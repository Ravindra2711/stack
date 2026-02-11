/**
 * Core scan loop – orchestrates repo preparation, analysis, and reporting
 * across multiple repositories with controlled concurrency.
 */

import pMap from 'p-map';
import consola from 'consola';

import { RepoEntry, prepareRepo, cleanupRepo } from './repo-manager';
import { analyseRepo } from './adapter';
import { buildSuccessReport, buildErrorReport, RepoReport } from './reporter';

export interface ScanOptions {
  repos: RepoEntry[];
  concurrency?: number;
  cleanup?: boolean;
}

/**
 * Scan a list of repositories and return an array of per-repo reports.
 */
export async function scan(opts: ScanOptions): Promise<RepoReport[]> {
  const { repos, concurrency = 1, cleanup = false } = opts;

  consola.info(`Starting scan of ${repos.length} repo(s) (concurrency=${concurrency})`);

  const reports = await pMap(
    repos,
    async (entry) => {
      consola.start(`[${entry.name}] Preparing…`);
      try {
        // 1. Prepare local directory
        const { localPath, isTemporary } = await prepareRepo(entry);
        consola.info(`[${entry.name}] Analysing ${localPath}…`);

        // 2. Run analysis
        const payload = await analyseRepo(localPath);

        // 3. Build report
        const report = buildSuccessReport(entry.name, payload);
        const r = report.results!;
        const counts = Object.entries(r).map(([k, v]) => `${v.length} ${k}`).join(', ');
        consola.success(`[${entry.name}] Done – ${counts}`);

        // 4. Optional cleanup
        if (cleanup && isTemporary) {
          await cleanupRepo(localPath);
        }

        return report;
      } catch (err) {
        consola.error(`[${entry.name}] Failed: ${err}`);
        return buildErrorReport(entry.name, err);
      }
    },
    { concurrency },
  );

  return reports;
}

export { RepoEntry } from './repo-manager';
export { RepoReport } from './reporter';
