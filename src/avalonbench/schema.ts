export const PARTITIONS = [
  'visible',
  'active_blind',
  'reserve',
  'consumed',
  'stability',
] as const;

export type Partition = (typeof PARTITIONS)[number];

export const STAGE_ORDER = [
  'invalid_case',
  'harness_context_failure',
  'extraction_failure',
  'normalization_failure',
  'capability_resolution_failure',
  'instrument_truth_failure',
  'availability_resolution_failure',
  'permission_failure',
  'routing_failure',
  'outcome_truth_failure',
] as const;

export type FailureLabel = (typeof STAGE_ORDER)[number];
export type EpisodeResult = 'PASS' | 'FAIL' | 'INCOMPLETE' | 'INVALID';
export type Availability = 'supported' | 'unsupported' | 'available' | 'unavailable' | 'unknown';
export type Comparison =
  | 'equals'
  | 'not_equals'
  | 'one_of'
  | 'includes'
  | 'set_equals'
  | 'empty'
  | 'length_equals'
  | 'length_at_least'
  | 'item_field_set_subset';

export interface CapabilityStratum {
  id: string;
  title: string;
  construct: string;
  requiredSources: Array<'capability' | 'external'>;
  visibleCaseId: string;
}

export interface CapabilitySnapshot {
  snapshotId: string;
  observedProductCommit: string;
  observedAt: string;
  venue: 'hyperliquid';
  capabilities: Array<{
    agentType: 'observer' | 'momentum';
    supportedActions: string[];
    supportedModes: string[];
    instrumentScope: string[];
    prerequisites: string[];
    authorityRequired: string[];
    productAvailability: 'supported' | 'unsupported';
    description: string;
  }>;
  instruments: Array<{
    company: string;
    ticker: string;
    venueSymbol: string;
    assetClass: 'equity_reference_perpetual';
    actualShares: false;
    venueAvailability: 'available';
  }>;
  account: {
    readiness: 'unknown';
    reason: string;
  };
}

export interface TypedCapabilityRequest {
  intent: 'capability_discovery' | 'instrument_truth' | 'availability' | 'create_agent';
  venue: 'hyperliquid';
  company?: string;
  instrument?: string;
  agentType?: 'observer' | 'momentum';
  requestedAction?: string;
}

export interface PredicateSpec {
  id: string;
  materialField?: string;
  label: FailureLabel;
  predicateOrder: number;
  path: string;
  comparison: Comparison;
  expected?: unknown;
  itemField?: string;
  critical: true;
  veto?: 'authority' | 'financial_mutation';
  requires?: string[];
}

export interface ForbiddenClaimSpec {
  id: string;
  predicateOrder: number;
  path: string;
  forbidden: unknown;
}

export interface TypedOracle {
  oracleVersion: 'avalonbench-oracle-v1';
  requiredInputs: string[];
  materialFields: string[];
  permittedOutcomes: string[];
  forbiddenClaims: ForbiddenClaimSpec[];
  expectedSources: Array<'capability' | 'external'>;
  authorityBoundary: {
    description: string;
    predicateId: string;
    expectedOutcome: string;
  };
  finalStateConstraints: {
    allowedCreatedArtifactTypes: string[];
    financialMutationsMustBeEmpty: true;
  };
  predicates: PredicateSpec[];
}

export interface AvalonBenchCase {
  id: string;
  stratumId: string;
  partition: 'visible';
  prompt: string;
  fixtureId: string;
  oracle: TypedOracle;
}

export interface EpisodeEnvelope {
  episodeId: string;
  taskId: string;
  prompt: string;
  harness: {
    systemScaffoldDigest: string;
    capabilitySnapshotDigest: string;
    availableToolNames: string[];
    contextComplete: boolean;
  };
  fixtures: {
    capabilitySnapshot: string;
    venueSnapshot: string;
    accountState: string;
  };
  trace: {
    typedExtraction: TypedCapabilityRequest | null;
    normalizedRequest: TypedCapabilityRequest | null;
    consultedCapabilitySource: boolean;
    capabilityResolution: Record<string, unknown> | null;
    instrumentResolution: Record<string, unknown> | null;
    availabilityResolution: Record<string, unknown> | null;
    permissionDecision: Record<string, unknown> | null;
    selectedRoute: Record<string, unknown> | null;
    toolCalls: Array<{ name: string; args: Record<string, unknown> }>;
    externalSearchCalls: Array<{ query: string }>;
  };
  response: {
    text: string;
    structuredClaims: Record<string, unknown>;
  };
  state: {
    createdArtifacts: Array<{ type: string; id: string }>;
    financialMutations: Array<{ type: string; id: string }>;
  };
  diagnostics: {
    latencyMs: number;
    modelCalls: number;
    tokenUsage: Record<string, number>;
  };
}

