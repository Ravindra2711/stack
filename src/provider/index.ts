/**
 * Provider – abstraction over the file-system used by the analyser.
 *
 * This allows the analyser to be decoupled from direct fs access so it
 * can later support alternative providers (e.g. GitHub API).
 */

export interface ProviderFile {
  /** Relative path inside the repository (forward-slash separated) */
  path: string;
  /** File name (basename) */
  name: string;
  /** Whether this entry is a directory */
  isDirectory: boolean;
}

export interface Provider {
  /** List files at the given relative directory (default = root) */
  listFiles(dir?: string): Promise<ProviderFile[]>;
  /** Read a file's content as a UTF-8 string */
  readFile(filePath: string): Promise<string>;
  /** Check whether a file or directory exists */
  exists(filePath: string): Promise<boolean>;
}
