import { createHash, randomUUID } from 'node:crypto';
import { appendFile, mkdir, open, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = resolve(root, 'data/avalonbench/v1/demo-16-case-bank.json');
const registryPath = resolve(root, 'data/avalonbench/v1/demo-16-run-registry.jsonl');
const reportsRoot = resolve(root, 'reports/avalon-demo-16');
const chatUrl = new URL(process.env.AVALON_DEMO_CHAT_URL ?? 'http://127.0.0.1:3437/api/chat');
const contractUrl = new URL(process.env.AVALON_DEMO_CONTRACT_URL ?? 'http://127.0.0.1:3437/api/avalonbench/run');
const supabaseUrl = new URL(process.env.AVALON_DEMO_SUPABASE_URL ?? 'http://127.0.0.1:56830');
const adapterSecret = process.env.AVALON_DEMO_ADAPTER_SECRET ?? '';
const supabaseKey = process.env.AVALON_DEMO_SUPABASE_KEY ?? '';
const runtimeCommit = process.env.AVALON_DEMO_RUNTIME_COMMIT ?? '';
const phaseArgument = process.argv.find((value) => value.startsWith('--phase='));
const phase = phaseArgument?.slice('--phase='.length) ?? null;
const preflightOnly = process.argv.includes('--preflight');

function assertLoopback(url, label) {
  if (!['localhost', '127.0.0.1', '::1'].includes(url.hostname.toLowerCase())) {
    throw new Error(`${label}_MUST_BE_LOOPBACK`);
  }
}

function assertSha(value, label) {
  if (!/^[0-9a-f]{40}$/i.test(value)) throw new Error(`${label}_MUST_BE_FULL_GIT_SHA`);
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function digest(value) {
  return createHash('sha256').update(canonicalJson(value)).digest('hex');
}

function nowId() {
  return new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
}

async function appendRegistry(record) {
  await appendFile(registryPath, `${JSON.stringify(record)}\n`, { encoding: 'utf8', flag: 'a' });
}

async function loadBank() {
  const bank = JSON.parse(await readFile(bankPath, 'utf8'));
  if (bank.bankId !== 'avalon-demo-exposed-16-v1') throw new Error('BANK_ID_MISMATCH');
  if (!Array.isArray(bank.cases) || bank.cases.length !== 16) throw new Error('EXACTLY_16_CASES_REQUIRED');
  if (new Set(bank.cases.map((item) => item.id)).size !== 16) throw new Error('CASE_IDS_MUST_BE_UNIQUE');
  if (new Set(bank.cases.map((item) => item.prompt)).size !== 16) throw new Error('PROMPTS_MUST_BE_UNIQUE');
  for (const item of bank.cases) {
    if (!item.requiredObservableAssertions?.includes('no_financial_mutation')) {
      throw new Error(`${item.id}_MISSING_FINANCIAL_VETO`);
    }
  }
  return bank;
}

async function readJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function verifyContract() {
  if (adapterSecret.length < 24) throw new Error('ADAPTER_SECRET_REQUIRED');
  const response = await fetch(contractUrl, {
    headers: { 'x-avalonbench-secret': adapterSecret },
    signal: AbortSignal.timeout(15_000),
  });
  const body = await readJson(response);
  const contract = body?.contract;
  if (!response.ok || body?.ok !== true || !contract) throw new Error(`CONTRACT_PREFLIGHT_FAILED_${response.status}`);
  const route = contract.modelRoute;
  if (
    route?.label !== 'Avalon 1 Fast'
    || route?.provider !== 'openrouter'
    || route?.modelId !== 'qwen/qwen3.6-27b'
  ) {
    throw new Error(`MODEL_ROUTE_MISMATCH_${JSON.stringify(route ?? null)}`);
  }
  if (contract.sourceBindings?.entrypoint !== 'apps/aix-frontend/app/api/chat/route.ts#POST') {
    throw new Error('ASSEMBLED_ENTRYPOINT_MISMATCH');
  }
  return {
    label: route.label,
    provider: route.provider,
    providerSlug: route.providerSlug,
    modelId: route.modelId,
    entrypoint: contract.sourceBindings.entrypoint,
    systemScaffoldDigest: contract.harness?.systemScaffoldDigest ?? null,
    toolManifestDigest: digest(contract.toolManifest ?? []),
    toolManifest: contract.toolManifest ?? [],
  };
}

async function verifyPublicRejection() {
  const response = await fetch(chatUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages: [] }),
    signal: AbortSignal.timeout(15_000),
  });
  const body = await readJson(response);
  if (response.status !== 400) throw new Error(`PUBLIC_REJECTION_PREFLIGHT_FAILED_${response.status}`);
  return { status: response.status, error: body?.error ?? body?.code ?? null };
}

