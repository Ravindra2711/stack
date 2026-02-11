/**
 * Repo Manager – handles git clone / pull / validation and
 * provides a local path ready for analysis.
 */

import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import * as fs from 'fs-extra';
import simpleGit, { SimpleGit } from 'simple-git';
import consola from 'consola';

const WORKSPACE_ROOT = path.join(os.tmpdir(), 'scanner-workspace');

// ── Public types ──────────────────────────────────────────

export interface RepoEntry {
  /** Human-readable identifier */
  name: string;
  /** Git URL (https/ssh/file) or absolute local path */
  url: string;
}

export interface PrepareResult {
  /** Absolute path to the local clone / validated directory */
  localPath: string;
  /** Whether the path is a temporary clone (eligible for cleanup) */
  isTemporary: boolean;
}

// ── Helpers ───────────────────────────────────────────────

/** Slugify + hash to produce a unique, filesystem-safe folder name. */
function safeFolderName(name: string, url: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const hash = crypto.createHash('sha256').update(url).digest('hex').slice(0, 8);
  return `${slug}-${hash}`;
}

/** Very basic URL validation – only allow known-safe protocols. */
function validateUrl(url: string): void {
  const allowed = ['http:', 'https:', 'ssh:', 'file:', 'git@'];
  const lower = url.toLowerCase();
  const ok = allowed.some((p) => lower.startsWith(p));
  if (!ok) {
    throw new Error(
      `Unsupported URL protocol in "${url}". Allowed: ${allowed.join(', ')}`,
    );
  }
  // Prevent obvious command-injection characters
  if (/[;&|`$]/.test(url)) {
    throw new Error(`URL contains suspicious characters: "${url}"`);
  }
}

/** Check whether a path looks like a local directory (not a URL). */
function isLocalPath(url: string): boolean {
  return (
    url.startsWith('/') ||
    url.startsWith('.') ||
    /^[a-zA-Z]:\\/.test(url) || // Windows absolute path
    url.startsWith('~')
  );
}

// ── Core logic ────────────────────────────────────────────

/**
 * Prepare the local directory for a repo entry.
 *
 * - Local paths are validated and returned as-is.
 * - Remote URLs are cloned (or pulled if already present).
 */
export async function prepareRepo(entry: RepoEntry): Promise<PrepareResult> {
  const { name, url } = entry;

  if (isLocalPath(url)) {
    return prepareLocal(url);
  }

  validateUrl(url);
  return prepareRemote(name, url);
}

async function prepareLocal(localUrl: string): Promise<PrepareResult> {
  const resolved = path.resolve(localUrl);
  if (!(await fs.pathExists(resolved))) {
    throw new Error(`Local path does not exist: ${resolved}`);
  }
  // Basic traversal guard – reject paths pointing at system roots
  const sensitive = ['/etc', '/usr', '/bin', '/sbin', 'C:\\Windows', 'C:\\Program Files'];
  for (const s of sensitive) {
    if (resolved.toLowerCase().startsWith(s.toLowerCase())) {
      throw new Error(`Path "${resolved}" is inside a sensitive directory.`);
    }
  }
  return { localPath: resolved, isTemporary: false };
}

async function prepareRemote(name: string, url: string): Promise<PrepareResult> {
  const folder = safeFolderName(name, url);
  const targetDir = path.join(WORKSPACE_ROOT, folder);

  await fs.ensureDir(WORKSPACE_ROOT);

  if (await fs.pathExists(targetDir)) {
    // Check origin matches
    const git: SimpleGit = simpleGit(targetDir);
    try {
      const currentOrigin = (await git.remote(['get-url', 'origin'])) ?? '';
      if (currentOrigin.trim() !== url.trim()) {
        throw new Error(
          `Directory "${targetDir}" already exists with a different origin.\n` +
          `  Expected: ${url}\n  Found:    ${currentOrigin.trim()}`,
        );
      }
      consola.info(`Pulling latest for "${name}"…`);
      await git.pull();
    } catch (err: any) {
      if (err.message?.includes('already exists')) throw err;
      // If something weird happened, try fresh clone
      consola.warn(`Pull failed for "${name}", re-cloning: ${err.message}`);
      await fs.remove(targetDir);
      await cloneFresh(url, targetDir, name);
    }
  } else {
    await cloneFresh(url, targetDir, name);
  }

  return { localPath: targetDir, isTemporary: true };
}

async function cloneFresh(url: string, targetDir: string, name: string): Promise<void> {
  consola.info(`Cloning "${name}" from ${url}…`);
  const git: SimpleGit = simpleGit();
  await git.clone(url, targetDir, ['--depth', '1']);
}

/**
 * Remove a previously cloned directory.
 */
export async function cleanupRepo(localPath: string): Promise<void> {
  consola.info(`Cleaning up ${localPath}`);
  await fs.remove(localPath);
}
