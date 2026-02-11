/**
 * Analyser – evaluates every rule against a repository exposed by a Provider.
 *
 * Detection strategies (in order):
 *   1. Marker files & directories
 *   2. File extensions
 *   3. Content patterns inside specific files
 *   4. Dependency matching (package.json, requirements.txt, Gemfile, go.mod, Cargo.toml, composer.json)
 *   5. dotenv prefix scanning (.env, .env.local, .env.example, .env.*)
 */

import { Provider } from '../provider';
import { Payload, PayloadNode } from '../payload';
import { rules, Rule, DepType } from '../rules';
import consola from 'consola';

export interface AnalyserOptions {
  provider: Provider;
}

// ── Dependency extraction helpers ─────────────────────────

/** Extract package names from a package.json string (deps + devDeps + peerDeps) */
function extractNpmDeps(content: string): string[] {
  try {
    const pkg = JSON.parse(content);
    return [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
      ...Object.keys(pkg.optionalDependencies ?? {}),
    ];
  } catch { return []; }
}

/** Extract package names from requirements.txt / requirements-*.txt */
function extractPythonDeps(content: string): string[] {
  return content
    .split(/\r?\n/)
    .map((l) => l.replace(/#.*$/, '').trim())
    .filter((l) => l && !l.startsWith('-'))
    .map((l) => l.split(/[><=!~;\[]/)[0].trim())
    .filter(Boolean);
}

/** Extract gem names from a Gemfile */
function extractRubyDeps(content: string): string[] {
  const re = /^\s*gem\s+['"]([^'"]+)['"]/gm;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) names.push(m[1]);
  return names;
}

/** Extract Go module paths from go.mod */
function extractGoDeps(content: string): string[] {
  const re = /^\s+([\w./-]+)\s+v/gm;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) names.push(m[1]);
  return names;
}

/** Extract crate names from Cargo.toml [dependencies] */
function extractCargoDeps(content: string): string[] {
  const names: string[] = [];
  let inDeps = false;
  for (const line of content.split(/\r?\n/)) {
    if (/^\[.*dependencies.*\]/i.test(line)) { inDeps = true; continue; }
    if (/^\[/.test(line)) { inDeps = false; continue; }
    if (inDeps) {
      const m = line.match(/^(\S+)\s*=/);
      if (m) names.push(m[1]);
    }
  }
  return names;
}

/** Extract composer package names from composer.json */
function extractComposerDeps(content: string): string[] {
  try {
    const pkg = JSON.parse(content);
    return [
      ...Object.keys(pkg.require ?? {}),
      ...Object.keys(pkg['require-dev'] ?? {}),
    ];
  } catch { return []; }
}

/** Extract docker image names from docker-compose / compose files */
function extractDockerImages(content: string): string[] {
  const re = /image:\s*['"]?([^\s'"#]+)/g;
  const images: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) {
    // strip tag
    images.push(m[1].split(':')[0]);
  }
  return images;
}

/** Extract env-var names from .env-style files */
function extractEnvVarNames(content: string): string[] {
  return content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split('=')[0].trim())
    .filter(Boolean);
}

// ── Main analyser ─────────────────────────────────────────

export async function analyser(opts: AnalyserOptions): Promise<Payload> {
  const { provider } = opts;

  // 1. Build file index (root + 2 levels deep)
  const rootFiles = await provider.listFiles('.');
  const allPaths = new Set<string>();
  const allFileNames = new Set<string>();
  const extensions = new Set<string>();

  const dirs: string[] = [];
  for (const f of rootFiles) {
    allPaths.add(f.path);
    allFileNames.add(f.name);
    if (f.isDirectory) {
      dirs.push(f.name);
    } else {
      const dotIdx = f.name.lastIndexOf('.');
      if (dotIdx > 0) extensions.add(f.name.substring(dotIdx));
    }
  }

  // Walk 2 levels deep to pick up .github/workflows, prisma/schema.prisma, etc.
  for (const dir of dirs) {
    try {
      const children = await provider.listFiles(dir);
      for (const c of children) {
        allPaths.add(c.path);
        allFileNames.add(c.name);
        if (c.isDirectory) {
          try {
            const grandchildren = await provider.listFiles(c.path);
            for (const gc of grandchildren) {
              allPaths.add(gc.path);
            }
          } catch { /* ignore */ }
        }
      }
    } catch { /* ignore */ }
  }

  // 2. File content cache
  const contentCache = new Map<string, string | null>();
  async function readCached(filePath: string): Promise<string | null> {
    if (contentCache.has(filePath)) return contentCache.get(filePath)!;
    try {
      const content = await provider.readFile(filePath);
      contentCache.set(filePath, content);
      return content;
    } catch {
      contentCache.set(filePath, null);
      return null;
    }
  }

  // 3. Extract all dependencies upfront
  const depsMap: Record<DepType, string[]> = {
    npm: [], python: [], ruby: [], golang: [], rust: [], docker: [], php: [],
  };

  const pkgJson = await readCached('package.json');
  if (pkgJson) depsMap.npm = extractNpmDeps(pkgJson);

  // Python deps – try common filenames
  for (const f of ['requirements.txt', 'requirements-dev.txt', 'requirements-base.txt']) {
    const c = await readCached(f);
    if (c) depsMap.python.push(...extractPythonDeps(c));
  }
  const pyproject = await readCached('pyproject.toml');
  if (pyproject) {
    // Extract from [project.dependencies] section – rough but effective
    const depSection = pyproject.match(/\[project\][\s\S]*?dependencies\s*=\s*\[([\s\S]*?)\]/);
    if (depSection) {
      depsMap.python.push(...extractPythonDeps(depSection[1].replace(/"/g, '')));
    }
  }

  const gemfile = await readCached('Gemfile');
  if (gemfile) depsMap.ruby = extractRubyDeps(gemfile);

  const gomod = await readCached('go.mod');
  if (gomod) depsMap.golang = extractGoDeps(gomod);

  const cargoToml = await readCached('Cargo.toml');
  if (cargoToml) depsMap.rust = extractCargoDeps(cargoToml);

  const composerJson = await readCached('composer.json');
  if (composerJson) depsMap.php = extractComposerDeps(composerJson);

  // Docker images from compose files
  for (const f of ['docker-compose.yml', 'docker-compose.yaml', 'compose.yml', 'compose.yaml']) {
    const c = await readCached(f);
    if (c) depsMap.docker.push(...extractDockerImages(c));
  }
  // Also scan Dockerfile FROM lines
  const dockerfile = await readCached('Dockerfile');
  if (dockerfile) {
    const fromRe = /^FROM\s+([^\s]+)/gm;
    let m: RegExpExecArray | null;
    while ((m = fromRe.exec(dockerfile))) {
      depsMap.docker.push(m[1].split(':')[0]);
    }
  }

  // 4. Extract .env variable names
  const envVarNames: string[] = [];
  for (const f of ['.env', '.env.local', '.env.example', '.env.development', '.env.production', '.env.test']) {
    const c = await readCached(f);
    if (c) envVarNames.push(...extractEnvVarNames(c));
  }

  // 5. Evaluate every rule
  const matched: PayloadNode[] = [];

  for (const rule of rules) {
    try {
      if (await evaluateRule(rule, allPaths, extensions, allFileNames, readCached, provider, depsMap, envVarNames)) {
        matched.push({ name: rule.name, type: rule.type });
      }
    } catch (err) {
      consola.warn(`Rule "${rule.id}" threw: ${err}`);
    }
  }

  return { childs: matched };
}

// ── Rule evaluation ───────────────────────────────────────

async function evaluateRule(
  rule: Rule,
  allPaths: Set<string>,
  extensions: Set<string>,
  rootNames: Set<string>,
  readCached: (p: string) => Promise<string | null>,
  provider: Provider,
  depsMap: Record<DepType, string[]>,
  envVarNames: string[],
): Promise<boolean> {
  const m = rule.match;

  // 1. File existence
  if (m?.files) {
    for (const f of m.files) {
      if (rootNames.has(f) || allPaths.has(f)) return true;
      if (await provider.exists(f)) return true;
    }
  }

  // 2. Extension
  if (m?.extensions) {
    for (const ext of m.extensions) {
      if (extensions.has(ext)) return true;
    }
  }

  // 3. Content patterns
  if (m?.contentPatterns) {
    for (const cp of m.contentPatterns) {
      const content = await readCached(cp.file);
      if (content === null) continue;
      for (const pat of cp.patterns) {
        if (typeof pat === 'string') {
          if (content.includes(pat)) return true;
        } else {
          if (pat.test(content)) return true;
        }
      }
    }
  }

  // 4. Dependency matching
  if (rule.dependencies) {
    for (const dep of rule.dependencies) {
      const pkgList = depsMap[dep.type];
      if (!pkgList || pkgList.length === 0) continue;
      for (const pkg of pkgList) {
        if (typeof dep.name === 'string') {
          if (pkg === dep.name) return true;
        } else {
          if (dep.name.test(pkg)) return true;
        }
      }
    }
  }

  // 5. dotenv prefix matching
  if (rule.dotenv && envVarNames.length > 0) {
    for (const prefix of rule.dotenv) {
      if (envVarNames.some((v) => v.startsWith(prefix))) return true;
    }
  }

  return false;
}
