import { readFileSync } from 'node:fs';
import { digest } from './canonical';

export interface SourceIdentity {
  path: string;
  sha256: string;
}

export function identifySources(root: string, paths: readonly string[]): SourceIdentity[] {
  return [...paths]
    .sort((left, right) => left.localeCompare(right))
    .map((path) => ({ path, sha256: digest(readFileSync(`${root}/${path}`, 'utf8')) }));
}

export function combinedSourceIdentity(identities: SourceIdentity[]): string {
  return digest(identities);
}

export const SCORER_SOURCE_PATHS = [
  'src/avalonbench/canonical.ts',
  'src/avalonbench/grader.ts',
  'src/avalonbench/schema.ts',
  'src/avalonbench/validator.ts',
] as const;

export const RUNNER_SOURCE_PATHS = [
  'scripts/avalonbench-contract-report.ts',
  'scripts/avalonbench-contract-test.ts',
  'src/avalonbench/fixtures.ts',
  'src/avalonbench/provider-runner.ts',
  'src/avalonbench/proofs.ts',
  'src/avalonbench/run-contract.ts',
] as const;
