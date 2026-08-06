#!/usr/bin/env tsx

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { SCHEMA_QUESTIONS_300Q } from '../src/questions/schema-questions-300q';

type Evaluation = { modelId: string; questionId: string; error?: string; grade: { pass: boolean } };
type Generation = { model: string; questionId: string; status: 'ok' | 'failed'; error?: string };
type Score = { model: string; questionId: string; status: 'ok' | 'failed'; error?: string; grade: { pass: boolean } };
type Run = {
  suite: string;
  models: string[];
  questionIds: string[];
  source?: Record<string, string>;
  options?: { temperature?: number; retryAttempts?: number; maxRetries?: number };
  evaluations: Evaluation[];
};

const input = process.argv[2];
if (!input) throw new Error('Usage: tsx scripts/audit-coinbench-difficulty-calibration.ts <result.json|checkpointed-results-dir>');

const root = process.cwd();
const inputPath = path.resolve(input);
const readJsonLines = <T>(file: string): T[] => fs.existsSync(file)
  ? fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line) as T)
  : [];
const run: Run = fs.statSync(inputPath).isDirectory()
  ? (() => {
      const manifest = JSON.parse(fs.readFileSync(path.join(inputPath, 'run-manifest.json'), 'utf8')) as Omit<Run, 'evaluations'>;
      const generations = readJsonLines<Generation>(path.join(inputPath, 'generations.jsonl'));
      const scores = readJsonLines<Score>(path.join(inputPath, 'scores.jsonl'));
      const ledgerKey = (modelId: string, questionId: string) => `${modelId}\u0000${questionId}`;
      const finalGeneration = new Map(generations.map(row => [ledgerKey(row.model, row.questionId), row]));
      const latestSuccessfulScore = new Map<string, Score>();
      for (const row of scores) if (row.status === 'ok') latestSuccessfulScore.set(ledgerKey(row.model, row.questionId), row);
      return {
        ...manifest,
        evaluations: [...finalGeneration.values()].map(generation => {
          const score = latestSuccessfulScore.get(ledgerKey(generation.model, generation.questionId));
          return {
            modelId: generation.model,
            questionId: generation.questionId,
            error: generation.status === 'failed' ? (generation.error || 'generation_failed') : (!score ? 'score_failed' : undefined),
            grade: score?.grade || { pass: false },
          };
        }),
      };
    })()
  : JSON.parse(fs.readFileSync(inputPath, 'utf8')) as Run;
const sha256 = (file: string) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const questions = SCHEMA_QUESTIONS_300Q as Array<{ id: string; level: number; rubric_id: string }>;
const rubricHash = createHash('sha256').update(Buffer.concat(
  [...new Set(questions.map(question => question.rubric_id))].sort().flatMap((id, index) =>
    index ? [Buffer.from('\n'), fs.readFileSync(path.join(root, 'src', 'rubrics', `${id}.json`))] : [fs.readFileSync(path.join(root, 'src', 'rubrics', `${id}.json`))]
  )
)).digest('hex');
const expectedSource = {
  questions_sha256: sha256(path.join(root, 'src', 'questions', 'schema-questions-300q.ts')),
  rubrics_sha256: rubricHash,
  grader_sha256: sha256(path.join(root, 'src', 'grading', 'schema-grader-300q.ts')),
};
const expectedIds = new Set(questions.map(question => question.id));
const key = (modelId: string, questionId: string) => `${modelId}\u0000${questionId}`;
const uniqueRows = new Map(run.evaluations.map(row => [key(row.modelId, row.questionId), row]));
const errors = [...uniqueRows.values()].filter(row => row.error);
const perQuestion = questions.map(question => {
  const rows = run.models.map(modelId => uniqueRows.get(key(modelId, question.id)));
  const passed = rows.filter(row => row?.grade.pass).length;
  return { question_id: question.id, tier: question.id.startsWith('AGI') ? 'AGI' : `L${question.level}`, passed, total: run.models.length, pass_rate: passed / run.models.length };
});
const summary = {
  status: 'REVIEW_REQUIRED',
  claim: 'Empirical difficulty evidence only; a human must review all 0% and 100% rows before difficulty_calibration may pass.',
  protocol: {
    source_current: JSON.stringify(run.source) === JSON.stringify(expectedSource),
    suite_is_coinbench_candidate: run.suite === 'coinbench-v1-repair-candidate',
    models: run.models,
    pinned_model_count: run.models.length,
    expected_questions: 300,
    exact_unique_evaluations: uniqueRows.size === run.models.length * questions.length,
    all_current_questions_covered: run.questionIds.length === questions.length && run.questionIds.every(id => expectedIds.has(id)),
    zero_execution_errors: errors.length === 0,
    temperature_zero: run.options?.temperature === 0,
    retries_disabled: run.options?.retryAttempts === 1 || run.options?.maxRetries === 0,
  },
  source: expectedSource,
  model_pass_rates: run.models.map(modelId => {
    const rows = perQuestion.map(row => uniqueRows.get(key(modelId, row.question_id)));
    const passed = rows.filter(row => row?.grade.pass).length;
    const completed = rows.filter(Boolean).length;
    return { model_id: modelId, passed, completed, total: questions.length, pass_rate: passed / questions.length };
  }),
  review_queue: {
    all_models_passed: perQuestion.filter(row => row.passed === row.total),
    no_models_passed: perQuestion.filter(row => row.passed === 0),
  },
  per_question: perQuestion,
};

const out = path.join(root, 'reports', 'coinbench', 'v1', 'difficulty-calibration.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify({ out, status: summary.status, protocol: summary.protocol, review_queue: { all_models_passed: summary.review_queue.all_models_passed.length, no_models_passed: summary.review_queue.no_models_passed.length } }, null, 2));
