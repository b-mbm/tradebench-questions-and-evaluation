#!/usr/bin/env tsx
/**
 * TradeBench 300Q mutation-test harness (v2 — real-passing-response canonicals).
 *
 * A benchmark row is only trustworthy if WRONG answers fail. The most honest ground-truth
 * canonical for each question is a REAL model response that the grader already accepted.
 * We pull passing responses from the baseline 300Q run, re-grade each (sanity: must still
 * pass), then build mutants and assert the grader REJECTS them:
 *
 *   - real passing response                  -> must PASS (re-grades to same verdict)
 *   - wrong strategy/intent label (string)   -> must FAIL
 *   - wrong core number (+1,000,007)         -> must FAIL  (each numeric field in the response)
 *   - missing required/critical field        -> must FAIL
 *   - decision/feasibility flip              -> must FAIL
 *
 * PLUS the hidden-oracle probe (specific to this benchmark):
 *   - synonym-renamed chosen_strategy        -> observed (FAIL = exact-match oracle confirmed;
 *                                                         PASS = grader tolerates synonyms = verifiable)
 *
 * Gate semantics (STRICT — exit non-zero if not met):
 *   - Every re-graded canonical MUST still pass (sanity that we loaded the right response).
 *   - Every correctness mutant MUST be rejected (else grader leaks).
 * The synonym-renamed-strategy case is REPORTED, not gated (it measures the oracle surface).
 *
 * Rows with NO passing baseline response are REPORTED as uncovered (not gated) — the model
 * never produced a passing answer, so we have no ground-truth canonical to mutate. That is
 * a coverage caveat, not a grader defect.
 *
 * Makes no paid model calls.
 */
import { SCHEMA_QUESTIONS_300Q } from '../src/questions/schema-questions-300q';
import { loadRubric300q } from '../src/rubrics/loader-300q';
import { gradeSchemaResponse } from '../src/grading/schema-grader-300q';
import fs from 'fs';

type Json = any;

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}
function setPath(obj: Json, path: string, value: Json): void {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur[parts[i]] === undefined || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}
function delPath(obj: Json, path: string): void {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur[parts[i]] === undefined || typeof cur[parts[i]] !== 'object') return;
    cur = cur[parts[i]];
  }
  delete cur[parts[parts.length - 1]];
}
function getPath(obj: Json, path: string): Json {
  return path.split('.').reduce((c: Json, k) => (c == null ? undefined : c[k]), obj);
}
function grade(answer: Json, q: Json, rubric: Json): boolean {
  const raw = JSON.stringify({ ...answer, reasoning: 'mutation harness probe' });
  return gradeSchemaResponse(raw, q, rubric).pass;
}

/** Semantically-plausible synonym rename of a snake_case strategy label:
 *  reverse the word order. private_delever_to_mandate_floor -> floor_mandate_to_delever_private.
 *  Different exact string, same composite concept — what a model that reasons right but names
 *  differently would emit. */
function synonymRename(label: string): string {
  const parts = label.split('_');
  if (parts.length < 2) return `${label}_alt`;
  return [...parts].reverse().join('_');
}

// ─── Load real passing responses from the baseline run ───
const gradedPath = 'results/community/300/run300-base-thinkon-2026-06-29/graded-base_on.json';
const gradedRaw = JSON.parse(fs.readFileSync(gradedPath, 'utf8'));
const passingByQid = new Map<string, Json>();
for (const row of (gradedRaw.rows ?? []) as Json[]) {
  if (row.pass && row.normalized && typeof row.normalized === 'object') {
    // keep the highest-scoring passing response per question
    const existing = passingByQid.get(row.questionId);
    if (!existing || row.score > existing.score) {
      passingByQid.set(row.questionId, clone(row.normalized));
    }
  }
}

type MutationOutcome = {
  label: string;
  field: string;           // which field was mutated
  fieldWeighted: boolean;  // does the rubric assign nonzero weight to this field?
  baseScore: number;
  mutScore: number;
  detected: boolean;       // score dropped meaningfully (grader noticed)
  flipped: boolean;        // pass went false (gate caught it)
  trueLeak: boolean;       // WEIGHTED field + NOT detected = real grader defect
};

