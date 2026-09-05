import type { RunRecord, RunTuple } from './schema';

export interface DeterministicRunIdentities {
  caseBatchDigest: string;
  capabilitySnapshotDigest: string;
  systemScaffoldDigest: string;
  toolManifestDigest: string;
  scorerIdentity: string;
  runnerIdentity: string;
}

export function buildDeterministicRunTuple(identities: DeterministicRunIdentities): RunTuple {
  return {
    candidateCommit: '605ed8fa10297e2d266e096600504bb4c35857b9',
    caseBatchDigest: identities.caseBatchDigest,
    scorerCommit: `content-sha256:${identities.scorerIdentity}`,
    runnerCommit: `content-sha256:${identities.runnerIdentity}`,
    modelId: 'deterministic-contract/no-provider',
    inferenceParameters: { temperature: 0, providerCalls: 0 },
    capabilitySnapshotDigest: identities.capabilitySnapshotDigest,
    systemScaffoldDigest: identities.systemScaffoldDigest,
    toolManifestDigest: identities.toolManifestDigest,
    providerConfiguration: { endpoint: null, route: 'no-provider' },
  };
}

export function buildDeterministicRunRecords(tuple: RunTuple): RunRecord[] {
  const base = {
    runId: 'avalonbench-v1-slice1-contract-003',
    tuple,
    costUsd: 0,
    failureReason: null,
  } as const;
  return [
    {
      ...base,
      entryId: 'run-003-planned',
      state: 'planned',
      occurredAt: '2026-09-05T04:00:00.000Z',
      aggregate: null,
      caseResultRefs: [],
    },
    {
      ...base,
      entryId: 'run-003-launched',
      state: 'launched',
      occurredAt: '2026-09-05T04:00:01.000Z',
      aggregate: null,
      caseResultRefs: [],
    },
    {
      ...base,
      entryId: 'run-003-completed',
      state: 'completed',
      occurredAt: '2026-09-05T04:00:02.000Z',
      aggregate: { visiblePassed: 4, visibleTotal: 4, redPassed: 13, redTotal: 13, providerCalls: 0 },
      caseResultRefs: [
        'green:avb-v1-visible-discovery-001',
        'green:avb-v1-visible-instrument-001',
        'green:avb-v1-visible-availability-001',
        'green:avb-v1-visible-routing-001',
      ],
    },
  ];
}
