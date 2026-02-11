/**
 * Analysis Adapter – thin wrapper that bridges a local repository path
 * with the core analyser + FSProvider.
 */

import { FSProvider } from '../provider/fs';
import { analyser } from '../analyser';
import { Payload } from '../payload';

/**
 * Run the analyser against a local directory and return the raw Payload.
 */
export async function analyseRepo(repoPath: string): Promise<Payload> {
  const provider = new FSProvider({ path: repoPath });
  return analyser({ provider });
}
