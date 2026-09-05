import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { digest } from '../src/avalonbench/canonical';
import { CAPABILITY_SNAPSHOT, STABILITY_PANEL, STRATA, VISIBLE_CASES } from '../src/avalonbench/contract';
import { assertAppendOnlyPrefix } from '../src/avalonbench/ledger';
import { runContractProofs } from '../src/avalonbench/proofs';
import { runCaseWithPreProviderValidation } from '../src/avalonbench/provider-runner';
import { RUNTIME_INVENTORY } from '../src/avalonbench/runtime-inventory';
import type { ExposureLedgerEntry, RunRecord, StabilityPanelContract } from '../src/avalonbench/schema';
import { PARTITIONS, STAGE_ORDER } from '../src/avalonbench/schema';
import {
  parseJsonLines,
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
    consumedReversalRejected: true,
    runTupleMutationRejected: true,
    invalidCaseRejectedBeforeProvider: invalidCaseProviderCalls === 0,
    providerFailureClassifiedIncomplete: incompleteResult.score.result === 'INCOMPLETE',
  },
  proofs: proofReceipts,
};

process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
