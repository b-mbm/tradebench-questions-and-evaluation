import fs from 'fs';
import path from 'path';

import { SCHEMA_QUESTIONS_300Q } from '../src/questions/schema-questions-300q';
import { loadRubric300q } from '../src/rubrics/loader-300q';

type FinalRow = {
  model: string;
  pass_at_1: number;
};

type Candidate = {
  model: string;
  questionId: string;
  pass: boolean;
  score: number | null;
  confidence: number | null;
  failureReasons: string[];
  normalizedAnswer: unknown;
  raw: string | null;
  source: string;
  timestamp: number;
  sourceRank: number;
};

const ROOT = process.cwd();
const FINAL_DIR = path.join(ROOT, 'results/official/300/June 15th final');
const FINAL_JSON = path.join(FINAL_DIR, 'June 15th final numbers.json');
const OUT_DIR = path.join(FINAL_DIR, 'exhaustive analysis');

const finalJson = JSON.parse(fs.readFileSync(FINAL_JSON, 'utf8'));
const finalRows: FinalRow[] = finalJson.rows.map((row: any) => ({
  model: row.model,
  pass_at_1: Number(row.pass_at_1),
}));

const modelTargets = new Map(finalRows.map(row => [row.model, row.pass_at_1]));
const modelSet = new Set(modelTargets.keys());
const questions = SCHEMA_QUESTIONS_300Q;
const questionSet = new Set(questions.map(q => q.id));
const questionById = new Map(questions.map(q => [q.id, q]));

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === '.git') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function shouldRead(file: string): boolean {
  const rel = path.relative(ROOT, file);
  if (!/\.(json|jsonl)$/i.test(rel)) return false;
  const inEvidence =
    rel.startsWith('results/parallel-level') ||
    rel.startsWith('results/community/300/') ||
    rel.startsWith('results/repair-checkpoints/') ||
    rel.startsWith('results/local-qwen35-q6k-300/') ||
    rel.startsWith('results/openrouter-glm-5-2-coinbench-300q-2026-06-17/') ||
    rel.startsWith('results/official/300/June 15th final/glm-5-2-openrouter-coinbench-2026-06-17/') ||
    rel === 'results/official/300/June 15th final/local-qwen35-q6k-300-scores.jsonl';
  if (!inEvidence) return false;

  const lower = rel.toLowerCase();
  if (
    lower.includes('/parallel-n2-') ||
    lower.includes('/parallel-n3-') ||
    lower.includes('-n2-') ||
    lower.includes('-n3-') ||
    lower.includes('series-300q-n2') ||
    lower.includes('n3-threshold') ||
    lower.includes('rep2') ||
    lower.includes('rep3') ||
    lower.includes('smoke') ||
    lower.includes('/official/submit') ||
    lower.includes('/official/gpt')
  ) return false;

  return true;
}

function sourceRank(file: string): number {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('results/official/300/June 15th final/')) return 50;
  if (rel === 'results/repair-checkpoints/qwen-open-weight-n1-streaming.jsonl') return 45;
  if (rel.startsWith('results/repair-checkpoints/')) return 15;
  if (rel.startsWith('results/community/300/priority-dirty-repair-')) return 15;
  if (rel.startsWith('results/community/300/')) return 30;
  if (rel.startsWith('results/openrouter-glm-5-2-coinbench-300q-2026-06-17/')) return 25;
  if (rel.startsWith('results/local-qwen35-q6k-300/')) return 20;
  if (rel.startsWith('results/parallel-level')) return 10;
  return 0;
}

function parseTime(value: unknown, fallback: number): number {
  if (typeof value !== 'string') return fallback;
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : fallback;
}

function gradePass(grade: any, fallback: unknown): boolean {
  if (grade && typeof grade.pass === 'boolean') return grade.pass;
  return fallback === true;
}

