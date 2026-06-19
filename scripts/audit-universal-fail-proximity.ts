import fs from 'fs';
import path from 'path';

import { SCHEMA_QUESTIONS_300Q } from '../src/questions/schema-questions-300q';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'results/official/300/June 15th final/exhaustive analysis');
const BASIC = path.join(OUT_DIR, 'basic.txt');
const ADVANCED = path.join(OUT_DIR, 'advanced.jsonl');

type Cell = {
  record_type: 'cell';
  question_id: string;
  tier: string;
  model: string;
  normalized_answer: unknown;
  pass: 0 | 1;
  score: number | null;
  confidence: number | null;
  failureReasons: string[];
};

type RubricRecord = {
  record_type: 'rubric';
  question_id: string;
  tier: string;
  rubric_id: string;
  expected_values: unknown;
  rubric: any;
};

const failIds = [...fs.readFileSync(BASIC, 'utf8').matchAll(/- (\S+) \(/g)].map(m => m[1]);
const failSet = new Set(failIds);
const questions = new Map(SCHEMA_QUESTIONS_300Q.map(q => [q.id, q]));
const rubrics = new Map<string, RubricRecord>();
const cells = new Map<string, Cell[]>();

for (const line of fs.readFileSync(ADVANCED, 'utf8').trim().split('\n')) {
  const row = JSON.parse(line);
  if (!failSet.has(row.question_id)) continue;
  if (row.record_type === 'rubric') rubrics.set(row.question_id, row);
  if (row.record_type === 'cell') {
    const arr = cells.get(row.question_id) ?? [];
    arr.push(row);
    cells.set(row.question_id, arr);
  }
}

function csv(value: unknown): string {
  const s = typeof value === 'string' ? value : JSON.stringify(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function short(value: unknown, max = 900): string {
  const s = typeof value === 'string' ? value : JSON.stringify(value ?? null);
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

function scoreBand(score: number): string {
  if (score >= 0.68) return 'near_threshold';
  if (score >= 0.6) return 'close';
  if (score >= 0.4) return 'partial';
  if (score >= 0.2) return 'far';
  return 'way_off';
}

function basicBand(score: number, id: string): string {
  if (['L5-001', 'L5-002', 'L7-001', 'L9-043'].includes(id)) return 'close_or_artifact';
  return score >= 0.6 ? 'close' : 'way_off';
}

function topFailures(arr: Cell[]): string[] {
  const counts = new Map<string, number>();
  for (const cell of arr) {
    const reasons = cell.failureReasons?.length ? cell.failureReasons : ['(none)'];
    for (const reason of reasons) counts.set(reason, (counts.get(reason) ?? 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k}:${v}`);
}

function skillModes(id: string, failures: string[]): string {
  if (id === 'L5-001') return 'Uniswap V3 range-LP terminology; IL/range risk control; rubric synonym following';
  if (id === 'L5-002') return 'Aave recursive leverage loop; schema wording flexibility; leverage-risk explanation';
  if (id === 'L7-001') return 'Flash-loan arbitrage abstraction; meta-vs-concrete task framing';
  if (id === 'L9-043') return 'Governance EV arithmetic; prompt/canonical consistency';
  if (failures.some(f => f.includes('self_check'))) return 'AGI strategy synthesis; exact self-check schema; multi-field reconciliation';
  if (failures.some(f => f.includes('chosen_strategy'))) return 'AGI strategy selection; canonical route naming; constraint reconciliation';
  if (failures.some(f => f.includes('expected') || f.includes('pnl') || f.includes('value'))) return 'AGI numeric derivation; scenario PnL reconciliation';
  return 'AGI multi-step structured answer; required-field compliance';
}

function analysis(id: string, title: string, bestScore: number, failures: string[]): { status: string; text: string; action: string } {
  if (id === 'L5-001') return {
    status: 'verifier_artifact_likely',
    text: 'Models were very close and often used materially correct Uniswap V3 concentrated-liquidity language, but the rubric/synonyms and 0.72 threshold reject near-correct range-LP answers. This is not a clean model-capability failure.',
    action: 'Loosen synonyms/threshold or rewrite expected schema before using as training/eval failure.',
  };
  if (id === 'L5-002') return {
    status: 'verifier_artifact_likely',
    text: 'The prompt asks for a 3x Aave leverage loop, but the custom validator rejects common valid labels like loop/leverage_long even when reasoning describes deposit-borrow-swap. This is too narrow.',
    action: 'Accept loop/recursive_loop/deposit_borrow_swap when the reasoning establishes 3x Aave leverage.',
  };
  if (id === 'L7-001') return {
    status: 'prompt_rubric_mismatch',
    text: 'The prompt sounds like a concrete analysis task, while the rubric expects a generic meta-answer and auto-fails concrete assets/sizes. Models reasonably instantiated examples.',
    action: 'Rewrite prompt as a generic/meta analysis task or loosen the rubric to accept concrete worked analysis.',
  };
  if (id === 'L9-043') return {
    status: 'canonical_error_likely',
    text: 'The prompt says bribes cost $0 per ARB vote, but the canonical subtracts $52,250 of bribe cost. Several models computed the prompt-consistent EV, so this row is unfair as written.',
    action: 'Fix prompt or canonical; exclude from training/eval analysis until repaired.',
  };

  if (bestScore >= 0.68) return {
    status: 'near_miss_review',
    text: `${title} has near-threshold answers. Models often got the broad structure but missed exact nested fields, canonical labels, or one reconciliation value. This is a good candidate for checking whether categorical labels are too strict.`,
    action: 'Review top answers manually; likely use as sibling-task seed after verifying label/range fairness.',
  };
  if (bestScore >= 0.6) return {
    status: 'close_but_strict',
    text: `${title} has partial strategy success but no pass. Failures cluster around exact intent/chosen_strategy/self_check labels and missing nested fields, so it is hard but may also be schema-strict.`,
    action: 'Keep as hard AGI seed, but consider semantic alternatives for categorical labels before declaring pure capability failure.',
  };
  if (bestScore >= 0.4) return {
    status: 'genuinely_hard_partial',
    text: `${title} shows partial reasoning at best. Top models captured pieces but did not reconcile the full strategy, numeric fields, and schema.`,
    action: 'Use as a V2 sibling-task seed; do not loosen unless manual review finds a valid alternate strategy.',
  };
  if (bestScore >= 0.2) return {
    status: 'genuinely_hard_far',
    text: `${title} appears far from solved. Models usually missed the central strategy and multiple required fields.`,
    action: 'Treat as capability-growth curriculum, not a verifier problem unless independent derivation finds an issue.',
  };
  return {
    status: 'way_off_or_too_strict',
    text: `${title} has essentially no close model answer. This is either genuinely beyond current models or the answer key requires a hidden/over-specific canonical strategy.`,
    action: 'Manual verifier review required before training; if sound, reserve for advanced/GRPO-style curriculum.',
  };
}

function canonicalOf(r: RubricRecord): unknown {
  return r.rubric?._agi_canonical ?? r.rubric?._l10_canonical ?? r.rubric?._l9_canonical ?? r.expected_values;
}

const basicRows = [['question_id', 'tier', 'basic_proximity', 'best_score', 'closest_model', 'codex_analysis']];
const intermediateRows = [[
  'question_id', 'tier', 'title', 'proximity_band', 'best_score', 'best_model', 'top3_models',
  'common_failure_reasons', 'verifier_status', 'skill_failure_modes', 'recommended_action', 'codex_analysis',
]];
const advancedRows: string[] = [];
const summary: string[] = [];
const counts = new Map<string, number>();

for (const id of failIds) {
  const arr = (cells.get(id) ?? []).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const best = arr[0];
  const rubric = rubrics.get(id)!;
  const q = questions.get(id)!;
  const canonical = canonicalOf(rubric);
  const title = rubric.rubric?._agi_canonical?.title ?? rubric.rubric?._l9_canonical?.question_id ?? rubric.rubric_id;
  const failures = topFailures(arr);
  const bestScore = best?.score ?? 0;
  const judgment = analysis(id, title, bestScore, failures);
  counts.set(judgment.status, (counts.get(judgment.status) ?? 0) + 1);
  const top3 = arr.slice(0, 3).map(c => `${c.model}:${c.score}`).join(' | ');
  const skills = skillModes(id, failures);

  basicRows.push([id, rubric.tier, basicBand(bestScore, id), bestScore.toFixed(3), best?.model ?? '', judgment.text]);
  intermediateRows.push([
    id, rubric.tier, title, scoreBand(bestScore), bestScore.toFixed(3), best?.model ?? '', top3,
    failures.join('; '), judgment.status, skills, judgment.action, judgment.text,
  ]);
  advancedRows.push(JSON.stringify({
    question_id: id,
    tier: rubric.tier,
    title,
    proximity_band: scoreBand(bestScore),
    best_score: bestScore,
    top_answers: arr.slice(0, 5).map(c => ({
      model: c.model,
      score: c.score,
      confidence: c.confidence,
      failureReasons: c.failureReasons,
      normalized_answer: c.normalized_answer,
    })),
    common_failure_reasons: failures,
    prompt: q.prompt,
    answer_key: canonical,
    codex_verifier_status: judgment.status,
    codex_analysis: judgment.text,
    recommended_action: judgment.action,
    skill_failure_modes: skills,
  }));
}

fs.writeFileSync(path.join(OUT_DIR, 'universal-fail-proximity-basic.csv'), `${basicRows.map(r => r.map(csv).join(',')).join('\n')}\n`);
fs.writeFileSync(path.join(OUT_DIR, 'universal-fail-proximity-intermediate.csv'), `${intermediateRows.map(r => r.map(csv).join(',')).join('\n')}\n`);
fs.writeFileSync(path.join(OUT_DIR, 'universal-fail-proximity-advanced.jsonl'), `${advancedRows.join('\n')}\n`);

summary.push('# Universal-Fail Proximity Audit');
summary.push('');
summary.push('Scope: 79 universal-fail rows from the authoritative 69-model TradeBench/CoinBench 300Q matrix.');
summary.push('');
summary.push('## Verdict');
summary.push('');
summary.push('The universal-fail pool is mixed. The 4 non-AGI universal fails are likely verifier/problem artifacts, not clean model failures. The 75 AGI universal fails are mostly genuinely hard, but many near-miss rows should be reviewed for over-strict categorical labels (`intent`, `chosen_strategy`, `self_check`) before being used as proof of model incapability.');
summary.push('');
summary.push('## Counts By Codex Status');
summary.push('');
for (const [status, count] of [...counts].sort((a, b) => b[1] - a[1])) summary.push(`- ${status}: ${count}`);
summary.push('');
summary.push('## Most Actionable Rows');
summary.push('');
summary.push('- `L9-043`: likely canonical error. Prompt says bribes cost `$0 per ARB vote`; canonical subtracts `$52,250` bribe cost.');
summary.push('- `L5-001`: near-threshold concentrated-liquidity answers rejected; likely synonym/threshold artifact.');
summary.push('- `L5-002`: Aave leverage-loop answers rejected due narrow order_type/intent validator.');
summary.push('- `L7-001`: prompt allows concrete flash-loan analysis, rubric expects generic meta-answer.');
summary.push('- AGI near-threshold rows worth manual review: rows with `best_score >= 0.68` in `universal-fail-proximity-intermediate.csv`.');
summary.push('');
summary.push('## Training Guidance');
summary.push('');
summary.push('Do not copy eval rows into training. Build sibling tasks that preserve the skill pattern but change numbers, instruments, route sets, and constraints. Exclude or repair the 4 non-AGI artifact rows before using them as failure-derived curriculum.');

fs.writeFileSync(path.join(OUT_DIR, 'universal-fail-proximity-summary.md'), `${summary.join('\n')}\n`);

console.log(JSON.stringify({
  rows: failIds.length,
  outputs: [
    'universal-fail-proximity-basic.csv',
    'universal-fail-proximity-intermediate.csv',
    'universal-fail-proximity-advanced.jsonl',
    'universal-fail-proximity-summary.md',
  ],
  status_counts: Object.fromEntries([...counts].sort((a, b) => b[1] - a[1])),
}, null, 2));
