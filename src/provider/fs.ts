/**
 * FSProvider – concrete Provider backed by the local file-system.
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import { Provider, ProviderFile } from './index';

export interface FSProviderOptions {
  /** Absolute path to the repository root */
  path: string;
}

export class FSProvider implements Provider {
  private root: string;

  constructor(opts: FSProviderOptions) {
    this.root = opts.path;
  }

  async listFiles(dir = '.'): Promise<ProviderFile[]> {
    const target = path.resolve(this.root, dir);
    if (!(await fs.pathExists(target))) return [];

    const entries = await fs.readdir(target, { withFileTypes: true });
    return entries
      .filter((e) => !e.name.startsWith('.')) // skip hidden / dot files
      .map((e) => ({
        path: path.posix.join(dir === '.' ? '' : dir, e.name),
        name: e.name,
        isDirectory: e.isDirectory(),
      }));
  }

  async readFile(filePath: string): Promise<string> {
    const target = path.resolve(this.root, filePath);
    return fs.readFile(target, 'utf-8');
  }

  async exists(filePath: string): Promise<boolean> {
    const target = path.resolve(this.root, filePath);
    return fs.pathExists(target);
  }
}
