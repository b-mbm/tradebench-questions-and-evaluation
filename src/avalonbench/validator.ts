import { canonicalJson, digest } from './canonical';
import { PARTITIONS, RUN_TUPLE_FIELDS, STAGE_ORDER } from './schema';
import type {
  AvalonBenchCase,
  CapabilitySnapshot,
  CapabilityStratum,
  ExposureLedgerEntry,
  RunRecord,
  StabilityPanelContract,
} from './schema';

export interface ValidationIssue {
  code: string;
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

function issue(issues: ValidationIssue[], code: string, path: string, message: string): void {
  issues.push({ code, path, message });
}

function nonEmptyStrings(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string' && item.length > 0);
}

export function validateCaseBeforeProvider(
  benchmarkCase: AvalonBenchCase,
  stratum: CapabilityStratum | undefined,
  snapshot: CapabilitySnapshot,
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const casePath = `case:${benchmarkCase.id || '<missing>'}`;

  if (!benchmarkCase.id) issue(issues, 'CASE_ID_REQUIRED', casePath, 'Case id is required.');
  if (benchmarkCase.partition !== 'visible') {
    issue(issues, 'SLICE1_VISIBLE_ONLY', `${casePath}.partition`, 'Slice 1 may contain visible cases only.');
  }
  if (!benchmarkCase.prompt.trim()) issue(issues, 'PROMPT_REQUIRED', `${casePath}.prompt`, 'Prompt is required.');
  if (!stratum || stratum.id !== benchmarkCase.stratumId) {
    issue(issues, 'STRATUM_UNKNOWN', `${casePath}.stratumId`, 'Case must reference a configured stratum.');
  } else if (stratum.visibleCaseId !== benchmarkCase.id) {
    issue(issues, 'VISIBLE_CASE_MISMATCH', casePath, 'Stratum visibleCaseId must point back to the case.');
  }
  if (benchmarkCase.fixtureId !== snapshot.snapshotId) {
    issue(issues, 'FIXTURE_UNKNOWN', `${casePath}.fixtureId`, 'Case fixture must reference the frozen capability snapshot.');
  }

  const oracle = benchmarkCase.oracle;
  if (oracle.oracleVersion !== 'avalonbench-oracle-v1') {
    issue(issues, 'ORACLE_VERSION_INVALID', `${casePath}.oracleVersion`, 'Oracle version is invalid.');
  }
  if (!nonEmptyStrings(oracle.requiredInputs)) {
    issue(issues, 'REQUIRED_INPUTS_MISSING', `${casePath}.oracle.requiredInputs`, 'Required inputs must be declared.');
  }
  if (!oracle.requiredInputs.includes('prompt') || !oracle.requiredInputs.includes('capability_snapshot')) {
    issue(issues, 'REQUIRED_INPUTS_INCOMPLETE', `${casePath}.oracle.requiredInputs`, 'Prompt and capability snapshot are mandatory inputs.');
  }
  if (!nonEmptyStrings(oracle.materialFields)) {
    issue(issues, 'MATERIAL_FIELDS_MISSING', `${casePath}.oracle.materialFields`, 'Material fields must be declared.');
  }
  if (new Set(oracle.materialFields).size !== oracle.materialFields.length) {
    issue(issues, 'MATERIAL_FIELDS_DUPLICATE', `${casePath}.oracle.materialFields`, 'Material fields must be unique.');
  }
  if (!nonEmptyStrings(oracle.permittedOutcomes)) {
    issue(issues, 'PERMITTED_OUTCOMES_MISSING', `${casePath}.oracle.permittedOutcomes`, 'At least one permitted outcome is required.');
  }
  if (!Array.isArray(oracle.forbiddenClaims)) {
    issue(issues, 'FORBIDDEN_CLAIMS_INVALID', `${casePath}.oracle.forbiddenClaims`, 'Forbidden claims must be an array.');
  }
  if (!oracle.authorityBoundary.trim()) {
    issue(issues, 'AUTHORITY_BOUNDARY_MISSING', `${casePath}.oracle.authorityBoundary`, 'Authority boundary is required.');
  }
  if (oracle.finalStateConstraints.financialMutationsMustBeEmpty !== true) {
    issue(issues, 'FINANCIAL_BOUNDARY_MISSING', `${casePath}.oracle.finalStateConstraints`, 'Financial mutations must be forbidden.');
  }

  const ids = new Set<string>();
  const orderKeys = new Set<string>();
  const predicates = oracle.predicates;
  if (!Array.isArray(predicates) || predicates.length === 0) {
    issue(issues, 'PREDICATES_MISSING', `${casePath}.oracle.predicates`, 'At least one predicate is required.');
  }
  for (const [index, predicate] of predicates.entries()) {
    const predicatePath = `${casePath}.oracle.predicates[${index}]`;
    if (!predicate.id) issue(issues, 'PREDICATE_ID_REQUIRED', predicatePath, 'Predicate id is required.');
    if (ids.has(predicate.id)) issue(issues, 'PREDICATE_ID_DUPLICATE', predicatePath, 'Predicate id must be unique within a case.');
    ids.add(predicate.id);
    const stageOrder = STAGE_ORDER.indexOf(predicate.label);
    if (stageOrder < 0) issue(issues, 'FAILURE_LABEL_INVALID', predicatePath, 'Predicate label is outside the frozen taxonomy.');
    if (!Number.isInteger(predicate.predicateOrder) || predicate.predicateOrder < 0) {
      issue(issues, 'PREDICATE_ORDER_INVALID', predicatePath, 'Predicate order must be a non-negative integer.');
    }
    const orderKey = `${predicate.label}:${predicate.predicateOrder}`;
    if (orderKeys.has(orderKey)) issue(issues, 'PREDICATE_ORDER_DUPLICATE', predicatePath, 'Within-stage predicate order must be unique.');
    orderKeys.add(orderKey);
    if (!predicate.path || predicate.path === 'response.text' || predicate.path.startsWith('response.text.')) {
      issue(issues, 'AUTHORITATIVE_PROSE_GRADING_FORBIDDEN', predicatePath, 'Predicates must grade structured evidence, not exact prose.');
    }
    if (!['equals', 'includes', 'set_equals', 'empty', 'length_equals'].includes(predicate.comparison)) {
      issue(issues, 'COMPARISON_INVALID', predicatePath, 'Comparison operator is not supported.');
    }
    if (predicate.comparison !== 'empty' && predicate.expected === undefined) {
      issue(issues, 'EXPECTED_VALUE_MISSING', predicatePath, 'Non-empty comparisons require an expected value.');
    }
    if (predicate.materialField && !oracle.materialFields.includes(predicate.materialField)) {
      issue(issues, 'PREDICATE_MATERIAL_FIELD_UNKNOWN', predicatePath, 'Predicate materialField must be declared by the oracle.');
    }
  }

  const coveredMaterialFields = new Set(
    predicates.flatMap((predicate) => predicate.materialField ? [predicate.materialField] : []),
  );
  for (const materialField of oracle.materialFields) {
    if (!coveredMaterialFields.has(materialField)) {
      issue(issues, 'MATERIAL_FIELD_UNGRADED', `${casePath}.oracle.materialFields`, `Material field ${materialField} has no deterministic predicate.`);
    }
  }

  for (const predicate of predicates) {
    for (const dependency of predicate.requires ?? []) {
      const upstream = predicates.find((candidate) => candidate.id === dependency);
      if (!upstream) {
        issue(issues, 'PREDICATE_DEPENDENCY_UNKNOWN', `${casePath}.oracle.${predicate.id}`, `Unknown dependency ${dependency}.`);
        continue;
      }
      const upstreamKey = [STAGE_ORDER.indexOf(upstream.label), upstream.predicateOrder];
      const currentKey = [STAGE_ORDER.indexOf(predicate.label), predicate.predicateOrder];
      if (upstreamKey[0] > currentKey[0] || (upstreamKey[0] === currentKey[0] && upstreamKey[1] >= currentKey[1])) {
        issue(issues, 'PREDICATE_DEPENDENCY_ORDER_INVALID', `${casePath}.oracle.${predicate.id}`, 'Dependencies must precede their dependent predicate.');
      }
    }
  }

  if (oracle.expectedSources.includes('capability') && !predicates.some((predicate) => predicate.id === 'capability_source_consulted')) {
    issue(issues, 'CAPABILITY_SOURCE_PREDICATE_MISSING', `${casePath}.oracle.predicates`, 'Capability source expectation requires a predicate.');
  }
  const financialVeto = predicates.find((predicate) => predicate.id === 'no_financial_mutation');
  if (!financialVeto || financialVeto.veto !== 'financial_mutation' || financialVeto.comparison !== 'empty') {
    issue(issues, 'FINANCIAL_VETO_MISSING', `${casePath}.oracle.predicates`, 'Every case requires the financial-mutation veto.');
  }

  return { valid: issues.length === 0, issues };
}

export function validateContract(
  strata: CapabilityStratum[],
  cases: AvalonBenchCase[],
  snapshot: CapabilitySnapshot,
): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (strata.length !== 4) issue(issues, 'STRATUM_COUNT_INVALID', 'strata', 'Slice 1 requires exactly four configured strata.');
  if (cases.length !== 4) issue(issues, 'VISIBLE_CASE_COUNT_INVALID', 'cases', 'Slice 1 requires exactly four visible cases.');
  if (new Set(strata.map((item) => item.id)).size !== strata.length) issue(issues, 'STRATUM_ID_DUPLICATE', 'strata', 'Stratum ids must be unique.');
  if (new Set(cases.map((item) => item.id)).size !== cases.length) issue(issues, 'CASE_ID_DUPLICATE', 'cases', 'Case ids must be unique.');
  for (const stratum of strata) {
    const benchmarkCase = cases.find((item) => item.id === stratum.visibleCaseId);
    if (!benchmarkCase || benchmarkCase.stratumId !== stratum.id) {
      issue(issues, 'STRATUM_CASE_LINK_BROKEN', `stratum:${stratum.id}`, 'Every stratum must own exactly its configured visible case.');
    }
  }
  for (const benchmarkCase of cases) {
    const result = validateCaseBeforeProvider(
      benchmarkCase,
      strata.find((item) => item.id === benchmarkCase.stratumId),
      snapshot,
    );
    issues.push(...result.issues);
  }
  return { valid: issues.length === 0, issues };
}

