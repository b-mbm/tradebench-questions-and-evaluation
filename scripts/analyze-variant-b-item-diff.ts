#!/usr/bin/env tsx
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { SCHEMA_QUESTIONS_300Q } from '../src/questions/schema-questions-300q';
import { gradeSchemaResponse } from '../src/grading/schema-grader-300q';
import { loadRubric300q } from '../src/rubrics/loader-300q';

const RUN_ROOT = '.lenny/research/variant-b-gate-2026-07-18/artifacts/r5-result/raw';
const BASE_FILE = `${RUN_ROOT}/historical-comparators/base-results.jsonl`;
const CANDIDATE_FILE = `${RUN_ROOT}/results.jsonl`;
const GATE_FILE = 'results/grpo-preconditions/gate-eval-ids.txt';
const PROMPT_A_FILE = 'prompts-300q.json';
const PROMPT_B_FILE = 'prompts-300q-variantB.json';
const GRADER_FILE = 'src/grading/schema-grader-300q.ts';
const RUBRIC_LOADER_FILE = 'src/rubrics/loader-300q.ts';
const QUESTIONS_FILE = 'src/questions/schema-questions-300q.ts';
const OUTPUT_FILE = 'Internal_docs/variant-b-item-diff-2026-07-19.json';

type RunRow = { questionId: string; raw: string; reasoning?: string; status: string };
type PromptRow = { id: string; system: string; user: string };

const sha256 = (target: string) => createHash('sha256').update(readFileSync(target)).digest('hex');
const readJsonl = (target: string) => new Map<string, RunRow>(
  readFileSync(target, 'utf8').trim().split('\n').map(line => {
    const row = JSON.parse(line) as RunRow;
    return [row.questionId, row];
  }),
);
const readPrompts = (target: string) => new Map<string, PromptRow>(
  (JSON.parse(readFileSync(target, 'utf8')) as PromptRow[]).map(row => [row.id, row]),
);
const groupOf = (id: string) => id.startsWith('L9-') ? 'L9'
  : id.startsWith('L10-') ? 'L10'
  : id.startsWith('AGI-') ? 'L11'
  : 'L1-L8';

const gateIds = readFileSync(GATE_FILE, 'utf8').trim().split('\n');
const base = readJsonl(BASE_FILE);
const candidate = readJsonl(CANDIDATE_FILE);
const promptA = readPrompts(PROMPT_A_FILE);
const promptB = readPrompts(PROMPT_B_FILE);
const questions = new Map(SCHEMA_QUESTIONS_300Q.map(question => [question.id, question]));

if (gateIds.length !== 175 || new Set(gateIds).size !== 175) throw new Error('gate must contain 175 unique IDs');

const items = gateIds.map(id => {
  const question = questions.get(id);
  const baseRow = base.get(id);
  const candidateRow = candidate.get(id);
  const a = promptA.get(id);
  const b = promptB.get(id);
  if (!question || !baseRow || !candidateRow || !a || !b) throw new Error(`missing evidence for ${id}`);
  if (baseRow.status !== 'ok' || candidateRow.status !== 'ok') throw new Error(`non-ok evidence for ${id}`);

  const rubric = loadRubric300q(question.rubric_id);
  const baseGrade = gradeSchemaResponse(baseRow.raw, question, rubric);
  const candidateGrade = gradeSchemaResponse(candidateRow.raw, question, rubric);
  const outcome = baseGrade.pass === candidateGrade.pass
    ? (baseGrade.pass ? 'both_pass' : 'both_fail')
    : (candidateGrade.pass ? 'candidate_only' : 'base_only');

  return {
    id,
    level: question.level,
    group: groupOf(id),
    rubricId: question.rubric_id,
    promptChanged: a.system !== b.system || a.user !== b.user,
    outcome,
    base: {
      pass: baseGrade.pass,
      score: baseGrade.score,
      parsingMethod: baseGrade.parsingMethod,
      failureReasons: baseGrade.failureReasons,
      fieldScores: baseGrade.fieldScores,
      normalizedResponse: baseGrade.normalizedResponse,
    },
    candidate: {
      pass: candidateGrade.pass,
      score: candidateGrade.score,
      parsingMethod: candidateGrade.parsingMethod,
      failureReasons: candidateGrade.failureReasons,
      fieldScores: candidateGrade.fieldScores,
      normalizedResponse: candidateGrade.normalizedResponse,
    },
    evidence: outcome === 'both_pass' || outcome === 'both_fail' ? undefined : {
      questionPrompt: question.prompt,
      context: question.context ?? null,
      expectedValues: question.expected_values,
      baseRaw: baseRow.raw,
      baseReasoning: baseRow.reasoning ?? '',
      candidateRaw: candidateRow.raw,
      candidateReasoning: candidateRow.reasoning ?? '',
    },
  };
});