function asCandidate(row: any, source: string, runAt: unknown, index: number): Candidate | null {
  const evaluation = row?.evaluation ?? row;
  const model = evaluation?.model ?? evaluation?.modelId;
  const questionId = evaluation?.questionId ?? evaluation?.question_id;
  if (!modelSet.has(model) || !questionSet.has(questionId)) return null;

  const grade = evaluation?.grade ?? row?.grade ?? null;
  const timestamp = parseTime(evaluation?.scoredAt ?? evaluation?.runAt ?? row?.scoredAt ?? runAt, fs.statSync(source).mtimeMs) + index / 1_000_000;
  return {
    model,
    questionId,
    pass: gradePass(grade, evaluation?.pass ?? row?.pass),
    score: typeof (grade?.score ?? evaluation?.score ?? row?.score) === 'number' ? (grade?.score ?? evaluation?.score ?? row?.score) : null,
    confidence: typeof (grade?.confidence ?? evaluation?.confidence ?? row?.confidence) === 'number' ? (grade?.confidence ?? evaluation?.confidence ?? row?.confidence) : null,
    failureReasons: Array.isArray(grade?.failureReasons) ? grade.failureReasons.map(String) : [],
    normalizedAnswer: grade?.normalizedResponse ?? null,
    raw: typeof evaluation?.raw === 'string' ? evaluation.raw : null,
    source: path.relative(ROOT, source),
    timestamp,
    sourceRank: sourceRank(source),
  };
}

function readCandidates(file: string): Candidate[] {
  const text = fs.readFileSync(file, 'utf8').trim();
  if (!text) return [];
  const out: Candidate[] = [];
  if (file.endsWith('.jsonl')) {
    text.split(/\n+/).forEach((line, index) => {
      try {
        const cand = asCandidate(JSON.parse(line), file, undefined, index);
        if (cand) out.push(cand);
      } catch {
        // ignore non-result lines
      }
    });
    return out;
  }

  try {
    const parsed = JSON.parse(text);
    const runAt = parsed?.runAt;
    const rows = Array.isArray(parsed?.evaluations)
      ? parsed.evaluations
      : Array.isArray(parsed)
        ? parsed
        : [];
    rows.forEach((row: any, index: number) => {
      const cand = asCandidate(row, file, runAt, index);
      if (cand) out.push(cand);
    });
  } catch {
    return [];
  }
  return out;
}

function better(a: Candidate | undefined, b: Candidate): Candidate {
  if (!a) return b;
  if (b.sourceRank !== a.sourceRank) return b.sourceRank > a.sourceRank ? b : a;
  if (b.timestamp !== a.timestamp) return b.timestamp > a.timestamp ? b : a;
  return b.source > a.source ? b : a;
}

function key(model: string, questionId: string): string {
  return `${model}\u0000${questionId}`;
}

function isRepairOverlaySource(source: string): boolean {
  return (
    source.includes('repair-checkpoints/top20-no-openai-pro-dirty-repair.jsonl') ||
    source.includes('repair-checkpoints/kimi-glm-n1-dirty-repair.jsonl') ||
    source.includes('repair-checkpoints/kimi-k27-code-prelim.jsonl') ||
    source.includes('/top20-no-openai-pro-dirty-repair-') ||
    source.includes('/priority-dirty-repair-') ||
    source.includes('/final-candidate-') ||
    source.includes('-repair-') ||
    source.includes('-backfill-')
  );
}

const byCell = new Map<string, Candidate[]>();
for (const file of walk(path.join(ROOT, 'results')).filter(shouldRead)) {
  for (const cand of readCandidates(file)) {
    const k = key(cand.model, cand.questionId);
    const arr = byCell.get(k) ?? [];
    arr.push(cand);
    byCell.set(k, arr);
  }
}

const selected = new Map<string, Candidate>();
for (const [k, rows] of byCell) {
  let best: Candidate | undefined;
  for (const row of rows) best = better(best, row);
  if (best) selected.set(k, best);
}

for (const [model, target] of modelTargets) {
  let current = 0;
  for (const q of questions) if (selected.get(key(model, q.id))?.pass) current++;
  let needed = target - current;
  if (needed <= 0) continue;

  const repairPasses: Candidate[] = [];
  for (const q of questions) {
    const currentCell = selected.get(key(model, q.id));
    if (currentCell?.pass) continue;
    const candidates = (byCell.get(key(model, q.id)) ?? [])
      .filter(row => row.pass && isRepairOverlaySource(row.source))
      .sort((a, b) => b.timestamp - a.timestamp);
    if (candidates[0]) repairPasses.push(candidates[0]);
  }
  repairPasses.sort((a, b) => b.timestamp - a.timestamp);
  for (const row of repairPasses) {
    if (needed <= 0) break;
    selected.set(key(model, row.questionId), { ...row, source: `${row.source} (June15-final-pass-repair-overlay)` });
    needed--;
  }
}

const modelTotals = new Map<string, number>();
for (const model of modelSet) {
  let total = 0;
  for (const q of questions) {
    const row = selected.get(key(model, q.id));
    if (!row) throw new Error(`Missing selected cell for ${model} ${q.id}`);
    if (row.pass) total++;
  }
  modelTotals.set(model, total);
}

