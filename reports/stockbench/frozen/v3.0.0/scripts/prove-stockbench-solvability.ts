#!/usr/bin/env tsx

import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';

import { STOCKBENCH_QUESTIONS_300Q } from '../src/questions/stockbench-questions-300q';
import { gradeSchemaResponse } from '../src/grading/schema-grader-300q';
import { loadRubric300q } from '../src/rubrics/loader-300q';

type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

type ProofRow = {
  id: string;
  rubric_id: string;
  tier_tagged: string;
  tier_observed: string;
  tier_variance: number;
  answer_key_verdict: 'VERIFIED' | 'ERROR';
  problem_rubric_hash: string;
  solution_hash: string;
  full_review_hash: string;
  canonical_grade_pass: boolean;
  canonical_grade_score: number;
  canonical_grade_confidence: number;
  primary_domain: string;
  capability_tag: string;
  scenario_family: string;
  feasibility_trap: boolean;
  required_fields: string[];
  validation_fields: string[];
  derivation: string;
  proof_statement: string;
  notes: string[];
};

const ROOT = process.cwd();
const RUBRIC_DIR = path.join(ROOT, 'src', 'rubrics');
const OUT_DIR = path.join(ROOT, 'docs');
const JSONL_OUT = path.join(OUT_DIR, 'stockbench-solvability-proofs.jsonl');
const CSV_OUT = path.join(OUT_DIR, 'stockbench-solvability-proofs.csv');
const SUMMARY_OUT = path.join(OUT_DIR, 'stockbench-solvability-proof-summary.md');

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function stableNormalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stableNormalize);
  }
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map(key => [key, stableNormalize(value[key])])
    );
  }
  return value;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(stableNormalize(value));
}

function sha256(value: unknown): string {
  return createHash('sha256').update(stableStringify(value)).digest('hex');
}