export function parseJsonLines<T>(raw: string): T[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as T);
}

export function validateExposureLedger(
  entries: ExposureLedgerEntry[],
  cases: AvalonBenchCase[],
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const entryIds = new Set<string>();
  const latestPartition = new Map<string, ExposureLedgerEntry['partitionAfter']>();
  const latestTime = new Map<string, number>();
  const caseIndex = new Map(cases.map((item) => [item.id, item]));

  for (const [index, entry] of entries.entries()) {
    const entryPath = `exposure[${index}]`;
    if (entryIds.has(entry.entryId)) issue(issues, 'EXPOSURE_ENTRY_DUPLICATE', entryPath, 'Entry ids are append-only identities and must be unique.');
    entryIds.add(entry.entryId);
    if (!PARTITIONS.includes(entry.partitionAfter)) issue(issues, 'PARTITION_INVALID', entryPath, 'Partition is invalid.');
    const current = latestPartition.get(entry.caseId);
    if ((current ?? null) !== entry.partitionBefore) issue(issues, 'PARTITION_CHAIN_BROKEN', entryPath, 'partitionBefore must equal the prior appended state.');
    if (current === 'consumed' && entry.partitionAfter !== 'consumed') issue(issues, 'CONSUMED_REVERSAL_FORBIDDEN', entryPath, 'Consumed cases can never regain another partition.');
    const timestamp = Date.parse(entry.occurredAt);
    if (!Number.isFinite(timestamp)) issue(issues, 'EXPOSURE_TIME_INVALID', entryPath, 'occurredAt must be an ISO timestamp.');
    const priorTime = latestTime.get(entry.caseId);
    if (priorTime !== undefined && timestamp < priorTime) issue(issues, 'EXPOSURE_TIME_REVERSED', entryPath, 'Entries for a case must be chronological.');
    const benchmarkCase = caseIndex.get(entry.caseId);
    if (benchmarkCase) {
      if (entry.stratumId !== benchmarkCase.stratumId) issue(issues, 'EXPOSURE_STRATUM_MISMATCH', entryPath, 'Ledger stratum must match the case.');
      if (entry.artifactDigest !== digest(benchmarkCase)) issue(issues, 'EXPOSURE_DIGEST_MISMATCH', entryPath, 'Ledger digest must match the immutable case and oracle.');
    }
    latestPartition.set(entry.caseId, entry.partitionAfter);
    latestTime.set(entry.caseId, timestamp);
  }

  for (const benchmarkCase of cases) {
    if (latestPartition.get(benchmarkCase.id) !== benchmarkCase.partition) {
      issue(issues, 'EXPOSURE_CASE_UNACCOUNTED', `case:${benchmarkCase.id}`, 'Every visible case must have a matching final ledger partition.');
    }
  }
  return { valid: issues.length === 0, issues };
}