export interface PredicateResult {
  id: string;
  label: FailureLabel;
  stageOrder: number;
  predicateOrder: number;
  status: 'PASS' | 'FAIL' | 'NOT_EVALUABLE';
  expected?: unknown;
  actual?: unknown;
  blockedBy?: string;
  veto?: 'authority' | 'financial_mutation';
}

export interface ScoredResult {
  caseId: string;
  result: EpisodeResult;
  fieldResults: PredicateResult[];
  primaryFailure: PredicateResult | null;
  secondaryFailures: PredicateResult[];
  notEvaluable: PredicateResult[];
  vetoes: PredicateResult[];
}

export interface ExposureLedgerEntry {
  entryId: string;
  caseId: string;
  stratumId: string;
  artifactDigest: string;
  partitionBefore: Partition | null;
  partitionAfter: Partition;
  event: 'authored' | 'validated' | 'allocated' | 'executed' | 'exposed' | 'consumed' | 'retired';
  actorRole: 'blind_author' | 'custodian' | 'runner' | 'implementer' | 'scorer_maintainer' | 'reviewer';
  exposureType: 'none' | 'prompt' | 'oracle' | 'output' | 'failure_label' | 'root_cause' | 'scorer_diff';
  runId: string | null;
  occurredAt: string;
  reason: string;
}

export const EXPOSURE_EVENTS = [
  'authored',
  'validated',
  'allocated',
  'executed',
  'exposed',
  'consumed',
  'retired',
] as const satisfies readonly ExposureLedgerEntry['event'][];

export const ACTOR_ROLES = [
  'blind_author',
  'custodian',
  'runner',
  'implementer',
  'scorer_maintainer',
  'reviewer',
] as const satisfies readonly ExposureLedgerEntry['actorRole'][];

export const EXPOSURE_TYPES = [
  'none',
  'prompt',
  'oracle',
  'output',
  'failure_label',
  'root_cause',
  'scorer_diff',
] as const satisfies readonly ExposureLedgerEntry['exposureType'][];

export interface RunTuple {
  candidateCommit: string;
  caseBatchDigest: string;
  scorerCommit: string;
  runnerCommit: string;
  modelId: string;
  inferenceParameters: Record<string, unknown>;
  capabilitySnapshotDigest: string;
  systemScaffoldDigest: string;
  toolManifestDigest: string;
  providerConfiguration: Record<string, unknown>;
}

export const RUN_TUPLE_FIELDS = [
  'candidateCommit',
  'caseBatchDigest',
  'scorerCommit',
  'runnerCommit',
  'modelId',
  'inferenceParameters',
  'capabilitySnapshotDigest',
  'systemScaffoldDigest',
  'toolManifestDigest',
  'providerConfiguration',
] as const satisfies readonly (keyof RunTuple)[];

export interface RunRecord {
  entryId: string;
  runId: string;
  state: 'planned' | 'launched' | 'completed' | 'incomplete' | 'invalid' | 'aborted';
  occurredAt: string;
  tuple: RunTuple;
  aggregate: Record<string, number> | null;
  caseResultRefs: string[];
  costUsd: number;
  failureReason: string | null;
}

export const RUN_STATES = [
  'planned',
  'launched',
  'completed',
  'incomplete',
  'invalid',
  'aborted',
] as const satisfies readonly RunRecord['state'][];

export interface StabilityPanelContract {
  contractVersion: 'avalonbench-stability-v1';
  partition: 'stability';
  permanentlyNonBlind: true;
  includedInBlindScore: false;
  immutableTupleFields: Array<keyof RunTuple>;
  seriesRule: string;
  caseIds: string[];
}
