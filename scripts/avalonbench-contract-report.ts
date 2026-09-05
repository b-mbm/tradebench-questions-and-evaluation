import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalJson, digest } from '../src/avalonbench/canonical';
import {
  CAPABILITY_SNAPSHOT,
  DETERMINISTIC_HARNESS,
  DETERMINISTIC_SYSTEM_SCAFFOLD,
  DETERMINISTIC_TOOL_MANIFEST,
  STABILITY_PANEL,
  STRATA,
  VISIBLE_CASES,
} from '../src/avalonbench/contract';
import { runContractProofs } from '../src/avalonbench/proofs';
import { buildDeterministicRunRecords, buildDeterministicRunTuple } from '../src/avalonbench/run-contract';
import { RUNTIME_INVENTORY } from '../src/avalonbench/runtime-inventory';
import type { ExposureLedgerEntry, RunRecord, StabilityPanelContract } from '../src/avalonbench/schema';
import { PARTITIONS, STAGE_ORDER } from '../src/avalonbench/schema';
import {
  combinedSourceIdentity,
  identifySources,
  RUNNER_SOURCE_PATHS,
  SCORER_SOURCE_PATHS,
} from '../src/avalonbench/source-identity';
import {
  parseJsonLines,
  validateContract,
  validateExposureLedger,
  validateRunRegistry,
  validateStabilityPanel,
} from '../src/avalonbench/validator';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const scorerSources = identifySources(root, SCORER_SOURCE_PATHS);
const runnerSources = identifySources(root, RUNNER_SOURCE_PATHS);
const capabilitySnapshotDigest = digest(CAPABILITY_SNAPSHOT);
const caseBatchDigest = digest(VISIBLE_CASES);
const tuple = buildDeterministicRunTuple({
  caseBatchDigest,
  capabilitySnapshotDigest,
  systemScaffoldDigest: DETERMINISTIC_HARNESS.systemScaffoldDigest,
  toolManifestDigest: digest(DETERMINISTIC_TOOL_MANIFEST),
  scorerIdentity: combinedSourceIdentity(scorerSources),
  runnerIdentity: combinedSourceIdentity(runnerSources),
});

const exposureEntries = parseJsonLines<ExposureLedgerEntry>(
  readFileSync(resolve(root, 'data/avalonbench/v1/exposure-ledger.jsonl'), 'utf8'),
);
const runEntries = parseJsonLines<RunRecord>(
  readFileSync(resolve(root, 'data/avalonbench/v1/run-registry.jsonl'), 'utf8'),
);
const stabilityPanel = JSON.parse(
  readFileSync(resolve(root, 'data/avalonbench/v1/stability-panel.json'), 'utf8'),
) as StabilityPanelContract;

const validations = {
  contract: validateContract(STRATA, VISIBLE_CASES, CAPABILITY_SNAPSHOT),
  exposureLedger: validateExposureLedger(exposureEntries, VISIBLE_CASES),
  runRegistry: validateRunRegistry(runEntries),
  stabilityPanel: validateStabilityPanel(stabilityPanel),
};
for (const validation of Object.values(validations)) {
  assert.equal(validation.valid, true, JSON.stringify(validation.issues));
}
assert.deepEqual(stabilityPanel, STABILITY_PANEL);
assert.equal(canonicalJson(runEntries.slice(-3)), canonicalJson(buildDeterministicRunRecords(tuple)));

const proofs = runContractProofs();
const reportCore = {
  reportVersion: 'avalonbench-v1-slice1-contract-report-v1',
  generatedFrom: 'deterministic-local-contract; no wall-clock inputs',
  scope: 'Slice 1 only',
  safety: {
    providerCalls: 0,
    paidModelCalls: 0,
    productRuntimeCalls: 0,
    financialMutations: 0,
    blindCasesAuthored: 0,
    blindCasesAllocated: 0,
    blindCasesRun: 0,
  },
  identities: {
    productCommit: RUNTIME_INVENTORY.productRepository.commit,
    benchmarkBaselineCommit: RUNTIME_INVENTORY.benchmarkRepository.baselineCommit,
    scorerSources,
    runnerSources,
    tuple,
  },
  runtimeInventory: RUNTIME_INVENTORY,
  contract: {
    partitions: PARTITIONS,
    stageOrder: STAGE_ORDER,
    strata: STRATA,
    capabilitySnapshot: CAPABILITY_SNAPSHOT,
    deterministicSystemScaffold: DETERMINISTIC_SYSTEM_SCAFFOLD,
    capabilitySnapshotDigest,
    visibleCases: VISIBLE_CASES.map((benchmarkCase) => ({
      ...benchmarkCase,
      artifactDigest: digest(benchmarkCase),
    })),
    caseBatchDigest,
    stabilityPanel,
  },
  appendOnlyArtifacts: {
    exposureLedgerEntries: exposureEntries.length,
    runRegistryEntries: runEntries.length,
    exposureLedgerDigest: digest(exposureEntries),
    runRegistryDigest: digest(runEntries),
  },
  validations,
  proofs: {
    green: proofs.filter((proof) => proof.id.startsWith('green:')),
    red: proofs.filter((proof) => proof.id.startsWith('red:')),
    classifications: proofs.filter((proof) => proof.id.startsWith('classification:')),
  },
};
const report = { ...reportCore, reportDigest: digest(reportCore) };
const outputPath = resolve(root, 'reports/avalonbench-v1-contract-report.json');
mkdirSync(resolve(root, 'reports'), { recursive: true });
writeFileSync(outputPath, `${canonicalJson(report)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({ status: 'PASS', outputPath, reportDigest: report.reportDigest })}\n`);
