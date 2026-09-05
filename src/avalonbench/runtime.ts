import { mkdirSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import runtimeContractFixture from '../../data/avalonbench/v1/runtime-contract.json';
import { canonicalJson, digest } from './canonical';
import { CAPABILITY_SNAPSHOT, DETERMINISTIC_HARNESS, STRATA, VISIBLE_CASES } from './contract';
import { appendRunRecord } from './ledger';
import { runCaseWithPreProviderValidation } from './provider-runner';
import type { EpisodeEnvelope, RunRecord, RunTuple, ScoredResult } from './schema';
import { combinedSourceIdentity, identifySources, RUNNER_SOURCE_PATHS, SCORER_SOURCE_PATHS } from './source-identity';
import { validateCaseBeforeProvider } from './validator';

interface AdapterContractResponse {
  ok: true;
  contract: typeof runtimeContractFixture;
}

interface AdapterEpisodeResponse extends EpisodeEnvelope {
  ok: true;
  runId: string;
  requestId: string;
  state: EpisodeEnvelope['state'] & { financialMutationAttempts: Array<Record<string, unknown>> };
  diagnostics: EpisodeEnvelope['diagnostics'] & {
    provider: string;
    modelId: string;
    providerSlug: string;
    responsePipeline: string;
    responsePath: string;
    sourceRouting: Record<string, unknown>;
    persistence: string;
  };
}

export interface RuntimeRunReceipt {
  receiptVersion: 'avalonbench-runtime-receipt-v2';
  runId: string;
  startedAt: string;
  completedAt: string;
  adapterBaseUrl: string;
  contract: typeof runtimeContractFixture;
  results: Array<{
    caseId: string;
    providerInvoked: boolean;
    episode: AdapterEpisodeResponse | null;
    score: ScoredResult;
  }>;
  aggregate: {
    visiblePassed: number;
    visibleFailed: number;
    visibleIncomplete: number;
    visibleInvalid: number;
    visibleTotal: number;
    providerCalls: number;
    financialMutations: number;
    financialMutationAttempts: number;
  };
}

function assertRuntimeContract(actual: typeof runtimeContractFixture): void {
  if (canonicalJson(actual) !== canonicalJson(runtimeContractFixture)) {
    throw new Error('RUNTIME_CONTRACT_DRIFT');
  }
  if (
    actual.modelRoute.label !== 'Avalon 1 Fast'
    || actual.modelRoute.provider !== 'openrouter'
    || actual.modelRoute.modelId !== 'qwen/qwen3.6-27b'
    || actual.modelRoute.mode !== 'fast'
  ) {
    throw new Error(`MODEL_ROUTE_NOT_AVALON_1_FAST:${canonicalJson(actual.modelRoute)}`);
  }
  if (
    actual.safety.financialMutationAuthorityAvailable !== false
    || canonicalJson(actual.safety.executionToolAllowlist) !== canonicalJson(['commission_observer'])
    || actual.safety.wallet !== null
    || actual.safety.signer !== null
    || actual.safety.orderAuthorityAvailable !== false
    || actual.safety.fillAuthorityAvailable !== false
    || actual.safety.positionAuthorityAvailable !== false
    || actual.safety.signingAuthorityAvailable !== false
    || actual.safety.transfers !== false
    || actual.safety.walletActions !== false
    || actual.safety.schedulerEnabled !== false
    || actual.safety.persistence !== 'ephemeral_read_only'
  ) {
    throw new Error('RUNTIME_SAFETY_CONTRACT_INVALID');
  }
  if (
    actual.experiment.mode !== 'incumbent_baseline'
    || actual.experiment.capabilityContextInjected !== false
    || actual.experiment.benchmarkAnswerSchemaInjected !== false
  ) {
    throw new Error('RUNTIME_INCUMBENT_CONTRACT_INVALID');
  }
  if (actual.sourceBindings.entrypoint !== 'apps/aix-frontend/app/api/chat/route.ts#POST') {
    throw new Error('RUNTIME_ASSEMBLED_ENTRYPOINT_INVALID');
  }
  if (canonicalJson(actual.harness) !== canonicalJson(DETERMINISTIC_HARNESS)) {
    throw new Error('RUNTIME_HARNESS_BINDING_MISMATCH');
  }
}

function buildRuntimeTuple(root: string, baseUrl: string, runtimeCommit: string): RunTuple {
  return {
    candidateCommit: runtimeCommit,
    caseBatchDigest: digest(VISIBLE_CASES),
    scorerCommit: `content-sha256:${combinedSourceIdentity(identifySources(root, SCORER_SOURCE_PATHS))}`,
    runnerCommit: `content-sha256:${combinedSourceIdentity(identifySources(root, RUNNER_SOURCE_PATHS))}`,
    modelId: runtimeContractFixture.modelRoute.modelId,
    inferenceParameters: {
      mode: 'fast',
      frontendTemperature: 0.7,
      typedRunTemperature: 0,
      typedRunMaxSteps: 8,
    },
    capabilitySnapshotDigest: runtimeContractFixture.harness.capabilitySnapshotDigest,
    systemScaffoldDigest: runtimeContractFixture.harness.systemScaffoldDigest,
    toolManifestDigest: digest(runtimeContractFixture.toolManifest),
    providerConfiguration: {
      adapter: `${baseUrl}/api/avalonbench/run`,
      provider: runtimeContractFixture.modelRoute.provider,
      providerSlug: runtimeContractFixture.modelRoute.providerSlug,
      route: runtimeContractFixture.sourceBindings.entrypoint,
    },
  };
}

function record(
  registryPath: string,
  runId: string,
  tuple: RunTuple,
  state: RunRecord['state'],
  suffix: string,
  aggregate: Record<string, number> | null,
  caseResultRefs: string[],
  failureReason: string | null,
): void {
  appendRunRecord(registryPath, {
    entryId: `${runId}-${suffix}`,
    runId,
    state,
    occurredAt: new Date().toISOString(),
    tuple,
    aggregate,
    caseResultRefs,
    costUsd: 0,
    failureReason,
  });
}

async function jsonOrThrow<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null) as T | { error?: unknown } | null;
  if (!response.ok || !body) {
    throw new Error(`ADAPTER_HTTP_${response.status}:${canonicalJson(body)}`);
  }
  return body as T;
}