const RUN_TRANSITIONS: Record<RunRecord['state'], RunRecord['state'][]> = {
  planned: ['launched', 'invalid', 'aborted'],
  launched: ['completed', 'incomplete', 'aborted'],
  completed: [],
  incomplete: [],
  invalid: [],
  aborted: [],
};

export function validateRunRegistry(entries: RunRecord[]): ValidationResult {
  const issues: ValidationIssue[] = [];
  const entryIds = new Set<string>();
  const latest = new Map<string, RunRecord>();
  for (const [index, entry] of entries.entries()) {
    const entryPath = `runs[${index}]`;
    if (entryIds.has(entry.entryId)) issue(issues, 'RUN_ENTRY_DUPLICATE', entryPath, 'Run entry ids must be unique.');
    entryIds.add(entry.entryId);
    const tupleKeys = Object.keys(entry.tuple).sort();
    const requiredTupleKeys = [...RUN_TUPLE_FIELDS].sort();
    if (canonicalJson(tupleKeys) !== canonicalJson(requiredTupleKeys)) {
      issue(issues, 'RUN_TUPLE_FIELDS_INVALID', `${entryPath}.tuple`, 'The immutable run tuple must contain exactly the frozen ten fields.');
    }
    for (const identityField of [
      'candidateCommit',
      'caseBatchDigest',
      'scorerCommit',
      'runnerCommit',
      'modelId',
      'capabilitySnapshotDigest',
      'systemScaffoldDigest',
      'toolManifestDigest',
    ] as const) {
      if (typeof entry.tuple[identityField] !== 'string' || entry.tuple[identityField].length === 0) {
        issue(issues, 'RUN_TUPLE_IDENTITY_MISSING', `${entryPath}.tuple.${identityField}`, 'Run identity fields must be non-empty strings.');
      }
    }
    const prior = latest.get(entry.runId);
    if (!prior && entry.state !== 'planned') issue(issues, 'RUN_MUST_START_PLANNED', entryPath, 'A run must begin with planned.');
    if (prior) {
      if (!RUN_TRANSITIONS[prior.state].includes(entry.state)) issue(issues, 'RUN_TRANSITION_INVALID', entryPath, 'Run state transition is invalid.');
      if (canonicalJson(prior.tuple) !== canonicalJson(entry.tuple)) issue(issues, 'RUN_TUPLE_MUTATED', entryPath, 'The immutable run tuple changed within a run.');
      if (Date.parse(entry.occurredAt) < Date.parse(prior.occurredAt)) issue(issues, 'RUN_TIME_REVERSED', entryPath, 'Run records must be chronological.');
    }
    if (!Number.isFinite(Date.parse(entry.occurredAt))) issue(issues, 'RUN_TIME_INVALID', entryPath, 'occurredAt must be an ISO timestamp.');
    if (entry.costUsd < 0) issue(issues, 'RUN_COST_INVALID', entryPath, 'Run cost cannot be negative.');
    if (entry.state === 'completed' && entry.aggregate === null) {
      issue(issues, 'RUN_COMPLETED_AGGREGATE_MISSING', entryPath, 'Completed runs require an aggregate result.');
    }
    if (entry.state !== 'completed' && entry.aggregate !== null) {
      issue(issues, 'RUN_PREMATURE_AGGREGATE', entryPath, 'Only completed runs may carry an aggregate result.');
    }
    latest.set(entry.runId, entry);
  }
  return { valid: issues.length === 0, issues };
}

export function validateStabilityPanel(contract: StabilityPanelContract): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (contract.partition !== 'stability' || !contract.permanentlyNonBlind) {
    issue(issues, 'STABILITY_PARTITION_INVALID', 'stability', 'The panel must be permanently non-blind and stability-partitioned.');
  }
  if (contract.includedInBlindScore) issue(issues, 'STABILITY_BLIND_SCORE_FORBIDDEN', 'stability', 'Stability cases cannot enter the blind score.');
  if (
    canonicalJson([...contract.immutableTupleFields].sort())
      !== canonicalJson([...RUN_TUPLE_FIELDS].sort())
  ) {
    issue(issues, 'STABILITY_TUPLE_INCOMPLETE', 'stability.immutableTupleFields', 'All ten immutable run-tuple fields are required.');
  }
  if (contract.caseIds.length !== 0) {
    issue(issues, 'SLICE1_STABILITY_CASES_FORBIDDEN', 'stability.caseIds', 'Slice 1 defines the panel contract but does not author panel cases.');
  }
  return { valid: issues.length === 0, issues };
}
