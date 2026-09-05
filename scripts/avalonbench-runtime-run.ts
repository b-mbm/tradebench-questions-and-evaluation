import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runVisibleRuntimeCases } from '../src/avalonbench/runtime';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const baseUrl = process.env.AVALONBENCH_BASE_URL?.trim() || 'http://127.0.0.1:3417';
const secret = process.env.AVALONBENCH_SECRET?.trim();
if (!secret || secret.length < 24) throw new Error('AVALONBENCH_SECRET must contain at least 24 characters.');

const { receipt, outputPath } = await runVisibleRuntimeCases({ root, baseUrl, secret });
process.stdout.write(`${JSON.stringify({
  runId: receipt.runId,
  modelRoute: receipt.contract.modelRoute,
  aggregate: receipt.aggregate,
  cases: receipt.results.map((item) => ({
    caseId: item.caseId,
    result: item.score.result,
    primaryFailure: item.score.primaryFailure?.id ?? null,
    secondaryFailures: item.score.secondaryFailures.map((failure) => failure.id),
    providerCalls: item.episode?.diagnostics.modelCalls ?? 0,
    toolCalls: item.episode?.trace.toolCalls.map((call) => call.name) ?? [],
  })),
  outputPath,
}, null, 2)}\n`);
