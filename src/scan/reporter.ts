/**
 * Reporter – transforms the Payload into a rich categorised report.
 */

import { Payload, PayloadNode, TechType } from '../payload';

// ── Public types ──────────────────────────────────────────

export interface ScanResults {
  languages: string[];
  frameworks: string[];
  ui: string[];
  databases: string[];
  orm: string[];
  ai: string[];
  monitoring: string[];
  analytics: string[];
  cloud: string[];
  hosting: string[];
  ci: string[];
  testing: string[];
  auth: string[];
  payment: string[];
  notification: string[];
  cms: string[];
  queue: string[];
  storage: string[];
  iac: string[];
  security: string[];
  automation: string[];
  builders: string[];
  linters: string[];
  packageManagers: string[];
  ssg: string[];
  validation: string[];
  tools: string[];
}

export interface RepoReport {
  repo: string;
  status: 'success' | 'error';
  results?: ScanResults;
  error?: string;
}

// ── Category mapping ──────────────────────────────────────

const categoryMap: Record<TechType, keyof ScanResults> = {
  language:         'languages',
  framework:        'frameworks',
  ui_framework:     'ui',
  ui:               'ui',
  db:               'databases',
  orm:              'orm',
  ai:               'ai',
  monitoring:       'monitoring',
  analytics:        'analytics',
  cloud:            'cloud',
  hosting:          'hosting',
  ci:               'ci',
  test:             'testing',
  auth:             'auth',
  payment:          'payment',
  notification:     'notification',
  cms:              'cms',
  queue:            'queue',
  storage:          'storage',
  iac:              'iac',
  security:         'security',
  automation:       'automation',
  builder:          'builders',
  linter:           'linters',
  package_manager:  'packageManagers',
  ssg:              'ssg',
  validation:       'validation',
  tool:             'tools',
  saas:             'tools',
  runtime:          'tools',
  app:              'tools',
  network:          'tools',
  unknown:          'tools',
};

function emptyResults(): ScanResults {
  return {
    languages: [], frameworks: [], ui: [], databases: [], orm: [],
    ai: [], monitoring: [], analytics: [], cloud: [], hosting: [],
    ci: [], testing: [], auth: [], payment: [], notification: [],
    cms: [], queue: [], storage: [], iac: [], security: [],
    automation: [], builders: [], linters: [], packageManagers: [],
    ssg: [], validation: [], tools: [],
  };
}

function categorise(nodes: PayloadNode[]): ScanResults {
  const results = emptyResults();

  const visit = (node: PayloadNode) => {
    const bucket = categoryMap[node.type] ?? 'tools';
    (results[bucket] as string[]).push(node.name);
    if (node.childs) node.childs.forEach(visit);
  };
  nodes.forEach(visit);

  // Deduplicate each bucket
  for (const key of Object.keys(results) as (keyof ScanResults)[]) {
    results[key] = [...new Set(results[key])];
  }

  // Remove empty arrays for a cleaner report
  for (const key of Object.keys(results) as (keyof ScanResults)[]) {
    if (results[key].length === 0) delete (results as any)[key];
  }

  return results;
}

// ── Public API ────────────────────────────────────────────

export function buildSuccessReport(repoName: string, payload: Payload): RepoReport {
  return {
    repo: repoName,
    status: 'success',
    results: categorise(payload.childs),
  };
}

export function buildErrorReport(repoName: string, error: unknown): RepoReport {
  return {
    repo: repoName,
    status: 'error',
    error: error instanceof Error ? error.message : String(error),
  };
}