const groups = ['L1-L8', 'L9', 'L10', 'L11'];
const summarize = (rows: typeof items) => Object.fromEntries(groups.map(group => {
  const groupRows = rows.filter(row => row.group === group);
  return [group, {
    n: groupRows.length,
    basePass: groupRows.filter(row => row.base.pass).length,
    candidatePass: groupRows.filter(row => row.candidate.pass).length,
    candidateOnly: groupRows.filter(row => row.outcome === 'candidate_only').map(row => row.id),
    baseOnly: groupRows.filter(row => row.outcome === 'base_only').map(row => row.id),
  }];
}));

const summary = summarize(items);
const basePass = items.filter(row => row.base.pass).length;
const candidatePass = items.filter(row => row.candidate.pass).length;
const schemaTargetItems = items.filter(row => row.group === 'L9' || row.group === 'L10');
const hasFailure = (reasons: string[], reason: string) => reasons.includes(reason);
const lacksExpectedValue = (response: unknown) => {
  if (!response || typeof response !== 'object') return true;
  return !Object.prototype.hasOwnProperty.call(response, 'expected_value');
};
const schemaMechanism = {
  baseMismatchFieldname: schemaTargetItems.filter(row => hasFailure(row.base.failureReasons, 'mismatch_fieldname')).map(row => row.id),
  candidateMismatchFieldname: schemaTargetItems.filter(row => hasFailure(row.candidate.failureReasons, 'mismatch_fieldname')).map(row => row.id),
  baseMissingExpectedValue: schemaTargetItems.filter(row => lacksExpectedValue(row.base.normalizedResponse)).map(row => row.id),
  candidateMissingExpectedValue: schemaTargetItems.filter(row => lacksExpectedValue(row.candidate.normalizedResponse)).map(row => row.id),
};
const rubricHashes = Object.fromEntries(
  [...new Set(items.map(row => row.rubricId))].sort().map(id => {
    const path = `src/rubrics/${id}.json`;
    return [id, { path, sha256: sha256(path) }];
  }),
);
if (basePass !== 143 || candidatePass !== 141) {
  throw new Error(`unexpected totals: base=${basePass}, candidate=${candidatePass}`);
}

writeFileSync(OUTPUT_FILE, `${JSON.stringify({
  analysisDate: '2026-07-19',
  inputs: {
    base: { path: BASE_FILE, sha256: sha256(BASE_FILE) },
    candidate: { path: CANDIDATE_FILE, sha256: sha256(CANDIDATE_FILE) },
    gate: { path: GATE_FILE, sha256: sha256(GATE_FILE) },
    promptA: { path: PROMPT_A_FILE, sha256: sha256(PROMPT_A_FILE) },
    promptB: { path: PROMPT_B_FILE, sha256: sha256(PROMPT_B_FILE) },
    grader: { path: GRADER_FILE, sha256: sha256(GRADER_FILE) },
    rubricLoader: { path: RUBRIC_LOADER_FILE, sha256: sha256(RUBRIC_LOADER_FILE) },
    questions: { path: QUESTIONS_FILE, sha256: sha256(QUESTIONS_FILE) },
    rubrics: rubricHashes,
  },
  totals: {
    n: items.length,
    basePass,
    candidatePass,
    candidateOnly: items.filter(row => row.outcome === 'candidate_only').map(row => row.id),
    baseOnly: items.filter(row => row.outcome === 'base_only').map(row => row.id),
  },
  groups: summary,
  schemaMechanism,
  items,
}, null, 2)}\n`);

console.log(`wrote ${OUTPUT_FILE}`);
console.log(JSON.stringify({ basePass, candidatePass, groups: summary }, null, 2));
