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
 * Rows with NO passing baseline response fail the full-suite gate. Missing evidence is not
 * a grader defect, but it does mean the benchmark is not ready to freeze.
 *
 * Makes no paid model calls.
 */
import { SCHEMA_QUESTIONS_300Q } from '../src/questions/schema-questions-300q';
import { COINBENCH_V1_QUARANTINE_IDS } from '../src/questions/coinbench-quarantine-v1';
import { loadRubric300q } from '../src/rubrics/loader-300q';
import { gradeSchemaResponse } from '../src/grading/schema-grader-300q';
import { createHash } from 'node:crypto';
import fs from 'fs';

type Json = any;

const sha256File = (file: string): string =>
  createHash('sha256').update(fs.readFileSync(file)).digest('hex');

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
  // Preserve the canonical's real reasoning — do NOT overwrite with a placeholder.
  // For some questions (L4-002, L8-009) `reasoning` is a load-bearing scored field
  // (L4-002 requires the word "correlation" in reasoning for a fatal intent gate;
  // L8-009's reasoning is a 0.55-weight structured object with 8 numeric sub-fields).
  // Overwriting it destroys the canonical and produces false canonical failures.
  const raw = JSON.stringify({ ...answer, reasoning: answer.reasoning ?? 'mutation harness probe' });
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

// ─── Load real passing responses from available tracked runs ───
const gradedPaths = (process.env.MUTATION_BASELINE_PATHS ?? [
  'results/official/300/June 15th final/exhaustive analysis/advanced.jsonl',
  'results/community/300/capability-probe-2026-07-02/graded-probe.json',
  'results/community/300/nojson29-gate-graded-2026-06-23.json',
].join(',')).split(',').map(value => value.trim()).filter(Boolean);
const missingBaselines = gradedPaths.filter(file => !fs.existsSync(file));
if (missingBaselines.length) throw new Error(`Missing mutation baselines: ${missingBaselines.join(', ')}`);

const questionById = new Map((SCHEMA_QUESTIONS_300Q as Json[]).map(question => [String(question.id), question]));
const referencedRubricsHash = createHash('sha256').update(
  [...new Set((SCHEMA_QUESTIONS_300Q as Json[]).map(question => String(question.rubric_id)))].sort()
    .map(id => fs.readFileSync(`src/rubrics/${id}.json`)).join('\n')
).digest('hex');
type CanonicalEvidence = 'historical_model' | 'repair_derivation_fixture';
const historicalReachableQids = new Set<string>();
const passingByQid = new Map<string, { answer: Json; score: number; source: string; evidence: CanonicalEvidence }>();
for (const gradedPath of gradedPaths) {
  const text = fs.readFileSync(gradedPath, 'utf8');
  const rows = gradedPath.endsWith('.jsonl')
    ? text.split(/\n+/).filter(Boolean).map(line => JSON.parse(line))
    : (JSON.parse(text).rows ?? []);
  for (const row of rows as Json[]) {
    if (row.record_type && row.record_type !== 'cell') continue;
    const questionId = String(row.questionId ?? row.question_id ?? '');
    const question = questionById.get(questionId);
    const answer = row.normalized ?? row.normalized_answer ?? row.grade?.normalizedResponse;
    if (!question || !answer || typeof answer !== 'object') continue;
    const current = gradeSchemaResponse(JSON.stringify(answer), question, loadRubric300q(question.rubric_id));
    if (current.pass) {
      historicalReachableQids.add(questionId);
      const existing = passingByQid.get(questionId);
      if (!existing || current.score > existing.score) {
        const model = row.model ?? row.modelId;
        passingByQid.set(questionId, {
          answer: clone(current.normalizedResponse),
          score: current.score,
          source: model ? `${gradedPath}#${model}` : gradedPath,
          evidence: 'historical_model',
        });
      }
    }
  }
}

// A repaired-row fixture is permitted only to exercise grader mutations. Its source is
// reported separately so a passing mutation gate is never mistaken for independent proof.
const repairCanonicalPath = process.env.MUTATION_REPAIR_CANONICAL_PATH
  ?? 'reports/coinbench/v1/repair-canonical-fixture.jsonl';