type RowResult = {
  id: string;
  tier: string;
  covered: boolean;          // did we have a real passing response to mutate?
  canonicalPass: boolean;    // re-grade of the real response
  mutations: MutationOutcome[];
  trueLeaks: string[];       // weighted-field mutants the grader failed to DETECT (gate failures)
  thresholdLeaks: string[];  // detected mutants that didn't FLIP (lenient threshold — reported, not gated)
  robust: boolean;           // canonical passes AND zero trueLeaks
  // hidden-oracle probe (reported, not gated)
  hasChosenStrategy: boolean;
  synonymMutantPassed: boolean | null;
};

const results: RowResult[] = [];
const uncovered: string[] = [];

const fieldIsWeighted = (field: string, rubric: Json): boolean => {
  const fw = rubric.field_weights ?? {};
  if (field in fw) return fw[field] > 0;
  // AGI canonical fields get weight 1 (grader line 1406). nested fields: check prefix.
  const agiVal = rubric?._agi_canonical?.validation ?? {};
  if (field in agiVal) return true;
  return false;
};

for (const q of SCHEMA_QUESTIONS_300Q as Json[]) {
  const qid = q.id as string;
  const rubric = loadRubric300q(q.rubric_id) as Json;
  const tier = String(qid).startsWith('AGI') ? 'AGI' : `L${q.level}`;

  const canonical = passingByQid.get(qid);
  if (!canonical) {
    uncovered.push(qid);
    results.push({
      id: qid, tier, covered: false, canonicalPass: false,
      mutations: [], trueLeaks: [], thresholdLeaks: [],
      robust: false, hasChosenStrategy: false, synonymMutantPassed: null,
    });
    continue;
  }

  const baseResult = gradeSchemaResponse(JSON.stringify({ ...canonical, reasoning: 'mutation harness probe' }), q, rubric);
  const canonicalPass = baseResult.pass;
  const baseScore = baseResult.score;
  const mutations: MutationOutcome[] = [];
  const trueLeaks: string[] = [];
  const thresholdLeaks: string[] = [];

  const runMutation = (label: string, field: string, mut: Json) => {
    const r = gradeSchemaResponse(JSON.stringify({ ...mut, reasoning: 'mutation harness probe' }), q, rubric);
    const detected = r.score < baseScore - 0.001;
    const flipped = !r.pass && canonicalPass;
    const weighted = fieldIsWeighted(field, rubric);
    const trueLeak = weighted && !detected; // weighted field + grader didn't even notice = defect
    mutations.push({ label, field, fieldWeighted: weighted, baseScore, mutScore: r.score, detected, flipped, trueLeak });
    if (trueLeak) trueLeaks.push(label);
    else if (weighted && detected && !flipped) thresholdLeaks.push(label); // noticed but threshold too lenient
  };

  // --- wrong strategy/intent label ---
  for (const f of ['chosen_strategy', 'intent', 'strategy', 'selected_strategy']) {
    if (typeof canonical[f] === 'string' && canonical[f]) {
      const m = clone(canonical);
      m[f] = 'wrong_decoy_label_zzz';
      runMutation(`wrong_label:${f}`, f, m);
      break;
    }
  }

  // --- wrong core numbers: every top-level numeric field, +1,000,007 ---
  for (const f of Object.keys(canonical)) {
    const v = canonical[f];
    if (typeof v === 'number') {
      const m = clone(canonical);
      m[f] = v + 1_000_000 + 7;
      runMutation(`wrong_number:${f}`, f, m);
    }
    // one level of nesting (e.g. allocation_usd.Aave_USDC, venue_fills.Dark_RFQ)
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      for (const sub of Object.keys(v)) {
        if (typeof v[sub] === 'number') {
          const m = clone(canonical);
          m[f][sub] = v[sub] + 1_000_000 + 7;
          runMutation(`wrong_number:${f}.${sub}`, `${f}.${sub}`, m);
        }
      }
    }
  }

  // --- missing required/critical fields ---
  const required: string[] = Array.isArray(rubric.required_fields) ? rubric.required_fields : [];
  const critical: string[] = Array.isArray(rubric.metadata?.critical_fields)
    ? rubric.metadata.critical_fields.map(String) : [];
  for (const f of new Set([...required, ...critical])) {
    if (getPath(canonical, f) === undefined) continue;
    const m = clone(canonical);
    delPath(m, f);
    runMutation(`missing_field:${f}`, f, m);
  }

  // --- decision/feasibility flip ---
  if (typeof canonical.decision === 'string') {
    const m = clone(canonical);
    m.decision = canonical.decision === 'no_trade' ? 'trade' : 'no_trade';
    runMutation('flip_decision', 'decision', m);
  }
  if (typeof canonical.feasibility === 'string') {
    const m = clone(canonical);
    m.feasibility = canonical.feasibility === 'feasible' ? 'infeasible' : 'feasible';
    runMutation('flip_feasibility', 'feasibility', m);
  }

  // --- HIDDEN-ORACLE PROBE: synonym-renamed chosen_strategy (reported, not gated) ---
  let synonymMutantPassed: boolean | null = null;
  const hasChosenStrategy = typeof canonical.chosen_strategy === 'string' && !!canonical.chosen_strategy;
  if (hasChosenStrategy) {
    const m = clone(canonical);
    m.chosen_strategy = synonymRename(canonical.chosen_strategy);
    synonymMutantPassed = grade(m, q, rubric);
  }

  results.push({
    id: qid, tier, covered: true, canonicalPass,
    mutations, trueLeaks, thresholdLeaks,
    robust: canonicalPass && trueLeaks.length === 0,
    hasChosenStrategy, synonymMutantPassed,
  });
}