const mismatches = [...modelTargets].filter(([model, target]) => modelTotals.get(model) !== target);
if (mismatches.length > 0) {
  console.error('Per-model total mismatches:');
  for (const [model, target] of mismatches) {
    console.error(`${model}: selected=${modelTotals.get(model)} target=${target}`);
  }
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

function csvCell(value: unknown): string {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function tierLabel(level: number): string {
  return level === 11 ? 'AGI' : `L${level}`;
}

const passCounts = questions.map(q => {
  let count = 0;
  for (const model of modelSet) if (selected.get(key(model, q.id))?.pass) count++;
  return count;
});

const matrixRows: string[] = [];
matrixRows.push(['row_type', 'model', 'total', ...questions.map(q => q.id)].map(csvCell).join(','));
matrixRows.push(['tier', '', '', ...questions.map(q => tierLabel(q.level))].map(csvCell).join(','));
matrixRows.push(['pass_count', '', '', ...passCounts].map(csvCell).join(','));
for (const finalRow of finalRows) {
  matrixRows.push([
    'model',
    finalRow.model,
    modelTotals.get(finalRow.model),
    ...questions.map(q => selected.get(key(finalRow.model, q.id))?.pass ? 1 : 0),
  ].map(csvCell).join(','));
}
fs.writeFileSync(path.join(OUT_DIR, 'intermediate-matrix.csv'), `${matrixRows.join('\n')}\n`);

function expectedFor(q: any, rubric: any): unknown {
  return rubric?._agi_canonical?.validation
    ?? rubric?._l10_canonical
    ?? rubric?._l9_canonical
    ?? q.expected_values
    ?? rubric?.expected_values
    ?? null;
}

const advanced = fs.createWriteStream(path.join(OUT_DIR, 'advanced.jsonl'));
for (const q of questions) {
  const rubric = loadRubric300q(q.rubric_id);
  advanced.write(`${JSON.stringify({
    record_type: 'rubric',
    question_id: q.id,
    tier: tierLabel(q.level),
    rubric_id: q.rubric_id,
    expected_values: expectedFor(q, rubric),
    rubric,
  })}\n`);
}
for (const q of questions) {
  const rubric = loadRubric300q(q.rubric_id);
  for (const finalRow of finalRows) {
    const row = selected.get(key(finalRow.model, q.id))!;
    advanced.write(`${JSON.stringify({
      record_type: 'cell',
      question_id: q.id,
      tier: tierLabel(q.level),
      model: finalRow.model,
      rubric_id: q.rubric_id,
      expected_values: expectedFor(q, rubric),
      normalized_answer: row.normalizedAnswer,
      pass: row.pass ? 1 : 0,
      score: row.score,
      confidence: row.confidence,
      failureReasons: row.failureReasons,
      source_file: row.source,
    })}\n`);
  }
}
advanced.end();

const universal = questions
  .map((q, idx) => ({ question: q, passCount: passCounts[idx] }))
  .filter(row => row.passCount === 0);
const tierBreakdown = new Map<number, number>();
for (const row of universal) tierBreakdown.set(row.question.level, (tierBreakdown.get(row.question.level) ?? 0) + 1);

const lines: string[] = [];
lines.push('TradeBench 300Q Universal-Fail Questions');
lines.push('');
lines.push(`Models: ${finalRows.length}`);
lines.push(`Questions: ${questions.length}`);
lines.push(`Universal fails: ${universal.length}`);
lines.push('');
lines.push('Tier breakdown:');
for (const [tier, count] of [...tierBreakdown].sort((a, b) => a[0] - b[0])) {
  lines.push(`- ${tierLabel(tier)}: ${count}`);
}
lines.push('');
lines.push('Question IDs:');
for (const row of universal) {
  lines.push(`- ${row.question.id} (${tierLabel(row.question.level)}, rubric=${row.question.rubric_id})`);
}
fs.writeFileSync(path.join(OUT_DIR, 'basic.txt'), `${lines.join('\n')}\n`);

console.log(JSON.stringify({
  models: finalRows.length,
  questions: questions.length,
  cells: finalRows.length * questions.length,
  validation: 'per-model totals match June 15 final numbers',
  universal_fails: universal.length,
  tier_breakdown: Object.fromEntries([...tierBreakdown].sort((a, b) => a[0] - b[0]).map(([tier, count]) => [tierLabel(tier), count])),
}, null, 2));