if (fs.existsSync(repairCanonicalPath)) {
  for (const line of fs.readFileSync(repairCanonicalPath, 'utf8').split(/\n+/).filter(Boolean)) {
    const row = JSON.parse(line) as { question_id?: string; answer?: Json };
    const questionId = String(row.question_id ?? '');
    const question = questionById.get(questionId);
    if (!question || !row.answer || typeof row.answer !== 'object' || passingByQid.has(questionId)) continue;
    const current = gradeSchemaResponse(JSON.stringify(row.answer), question, loadRubric300q(question.rubric_id));
    if (!current.pass) throw new Error(`Repair fixture does not pass ${questionId}: ${current.failureReasons.join(',')}`);
    passingByQid.set(questionId, {
      answer: clone(current.normalizedResponse),
      score: current.score,
      source: `${repairCanonicalPath}#${questionId}`,
      evidence: 'repair_derivation_fixture',
    });
  }
}

// The repair fixture is for mutation coverage only. It does not establish prompt
// answerability; that remains a separate proof and Council gate.

type MutationOutcome = {
  label: string;
  field: string;           // which field was mutated
  fieldWeighted: boolean;  // does the rubric assign nonzero weight to this field?
  baseScore: number;
  mutScore: number;
  detected: boolean;       // score dropped meaningfully (grader noticed)
  flipped: boolean;        // pass went false (gate caught it)
  trueLeak: boolean;       // weighted mutant still passes with no score drop
};

type RowResult = {
  id: string;
  tier: string;
  covered: boolean;          // did we have a real passing response to mutate?
  canonicalPass: boolean;    // re-grade of the real response
  mutations: MutationOutcome[];
  trueLeaks: string[];       // weighted mutants that pass with no score drop
  thresholdLeaks: string[];  // score dropped but mutant still passed (lenient threshold)
  robust: boolean;           // canonical passes AND zero trueLeaks
  // hidden-oracle probe (reported, not gated)
  hasChosenStrategy: boolean;
  synonymMutantPassed: boolean | null;
};

const results: RowResult[] = [];
const uncovered: string[] = [];

const fieldIsWeighted = (field: string, rubric: Json, questionId: string): boolean => {
  // L4-001 intentionally accepts intent/assets stated in reasoning or follow-up text;
  // mutating one redundant surface field does not make the whole answer wrong.
  if (questionId === 'L4-001' && (field === 'intent' || field === 'asset')) return false;
  const agiVal = rubric?._agi_canonical?.validation ?? {};
  if (field in agiVal) return field !== 'intent' && field !== 'chosen_strategy';
  const fw = rubric.field_weights ?? {};
  if (field in fw) return fw[field] > 0;
  return false;
};

const executableQuestions = (SCHEMA_QUESTIONS_300Q as Json[]).filter(
  q => !COINBENCH_V1_QUARANTINE_IDS.has(String(q.id))
);

