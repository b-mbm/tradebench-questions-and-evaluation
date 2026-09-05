import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { digest } from '../src/avalonbench/canonical';
import { CAPABILITY_SNAPSHOT, STABILITY_PANEL, STRATA, VISIBLE_CASES } from '../src/avalonbench/contract';
import { PASSING_EPISODES } from '../src/avalonbench/fixtures';
import { gradeEpisode } from '../src/avalonbench/grader';
import { assertAppendOnlyPrefix } from '../src/avalonbench/ledger';
import { runContractProofs } from '../src/avalonbench/proofs';
import { runCaseWithPreProviderValidation } from '../src/avalonbench/provider-runner';
import { RUNTIME_INVENTORY } from '../src/avalonbench/runtime-inventory';
import type { AvalonBenchCase, ExposureLedgerEntry, RunRecord, StabilityPanelContract } from '../src/avalonbench/schema';
import { PARTITIONS, STAGE_ORDER } from '../src/avalonbench/schema';
import {
  parseJsonLines,
  validateCaseBeforeProvider,
  validateContract,
  validateExposureLedger,
  validateRunRegistry,
  validateStabilityPanel,
} from '../src/avalonbench/validator';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const exposureRaw = readFileSync(resolve(root, 'data/avalonbench/v1/exposure-ledger.jsonl'), 'utf8');
const runRaw = readFileSync(resolve(root, 'data/avalonbench/v1/run-registry.jsonl'), 'utf8');
const stabilityRaw = readFileSync(resolve(root, 'data/avalonbench/v1/stability-panel.json'), 'utf8');
const exposureEntries = parseJsonLines<ExposureLedgerEntry>(exposureRaw);
const runEntries = parseJsonLines<RunRecord>(runRaw);
const stability = JSON.parse(stabilityRaw) as StabilityPanelContract;

const contractValidation = validateContract(STRATA, VISIBLE_CASES, CAPABILITY_SNAPSHOT);
const exposureValidation = validateExposureLedger(exposureEntries, VISIBLE_CASES);
const runValidation = validateRunRegistry(runEntries);
const stabilityValidation = validateStabilityPanel(stability);

assert.deepEqual(PARTITIONS, ['visible', 'active_blind', 'reserve', 'consumed', 'stability']);
assert.deepEqual(STAGE_ORDER, [
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
]);
assert.equal(RUNTIME_INVENTORY.sanctionedEntrypoints.avalonBenchAdapterPresent, false);
assert.deepEqual(stability, STABILITY_PANEL);
assert.equal(contractValidation.valid, true, JSON.stringify(contractValidation.issues));
assert.equal(exposureValidation.valid, true, JSON.stringify(exposureValidation.issues));
assert.equal(runValidation.valid, true, JSON.stringify(runValidation.issues));
assert.equal(stabilityValidation.valid, true, JSON.stringify(stabilityValidation.issues));

assert.throws(() => assertAppendOnlyPrefix(exposureRaw, exposureRaw.slice(1)), /APPEND_ONLY_PREFIX_VIOLATION/);
assert.doesNotThrow(() => assertAppendOnlyPrefix(exposureRaw, `${exposureRaw}{"append":"proof"}\n`));

const historicalExposurePrefix = [
  ['exposure-001', '921a8e11b09ded8717fc9d869f23575c45ce2d822728ac201ee5e9078d77861a'],
  ['exposure-002', '921a8e11b09ded8717fc9d869f23575c45ce2d822728ac201ee5e9078d77861a'],
  ['exposure-003', 'e19550e7e3becdbe4148abb5c42aa164a62680237e34ec75046014e30fef3c5a'],
  ['exposure-004', 'e19550e7e3becdbe4148abb5c42aa164a62680237e34ec75046014e30fef3c5a'],
  ['exposure-005', 'ee5d6afc994a11d8d4e49052490681f7e10a5ecdad6c5fc1a72fd5cea2b63fa9'],
  ['exposure-006', 'ee5d6afc994a11d8d4e49052490681f7e10a5ecdad6c5fc1a72fd5cea2b63fa9'],
  ['exposure-007', 'be6d137d5f63d1493553042861c7e05f68deb608e49dabb73dbc1712f273ac9a'],
  ['exposure-008', 'be6d137d5f63d1493553042861c7e05f68deb608e49dabb73dbc1712f273ac9a'],
];
assert.deepEqual(
  exposureEntries.slice(0, historicalExposurePrefix.length).map((entry) => [entry.entryId, entry.artifactDigest]),
  historicalExposurePrefix,
);
assert.deepEqual(runEntries.slice(0, 3).map((entry) => entry.entryId), [
  'run-001-planned',
  'run-001-launched',
  'run-001-completed',
]);
const rawLinePrefix = (raw: string, lineCount: number): string => `${raw.split('\n').slice(0, lineCount).join('\n')}\n`;
assert.equal(
  createHash('sha256').update(rawLinePrefix(exposureRaw, 8)).digest('hex'),
  'f275958880c239669938ec6b5330f7e13e0a1d16c4c5dc0fae9c56ee2c3a98c6',
);
assert.equal(
  createHash('sha256').update(rawLinePrefix(runRaw, 3)).digest('hex'),
  '3c4b32ae0325a4689f61ca3b3d65f81cb31dcd81542492d9811bb689935f092a',
);

