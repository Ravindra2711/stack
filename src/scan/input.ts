/**
 * Input Parser – reads the repo list from a JSON or plain-text file.
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import { RepoEntry } from './repo-manager';

/**
 * Derive a repo name from a URL.
 * e.g. "https://github.com/org/repo.git" → "repo"
 */
function nameFromUrl(url: string): string {
  // Strip trailing slashes and .git suffix
  const cleaned = url.replace(/\/+$/, '').replace(/\.git$/, '');
  const last = cleaned.split('/').pop() ?? cleaned;
  return last || 'unknown';
}

/**
 * Parse an input file (JSON array or one-URL-per-line text).
 */
export async function parseInputFile(filePath: string): Promise<RepoEntry[]> {
  const abs = path.resolve(filePath);
  if (!(await fs.pathExists(abs))) {
    throw new Error(`Input file not found: ${abs}`);
  }

  const raw = await fs.readFile(abs, 'utf-8');
  const trimmed = raw.trim();

  // Attempt JSON first
  if (trimmed.startsWith('[')) {
    const arr: Array<{ name?: string; url: string }> = JSON.parse(trimmed);
    return arr.map((item) => ({
      name: item.name ?? nameFromUrl(item.url),
      url: item.url,
    }));
  }

  // Otherwise treat as plain text (one URL per line)
  return trimmed
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'))
    .map((url) => ({ name: nameFromUrl(url), url }));
}