function csvCell(value: unknown): string {
  const text = Array.isArray(value) ? value.join('|') : String(value);
  const escaped = text.replace(/"/g, '""');
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

function readRawRubric(rubricId: string): Record<string, unknown> {
  const filePath = path.join(RUBRIC_DIR, `${rubricId}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function stripQuestionSolution(question: Record<string, unknown>): Record<string, unknown> {
  const { expected_values: _expectedValues, context, ...rest } = question;
  const cleanContext = isPlainObject(context)
    ? Object.fromEntries(
        Object.entries(context).filter(([key]) => key !== 'canonical_answer')
      )
    : context;
  return { ...rest, context: cleanContext };
}

function stripRubricSolution(rubric: Record<string, unknown>): Record<string, unknown> {
  const {
    _agi_canonical: _agiCanonical,
    _l9_canonical: _l9Canonical,
    _l10_canonical: _l10Canonical,
    canonical: _canonical,
    answer_key: _answerKey,
    ...rest
  } = rubric;
  return rest;
}

function getCanonicalBlock(rubric: Record<string, unknown>): Record<string, unknown> {
  const block = rubric._agi_canonical ?? rubric._l10_canonical ?? rubric._l9_canonical;
  if (isPlainObject(block)) return block;

  const metadata = isPlainObject(rubric.metadata) ? rubric.metadata : {};
  const rangeFields = isPlainObject(rubric.range_fields) ? rubric.range_fields : {};
  return {
    validation: rangeFields,
    derivation: typeof metadata.canonical_derivation === 'string' ? metadata.canonical_derivation : '',
  };
}

function tierName(level: number): string {
  return level === 11 ? 'AGI' : `L${level}`;
}

function tierRank(tier: string): number {
  return tier === 'AGI' ? 11 : Number(tier.replace('L', ''));
}

function observedTier(tagged: string, prompt: string, requiredFields: string[]): string {
  const hasObjective = /Objective:/i.test(prompt);
  const hasReject = /reject|unavailable|not permitted|violates|infeasible/i.test(prompt);
  const hasSelfCheck = requiredFields.includes('self_check') || /self_check/i.test(prompt);

  if (tagged === 'AGI') return hasObjective && hasReject && hasSelfCheck ? 'AGI' : 'L10';
  if (tagged === 'L10') return hasObjective && hasReject ? 'L10' : 'L9';
  if (tagged === 'L9') return hasObjective && hasReject ? 'L9' : 'L8';
  return tagged;
}

function missingStructuralNotes(
  question: Record<string, unknown>,
  rubric: Record<string, unknown>,
  tagged: string,
  canonicalBlock: Record<string, unknown>
): string[] {
  const notes: string[] = [];
  const prompt = String(question.prompt ?? '');
  const meta = isPlainObject((question.context as Record<string, unknown> | undefined)?.stockbench)
    ? ((question.context as Record<string, unknown>).stockbench as Record<string, unknown>)
    : {};
  const rubricMeta = isPlainObject(rubric.metadata) ? rubric.metadata : {};

  if (!prompt.includes('Frozen market snapshot:')) notes.push('missing_frozen_market_snapshot');
  if (!prompt.includes('Output JSON fields:')) notes.push('missing_output_json_fields');
  if (prompt.includes('undefined')) notes.push('prompt_contains_undefined');
  if (['L9', 'L10', 'AGI'].includes(tagged) && !prompt.includes('Objective:')) notes.push('missing_objective');
  for (const key of ['primary_domain', 'tier', 'capability_tag', 'scenario_family', 'feasibility_trap']) {
    if (meta[key] === undefined) notes.push(`missing_question_metadata_${key}`);
  }
  if (!Array.isArray(rubric.expected_fields) || rubric.expected_fields.length === 0) notes.push('missing_expected_fields');
  if (!Array.isArray(rubric.required_fields) || rubric.required_fields.length === 0) notes.push('missing_required_fields');
  const hasCanonicalValidation = isPlainObject(canonicalBlock.validation) && Object.keys(canonicalBlock.validation).length > 0;
  if (
    (!isPlainObject(rubric.field_weights) || Object.keys(rubric.field_weights).length === 0) &&
    !hasCanonicalValidation
  ) {
    notes.push('missing_field_weights_or_canonical_validation');
  }
  if (typeof rubric.pass_threshold !== 'number') notes.push('missing_pass_threshold');
  if (!Array.isArray(rubricMeta.failure_modes) || rubricMeta.failure_modes.length === 0) notes.push('missing_failure_modes');
  if (!Array.isArray(rubricMeta.must_not) || rubricMeta.must_not.length === 0) notes.push('missing_must_not');
  if (!hasCanonicalValidation) notes.push('missing_canonical_validation');
  if (typeof canonicalBlock.derivation !== 'string' || canonicalBlock.derivation.trim().length < 5) notes.push('missing_canonical_derivation');

  return notes;
}

function countBy(rows: ProofRow[], key: keyof ProofRow): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const value = String(row[key]);
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort());
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const rows: ProofRow[] = [];

for (const question of STOCKBENCH_QUESTIONS_300Q) {
  const rawQuestion = question as unknown as Record<string, unknown>;
  const rawRubric = readRawRubric(question.rubric_id);
  const loadedRubric = loadRubric300q(question.rubric_id);
  const canonicalBlock = getCanonicalBlock(rawRubric);
  const validation = isPlainObject(canonicalBlock.validation)
    ? canonicalBlock.validation
    : {};
  const derivation = typeof canonicalBlock.derivation === 'string' ? canonicalBlock.derivation : '';
  const requiredFields = Array.isArray(rawRubric.required_fields)
    ? rawRubric.required_fields.map(String)
    : [];
  const validationFields = Object.keys(validation);

  const tagged = String(
    ((question.context?.stockbench as Record<string, unknown> | undefined)?.tier ?? tierName(question.level))
  );
  const observed = observedTier(tagged, question.prompt, requiredFields);
  const variance = Math.abs(tierRank(tagged) - tierRank(observed));

  const raw = JSON.stringify({
    ...question.expected_values,
    reasoning: 'canonical derivation from frozen packet',
  });
  const grade = gradeSchemaResponse(raw, question, loadedRubric);

  const structuralNotes = missingStructuralNotes(rawQuestion, rawRubric, tagged, canonicalBlock);
  if (!grade.pass) structuralNotes.push(`canonical_grade_failed:${grade.failureReasons.join('|')}`);
  if (variance > 1) structuralNotes.push(`tier_variance_gt_1:${variance}`);

  const problemRubricPacket = {
    question: stripQuestionSolution(rawQuestion),
    rubric: stripRubricSolution(rawRubric),
  };
  const solutionPacket = {
    question_id: question.id,
    expected_values: question.expected_values,
    canonical_answer: question.context?.canonical_answer ?? null,
    canonical_block: canonicalBlock,
  };
  const fullReviewPacket = {
    question: rawQuestion,
    rubric: rawRubric,
  };

  const meta = (question.context?.stockbench ?? {}) as Record<string, unknown>;
  const verified = grade.pass && structuralNotes.length === 0;

  rows.push({
    id: question.id,
    rubric_id: question.rubric_id,
    tier_tagged: tagged,
    tier_observed: observed,
    tier_variance: variance,
    answer_key_verdict: verified ? 'VERIFIED' : 'ERROR',
    problem_rubric_hash: sha256(problemRubricPacket),
    solution_hash: sha256(solutionPacket),
    full_review_hash: sha256(fullReviewPacket),
    canonical_grade_pass: grade.pass,
    canonical_grade_score: grade.score,
    canonical_grade_confidence: grade.confidence,
    primary_domain: String(meta.primary_domain ?? ''),
    capability_tag: String(meta.capability_tag ?? ''),
    scenario_family: String(meta.scenario_family ?? ''),
    feasibility_trap: Boolean(meta.feasibility_trap),
    required_fields: requiredFields,
    validation_fields: validationFields,
    derivation,
    proof_statement: verified
      ? 'VERIFIED: the hashed problem+rubric packet is self-contained, the canonical derivation is present in the review record, and the canonical answer passes the local grader through the existing code path.'
      : 'ERROR: see notes; this row did not clear the solvability proof gate.',
    notes: structuralNotes,
  });
}

const jsonl = rows.map(row => JSON.stringify(row)).join('\n');
fs.writeFileSync(JSONL_OUT, `${jsonl}\n`);

const csvHeaders: (keyof ProofRow)[] = [
  'id',
  'rubric_id',
  'tier_tagged',
  'tier_observed',
  'tier_variance',
  'answer_key_verdict',
  'problem_rubric_hash',
  'solution_hash',
  'full_review_hash',
  'canonical_grade_pass',
  'canonical_grade_score',
  'canonical_grade_confidence',
  'primary_domain',
  'capability_tag',
  'scenario_family',
  'feasibility_trap',
  'required_fields',
  'validation_fields',
  'notes',
];
const csv = [
  csvHeaders.join(','),
  ...rows.map(row => csvHeaders.map(header => csvCell(row[header])).join(',')),
].join('\n');
fs.writeFileSync(CSV_OUT, `${csv}\n`);

const verifiedCount = rows.filter(row => row.answer_key_verdict === 'VERIFIED').length;
const errorRows = rows.filter(row => row.answer_key_verdict !== 'VERIFIED');
const aggregateProblemHash = sha256(rows.map(row => ({
  id: row.id,
  problem_rubric_hash: row.problem_rubric_hash,
})));
const aggregateFullReviewHash = sha256(rows.map(row => ({
  id: row.id,
  full_review_hash: row.full_review_hash,
})));

const summary = `# StockBench 300Q Solvability Proof Ledger

Status: ${verifiedCount === rows.length ? 'ALL 300 VERIFIED' : 'REVIEW REQUIRED'}

This proof ledger creates stable per-question hashes and a one-row-per-question solvability record. No paid model calls were run.

> NOTE ON SCOPE (read before trusting "ALL 300 VERIFIED"): this ledger grades each canonical
> answer against its own rubric, so it confirms rubric/answer COMPATIBILITY and produces stable
> review hashes — it does NOT independently prove difficulty or that wrong answers fail. The real
> correctness gate is \`scripts/mutation-test-stockbench.ts\` (canonical passes AND wrong
> strategy/instrument/number/missing-critical/invalid-route all fail), and answer-leakage /
> diversity / family-content are checked by \`scripts/stockbench-quality-gate.ts\`. Freeze also
> requires a model smoke run. Treat this ledger as a consistency linter, not a freeze proof.

## Hash Contract

- \`problem_rubric_hash\`: SHA-256 of a canonical JSON packet containing the question prompt/context and rubric scoring contract, excluding \`expected_values\`, \`context.canonical_answer\`, and canonical solution blocks such as \`_agi_canonical\`.
- \`solution_hash\`: SHA-256 of the answer-side packet: \`expected_values\`, \`context.canonical_answer\`, and canonical validation/derivation metadata.
- \`full_review_hash\`: SHA-256 of the complete local question object plus complete rubric JSON.

Use \`problem_rubric_hash\` when asking another agent to independently solve from the problem and rubric. Use \`full_review_hash\` when checking that two agents reviewed the exact same local row.

## Results

- Questions reviewed: ${rows.length}
- Verified rows: ${verifiedCount}
- Error rows: ${errorRows.length}
- Aggregate problem/rubric hash: \`${aggregateProblemHash}\`
- Aggregate full-review hash: \`${aggregateFullReviewHash}\`

## Verdict Counts

\`\`\`json
${JSON.stringify(countBy(rows, 'answer_key_verdict'), null, 2)}
\`\`\`

## Tier Counts

\`\`\`json
${JSON.stringify(countBy(rows, 'tier_tagged'), null, 2)}
\`\`\`

## Observed Tier Counts

\`\`\`json
${JSON.stringify(countBy(rows, 'tier_observed'), null, 2)}
\`\`\`

## Output Files

- \`${path.relative(ROOT, JSONL_OUT)}\`: full proof ledger with derivations.
- \`${path.relative(ROOT, CSV_OUT)}\`: compact review index for spreadsheet comparison.
- \`${path.relative(ROOT, SUMMARY_OUT)}\`: this summary.

## Reproduce

\`\`\`bash
npx tsx scripts/prove-stockbench-solvability.ts
\`\`\`

`;
fs.writeFileSync(SUMMARY_OUT, summary);

const result = {
  status: verifiedCount === rows.length ? 'ALL_300_VERIFIED' : 'REVIEW_REQUIRED',
  questions: rows.length,
  verified: verifiedCount,
  errors: errorRows.length,
  aggregateProblemHash,
  aggregateFullReviewHash,
  jsonl: JSONL_OUT,
  csv: CSV_OUT,
  summary: SUMMARY_OUT,
};

console.log(JSON.stringify(result, null, 2));
if (errorRows.length > 0) {
  console.error(JSON.stringify(errorRows.map(row => ({ id: row.id, notes: row.notes })), null, 2));
  process.exit(1);
}
