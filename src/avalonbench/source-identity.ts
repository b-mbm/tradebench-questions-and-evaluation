import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { digest } from './canonical';

export interface SourceIdentity {
  path: string;
  sha256: string;
}

export function identifySources(root: string, paths: readonly string[]): SourceIdentity[] {
  return [...paths]
    .sort((left, right) => left.localeCompare(right))
    .map((path) => ({
      path,
      sha256: createHash('sha256').update(readFileSync(`${root}/${path}`)).digest('hex'),
    }));
}

export function combinedSourceIdentity(identities: SourceIdentity[]): string {
  return digest(identities);
}

export const SCORER_SOURCE_PATHS = [
  'src/avalonbench/canonical.ts',
  'src/avalonbench/grader.ts',
  'src/avalonbench/harness-contract.ts',
  'src/avalonbench/schema.ts',
  'src/avalonbench/validator.ts',
] as const;

export const RUNNER_SOURCE_PATHS = [
  'package-lock.json',
  'package.json',
  'scripts/avalonbench-contract-report.ts',
  'scripts/avalonbench-contract-test.ts',
  'scripts/avalonbench-runtime-preflight.ts',
  'scripts/avalonbench-runtime-run.ts',
  'data/avalonbench/v1/runtime-contract.json',
  'src/avalonbench/canonical.ts',
  'src/avalonbench/contract.ts',
  'src/avalonbench/fixtures.ts',
  'src/avalonbench/grader.ts',
  'src/avalonbench/harness-contract.ts',
  'src/avalonbench/ledger.ts',
  'src/avalonbench/provider-runner.ts',
  'src/avalonbench/proofs.ts',
  'src/avalonbench/run-contract.ts',
  'src/avalonbench/runtime-inventory.ts',
  'src/avalonbench/runtime.ts',
  'src/avalonbench/schema.ts',
  'src/avalonbench/source-identity.ts',
  'src/avalonbench/validator.ts',
  'tsconfig.avalonbench.json',
] as const;
