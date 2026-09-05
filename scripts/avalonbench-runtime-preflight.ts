import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalJson } from '../src/avalonbench/canonical';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const expectedContract = JSON.parse(
  readFileSync(resolve(root, 'data/avalonbench/v1/runtime-contract.json'), 'utf8'),
) as Record<string, any>;
const baseUrl = (process.env.AVALONBENCH_BASE_URL ?? 'http://127.0.0.1:3437').replace(/\/$/, '');
const secret = process.env.AVALONBENCH_SECRET;
if (!secret || secret.length < 24) throw new Error('AVALONBENCH_SECRET_MISSING');

const endpoint = `${baseUrl}/api/avalonbench/run`;
const contractResponse = await fetch(endpoint, {
  headers: { 'x-avalonbench-secret': secret },
});
const contractBody = await contractResponse.json() as {
  ok?: boolean;
  contract?: Record<string, any>;
};
assert.equal(contractResponse.status, 200);
assert.equal(contractBody.ok, true);
assert(contractBody.contract);
assert.equal(canonicalJson(contractBody.contract), canonicalJson(expectedContract));

const visible = expectedContract.visibleCases[0] as { id: string; prompt: string };
async function expectRejected(body: Record<string, unknown>, error: string) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-avalonbench-secret': secret!,
    },
    body: JSON.stringify(body),
  });
  const result = await response.json() as { ok?: boolean; error?: string };
  assert.equal(response.status, 400);
  assert.equal(result.ok, false);
  assert.equal(result.error, error);
}

await expectRejected({
  taskId: visible.id,
  prompt: visible.prompt,
  fixtureId: expectedContract.fixtureRefs.capabilitySnapshot,
  typedRequest: { intent: 'capability_discovery', venue: 'hyperliquid' },
}, 'expected_or_oracle_input_forbidden');
await expectRejected({
  taskId: 'blind-or-unknown-case',
  prompt: 'not a visible case',
  fixtureId: expectedContract.fixtureRefs.capabilitySnapshot,
}, 'visible_case_required');

process.stdout.write(`${JSON.stringify({
  status: 'PASS',
  endpoint,
  contractMatch: true,
  modelRoute: expectedContract.modelRoute,
  entrypoint: expectedContract.sourceBindings.entrypoint,
  toolManifestCount: expectedContract.toolManifest.length,
  executionToolAllowlist: expectedContract.safety.executionToolAllowlist,
  oracleTransportRejected: true,
  unknownCaseRejected: true,
  providerCalls: 0,
  financialMutations: 0,
})}\n`);