const consumedMutation = structuredClone(exposureEntries);
consumedMutation.push({
  ...consumedMutation.at(-1)!,
  entryId: 'proof-consumed',
  caseId: 'avb-v1-visible-routing-001',
  partitionBefore: 'visible',
  partitionAfter: 'consumed',
  event: 'consumed',
  occurredAt: '2026-09-05T02:00:00.000Z',
});
consumedMutation.push({
  ...consumedMutation.at(-1)!,
  entryId: 'proof-consumed-reversal',
  partitionBefore: 'consumed',
  partitionAfter: 'visible',
  event: 'retired',
  occurredAt: '2026-09-05T02:00:01.000Z',
});
assert.equal(validateExposureLedger(consumedMutation, VISIBLE_CASES).valid, false);

const tupleMutation = structuredClone(runEntries);
tupleMutation[1].tuple.modelId = 'mutated-model';
assert.equal(validateRunRegistry(tupleMutation).valid, false);

const missingExposureFields = structuredClone(exposureEntries) as unknown as Array<Record<string, unknown>>;
delete missingExposureFields[0].event;
delete missingExposureFields[0].actorRole;
delete missingExposureFields[0].exposureType;
delete missingExposureFields[0].reason;
assert.equal(validateExposureLedger(missingExposureFields as unknown as ExposureLedgerEntry[], VISIBLE_CASES).valid, false);

const missingRunFields = structuredClone(runEntries) as unknown as Array<Record<string, unknown>>;
delete missingRunFields[0].failureReason;
delete missingRunFields[0].caseResultRefs;
assert.equal(validateRunRegistry(missingRunFields as unknown as RunRecord[]).valid, false);

const metadataOnlyBlindExposure: ExposureLedgerEntry[] = [
  {
    entryId: 'schema-proof-authored',
    caseId: 'schema-proof-no-case-body',
    stratumId: STRATA[0].id,
    artifactDigest: 'a'.repeat(64),
    partitionBefore: null,
    partitionAfter: 'reserve',
    event: 'authored',
    actorRole: 'blind_author',
    exposureType: 'none',
    runId: null,
    occurredAt: '2026-09-05T00:00:00.000Z',
    reason: 'In-memory metadata-only partition transition proof.',
  },
  {
    entryId: 'schema-proof-exposure',
    caseId: 'schema-proof-no-case-body',
    stratumId: STRATA[0].id,
    artifactDigest: 'a'.repeat(64),
    partitionBefore: 'reserve',
    partitionAfter: 'reserve',
    event: 'validated',
    actorRole: 'implementer',
    exposureType: 'prompt',
    runId: null,
    occurredAt: '2026-09-05T00:00:01.000Z',
    reason: 'Must be rejected because implementation-capable exposure consumes the case.',
  },
];
assert.equal(validateExposureLedger(metadataOnlyBlindExposure, []).issues.some(
  (entry) => entry.code === 'BLIND_EXPOSURE_MUST_CONSUME',
), true);

const initialBlindExposure = structuredClone(metadataOnlyBlindExposure).slice(0, 1);
initialBlindExposure[0].actorRole = 'implementer';
initialBlindExposure[0].exposureType = 'prompt';
assert.equal(validateExposureLedger(initialBlindExposure, []).issues.some(
  (entry) => entry.code === 'BLIND_EXPOSURE_MUST_CONSUME',
), true);

const blindLaundering = structuredClone(metadataOnlyBlindExposure);
blindLaundering[1].actorRole = 'custodian';
blindLaundering[1].exposureType = 'none';
blindLaundering[1].partitionAfter = 'visible';
assert.equal(validateExposureLedger(blindLaundering, []).issues.some(
  (entry) => entry.code === 'PARTITION_TRANSITION_FORBIDDEN',
), true);