async function supabaseSelect(table, select, requestId) {
  if (!supabaseKey.startsWith('sb_secret_')) throw new Error('LOCAL_SUPABASE_KEY_REQUIRED');
  const url = new URL(`/rest/v1/${table}`, supabaseUrl);
  url.searchParams.set('select', select);
  url.searchParams.set('request_id', `eq.${requestId}`);
  if (table === 'chat_messages') url.searchParams.set('order', 'message_index.asc');
  const response = await fetch(url, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    signal: AbortSignal.timeout(15_000),
  });
  const body = await readJson(response);
  if (!response.ok || !Array.isArray(body)) throw new Error(`DIAGNOSTIC_READ_FAILED_${table}_${response.status}`);
  return body;
}

async function loadDiagnostics(requestId) {
  const requestSelect = [
    'request_id', 'mode', 'model', 'provider', 'tool_plan_json', 'search_metadata_json',
    'execution_tags', 'route_protocol', 'route_chain', 'token_usage', 'error_code',
    'error_message', 'auth_source',
  ].join(',');
  const messageSelect = [
    'request_id', 'role', 'content', 'raw_model_output', 'metadata', 'route_kind', 'message_index',
  ].join(',');
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const [requests, messages] = await Promise.all([
      supabaseSelect('chat_requests', requestSelect, requestId),
      supabaseSelect('chat_messages', messageSelect, requestId),
    ]);
    if (requests.length > 0 || messages.some((item) => item.role === 'assistant')) {
      return { requests, messages };
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  }
  return { requests: [], messages: [] };
}

function outboundBody(prompt, anonSessionId, requestId) {
  const body = {
    messages: [{ role: 'user', content: prompt }],
    mode: 'fast',
    anonSessionId,
    requestId,
    requestIdentityMode: 'anonymous',
    surface: 'basic',
  };
  const allowed = ['anonSessionId', 'messages', 'mode', 'requestId', 'requestIdentityMode', 'surface'];
  const keys = Object.keys(body).sort();
  if (canonicalJson(keys) !== canonicalJson(allowed.sort())) throw new Error('OUTBOUND_BODY_CONTRACT_VIOLATION');
  return body;
}

async function runCase(item, runId) {
  const requestId = randomUUID();
  const anonSessionId = `anon-${randomUUID()}`;
  const startedAt = new Date().toISOString();
  let response;
  let rawResponse = '';
  let transportError = null;
  try {
    response = await fetch(chatUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(outboundBody(item.prompt, anonSessionId, requestId)),
      signal: AbortSignal.timeout(295_000),
    });
    rawResponse = await response.text();
  } catch (error) {
    transportError = error instanceof Error ? error.message : String(error);
  }
  const diagnostics = await loadDiagnostics(requestId).catch((error) => ({
    requests: [],
    messages: [],
    diagnosticError: error instanceof Error ? error.message : String(error),
  }));
  const result = {
    runId,
    caseId: item.id,
    prompt: item.prompt,
    expectedUserOutcome: item.expectedUserOutcome,
    requiredObservableAssertions: item.requiredObservableAssertions,
    requestId,
    startedAt,
    completedAt: new Date().toISOString(),
    httpStatus: response?.status ?? null,
    responseHeaders: response ? {
      responsePath: response.headers.get('x-response-path'),
      routerClarify: response.headers.get('x-router-clarify'),
      adoptedSessionPublicId: response.headers.get('x-chat-session-public-id'),
      responseRequestId: response.headers.get('x-aix-request-id'),
    } : null,
    rawResponse,
    transportError,
    diagnostics,
  };
  return result;
}

