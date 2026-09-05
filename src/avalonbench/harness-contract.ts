import { digest } from './canonical';
import type { CapabilitySnapshot } from './schema';

export const DETERMINISTIC_SYSTEM_SCAFFOLD = {
  kind: 'avalonbench-v1-slice1-deterministic-fixture',
  providerCalls: 0,
  productRuntimeCalls: 0,
  contextComplete: true,
} as const;

export const DETERMINISTIC_TOOL_MANIFEST = [
  'commission_observer',
  'manage_trading_agent_setup',
  'web_search',
] as const;

export const DETERMINISTIC_FIXTURE_REFS = {
  venueSnapshot: 'slice1-hyperliquid-static-observation',
  accountState: 'slice1-account-unknown',
} as const;

export function deterministicHarnessFor(snapshot: CapabilitySnapshot) {
  return {
    systemScaffoldDigest: digest(DETERMINISTIC_SYSTEM_SCAFFOLD),
    capabilitySnapshotDigest: digest(snapshot),
    availableToolNames: [...DETERMINISTIC_TOOL_MANIFEST],
    contextComplete: true,
  } as const;
}
