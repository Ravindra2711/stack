/**
 * Rule – a detection rule the analyser evaluates against a repository.
 */

import { TechType } from '../payload';

export type DepType = 'npm' | 'python' | 'docker' | 'golang' | 'ruby' | 'rust' | 'php';

export interface RuleDependency {
  type: DepType;
  name: string | RegExp;
}

export interface RuleMatch {
  /** Marker files whose existence triggers the rule */
  files?: string[];
  /** File extensions that trigger the rule */
  extensions?: string[];
  /** Content patterns inside specific files */
  contentPatterns?: { file: string; patterns: (string | RegExp)[] }[];
}

export interface Rule {
  id: string;
  name: string;
  type: TechType;
  match?: RuleMatch;
  /** Package / image dependencies that trigger the rule */
  dependencies?: RuleDependency[];
  /** Environment-variable prefixes to look for in .env files */
  dotenv?: string[];
}