export async function runVisibleRuntimeCases(params: {
  root: string;
  baseUrl: string;
  secret: string;
  runtimeCommit: string;
}): Promise<{ receipt: RuntimeRunReceipt; outputPath: string }> {
  const baseUrl = params.baseUrl.replace(/\/$/, '');
  const endpoint = `${baseUrl}/api/avalonbench/run`;
  const registryPath = resolve(params.root, 'data/avalonbench/v1/run-registry.jsonl');
  const runId = `avalonbench-runtime-${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`;
  const tuple = buildRuntimeTuple(params.root, baseUrl, params.runtimeCommit);
  const startedAt = new Date().toISOString();
  record(registryPath, runId, tuple, 'planned', 'planned', null, [], null);

  try {
    const contractResponse = await jsonOrThrow<AdapterContractResponse>(await fetch(endpoint, {
      headers: { 'x-avalonbench-secret': params.secret },
    }));
    assertRuntimeContract(contractResponse.contract);

    const invalidCases = VISIBLE_CASES.flatMap((benchmarkCase) => {
      const stratum = STRATA.find((item) => item.id === benchmarkCase.stratumId);
      const validation = validateCaseBeforeProvider(benchmarkCase, stratum, CAPABILITY_SNAPSHOT);
      return validation.valid ? [] : [{ caseId: benchmarkCase.id, issues: validation.issues }];
    });
    if (invalidCases.length > 0) throw new Error(`PRE_PROVIDER_VALIDATION_FAILED:${canonicalJson(invalidCases)}`);

    record(registryPath, runId, tuple, 'launched', 'launched', null, [], null);
    const results: RuntimeRunReceipt['results'] = [];
    for (const benchmarkCase of VISIBLE_CASES) {
      const stratum = STRATA.find((item) => item.id === benchmarkCase.stratumId);
      let episode: AdapterEpisodeResponse | null = null;
      const runResult = await runCaseWithPreProviderValidation(
        benchmarkCase,
        stratum,
        CAPABILITY_SNAPSHOT,
        async () => {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-avalonbench-secret': params.secret,
            },
            body: JSON.stringify({
              taskId: benchmarkCase.id,
              prompt: benchmarkCase.prompt,
              fixtureId: benchmarkCase.fixtureId,
            }),
          });
          episode = await jsonOrThrow<AdapterEpisodeResponse>(response);
          return episode;
        },
      );
      results.push({
        caseId: benchmarkCase.id,
        providerInvoked: runResult.providerInvoked,
        episode,
        score: runResult.score,
      });
    }

    const aggregate = {
      visiblePassed: results.filter((item) => item.score.result === 'PASS').length,
      visibleFailed: results.filter((item) => item.score.result === 'FAIL').length,
      visibleIncomplete: results.filter((item) => item.score.result === 'INCOMPLETE').length,
      visibleInvalid: results.filter((item) => item.score.result === 'INVALID').length,
      visibleTotal: results.length,
      providerCalls: results.reduce((sum, item) => sum + (item.episode?.diagnostics.modelCalls ?? 0), 0),
      financialMutations: results.reduce((sum, item) => sum + (item.episode?.state.financialMutations.length ?? 0), 0),
      financialMutationAttempts: results.reduce(
        (sum, item) => sum + (item.episode?.state.financialMutationAttempts.length ?? 0),
        0,
      ),
    };
    const completedAt = new Date().toISOString();
    const receipt: RuntimeRunReceipt = {
      receiptVersion: 'avalonbench-runtime-receipt-v2',
      runId,
      startedAt,
      completedAt,
      adapterBaseUrl: baseUrl,
      contract: contractResponse.contract,
      results,
      aggregate,
    };
    const outputDir = resolve(params.root, 'reports/avalonbench-v1-runtime');
    mkdirSync(outputDir, { recursive: true });
    const outputPath = resolve(outputDir, `${runId}.json`);
    writeFileSync(outputPath, `${JSON.stringify({ ...receipt, receiptDigest: digest(receipt) }, null, 2)}\n`);
    record(
      registryPath,
      runId,
      tuple,
      aggregate.visibleIncomplete > 0 || aggregate.visibleInvalid > 0 ? 'incomplete' : 'completed',
      aggregate.visibleIncomplete > 0 || aggregate.visibleInvalid > 0 ? 'incomplete' : 'completed',
      aggregate.visibleIncomplete > 0 || aggregate.visibleInvalid > 0 ? null : aggregate,
      results.map((item) => `${item.score.result.toLowerCase()}:${item.caseId}`),
      aggregate.visibleIncomplete > 0 || aggregate.visibleInvalid > 0 ? 'One or more cases were not evaluable.' : null,
    );
    return { receipt, outputPath };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    const raw = await import('node:fs').then(({ readFileSync }) => readFileSync(registryPath, 'utf8'));
    const launched = raw.includes(`"runId":"${runId}","state":"launched"`);
    record(registryPath, runId, tuple, launched ? 'incomplete' : 'aborted', launched ? 'incomplete' : 'aborted', null, [], reason);
    throw error;
  }
}