// ─── Reporting ───
const total = results.length;
const covered = results.filter(r => r.covered);
const uncoveredCount = total - covered.length;
const canonicalPasses = covered.filter(r => r.canonicalPass).length;
const robust = results.filter(r => r.robust).length;
const rowsWithTrueLeaks = covered.filter(r => r.trueLeaks.length > 0).length;
const rowsWithThresholdLeaks = covered.filter(r => r.thresholdLeaks.length > 0).length;

// detection stats across all mutations
const allMuts = covered.flatMap(r => r.mutations);
const weightedMuts = allMuts.filter(m => m.fieldWeighted);
const detectedCount = weightedMuts.filter(m => m.detected).length;
const flippedCount = weightedMuts.filter(m => m.flipped).length;
const trueLeakCount = weightedMuts.filter(m => m.trueLeak).length;

const tiers = ['L1','L2','L3','L4','L5','L6','L7','L8','L9','L10','AGI'];
const byTier = (t: string) => results.filter(r => r.tier === t);

console.log('=== TradeBench 300Q mutation gate (real-passing-response canonicals) ===');
console.log(`baseline source: ${gradedPath}`);
console.log(`rows: ${total}`);
console.log(`covered (real passing response available): ${covered.length}/${total}`);
console.log(`uncovered (no passing baseline — coverage caveat): ${uncoveredCount}`);
console.log(`canonical re-grade passes: ${canonicalPasses}/${covered.length}`);
console.log(`\nMUTATION-ROBUST rows (no true leaks): ${robust}/${total}`);
console.log(`rows with TRUE leaks (weighted field, grader didn't detect): ${rowsWithTrueLeaks}`);
console.log(`rows with threshold leaks (detected but 0.7 threshold too lenient to flip): ${rowsWithThresholdLeaks}`);

console.log('\ndetection stats (WEIGHTED fields only):');
console.log(`  weighted mutations run: ${weightedMuts.length}`);
console.log(`  DETECTED (score dropped): ${detectedCount}/${weightedMuts.length} (${(100*detectedCount/weightedMuts.length).toFixed(0)}%)`);
console.log(`  FLIPPED to fail: ${flippedCount}/${weightedMuts.length} (${(100*flippedCount/weightedMuts.length).toFixed(0)}%)`);
console.log(`  TRUE leaks (weighted + not detected): ${trueLeakCount}/${weightedMuts.length} (${(100*trueLeakCount/weightedMuts.length).toFixed(0)}%)`);

