import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

function argument(name) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length) ?? '';
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

function parseAuthenticatedChatStream(raw, controlNonce) {
  const controlEvents = [];
  let responseText = '';
  let cursor = 0;
  while (cursor < raw.length) {
    if (raw.slice(cursor, cursor + 6) === 'data: ') {
      const lineEnd = raw.indexOf('\n', cursor);
      if (lineEnd < 0) {
        responseText += raw.slice(cursor);
        break;
      }
      try {
        const parsed = JSON.parse(raw.slice(cursor + 6, lineEnd));
        const event = parsed?.__aixControl === true
          && typeof parsed.__nonce === 'string'
          && parsed.__nonce === controlNonce
          && parsed.event
          && typeof parsed.event === 'object'
          ? parsed.event
          : null;
        if (event) {
          controlEvents.push(event);
          cursor = lineEnd + 1;
          if (raw[cursor] === '\n') cursor += 1;
          continue;
        }
      } catch {
        // Non-control text is retained exactly.
      }
    }
    responseText += raw[cursor];
    cursor += 1;
  }
  const metadataEnd = responseText.startsWith('<SEARCH_METADATA>')
    ? responseText.indexOf('</SEARCH_METADATA>')
    : -1;
  const visibleResponse = metadataEnd >= 0
    ? responseText.slice(metadataEnd + '</SEARCH_METADATA>'.length).trim()
    : responseText.trim();
  return { responseText, visibleResponse, controlEvents };
}

function assert(condition, code) {
  if (!condition) throw new Error(code);
}

function evidenceMatches(evidence, result, financialIdentical) {
  if (evidence.kind === 'visible_text') {
    return typeof evidence.exact === 'string'
      && evidence.exact.length > 0
      && result.observedResponse.visibleResponse.includes(evidence.exact);
  }
  if (evidence.kind === 'visible_text_absent') {
    return typeof evidence.exact === 'string'
      && evidence.exact.length > 0
      && !result.observedResponse.visibleResponse.includes(evidence.exact);
  }
  if (evidence.kind === 'response_path') {
    return result.responseHeaders.responsePath === evidence.exact;
  }
  if (evidence.kind === 'market_line_count') {
    return result.observedResponse.visibleResponse
      .split('\n')
      .filter((line) => line.startsWith('- ')).length === evidence.exact;
  }
  if (evidence.kind === 'control_event') {
    return result.observedResponse.controlEvents.some((event) =>
      Object.entries(evidence.match ?? {}).every(([key, value]) => event[key] === value)
    );
  }
  if (evidence.kind === 'financial_snapshot_identical') return financialIdentical;
  return false;
}

const runPath = argument('run');
const judgmentsPath = argument('judgments');
const preFinancialPath = argument('pre-financial');
const postFinancialPath = argument('post-financial');
const outputPath = argument('output');
for (const [name, value] of Object.entries({ runPath, judgmentsPath, preFinancialPath, postFinancialPath, outputPath })) {
  assert(value.endsWith('.json'), `${name.toUpperCase()}_JSON_PATH_REQUIRED`);
}

const bank = JSON.parse(await readFile(resolve('data/avalonbench/v1/demo-16-case-bank.json'), 'utf8'));
const run = JSON.parse(await readFile(resolve(runPath), 'utf8'));
const judgments = JSON.parse(await readFile(resolve(judgmentsPath), 'utf8'));
const preFinancial = JSON.parse(await readFile(resolve(preFinancialPath), 'utf8'));
const postFinancial = JSON.parse(await readFile(resolve(postFinancialPath), 'utf8'));

assert(bank.cases.length === 16, 'EXACTLY_16_BANK_CASES_REQUIRED');
assert(run.results?.length === 16, 'EXACTLY_16_RUN_RESULTS_REQUIRED');
assert(run.bankDigest === digest(bank), 'RUN_BANK_DIGEST_MISMATCH');
for (const result of run.results) {
  assert(typeof result.responseHeaders?.controlNonce === 'string' && result.responseHeaders.controlNonce.length > 0, `CONTROL_NONCE_MISSING_${result.caseId}`);
  const reparsed = parseAuthenticatedChatStream(result.rawResponse, result.responseHeaders.controlNonce);
  assert(canonicalJson(reparsed) === canonicalJson(result.observedResponse), `OBSERVED_RESPONSE_DERIVATION_MISMATCH_${result.caseId}`);
}
assert(judgments.runId === run.runId, 'JUDGMENT_RUN_ID_MISMATCH');
assert(judgments.cases?.length === 16, 'EXACTLY_16_JUDGMENT_CASES_REQUIRED');

const preRowsDigest = digest(preFinancial.rows);
const postRowsDigest = digest(postFinancial.rows);
const financialIdentical = preRowsDigest === postRowsDigest
  && canonicalJson(preFinancial.rows) === canonicalJson(postFinancial.rows)
  && preFinancial.tableCount === postFinancial.tableCount
  && preFinancial.totalRows === postFinancial.totalRows;
assert(financialIdentical, 'FINANCIAL_SNAPSHOTS_DIFFER');

const judgmentByCase = new Map(judgments.cases.map((item) => [item.caseId, item]));
const scoredCases = [];
const humanSemanticAssertions = [];
const mechanicalAssertions = [];