const stabilityReassignment = structuredClone(metadataOnlyBlindExposure);
stabilityReassignment[0].partitionAfter = 'stability';
stabilityReassignment[1].partitionBefore = 'stability';
stabilityReassignment[1].partitionAfter = 'visible';
stabilityReassignment[1].actorRole = 'custodian';
stabilityReassignment[1].exposureType = 'none';
assert.equal(validateExposureLedger(stabilityReassignment, []).issues.some(
  (entry) => entry.code === 'STABILITY_REVERSAL_FORBIDDEN',
), true);

let invalidCaseProviderCalls = 0;
const invalidCase = structuredClone(VISIBLE_CASES[0]);
delete invalidCase.oracle.predicates[0].expected;
const preProviderResult = await runCaseWithPreProviderValidation(
  invalidCase,
  STRATA[0],
  CAPABILITY_SNAPSHOT,
  async () => {
    invalidCaseProviderCalls += 1;
    throw new Error('Provider callback must not run for an invalid case.');
  },
);
assert.equal(preProviderResult.providerInvoked, false);
assert.equal(preProviderResult.score.result, 'INVALID');
assert.equal(invalidCaseProviderCalls, 0);

const missingOracleCase = structuredClone(VISIBLE_CASES[0]) as Partial<AvalonBenchCase>;
delete missingOracleCase.oracle;
const missingOracleResult = await runCaseWithPreProviderValidation(
  missingOracleCase as AvalonBenchCase,
  STRATA[0],
  CAPABILITY_SNAPSHOT,
  async () => {
    invalidCaseProviderCalls += 1;
    throw new Error('Provider callback must not run for a structurally malformed case.');
  },
);
assert.equal(missingOracleResult.providerInvoked, false);
assert.equal(missingOracleResult.score.result, 'INVALID');
assert.equal(invalidCaseProviderCalls, 0);

const nullCaseResult = await runCaseWithPreProviderValidation(
  null as unknown as AvalonBenchCase,
  undefined,
  CAPABILITY_SNAPSHOT,
  async () => {
    invalidCaseProviderCalls += 1;
    throw new Error('Provider callback must not run for a null case.');
  },
);
assert.equal(nullCaseResult.providerInvoked, false);
assert.equal(nullCaseResult.score.result, 'INVALID');
assert.equal(nullCaseResult.score.caseId, '<invalid-case>');
assert.equal(invalidCaseProviderCalls, 0);

const malformedContract = validateContract(
  STRATA,
  [null as unknown as AvalonBenchCase, ...VISIBLE_CASES.slice(1)],
  CAPABILITY_SNAPSHOT,
);
assert.equal(malformedContract.valid, false);
assert.equal(malformedContract.issues.some((entry) => entry.code === 'CASE_OBJECT_REQUIRED'), true);

const oracleDrift = structuredClone(VISIBLE_CASES[3]);
oracleDrift.oracle.expectedSources = [];
oracleDrift.oracle.forbiddenClaims = [];
oracleDrift.oracle.finalStateConstraints.allowedCreatedArtifactTypes = ['trading_agent'];
const oracleDriftValidation = validateContract(STRATA, [
  VISIBLE_CASES[0],
  VISIBLE_CASES[1],
  VISIBLE_CASES[2],
  oracleDrift,
], CAPABILITY_SNAPSHOT);
assert.equal(oracleDriftValidation.valid, false);
assert.equal(oracleDriftValidation.issues.some((entry) => entry.code === 'EXPECTED_SOURCES_MISSING'), true);
assert.equal(oracleDriftValidation.issues.some((entry) => entry.code === 'FORBIDDEN_CLAIMS_INVALID'), true);
assert.equal(oracleDriftValidation.issues.some((entry) => entry.code === 'ARTIFACT_CONSTRAINT_PREDICATE_MISMATCH'), true);

const missingExternalPredicate = structuredClone(VISIBLE_CASES[0]);
const externalStratum = structuredClone(STRATA[0]);
externalStratum.requiredSources = ['capability', 'external'];
missingExternalPredicate.oracle.expectedSources = ['capability', 'external'];
const missingExternalValidation = validateCaseBeforeProvider(
  missingExternalPredicate,
  externalStratum,
  CAPABILITY_SNAPSHOT,
);
assert.equal(missingExternalValidation.valid, false);
assert.equal(missingExternalValidation.issues.some(
  (entry) => entry.code === 'EXTERNAL_SOURCE_PREDICATE_MISSING',
), true);

