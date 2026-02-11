#!/usr/bin/env node

/**
 * CLI entry point – the `scanner` command.
 *
 * Usage:
 *   scanner scan -i repos.json -o report.json --concurrency 4 --cleanup
 */

import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import consola from 'consola';

import { parseInputFile } from '../scan/input';
import { scan } from '../scan';

const program = new Command();

program
  .name('scanner')
  .description('Tech Stack Bulk Scanner – analyse git repositories and report their tech stack')
  .version('1.0.0');

program
  .command('scan')
  .description('Scan a list of repositories')
  .requiredOption('-i, --input <file>', 'Path to input file (JSON or TXT)')
  .option('-o, --output <file>', 'Path to output JSON file', 'report.json')
  .option('--concurrency <number>', 'Number of parallel scans', '1')
  .option('--cleanup', 'Remove temp folders after scan', false)
  .action(async (opts) => {
    try {
      const inputPath: string = opts.input;
      const outputPath: string = opts.output;
      const concurrency: number = parseInt(opts.concurrency, 10) || 1;
      const cleanup: boolean = opts.cleanup;

      consola.info(`Input:       ${path.resolve(inputPath)}`);
      consola.info(`Output:      ${path.resolve(outputPath)}`);
      consola.info(`Concurrency: ${concurrency}`);
      consola.info(`Cleanup:     ${cleanup}`);

      // 1. Parse input
      const repos = await parseInputFile(inputPath);
      if (repos.length === 0) {
        consola.warn('No repositories found in input file.');
        return;
      }

      // 2. Run scan
      const reports = await scan({ repos, concurrency, cleanup });

      // 3. Write output
      await fs.ensureDir(path.dirname(path.resolve(outputPath)));
      await fs.writeJson(path.resolve(outputPath), reports, { spaces: 2 });

      const successful = reports.filter((r) => r.status === 'success').length;
      const failed = reports.filter((r) => r.status === 'error').length;
      consola.success(`Report written to ${path.resolve(outputPath)}`);
      consola.info(`Results: ${successful} succeeded, ${failed} failed out of ${reports.length}`);
    } catch (err) {
      consola.error(err);
      process.exit(1);
    }
  });

program.parse();
