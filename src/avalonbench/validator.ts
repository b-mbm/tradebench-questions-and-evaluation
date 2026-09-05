import { canonicalJson, digest } from './canonical';
import {
  ACTOR_ROLES,
  EXPOSURE_EVENTS,
  EXPOSURE_TYPES,
  PARTITIONS,
  RUN_STATES,
  RUN_TUPLE_FIELDS,
  STAGE_ORDER,
} from './schema';
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function stringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function validateCaseBeforeProvider(
  benchmarkCase: AvalonBenchCase,
  stratum: CapabilityStratum | undefined,
  snapshot: CapabilitySnapshot,
): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (!isRecord(benchmarkCase)) {
    issue(issues, 'CASE_OBJECT_REQUIRED', 'case:<missing>', 'Case must be an object.');
    return { valid: false, issues };
  }

  const caseId = typeof benchmarkCase.id === 'string' ? benchmarkCase.id : '';
  const casePath = `case:${caseId || '<missing>'}`;
  if (!caseId) issue(issues, 'CASE_ID_REQUIRED', casePath, 'Case id is required.');
  if (typeof benchmarkCase.stratumId !== 'string' || benchmarkCase.stratumId.length === 0) {
    issue(issues, 'STRATUM_ID_REQUIRED', `${casePath}.stratumId`, 'Stratum id is required.');
  }
  if (benchmarkCase.partition !== 'visible') {
    issue(issues, 'SLICE1_VISIBLE_ONLY', `${casePath}.partition`, 'Slice 1 may contain visible cases only.');
  }
  if (typeof benchmarkCase.prompt !== 'string' || benchmarkCase.prompt.trim().length === 0) {
    issue(issues, 'PROMPT_REQUIRED', `${casePath}.prompt`, 'Prompt is required.');
  }
  if (!stratum || stratum.id !== benchmarkCase.stratumId) {
    issue(issues, 'STRATUM_UNKNOWN', `${casePath}.stratumId`, 'Case must reference a configured stratum.');
  } else if (stratum.visibleCaseId !== caseId) {
    issue(issues, 'VISIBLE_CASE_MISMATCH', casePath, 'Stratum visibleCaseId must point back to the case.');
  }
  if (!isRecord(snapshot) || typeof snapshot.snapshotId !== 'string') {
    issue(issues, 'SNAPSHOT_INVALID', 'capabilitySnapshot', 'Capability snapshot must have a stable snapshot id.');
  } else if (benchmarkCase.fixtureId !== snapshot.snapshotId) {
    issue(issues, 'FIXTURE_UNKNOWN', `${casePath}.fixtureId`, 'Case fixture must reference the frozen capability snapshot.');
  }

  if (!isRecord(benchmarkCase.oracle)) {
    issue(issues, 'ORACLE_REQUIRED', `${casePath}.oracle`, 'A typed oracle object is required.');
    return { valid: false, issues };
  }
  const oracle = benchmarkCase.oracle;
  if (oracle.oracleVersion !== 'avalonbench-oracle-v1') {
    issue(issues, 'ORACLE_VERSION_INVALID', `${casePath}.oracleVersion`, 'Oracle version is invalid.');
  }
  if (!nonEmptyStrings(oracle.requiredInputs)) {
    issue(issues, 'REQUIRED_INPUTS_MISSING', `${casePath}.oracle.requiredInputs`, 'Required inputs must be declared.');
  }
  if (stringArray(oracle.requiredInputs)
      && (!oracle.requiredInputs.includes('prompt') || !oracle.requiredInputs.includes('capability_snapshot'))) {
    issue(issues, 'REQUIRED_INPUTS_INCOMPLETE', `${casePath}.oracle.requiredInputs`, 'Prompt and capability snapshot are mandatory inputs.');
  }
  if (!nonEmptyStrings(oracle.materialFields)) {
    issue(issues, 'MATERIAL_FIELDS_MISSING', `${casePath}.oracle.materialFields`, 'Material fields must be declared.');
  }
  if (stringArray(oracle.materialFields)
      && new Set(oracle.materialFields).size !== oracle.materialFields.length) {
    issue(issues, 'MATERIAL_FIELDS_DUPLICATE', `${casePath}.oracle.materialFields`, 'Material fields must be unique.');
  }
  if (!nonEmptyStrings(oracle.permittedOutcomes)) {
    issue(issues, 'PERMITTED_OUTCOMES_MISSING', `${casePath}.oracle.permittedOutcomes`, 'At least one permitted outcome is required.');
  }
  if (!Array.isArray(oracle.forbiddenClaims) || oracle.forbiddenClaims.length === 0) {
    issue(issues, 'FORBIDDEN_CLAIMS_INVALID', `${casePath}.oracle.forbiddenClaims`, 'At least one typed forbidden claim is required.');
  }
  if (!nonEmptyStrings(oracle.expectedSources)) {
    issue(issues, 'EXPECTED_SOURCES_MISSING', `${casePath}.oracle.expectedSources`, 'At least one expected source is required.');
  } else if (stratum
      && canonicalJson([...oracle.expectedSources].sort()) !== canonicalJson([...stratum.requiredSources].sort())) {
    issue(issues, 'EXPECTED_SOURCES_MISMATCH', `${casePath}.oracle.expectedSources`, 'Oracle sources must exactly match the configured stratum.');
  }
  if (!isRecord(oracle.authorityBoundary)
      || typeof oracle.authorityBoundary.description !== 'string'
      || oracle.authorityBoundary.description.trim().length === 0
      || typeof oracle.authorityBoundary.predicateId !== 'string'
      || oracle.authorityBoundary.predicateId.length === 0) {
    issue(issues, 'AUTHORITY_BOUNDARY_MISSING', `${casePath}.oracle.authorityBoundary`, 'Authority boundary is required.');
  }
  if (!isRecord(oracle.finalStateConstraints)) {
    issue(issues, 'FINAL_STATE_CONSTRAINTS_MISSING', `${casePath}.oracle.finalStateConstraints`, 'Final-state constraints are required.');
    return { valid: false, issues };
  }
  if (!stringArray(oracle.finalStateConstraints.allowedCreatedArtifactTypes)) {
    issue(issues, 'ALLOWED_ARTIFACT_TYPES_INVALID', `${casePath}.oracle.finalStateConstraints.allowedCreatedArtifactTypes`, 'Allowed artifact types must be a string array.');
  }
  if (oracle.finalStateConstraints.financialMutationsMustBeEmpty !== true) {
    issue(issues, 'FINANCIAL_BOUNDARY_MISSING', `${casePath}.oracle.finalStateConstraints`, 'Financial mutations must be forbidden.');
  }

  const ids = new Set<string>();
  const orderKeys = new Set<string>();
  const predicates = Array.isArray(oracle.predicates) ? oracle.predicates : [];
  if (!Array.isArray(predicates) || predicates.length === 0) {
    issue(issues, 'PREDICATES_MISSING', `${casePath}.oracle.predicates`, 'At least one predicate is required.');
  }
  for (const [index, unknownPredicate] of predicates.entries()) {
    const predicatePath = `${casePath}.oracle.predicates[${index}]`;
    if (!isRecord(unknownPredicate)) {
      issue(issues, 'PREDICATE_OBJECT_REQUIRED', predicatePath, 'Predicate must be an object.');
      continue;
    }
    const predicate = unknownPredicate;
    const predicateId = typeof predicate.id === 'string' ? predicate.id : '';
    const label = typeof predicate.label === 'string' ? predicate.label : '';
    const predicateOrder = predicate.predicateOrder;
    const comparison = typeof predicate.comparison === 'string' ? predicate.comparison : '';
    if (!predicateId) issue(issues, 'PREDICATE_ID_REQUIRED', predicatePath, 'Predicate id is required.');
    if (ids.has(predicateId)) issue(issues, 'PREDICATE_ID_DUPLICATE', predicatePath, 'Predicate id must be unique within a case.');
    ids.add(predicateId);
    const stageOrder = STAGE_ORDER.indexOf(label as (typeof STAGE_ORDER)[number]);
    if (stageOrder < 0) issue(issues, 'FAILURE_LABEL_INVALID', predicatePath, 'Predicate label is outside the frozen taxonomy.');
    if (!Number.isInteger(predicateOrder) || (predicateOrder as number) < 0) {
      issue(issues, 'PREDICATE_ORDER_INVALID', predicatePath, 'Predicate order must be a non-negative integer.');
    }
    const orderKey = `${label}:${String(predicateOrder)}`;
    if (orderKeys.has(orderKey)) issue(issues, 'PREDICATE_ORDER_DUPLICATE', predicatePath, 'Within-stage predicate order must be unique.');
    orderKeys.add(orderKey);
    if (typeof predicate.path !== 'string'
        || predicate.path.length === 0
        || predicate.path === 'response.text'
        || predicate.path.startsWith('response.text.')) {
      issue(issues, 'AUTHORITATIVE_PROSE_GRADING_FORBIDDEN', predicatePath, 'Predicates must grade structured evidence, not exact prose.');
    }
    if (![
      'equals',
      'not_equals',
      'one_of',
      'includes',
      'set_equals',
      'empty',
      'length_equals',
      'item_field_set_subset',
    ].includes(comparison)) {
      issue(issues, 'COMPARISON_INVALID', predicatePath, 'Comparison operator is not supported.');
    }
    if (comparison !== 'empty' && predicate.expected === undefined) {
      issue(issues, 'EXPECTED_VALUE_MISSING', predicatePath, 'Non-empty comparisons require an expected value.');
    }
    if (comparison === 'item_field_set_subset'
        && (typeof predicate.itemField !== 'string' || !stringArray(predicate.expected))) {
      issue(issues, 'ITEM_FIELD_SUBSET_INVALID', predicatePath, 'Item-field subset comparison requires an item field and string-array expected value.');
    }
    if (comparison === 'one_of' && !nonEmptyStrings(predicate.expected)) {
      issue(issues, 'ONE_OF_EXPECTED_INVALID', predicatePath, 'One-of comparison requires a non-empty string-array expected value.');
    }
    if (typeof predicate.materialField === 'string'
        && stringArray(oracle.materialFields)
        && !oracle.materialFields.includes(predicate.materialField)) {
      issue(issues, 'PREDICATE_MATERIAL_FIELD_UNKNOWN', predicatePath, 'Predicate materialField must be declared by the oracle.');
    }
  }

  const coveredMaterialFields = new Set(
    predicates.flatMap((predicate) => isRecord(predicate) && typeof predicate.materialField === 'string'
      ? [predicate.materialField]
      : []),
  );
  for (const materialField of stringArray(oracle.materialFields) ? oracle.materialFields : []) {
    if (!coveredMaterialFields.has(materialField)) {
      issue(issues, 'MATERIAL_FIELD_UNGRADED', `${casePath}.oracle.materialFields`, `Material field ${materialField} has no deterministic predicate.`);
    }
  }

  for (const unknownPredicate of predicates) {
    if (!isRecord(unknownPredicate)) continue;
    const predicate = unknownPredicate;
    if (predicate.requires !== undefined && !stringArray(predicate.requires)) {
      issue(issues, 'PREDICATE_DEPENDENCIES_INVALID', `${casePath}.oracle.${String(predicate.id)}`, 'Predicate dependencies must be a string array.');
      continue;
    }
    for (const dependency of stringArray(predicate.requires) ? predicate.requires : []) {
      const upstream = predicates.find((candidate) => isRecord(candidate) && candidate.id === dependency);
      if (!upstream) {
        issue(issues, 'PREDICATE_DEPENDENCY_UNKNOWN', `${casePath}.oracle.${String(predicate.id)}`, `Unknown dependency ${dependency}.`);
        continue;
      }
      const upstreamKey = [
        STAGE_ORDER.indexOf(upstream.label as (typeof STAGE_ORDER)[number]),
        Number(upstream.predicateOrder),
      ];
      const currentKey = [
        STAGE_ORDER.indexOf(predicate.label as (typeof STAGE_ORDER)[number]),
        Number(predicate.predicateOrder),
      ];
      if (upstreamKey[0] > currentKey[0] || (upstreamKey[0] === currentKey[0] && upstreamKey[1] >= currentKey[1])) {
        issue(issues, 'PREDICATE_DEPENDENCY_ORDER_INVALID', `${casePath}.oracle.${String(predicate.id)}`, 'Dependencies must precede their dependent predicate.');
      }
    }
  }

  for (const [index, unknownClaim] of (Array.isArray(oracle.forbiddenClaims) ? oracle.forbiddenClaims : []).entries()) {
    const claimPath = `${casePath}.oracle.forbiddenClaims[${index}]`;
    if (!isRecord(unknownClaim)) {
      issue(issues, 'FORBIDDEN_CLAIM_OBJECT_REQUIRED', claimPath, 'Forbidden claim must be an object.');
      continue;
    }
    const claimId = typeof unknownClaim.id === 'string' ? unknownClaim.id : '';
    if (!claimId) issue(issues, 'FORBIDDEN_CLAIM_ID_REQUIRED', claimPath, 'Forbidden claim id is required.');
    if (ids.has(claimId)) issue(issues, 'PREDICATE_ID_DUPLICATE', claimPath, 'Forbidden claim id must be unique within the oracle.');
    ids.add(claimId);
    if (!Number.isInteger(unknownClaim.predicateOrder) || Number(unknownClaim.predicateOrder) < 0) {
      issue(issues, 'PREDICATE_ORDER_INVALID', claimPath, 'Forbidden claim order must be a non-negative integer.');
    }
    const orderKey = `outcome_truth_failure:${String(unknownClaim.predicateOrder)}`;
    if (orderKeys.has(orderKey)) issue(issues, 'PREDICATE_ORDER_DUPLICATE', claimPath, 'Forbidden claim order must be unique in outcome truth.');
    orderKeys.add(orderKey);
    if (typeof unknownClaim.path !== 'string'
        || !unknownClaim.path.startsWith('response.structuredClaims.')) {
      issue(issues, 'FORBIDDEN_CLAIM_PATH_INVALID', claimPath, 'Forbidden claims must bind a structured response claim.');
    }
    if (unknownClaim.forbidden === undefined) {
      issue(issues, 'FORBIDDEN_CLAIM_VALUE_MISSING', claimPath, 'Forbidden claim value is required.');
    }
  }

  if (stringArray(oracle.expectedSources) && oracle.expectedSources.includes('capability')) {
    const capabilitySource = predicates.find((predicate) => isRecord(predicate) && predicate.id === 'capability_source_consulted');
    if (!isRecord(capabilitySource)
        || capabilitySource.path !== 'trace.consultedCapabilitySource'
        || capabilitySource.comparison !== 'equals'
        || capabilitySource.expected !== true) {
      issue(issues, 'CAPABILITY_SOURCE_PREDICATE_MISSING', `${casePath}.oracle.predicates`, 'Capability source expectation requires an exact deterministic source predicate.');
    }
  }
  if (stringArray(oracle.expectedSources) && oracle.expectedSources.includes('external')) {
    const externalSource = predicates.find((predicate) => isRecord(predicate) && predicate.id === 'external_source_consulted');
    if (!isRecord(externalSource)
        || externalSource.path !== 'trace.externalSearchCalls'
        || externalSource.comparison !== 'length_equals'
        || externalSource.expected !== 1) {
      issue(issues, 'EXTERNAL_SOURCE_PREDICATE_MISSING', `${casePath}.oracle.predicates`, 'External source expectation requires an exact deterministic source predicate.');
    }
  }
  const financialVeto = predicates.find((predicate) => isRecord(predicate) && predicate.id === 'no_financial_mutation');
  if (!isRecord(financialVeto)
      || financialVeto.veto !== 'financial_mutation'
      || financialVeto.comparison !== 'empty'
      || financialVeto.path !== 'state.financialMutations') {
    issue(issues, 'FINANCIAL_VETO_MISSING', `${casePath}.oracle.predicates`, 'Every case requires the financial-mutation veto.');
  }
  const artifactConstraint = predicates.find((predicate) => isRecord(predicate) && predicate.id === 'created_artifact_types_allowed');
  if (!isRecord(artifactConstraint)
      || artifactConstraint.comparison !== 'item_field_set_subset'
      || artifactConstraint.path !== 'state.createdArtifacts'
      || artifactConstraint.itemField !== 'type'
      || canonicalJson(artifactConstraint.expected)
        !== canonicalJson(oracle.finalStateConstraints.allowedCreatedArtifactTypes)) {
    issue(issues, 'ARTIFACT_CONSTRAINT_PREDICATE_MISMATCH', `${casePath}.oracle.finalStateConstraints`, 'Allowed artifact types must exactly match the deterministic final-state predicate.');
  }
  const permittedOutcomePredicate = predicates.find((predicate) => isRecord(predicate) && predicate.id === 'permitted_outcome_claimed');
  if (!isRecord(permittedOutcomePredicate)
      || permittedOutcomePredicate.label !== 'outcome_truth_failure'
      || permittedOutcomePredicate.comparison !== 'one_of'
      || permittedOutcomePredicate.path !== 'response.structuredClaims.outcome'
      || canonicalJson(permittedOutcomePredicate.expected) !== canonicalJson(oracle.permittedOutcomes)) {
    issue(issues, 'PERMITTED_OUTCOME_PREDICATE_MISMATCH', `${casePath}.oracle.permittedOutcomes`, 'Permitted outcomes must exactly match the deterministic outcome predicate.');
  }
  const authorityPredicate = isRecord(oracle.authorityBoundary)
    ? predicates.find((predicate) => isRecord(predicate) && predicate.id === oracle.authorityBoundary.predicateId)
    : undefined;
  if (!isRecord(authorityPredicate)
      || authorityPredicate.label !== 'permission_failure'
      || authorityPredicate.veto !== 'authority') {
    issue(issues, 'AUTHORITY_PREDICATE_MISMATCH', `${casePath}.oracle.authorityBoundary`, 'Authority boundary must reference an authority-veto permission predicate.');
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
  const caseIds = cases.map((item, index) => isRecord(item) && typeof item.id === 'string' ? item.id : `<invalid:${index}>`);
  if (new Set(caseIds).size !== cases.length) issue(issues, 'CASE_ID_DUPLICATE', 'cases', 'Case ids must be unique.');
  for (const stratum of strata) {
    const benchmarkCase = cases.find((item) => isRecord(item) && item.id === stratum.visibleCaseId);
    if (!isRecord(benchmarkCase) || benchmarkCase.stratumId !== stratum.id) {
      issue(issues, 'STRATUM_CASE_LINK_BROKEN', `stratum:${stratum.id}`, 'Every stratum must own exactly its configured visible case.');
    }
  }
  for (const benchmarkCase of cases) {
    const stratumId = isRecord(benchmarkCase) && typeof benchmarkCase.stratumId === 'string'
      ? benchmarkCase.stratumId
      : undefined;
    const result = validateCaseBeforeProvider(
      benchmarkCase,
      strata.find((item) => item.id === stratumId),
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
  const latestEntry = new Map<string, ExposureLedgerEntry>();
  const caseIndex = new Map(cases.map((item) => [item.id, item]));

  for (const [index, unknownEntry] of entries.entries()) {
    const entryPath = `exposure[${index}]`;
    if (!isRecord(unknownEntry)) {
      issue(issues, 'EXPOSURE_ENTRY_OBJECT_REQUIRED', entryPath, 'Exposure entry must be an object.');
      continue;
    }
    const entry = unknownEntry as unknown as ExposureLedgerEntry;
    if (typeof entry.entryId !== 'string' || entry.entryId.length === 0) {
      issue(issues, 'EXPOSURE_ENTRY_ID_REQUIRED', entryPath, 'Entry id is required.');
    } else if (entryIds.has(entry.entryId)) {
      issue(issues, 'EXPOSURE_ENTRY_DUPLICATE', entryPath, 'Entry ids are append-only identities and must be unique.');
    }
    entryIds.add(entry.entryId);
    if (typeof entry.caseId !== 'string' || entry.caseId.length === 0) issue(issues, 'EXPOSURE_CASE_ID_REQUIRED', entryPath, 'Case id is required.');
    if (typeof entry.stratumId !== 'string' || entry.stratumId.length === 0) issue(issues, 'EXPOSURE_STRATUM_ID_REQUIRED', entryPath, 'Stratum id is required.');
    if (typeof entry.artifactDigest !== 'string'
        || entry.artifactDigest.length !== 64
        || ![...entry.artifactDigest].every((character) => '0123456789abcdef'.includes(character))) {
      issue(issues, 'EXPOSURE_DIGEST_INVALID', entryPath, 'Artifact digest must be a lowercase SHA-256 hex string.');
    }
    if (entry.partitionBefore !== null && !PARTITIONS.includes(entry.partitionBefore)) issue(issues, 'PARTITION_BEFORE_INVALID', entryPath, 'Prior partition is invalid.');
    if (!PARTITIONS.includes(entry.partitionAfter)) issue(issues, 'PARTITION_INVALID', entryPath, 'Partition is invalid.');
    if (!EXPOSURE_EVENTS.includes(entry.event)) issue(issues, 'EXPOSURE_EVENT_INVALID', entryPath, 'Exposure event is invalid.');
    if (!ACTOR_ROLES.includes(entry.actorRole)) issue(issues, 'EXPOSURE_ACTOR_ROLE_INVALID', entryPath, 'Actor role is invalid.');
    if (!EXPOSURE_TYPES.includes(entry.exposureType)) issue(issues, 'EXPOSURE_TYPE_INVALID', entryPath, 'Exposure type is invalid.');
    if (entry.runId !== null && (typeof entry.runId !== 'string' || entry.runId.length === 0)) issue(issues, 'EXPOSURE_RUN_ID_INVALID', entryPath, 'Run id must be null or a non-empty string.');
    if (typeof entry.reason !== 'string' || entry.reason.trim().length === 0) issue(issues, 'EXPOSURE_REASON_REQUIRED', entryPath, 'A bounded reason is required.');
    const current = latestPartition.get(entry.caseId);
    if ((current ?? null) !== entry.partitionBefore) issue(issues, 'PARTITION_CHAIN_BROKEN', entryPath, 'partitionBefore must equal the prior appended state.');
    if (!current && entry.event !== 'authored') issue(issues, 'PARTITION_MUST_START_AUTHORED', entryPath, 'A case partition history must begin with authored.');
    if (entry.event === 'allocated'
        && !(entry.partitionBefore === 'reserve' && entry.partitionAfter === 'active_blind')) {
      issue(issues, 'BLIND_ALLOCATION_TRANSITION_INVALID', entryPath, 'Allocation is only reserve to active_blind.');
    }
    if ((entry.event === 'exposed' || entry.event === 'consumed') && entry.partitionAfter !== 'consumed') {
      issue(issues, 'CONSUMPTION_TRANSITION_INVALID', entryPath, 'Exposed or consumed events must end in consumed.');
    }
    if (current === 'consumed' && entry.partitionAfter !== 'consumed') issue(issues, 'CONSUMED_REVERSAL_FORBIDDEN', entryPath, 'Consumed cases can never regain another partition.');
    if (current === 'stability' && entry.partitionAfter !== 'stability') issue(issues, 'STABILITY_REVERSAL_FORBIDDEN', entryPath, 'Stability cases are permanently stability-partitioned.');
    if (current && current !== 'stability' && entry.partitionAfter === 'stability') issue(issues, 'STABILITY_REASSIGNMENT_FORBIDDEN', entryPath, 'Existing cases cannot be reassigned into stability.');
    const allowedTransitions: Record<NonNullable<typeof current>, ExposureLedgerEntry['partitionAfter'][]> = {
      visible: ['visible', 'consumed'],
      reserve: ['reserve', 'active_blind', 'consumed'],
      active_blind: ['active_blind', 'consumed'],
      consumed: ['consumed'],
      stability: ['stability'],
    };
    if (current && !allowedTransitions[current].includes(entry.partitionAfter)) {
      issue(issues, 'PARTITION_TRANSITION_FORBIDDEN', entryPath, `Transition ${current} to ${entry.partitionAfter} is forbidden.`);
    }
    const contaminationSensitiveRole = ['implementer', 'scorer_maintainer', 'reviewer'].includes(entry.actorRole);
    const blindAtEitherBoundary = current === 'active_blind'
      || current === 'reserve'
      || entry.partitionAfter === 'active_blind'
      || entry.partitionAfter === 'reserve';
    if (blindAtEitherBoundary
        && entry.exposureType !== 'none'
        && contaminationSensitiveRole
        && entry.partitionAfter !== 'consumed') {
      issue(issues, 'BLIND_EXPOSURE_MUST_CONSUME', entryPath, 'Mechanism exposure to an implementation-capable role must immediately consume a blind or reserve case.');
    }
    const timestamp = typeof entry.occurredAt === 'string' ? Date.parse(entry.occurredAt) : Number.NaN;
    if (!Number.isFinite(timestamp)) issue(issues, 'EXPOSURE_TIME_INVALID', entryPath, 'occurredAt must be an ISO timestamp.');
    const priorTime = latestTime.get(entry.caseId);
    if (priorTime !== undefined && timestamp < priorTime) issue(issues, 'EXPOSURE_TIME_REVERSED', entryPath, 'Entries for a case must be chronological.');
    const benchmarkCase = caseIndex.get(entry.caseId);
    if (benchmarkCase) {
      if (entry.stratumId !== benchmarkCase.stratumId) issue(issues, 'EXPOSURE_STRATUM_MISMATCH', entryPath, 'Ledger stratum must match the case.');
    }
    latestPartition.set(entry.caseId, entry.partitionAfter);
    latestTime.set(entry.caseId, timestamp);
    latestEntry.set(entry.caseId, entry);
  }

  for (const benchmarkCase of cases) {
    if (latestPartition.get(benchmarkCase.id) !== benchmarkCase.partition) {
      issue(issues, 'EXPOSURE_CASE_UNACCOUNTED', `case:${benchmarkCase.id}`, 'Every visible case must have a matching final ledger partition.');
    }
    if (latestEntry.get(benchmarkCase.id)?.artifactDigest !== digest(benchmarkCase)) {
      issue(issues, 'EXPOSURE_DIGEST_MISMATCH', `case:${benchmarkCase.id}`, 'The latest ledger entry must identify the current case and oracle digest.');
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
  for (const [index, unknownEntry] of entries.entries()) {
    const entryPath = `runs[${index}]`;
    if (!isRecord(unknownEntry)) {
      issue(issues, 'RUN_ENTRY_OBJECT_REQUIRED', entryPath, 'Run entry must be an object.');
      continue;
    }
    const entry = unknownEntry as unknown as RunRecord;
    if (typeof entry.entryId !== 'string' || entry.entryId.length === 0) issue(issues, 'RUN_ENTRY_ID_REQUIRED', entryPath, 'Run entry id is required.');
    if (entryIds.has(entry.entryId)) issue(issues, 'RUN_ENTRY_DUPLICATE', entryPath, 'Run entry ids must be unique.');
    entryIds.add(entry.entryId);
    if (typeof entry.runId !== 'string' || entry.runId.length === 0) issue(issues, 'RUN_ID_REQUIRED', entryPath, 'Run id is required.');
    if (!RUN_STATES.includes(entry.state)) issue(issues, 'RUN_STATE_INVALID', entryPath, 'Run state is invalid.');
    if (!isRecord(entry.tuple)) {
      issue(issues, 'RUN_TUPLE_REQUIRED', `${entryPath}.tuple`, 'Run tuple must be an object.');
      continue;
    }
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
    if (!isRecord(entry.tuple.inferenceParameters)) issue(issues, 'RUN_INFERENCE_PARAMETERS_INVALID', `${entryPath}.tuple.inferenceParameters`, 'Inference parameters must be an object.');
    if (!isRecord(entry.tuple.providerConfiguration)) issue(issues, 'RUN_PROVIDER_CONFIGURATION_INVALID', `${entryPath}.tuple.providerConfiguration`, 'Provider configuration must be an object.');
    if (!Array.isArray(entry.caseResultRefs)
        || !entry.caseResultRefs.every((reference) => typeof reference === 'string' && reference.length > 0)) {
      issue(issues, 'RUN_CASE_RESULT_REFS_INVALID', entryPath, 'Case result references must be a string array.');
    }
    if (entry.aggregate !== null
        && (!isRecord(entry.aggregate)
          || !Object.values(entry.aggregate).every((value) => typeof value === 'number' && Number.isFinite(value)))) {
      issue(issues, 'RUN_AGGREGATE_INVALID', entryPath, 'Run aggregate must be null or a finite numeric record.');
    }
    if (!('failureReason' in entry)
        || (entry.failureReason !== null
          && (typeof entry.failureReason !== 'string' || entry.failureReason.length === 0))) {
      issue(issues, 'RUN_FAILURE_REASON_INVALID', entryPath, 'Failure reason must be present and null or a non-empty string.');
    }
    const prior = latest.get(entry.runId);
    if (!prior && entry.state !== 'planned') issue(issues, 'RUN_MUST_START_PLANNED', entryPath, 'A run must begin with planned.');
    if (prior) {
      if (!RUN_TRANSITIONS[prior.state]?.includes(entry.state)) issue(issues, 'RUN_TRANSITION_INVALID', entryPath, 'Run state transition is invalid.');
      if (canonicalJson(prior.tuple) !== canonicalJson(entry.tuple)) issue(issues, 'RUN_TUPLE_MUTATED', entryPath, 'The immutable run tuple changed within a run.');
      if (Date.parse(entry.occurredAt) < Date.parse(prior.occurredAt)) issue(issues, 'RUN_TIME_REVERSED', entryPath, 'Run records must be chronological.');
    }
    if (typeof entry.occurredAt !== 'string' || !Number.isFinite(Date.parse(entry.occurredAt))) issue(issues, 'RUN_TIME_INVALID', entryPath, 'occurredAt must be an ISO timestamp.');
    if (typeof entry.costUsd !== 'number' || !Number.isFinite(entry.costUsd) || entry.costUsd < 0) issue(issues, 'RUN_COST_INVALID', entryPath, 'Run cost must be a non-negative finite number.');
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
  if (!isRecord(contract)) {
    issue(issues, 'STABILITY_CONTRACT_REQUIRED', 'stability', 'Stability contract must be an object.');
    return { valid: false, issues };
  }
  if (contract.contractVersion !== 'avalonbench-stability-v1') {
    issue(issues, 'STABILITY_VERSION_INVALID', 'stability.contractVersion', 'Stability contract version is invalid.');
  }
  if (contract.partition !== 'stability' || !contract.permanentlyNonBlind) {
    issue(issues, 'STABILITY_PARTITION_INVALID', 'stability', 'The panel must be permanently non-blind and stability-partitioned.');
  }
  if (contract.includedInBlindScore) issue(issues, 'STABILITY_BLIND_SCORE_FORBIDDEN', 'stability', 'Stability cases cannot enter the blind score.');
  if (!Array.isArray(contract.immutableTupleFields)
      || canonicalJson([...contract.immutableTupleFields].sort())
      !== canonicalJson([...RUN_TUPLE_FIELDS].sort())
  ) {
    issue(issues, 'STABILITY_TUPLE_INCOMPLETE', 'stability.immutableTupleFields', 'All ten immutable run-tuple fields are required.');
  }
  if (typeof contract.seriesRule !== 'string' || contract.seriesRule.trim().length === 0) {
    issue(issues, 'STABILITY_SERIES_RULE_REQUIRED', 'stability.seriesRule', 'Stability series rule is required.');
  }
  if (!Array.isArray(contract.caseIds) || !contract.caseIds.every((caseId) => typeof caseId === 'string')) {
    issue(issues, 'STABILITY_CASE_IDS_INVALID', 'stability.caseIds', 'Stability case ids must be a string array.');
  } else if (contract.caseIds.length !== 0) {
    issue(issues, 'SLICE1_STABILITY_CASES_FORBIDDEN', 'stability.caseIds', 'Slice 1 defines the panel contract but does not author panel cases.');
  }
  return { valid: issues.length === 0, issues };
}