for (const q of executableQuestions) {
  const qid = q.id as string;
  const rubric = loadRubric300q(q.rubric_id) as Json;
  const tier = String(qid).startsWith('AGI') ? 'AGI' : `L${q.level}`;

  const passing = passingByQid.get(qid);
  if (!passing) {
    uncovered.push(qid);
    results.push({
      id: qid, tier, covered: false, canonicalPass: false,
      mutations: [], trueLeaks: [], thresholdLeaks: [],
      robust: false, hasChosenStrategy: false, synonymMutantPassed: null,
    });
    continue;
  }
  const canonical = passing.answer;

  const baseResult = gradeSchemaResponse(JSON.stringify({ ...canonical, reasoning: canonical.reasoning ?? 'mutation harness probe' }), q, rubric);
  const canonicalPass = baseResult.pass;
  const baseScore = baseResult.score;
  const mutations: MutationOutcome[] = [];
  const trueLeaks: string[] = [];
  const thresholdLeaks: string[] = [];

  const runMutation = (label: string, field: string, mut: Json) => {
    const r = gradeSchemaResponse(JSON.stringify({ ...mut, reasoning: mut.reasoning ?? 'mutation harness probe' }), q, rubric);
    const flipped = !r.pass && canonicalPass;
    const scoreDropped = r.score < baseScore - 1e-9;
    const detected = flipped || scoreDropped;
    const weighted = fieldIsWeighted(field, rubric, qid);
    // Required-field omission is a partial-credit policy caveat, not automatically a wrong
    // semantic answer. Gate numeric/decision corruption; report omissions as threshold leniency.
    const omission = label.startsWith('missing_field:');
    const trueLeak = weighted && !omission && r.pass && !scoreDropped;
    mutations.push({ label, field, fieldWeighted: weighted, baseScore, mutScore: r.score, detected, flipped, trueLeak });
    if (trueLeak) trueLeaks.push(label);
    else if (weighted && r.pass && (detected || omission)) thresholdLeaks.push(label);
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
const total = executableQuestions.length;
const covered = results.filter(r => r.covered);
const historicalCovered = results.filter(r => historicalReachableQids.has(r.id)).length;
const repairFixtureCovered = results.filter(r => r.covered && !historicalReachableQids.has(r.id)).length;
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
const thresholdLeakCount = weightedMuts.filter(m => m.detected && !m.flipped).length;

const tiers = ['L1','L2','L3','L4','L5','L6','L7','L8','L9','L10','AGI'];
const byTier = (t: string) => results.filter(r => r.tier === t);

console.log('=== TradeBench 300Q mutation gate (real-passing-response canonicals) ===');
console.log(`baseline sources: ${gradedPaths.join(', ')}`);
console.log(`rows: ${total}`);
console.log(`covered (historical-model canonical available): ${covered.length}/${total}`);
console.log(`  historical-model canonicals: ${historicalCovered}`);
console.log(`  repair-derivation fixtures: ${repairFixtureCovered}`);
console.log(`uncovered (no passing baseline — coverage caveat): ${uncoveredCount}`);
console.log(`canonical re-grade passes: ${canonicalPasses}/${covered.length}`);
console.log(`\nMUTATION-ROBUST rows (no true leaks): ${robust}/${total}`);
console.log(`rows with TRUE leaks (weighted field, grader didn't detect): ${rowsWithTrueLeaks}`);
console.log(`rows with threshold leaks (score dropped but pass verdict held): ${rowsWithThresholdLeaks}`);
console.log(`threshold-leak mutations across those rows: ${thresholdLeakCount}`);

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
const coverageComplete = covered.length === total;
const gatePass = coverageComplete && canonicalFailures.length === 0 && rowsWithTrueLeaks === 0;
console.log(`\nGATE: ${gatePass ? 'PASS' : 'FAIL'}`);
console.log(`  canonical re-grade failures (sanity): ${canonicalFailures.length}`);
console.log(`  rows with TRUE leaks (weighted field not detected): ${rowsWithTrueLeaks}`);
console.log(`  threshold-leak rows/mutations (caveat, not gated): ${rowsWithThresholdLeaks}/${thresholdLeakCount}`);
console.log(`  full-suite canonical coverage: ${coverageComplete ? 'PASS' : 'FAIL'} (${covered.length}/${total})`);
if (canonicalFailures.length) {
  console.log(`  canonical FAILURES: ${canonicalFailures.slice(0, 20).join(', ')}${canonicalFailures.length > 20 ? '…' : ''}`);
}
if (!gatePass) process.exitCode = 1;

// write full results
const outDir = process.env.MUTATION_OUT_DIR || 'results/mutation-test-300q-current';
fs.mkdirSync(outDir, { recursive: true });
const summary = {
  source: {
    baselines: gradedPaths,
    canonical_provenance: Object.fromEntries(
      [...passingByQid].filter(([id]) => results.some(row => row.id === id && row.covered)).map(([id, value]) => [id, value.source])
    ),
    canonical_evidence: Object.fromEntries(
      [...passingByQid].filter(([id]) => results.some(row => row.id === id && row.covered)).map(([id, value]) => [id, value.evidence])
    ),
    questions_sha256: sha256File('src/questions/schema-questions-300q.ts'),
    rubrics_sha256: referencedRubricsHash,
    grader_sha256: sha256File('src/grading/schema-grader-300q.ts'),
  },
  total, covered: covered.length, historicalCovered, repairFixtureCovered, uncoveredCount, canonicalPasses, robust,
  rowsWithTrueLeaks, rowsWithThresholdLeaks,
  detectionStats: { weightedMuts: weightedMuts.length, detectedCount, flippedCount, trueLeakCount, thresholdLeakCount },
  trueLeakHist,
  hiddenOracleProbe: {
    strategyRows: strategyRows.length, oracleConfirmedBrittle: oracleBrittle, toleratedNaming: oracleTolerant,
  },
  canonicalFailures,
  coverageComplete,
  gate: gatePass ? 'PASS' : 'FAIL',
  uncovered,
  rowsWithTrueLeaksIds: covered.filter(r => r.trueLeaks.length > 0).map(r => r.id),
};
fs.writeFileSync(`${outDir}/summary.json`, JSON.stringify(summary, null, 2));
fs.writeFileSync(`${outDir}/row-results.json`, JSON.stringify(results, null, 2));
console.log(`\nwrote ${outDir}/summary.json + row-results.json`);