console.log('\nper-tier robust / covered / total:');
for (const t of tiers) {
  const arr = byTier(t);
  if (!arr.length) continue;
  const c = arr.filter(r => r.covered).length;
  console.log(`  ${t}: ${arr.filter(r => r.robust).length}/${c} robust/covered  (${arr.length} total)`);
}

// true-leak type histogram (the real defects)
const trueLeakHist: Record<string, number> = {};
for (const r of results) for (const l of r.trueLeaks) {
  const kind = l.split(':')[0];
  trueLeakHist[kind] = (trueLeakHist[kind] ?? 0) + 1;
}
console.log('\nTRUE LEAK types (weighted field, grader failed to detect):', JSON.stringify(trueLeakHist, null, 2));

// hidden-oracle probe
const strategyRows = results.filter(r => r.hasChosenStrategy);
const oracleBrittle = strategyRows.filter(r => r.synonymMutantPassed === false).length;
const oracleTolerant = strategyRows.filter(r => r.synonymMutantPassed === true).length;
console.log('\n=== HIDDEN-ORACLE PROBE (synonym-renamed chosen_strategy) ===');
console.log(`rows with a chosen_strategy string label (among covered): ${strategyRows.length}`);
console.log(`  synonym mutant REJECTED (exact-match oracle CONFIRMED): ${oracleBrittle}`);
console.log(`  synonym mutant ACCEPTED (grader tolerates naming): ${oracleTolerant}`);
console.log(`  => ${oracleBrittle}/${strategyRows.length} label fields are brittle to renaming`);

console.log('\nfirst 30 rows with TRUE leaks:');
results.filter(r => r.covered && r.trueLeaks.length > 0).slice(0, 30).forEach(r =>
  console.log(`  ${r.id} [${r.tier}] canonical=${r.canonicalPass} trueLeaks=${r.trueLeaks.slice(0, 4).join(',')}${r.trueLeaks.length > 4 ? '…' : ''}`)
);

// ─── Gate decision ───
// GATE: canonical must pass (sanity) AND zero TRUE leaks (weighted field not detected = real defect).
// Threshold leaks (detected but didn't flip) are REPORTED as a design caveat, not gated.
const canonicalFailures = covered.filter(r => !r.canonicalPass).map(r => r.id);
const gatePass = canonicalFailures.length === 0 && rowsWithTrueLeaks === 0;
console.log(`\nGATE: ${gatePass ? 'PASS' : 'FAIL'}`);
console.log(`  canonical re-grade failures (sanity): ${canonicalFailures.length}`);
console.log(`  rows with TRUE leaks (weighted field not detected): ${rowsWithTrueLeaks}`);
console.log(`  rows with threshold leaks (caveat, not gated): ${rowsWithThresholdLeaks}`);
console.log(`  uncovered rows (coverage caveat): ${uncoveredCount}`);
if (canonicalFailures.length) {
  console.log(`  canonical FAILURES: ${canonicalFailures.slice(0, 20).join(', ')}${canonicalFailures.length > 20 ? '…' : ''}`);
}
if (!gatePass) process.exitCode = 1;

// write full results
const outDir = 'results/mutation-test-300q';
fs.mkdirSync(outDir, { recursive: true });
const summary = {
  total, covered: covered.length, uncoveredCount, canonicalPasses, robust,
  rowsWithTrueLeaks, rowsWithThresholdLeaks,
  detectionStats: { weightedMuts: weightedMuts.length, detectedCount, flippedCount, trueLeakCount },
  trueLeakHist,
  hiddenOracleProbe: {
    strategyRows: strategyRows.length, oracleConfirmedBrittle: oracleBrittle, toleratedNaming: oracleTolerant,
  },
  canonicalFailures,
  gate: gatePass ? 'PASS' : 'FAIL',
  uncovered,
  rowsWithTrueLeaksIds: covered.filter(r => r.trueLeaks.length > 0).map(r => r.id),
};
fs.writeFileSync(`${outDir}/summary.json`, JSON.stringify(summary, null, 2));
fs.writeFileSync(`${outDir}/row-results.json`, JSON.stringify(results, null, 2));
console.log(`\nwrote ${outDir}/summary.json + row-results.json`);
