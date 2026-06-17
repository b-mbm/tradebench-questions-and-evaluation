#!/usr/bin/env tsx
/**
 * StockBench mutation-test harness.
 *
 * A benchmark row is only trustworthy if WRONG answers fail. This harness does
 * NOT trust canonical-pass alone. For every row it builds mutants from the
 * canonical answer and asserts the grader REJECTS them:
 *
 *   - canonical            -> must PASS
 *   - wrong strategy       -> must FAIL  (chosen_strategy / selected_route / chosen_route)
 *   - wrong instrument     -> must FAIL  (selected_instrument / instrument)
 *   - wrong core number    -> must FAIL  (each critical/deterministic numeric, incl. dotted)
 *   - missing critical     -> must FAIL  (drop each critical field)
 *   - invalid-route flip   -> must FAIL  (feasibility / decision flipped)
 *
 * It is a measurement tool. It makes no paid model calls.
 */
import { STOCKBENCH_QUESTIONS_300Q } from '../src/questions/stockbench-questions-300q';
import { loadRubric300q } from '../src/rubrics/loader-300q';
import { gradeSchemaResponse } from '../src/grading/schema-grader-300q';

type Json = any;

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function setPath(obj: Json, path: string, value: Json): void {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur[parts[i]] === undefined || cur[parts[i]] === null || typeof cur[parts[i]] !== 'object') return;
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

function delPath(obj: Json, path: string): void {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur[parts[i]] === undefined || cur[parts[i]] === null || typeof cur[parts[i]] !== 'object') return;
    cur = cur[parts[i]];
  }
  delete cur[parts[parts.length - 1]];
}

function getPath(obj: Json, path: string): Json {
  return path.split('.').reduce((c: Json, k) => (c == null ? undefined : c[k]), obj);
}

function grade(expected: Json, q: Json, rubric: Json): boolean {
  const raw = JSON.stringify({ ...expected, reasoning: 'mutation harness probe' });
  return gradeSchemaResponse(raw, q, rubric).pass;
}

type RowResult = {
  id: string;
  tier: string;
  canonicalPass: boolean;
  leaks: string[]; // mutations that WRONGLY passed
  mutantsRun: number;
  robust: boolean;
};

const STRATEGY_FIELDS = ['chosen_strategy', 'selected_route', 'chosen_route', 'chosen_strategy_id'];
const INSTRUMENT_FIELDS = ['selected_instrument', 'instrument'];

const results: RowResult[] = [];

for (const q of STOCKBENCH_QUESTIONS_300Q as Json[]) {
  const rubric = loadRubric300q(q.rubric_id) as Json;
  const expected = q.expected_values as Json;
  const meta = (q.context?.stockbench ?? {}) as Json;
  const tier = String(meta.tier ?? `L${q.level}`);
  const critical: string[] = Array.isArray(rubric.metadata?.critical_fields)
    ? rubric.metadata.critical_fields.map(String)
    : [];
  const deterministic: string[] = Array.isArray(meta.deterministic_grading_fields)
    ? meta.deterministic_grading_fields.map(String)
    : [];

  const canonicalPass = grade(expected, q, rubric);
  const leaks: string[] = [];
  let mutantsRun = 0;

  const expectFail = (label: string, mut: Json) => {
    mutantsRun += 1;
    if (grade(mut, q, rubric)) leaks.push(label);
  };

  // --- wrong strategy ---
  for (const f of STRATEGY_FIELDS) {
    if (expected[f] !== undefined && typeof expected[f] === 'string') {
      const m = clone(expected);
      m[f] = 'wrong_decoy_strategy_zzz';
      expectFail(`wrong_strategy:${f}`, m);
      break;
    }
  }

  // --- wrong instrument ---
  for (const f of INSTRUMENT_FIELDS) {
    if (expected[f] !== undefined && typeof expected[f] === 'string') {
      const m = clone(expected);
      m[f] = expected[f] === 'WXYZ' ? 'ABCD' : 'WXYZ';
      expectFail(`wrong_instrument:${f}`, m);
      break;
    }
  }

  // --- wrong core numbers (critical + deterministic numerics, incl. dotted) ---
  const numericTargets = new Set<string>();
  for (const f of [...critical, ...deterministic]) {
    const v = getPath(expected, f);
    if (typeof v === 'number') numericTargets.add(f);
  }
  for (const f of numericTargets) {
    const v = getPath(expected, f) as number;
    const m = clone(expected);
    setPath(m, f, v + 1_000_000 + 7); // far outside any tolerance/range
    expectFail(`wrong_number:${f}`, m);
  }

  // --- missing critical fields ---
  for (const f of critical) {
    if (getPath(expected, f) === undefined) continue;
    const m = clone(expected);
    delPath(m, f);
    expectFail(`missing_critical:${f}`, m);
  }

  // --- self-contradiction: chosen route also listed as rejected (must fail) ---
  if (Array.isArray(expected.rejected_routes)) {
    for (const choiceKey of ['selected_route', 'chosen_route', 'chosen_strategy', 'selected_instrument']) {
      if (typeof expected[choiceKey] === 'string' && expected[choiceKey]) {
        const m = clone(expected);
        m.rejected_routes = [...m.rejected_routes, expected[choiceKey]];
        expectFail(`selected_in_rejected:${choiceKey}`, m);
        break;
      }
    }
  }

  // --- invalid-route flip ---
  if (typeof expected.feasibility === 'string') {
    const m = clone(expected);
    m.feasibility = expected.feasibility === 'feasible' ? 'infeasible' : 'feasible';
    expectFail('flip_feasibility', m);
  }
  if (typeof expected.decision === 'string' && (expected.decision === 'no_trade' || expected.decision === 'trade')) {
    const m = clone(expected);
    m.decision = expected.decision === 'no_trade' ? 'trade' : 'no_trade';
    expectFail('flip_decision', m);
  }

  results.push({
    id: q.id,
    tier,
    canonicalPass,
    leaks,
    mutantsRun,
    robust: canonicalPass && leaks.length === 0,
  });
}

const tiers = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'AGI'];
const byTier = (t: string) => results.filter(r => r.tier === t);

console.log('=== StockBench mutation gate ===');
console.log(`rows: ${results.length}`);
console.log(`canonical passes: ${results.filter(r => r.canonicalPass).length}/${results.length}`);
console.log(`MUTATION-ROBUST rows: ${results.filter(r => r.robust).length}/${results.length}`);
console.log(`rows with leaks (wrong answer passes): ${results.filter(r => r.leaks.length).length}`);
console.log('\nper-tier robust / total:');
for (const t of tiers) {
  const arr = byTier(t);
  if (!arr.length) continue;
  console.log(`  ${t}: ${arr.filter(r => r.robust).length}/${arr.length} robust`);
}

// leak-type histogram
const leakHist: Record<string, number> = {};
for (const r of results) for (const l of r.leaks) {
  const kind = l.split(':')[0];
  leakHist[kind] = (leakHist[kind] ?? 0) + 1;
}
console.log('\nleak types (mutation wrongly passed):', JSON.stringify(leakHist, null, 2));

console.log('\nfirst 25 non-robust rows:');
results.filter(r => !r.robust).slice(0, 25).forEach(r =>
  console.log(`  ${r.id} [${r.tier}] canonical=${r.canonicalPass} leaks=${r.leaks.slice(0, 4).join(',')}${r.leaks.length > 4 ? '…' : ''}`)
);

const allRobust = results.every(r => r.robust);
console.log(`\nGATE: ${allRobust ? 'PASS' : 'FAIL'} (require 100% mutation-robust)`);
if (!allRobust) process.exitCode = 1;