for (let index = 0; index < bank.cases.length; index += 1) {
  const bankCase = bank.cases[index];
  const result = run.results[index];
  const caseJudgment = judgmentByCase.get(bankCase.id);
  assert(result.caseId === bankCase.id, `RUN_CASE_ORDER_MISMATCH_${bankCase.id}`);
  assert(result.prompt === bankCase.prompt, `RUN_PROMPT_MISMATCH_${bankCase.id}`);
  assert(result.httpStatus === 200 && result.transportError === null, `RUN_TRANSPORT_FAILURE_${bankCase.id}`);
  assert(typeof result.responseHeaders?.controlNonce === 'string' && result.responseHeaders.controlNonce.length > 0, `CONTROL_NONCE_MISSING_${bankCase.id}`);
  const reparsed = parseAuthenticatedChatStream(result.rawResponse, result.responseHeaders.controlNonce);
  assert(canonicalJson(reparsed) === canonicalJson(result.observedResponse), `OBSERVED_RESPONSE_DERIVATION_MISMATCH_${bankCase.id}`);
  assert(caseJudgment, `JUDGMENT_CASE_MISSING_${bankCase.id}`);
  assert(caseJudgment.assertions?.length === bankCase.requiredObservableAssertions.length, `ASSERTION_COUNT_MISMATCH_${bankCase.id}`);

  const assertions = bankCase.requiredObservableAssertions.map((assertionId, assertionIndex) => {
    const judgment = caseJudgment.assertions[assertionIndex];
    assert(judgment.id === assertionId, `ASSERTION_ORDER_MISMATCH_${bankCase.id}_${assertionId}`);
    assert(['PASS', 'FAIL', 'NOT_EVALUABLE'].includes(judgment.verdict), `INVALID_VERDICT_${bankCase.id}_${assertionId}`);
    assert(['mechanical_observation', 'human_semantic_judgment'].includes(judgment.judgmentClass), `INVALID_JUDGMENT_CLASS_${bankCase.id}_${assertionId}`);
    assert(typeof judgment.rationale === 'string' && judgment.rationale.length > 0, `RATIONALE_REQUIRED_${bankCase.id}_${assertionId}`);
    assert(Array.isArray(judgment.evidence) && judgment.evidence.length > 0, `EVIDENCE_REQUIRED_${bankCase.id}_${assertionId}`);
    for (const evidence of judgment.evidence) {
      assert(evidenceMatches(evidence, result, financialIdentical), `EVIDENCE_MISMATCH_${bankCase.id}_${assertionId}_${evidence.kind}`);
    }
    const record = { caseId: bankCase.id, assertionId, verdict: judgment.verdict };
    if (judgment.judgmentClass === 'human_semantic_judgment') humanSemanticAssertions.push(record);
    else mechanicalAssertions.push(record);
    return judgment;
  });

  const failures = assertions.filter((assertion) => assertion.verdict !== 'PASS');
  scoredCases.push({
    caseId: bankCase.id,
    prompt: bankCase.prompt,
    expectedUserOutcome: bankCase.expectedUserOutcome,
    actualResponse: result.observedResponse.visibleResponse,
    actualResponsePath: result.responseHeaders.responsePath,
    actualTraceEvents: result.observedResponse.controlEvents,
    assertions,
    verdict: failures.length === 0 ? 'PASS' : 'FAIL',
    earliestDecisiveFailure: failures[0]?.id ?? null,
    secondaryFailures: failures.slice(1).map((assertion) => assertion.id),
  });
}

const mutationToolTerms = ['execution', 'fill', 'order', 'position', 'sign', 'transaction', 'transfer', 'wallet'];
const mutationToolEvents = scoredCases.flatMap((item) => item.actualTraceEvents
  .filter((event) => event.type === 'trace' && typeof event.tool === 'string'
    && mutationToolTerms.some((term) => event.tool.toLocaleLowerCase('en-US').includes(term)))
  .map((event) => ({ caseId: item.caseId, event })));
assert(mutationToolEvents.length === 0, 'FINANCIAL_MUTATION_TOOL_EVENT_OBSERVED');

const failedCases = scoredCases.filter((item) => item.verdict === 'FAIL');
const allAssertions = scoredCases.flatMap((item) => item.assertions);
const scorecard = {
  scorecardVersion: 'avalon-demo-16-mechanical-scorecard-v1',
  runId: run.runId,
  runtimeCommit: run.runtimeCommit,
  bankId: bank.bankId,
  bankDigest: run.bankDigest,
  derivation: {
    runPath,
    judgmentsPath,
    preFinancialPath,
    postFinancialPath,
    authenticatedControlEventsRequired: true,
    semanticVerdictsAreHumanJudgments: true,
  },
  summary: {
    caseCount: scoredCases.length,
    passCount: scoredCases.length - failedCases.length,
    failCount: failedCases.length,
    assertionCount: allAssertions.length,
    assertionPassCount: allAssertions.filter((item) => item.verdict === 'PASS').length,
    assertionFailCount: allAssertions.filter((item) => item.verdict === 'FAIL').length,
    assertionNotEvaluableCount: allAssertions.filter((item) => item.verdict === 'NOT_EVALUABLE').length,
    mechanicalAssertionCount: mechanicalAssertions.length,
    humanSemanticAssertionCount: humanSemanticAssertions.length,
    mutationToolEventCount: mutationToolEvents.length,
    financialTableCount: postFinancial.tableCount,
    financialTotalRowsBefore: preFinancial.totalRows,
    financialTotalRowsAfter: postFinancial.totalRows,
    financialSnapshotsIdentical: financialIdentical,
  },
  humanSemanticAssertions,
  mechanicalAssertions,
  cases: scoredCases,
};

await writeFile(resolve(outputPath), `${JSON.stringify(scorecard, null, 2)}\n`, { flag: 'wx' });
process.stdout.write(`${JSON.stringify({
  ok: true,
  outputPath: resolve(outputPath),
  scorecardSha256: createHash('sha256').update(`${JSON.stringify(scorecard, null, 2)}\n`).digest('hex'),
  summary: scorecard.summary,
})}\n`);