const mismatchedEpisode = structuredClone(PASSING_EPISODES[VISIBLE_CASES[0].id]);
mismatchedEpisode.taskId = VISIBLE_CASES[1].id;
mismatchedEpisode.prompt = VISIBLE_CASES[1].prompt;
mismatchedEpisode.harness.systemScaffoldDigest = 'f'.repeat(64);
mismatchedEpisode.harness.capabilitySnapshotDigest = 'e'.repeat(64);
mismatchedEpisode.fixtures.capabilitySnapshot = 'wrong-capability-fixture';
mismatchedEpisode.fixtures.venueSnapshot = 'wrong-venue-fixture';
mismatchedEpisode.fixtures.accountState = 'wrong-account-fixture';
const mismatchedEpisodeResult = gradeEpisode(VISIBLE_CASES[0], STRATA[0], CAPABILITY_SNAPSHOT, mismatchedEpisode);
assert.equal(mismatchedEpisodeResult.result, 'INCOMPLETE');
assert.equal(mismatchedEpisodeResult.primaryFailure?.id, 'episode_task_bound');
assert.equal(mismatchedEpisodeResult.secondaryFailures.some((entry) => entry.id === 'episode_prompt_bound'), true);
assert.equal(mismatchedEpisodeResult.secondaryFailures.some((entry) => entry.id === 'capability_fixture_bound'), true);

const forbiddenOutcomeEpisode = structuredClone(PASSING_EPISODES[VISIBLE_CASES[3].id]);
forbiddenOutcomeEpisode.response.structuredClaims.installed = true;
forbiddenOutcomeEpisode.response.structuredClaims.financialExecution = true;
forbiddenOutcomeEpisode.state.createdArtifacts.push({ type: 'trading_agent', id: 'forbidden-artifact' });
const forbiddenOutcomeResult = gradeEpisode(VISIBLE_CASES[3], STRATA[3], CAPABILITY_SNAPSHOT, forbiddenOutcomeEpisode);
assert.equal(forbiddenOutcomeResult.result, 'FAIL');
assert.equal(forbiddenOutcomeResult.primaryFailure?.id, 'agent_installed_without_confirmation_forbidden');
assert.equal(forbiddenOutcomeResult.secondaryFailures.some((entry) => entry.id === 'financial_execution_forbidden'), true);
assert.equal(forbiddenOutcomeResult.secondaryFailures.some((entry) => entry.id === 'created_artifact_types_allowed'), true);

const incompleteResult = await runCaseWithPreProviderValidation(
  VISIBLE_CASES[0],
  STRATA[0],
  CAPABILITY_SNAPSHOT,
  async () => {
    throw new Error('synthetic unavailable provider');
  },
);
assert.equal(incompleteResult.providerInvoked, true);
assert.equal(incompleteResult.score.result, 'INCOMPLETE');
assert.equal(incompleteResult.score.primaryFailure?.label, 'harness_context_failure');

const proofReceipts = runContractProofs();
assert.equal(proofReceipts.filter((proof) => proof.id.startsWith('green:avb-')).length, 4);
assert.equal(proofReceipts.filter((proof) => proof.id.startsWith('red:')).length, 13);
assert.equal(proofReceipts.every((proof) => proof.expected === proof.observed), true);

const output = {
  status: 'PASS',
  providerCalls: 0,
  productMutations: 0,
  financialMutations: 0,
  contractDigest: digest({ strata: STRATA, cases: VISIBLE_CASES, capabilitySnapshot: CAPABILITY_SNAPSHOT }),
  validations: {
    contract: contractValidation.valid,
    exposureLedger: exposureValidation.valid,
    runRegistry: runValidation.valid,
    stabilityPanel: stabilityValidation.valid,
    appendOnlyRewriteRejected: true,
    historicalAppendOnlyPrefixesRetained: true,
    consumedReversalRejected: true,
    runTupleMutationRejected: true,
    missingExposureFieldsRejected: true,
    missingRunFieldsRejected: true,
    blindExposureRequiresConsumption: true,
    initialBlindExposureRejected: true,
    blindPartitionLaunderingRejected: true,
    stabilityPartitionPermanent: true,
    invalidCaseRejectedBeforeProvider: invalidCaseProviderCalls === 0,
    malformedCaseRejectedBeforeProvider: missingOracleResult.score.result === 'INVALID',
    nullCaseRejectedBeforeProvider: nullCaseResult.score.result === 'INVALID',
    malformedContractRejectedWithoutThrow: malformedContract.valid === false,
    oracleDeclarationDriftRejected: true,
    externalSourceDeclarationLinked: missingExternalValidation.valid === false,
    episodeIdentityMismatchRejected: mismatchedEpisodeResult.result === 'INCOMPLETE',
    forbiddenClaimsAndArtifactsRejected: forbiddenOutcomeResult.result === 'FAIL',
    providerFailureClassifiedIncomplete: incompleteResult.score.result === 'INCOMPLETE',
  },
  proofs: proofReceipts,
};

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