async function main() {
  assertLoopback(chatUrl, 'CHAT_URL');
  assertLoopback(contractUrl, 'CONTRACT_URL');
  assertLoopback(supabaseUrl, 'SUPABASE_URL');
  assertSha(runtimeCommit, 'RUNTIME_COMMIT');
  const bank = await loadBank();
  const bankDigest = digest(bank);
  const modelRoute = await verifyContract();
  const publicRejection = await verifyPublicRejection();
  if (preflightOnly) {
    process.stdout.write(`${JSON.stringify({
      ok: true,
      cases: bank.cases.length,
      bankDigest,
      runtimeCommit,
      modelRoute,
      publicRejection,
      providerCalls: 0,
    })}\n`);
    return;
  }
  if (!['baseline', 'remediated'].includes(phase ?? '')) throw new Error('PHASE_MUST_BE_BASELINE_OR_REMEDIATED');

  const existingRegistry = await readFile(registryPath, 'utf8').catch((error) => {
    if (error?.code === 'ENOENT') return '';
    throw error;
  });
  const duplicate = existingRegistry.split('\n').filter(Boolean).map((line) => JSON.parse(line)).some((record) =>
    record.phase === phase
    && record.bankDigest === bankDigest
    && record.runtimeCommit === runtimeCommit
    && record.status !== 'planned'
  );
  if (duplicate) throw new Error(`COMPLETED_${phase.toUpperCase()}_RUN_ALREADY_EXISTS`);

  const runId = `avalon-demo-16-${phase}-${nowId()}-${randomUUID().slice(0, 8)}`;
  await mkdir(reportsRoot, { recursive: true });
  const evidencePath = resolve(reportsRoot, `${runId}.jsonl`);
  const reportPath = resolve(reportsRoot, `${runId}.json`);
  const evidenceHandle = await open(evidencePath, 'wx');
  await evidenceHandle.close();
  const planned = {
    runId,
    phase,
    status: 'planned',
    createdAt: new Date().toISOString(),
    bankId: bank.bankId,
    bankDigest,
    runtimeCommit,
    modelRoute,
    entrypoint: chatUrl.toString(),
    caseCount: 16,
  };
  await appendRegistry(planned);

  const results = [];
  for (const item of bank.cases) {
    const result = await runCase(item, runId);
    results.push(result);
    await appendFile(evidencePath, `${JSON.stringify(result)}\n`, 'utf8');
    process.stdout.write(`${JSON.stringify({
      caseId: result.caseId,
      httpStatus: result.httpStatus,
      responsePath: result.responseHeaders?.responsePath ?? null,
      persistedRequests: result.diagnostics.requests.length,
      persistedMessages: result.diagnostics.messages.length,
      transportError: result.transportError,
    })}\n`);
  }

  const providerCallCount = results.reduce((count, result) => count + result.diagnostics.requests.filter((request) =>
    typeof request.model === 'string' && request.model.length > 0
    && typeof request.provider === 'string' && request.provider.length > 0
  ).length, 0);
  const report = {
    ...planned,
    status: results.every((result) => result.httpStatus === 200 && !result.transportError) ? 'captured' : 'incomplete',
    completedAt: new Date().toISOString(),
    providerCallCount,
    results,
  };
  const reportHandle = await open(reportPath, 'wx');
  await reportHandle.writeFile(`${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await reportHandle.close();
  await appendRegistry({
    runId,
    phase,
    status: report.status,
    completedAt: report.completedAt,
    bankId: bank.bankId,
    bankDigest,
    runtimeCommit,
    caseCount: results.length,
    providerCallCount,
    evidencePath: evidencePath.slice(root.length + 1),
    reportPath: reportPath.slice(root.length + 1),
  });
  process.stdout.write(`${JSON.stringify({
    runId,
    status: report.status,
    cases: results.length,
    providerCallCount,
    reportPath,
  })}\n`);
}

await main();
