/**
 * Payload – the data structure returned by the analyser.
 */

export type TechType =
  | 'language'
  | 'framework'
  | 'ui_framework'
  | 'ui'
  | 'runtime'
  | 'tool'
  | 'builder'
  | 'linter'
  | 'test'
  | 'ci'
  | 'hosting'
  | 'cloud'
  | 'db'
  | 'orm'
  | 'queue'
  | 'storage'
  | 'ai'
  | 'analytics'
  | 'monitoring'
  | 'auth'
  | 'payment'
  | 'notification'
  | 'cms'
  | 'saas'
  | 'iac'
  | 'security'
  | 'automation'
  | 'ssg'
  | 'package_manager'
  | 'validation'
  | 'app'
  | 'network'
  | 'unknown';

export interface PayloadNode {
  name: string;
  type: TechType;
  childs?: PayloadNode[];
}

export interface Payload {
  childs: PayloadNode[];
}
