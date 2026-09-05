import { digest } from './canonical';
import type { CapabilitySnapshot } from './schema';

export const DETERMINISTIC_SYSTEM_SCAFFOLD = {
  kind: 'avalonbench-v1-slice2-product-runtime',
  productPath: 'apps/api/src/app/api/v1/avalonbench/run/route.ts',
  modelRoute: 'Avalon 1 Fast',
  contextComplete: true,
} as const;

export const DETERMINISTIC_TOOL_MANIFEST = [
  'commission_observer',
] as const;

export const DETERMINISTIC_FIXTURE_REFS = {
  venueSnapshot: 'avalonbench-hyperliquid-catalog-605ed8f',
  accountState: 'avalonbench-account-unknown-v1',
} as const;

export function deterministicHarnessFor(snapshot: CapabilitySnapshot) {
  return {
    systemScaffoldDigest: digest(DETERMINISTIC_SYSTEM_SCAFFOLD),
    capabilitySnapshotDigest: digest(snapshot),
    availableToolNames: [...DETERMINISTIC_TOOL_MANIFEST],
    contextComplete: true,
  } as const;
}
