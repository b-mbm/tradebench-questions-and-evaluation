#!/usr/bin/env tsx
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { SCHEMA_QUESTIONS_300Q } from '../src/questions/schema-questions-300q';
import {
  COINBENCH_V1_EXACT_DUPLICATE_QUARANTINE_IDS,
  COINBENCH_V1_QUARANTINE_IDS,
  COINBENCH_V1_REPAIR_QUARANTINE_IDS,
} from '../src/questions/coinbench-quarantine-v1';
import { loadRubric300q } from '../src/rubrics/loader-300q';

type Json = Record<string, any>;

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'reports', 'coinbench', 'v1');
const QUESTIONS_PATH = path.join(ROOT, 'src', 'questions', 'schema-questions-300q.ts');
const GRADER_PATH = path.join(ROOT, 'src', 'grading', 'schema-grader-300q.ts');
const RUBRIC_DIR = path.join(ROOT, 'src', 'rubrics');
const CURRENT_MUTATION_DIR = path.join(ROOT, 'results', 'mutation-test-300q-current');
const LEGACY_MUTATION_DIR = path.join(ROOT, 'results', 'mutation-test-300q');
const MUTATION_SUMMARY_PATH = fs.existsSync(path.join(CURRENT_MUTATION_DIR, 'summary.json'))
  ? path.join(CURRENT_MUTATION_DIR, 'summary.json')
  : path.join(LEGACY_MUTATION_DIR, 'summary.json');
const MUTATION_ROWS_PATH = fs.existsSync(path.join(CURRENT_MUTATION_DIR, 'row-results.json'))
  ? path.join(CURRENT_MUTATION_DIR, 'row-results.json')
  : path.join(LEGACY_MUTATION_DIR, 'row-results.json');
const SPLIT_PATH = path.join(ROOT, 'results', 'grpo-preconditions', 'grpo-holdout-split.json');
const PROOF_PATH = path.join(OUT, 'independent-derivation-verification.json');
const BUNDLE_DIR = path.join(ROOT, 'reports', 'coinbench', 'frozen', 'v1.0.1');

function sha256(value: string | Buffer): string {
  return createHash('sha256').update(value).digest('hex');
}

function groupsBy<T>(rows: T[], key: (row: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const row of rows) {
    const value = key(row);
    groups.set(value, [...(groups.get(value) ?? []), row]);
  }
  return groups;
}

function normalizedPrompt(prompt: string): string {
  return prompt.trim().replace(/\s+/g, ' ');
}

function maskedPrompt(prompt: string): string {
  return normalizedPrompt(prompt)
    .toLowerCase()
    .replace(/0x[a-f0-9]+/g, '<address>')
    .replace(/\b\d+(?:[,.]\d+)*(?:%|x)?\b/g, '<number>');
}

function readJson(file: string): Json {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function csv(value: unknown): string {
  const text = Array.isArray(value) ? value.join('|') : String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

const questions = SCHEMA_QUESTIONS_300Q as Json[];
const ids = questions.map(question => String(question.id));
const executableQuestions = questions.filter(
  question => !COINBENCH_V1_QUARANTINE_IDS.has(String(question.id))
);
if (questions.length !== 300 || new Set(ids).size !== 300) {
  throw new Error(`CoinBench source invalid: ${questions.length} rows, ${new Set(ids).size} unique IDs`);
}

const exactGroups = [...groupsBy(questions, question => normalizedPrompt(String(question.prompt))).values()]
  .filter(group => group.length > 1);
const executableExactGroups = exactGroups.filter(group =>
  group.filter(question => !COINBENCH_V1_QUARANTINE_IDS.has(String(question.id))).length > 1
);
const maskedGroups = [...groupsBy(questions, question => maskedPrompt(String(question.prompt))).values()]
  .filter(group => group.length > 1);

// RED self-check: the duplicate detector must reject a planted duplicate family.
const planted = groupsBy([{ prompt: 'same' }, { prompt: 'same' }], row => row.prompt);
if (![...planted.values()].some(group => group.length > 1)) {
  throw new Error('Duplicate detector RED self-check failed');
}

const findsTrainingContamination = (trainIds: string[], evaluationIds: Set<string>): boolean =>
  trainIds.some(id => evaluationIds.has(id));
if (!findsTrainingContamination(['__PLANTED_EVAL_ID__'], new Set(['__PLANTED_EVAL_ID__']))) {
  throw new Error('Training-contamination RED self-check failed');
}

const exactPeers = new Map<string, string[]>();
for (const group of exactGroups) {
  const groupIds = group.map(question => String(question.id));
  for (const id of groupIds) exactPeers.set(id, groupIds.filter(peer => peer !== id));
}

const maskedPeers = new Map<string, string[]>();
for (const group of maskedGroups) {
  const groupIds = group.map(question => String(question.id));
  for (const id of groupIds) maskedPeers.set(id, groupIds.filter(peer => peer !== id));
}

const historicalMutationSummary = fs.existsSync(MUTATION_SUMMARY_PATH)
  ? readJson(MUTATION_SUMMARY_PATH)
  : null;
const historicalMutationRows = fs.existsSync(MUTATION_ROWS_PATH)
  ? new Map((readJson(MUTATION_ROWS_PATH) as any[]).map(row => [String(row.id), row]))
  : new Map<string, Json>();
const oldSplit = fs.existsSync(SPLIT_PATH) ? readJson(SPLIT_PATH) : null;
const splitIsRetired = oldSplit?.status === 'retired_eval_contamination';
const activeTrainIds = splitIsRetired ? [] : (oldSplit?.train?.ids ?? []).map(String);
const contaminatedTrainIds = new Set<string>(activeTrainIds.filter(id => ids.includes(id)));

const rubricIds = [...new Set(questions.map(question => String(question.rubric_id)))].sort();
const rubricFiles = rubricIds.map(id => path.join(RUBRIC_DIR, `${id}.json`));
const missingRubrics = rubricIds.filter((_, index) => !fs.existsSync(rubricFiles[index]));
if (missingRubrics.length) throw new Error(`Missing rubrics: ${missingRubrics.join(', ')}`);

const rubricHash = sha256(rubricFiles.map(file => fs.readFileSync(file)).join('\n'));
const currentQuestionsHash = sha256(fs.readFileSync(QUESTIONS_PATH));
const currentGraderHash = sha256(fs.readFileSync(GRADER_PATH));
const mutationEvidenceCurrent =
  historicalMutationSummary?.source?.questions_sha256 === currentQuestionsHash &&
  historicalMutationSummary?.source?.rubrics_sha256 === rubricHash &&
  historicalMutationSummary?.source?.grader_sha256 === currentGraderHash;
const proof = fs.existsSync(PROOF_PATH) ? readJson(PROOF_PATH) : null;
const proofEvidenceCurrent =
  proof?.source?.questions_sha256 === currentQuestionsHash &&
  proof?.source?.rubrics_sha256 === rubricHash &&
  proof?.source?.grader_sha256 === currentGraderHash;
const proofAllRowsPass =
  proofEvidenceCurrent &&
  proof?.expected === executableQuestions.length &&
  proof?.statusCounts?.PASS === executableQuestions.length &&
  Object.keys(proof?.statusCounts ?? {}).length === 1;
const bundleManifestPath = path.join(BUNDLE_DIR, 'manifest.json');
const bundle = fs.existsSync(bundleManifestPath) ? readJson(bundleManifestPath) : null;
const bundleHashesIntact = !!bundle && Array.isArray(bundle.files) && bundle.files.every((entry: Json) => {
  const file = path.join(BUNDLE_DIR, String(entry.path));
  return fs.existsSync(file) && sha256(fs.readFileSync(file)) === entry.sha256;
});
const bundleEvidenceCurrent =
  bundleHashesIntact &&
  bundle?.source?.questions_sha256 === currentQuestionsHash &&
  bundle?.source?.rubrics_sha256 === rubricHash &&
  bundle?.source?.grader_sha256 === currentGraderHash;
const rows = questions.map(question => {
  const id = String(question.id);
  const rubric = loadRubric300q(String(question.rubric_id)) as Json;
  const historical = historicalMutationRows.get(id);
  const exactDuplicateQuarantined = COINBENCH_V1_EXACT_DUPLICATE_QUARANTINE_IDS.has(id);
  const repairQuarantined = COINBENCH_V1_REPAIR_QUARANTINE_IDS.has(id);
  const blockers = [
    exactDuplicateQuarantined ? 'exact_duplicate_quarantined' : null,
    repairQuarantined ? 'specification_or_grader_repair_quarantined' : null,
    contaminatedTrainIds.has(id) ? 'evaluation_row_in_old_training_split' : null,
    proofAllRowsPass ? null : 'solvability_unreviewed',
    proofAllRowsPass ? null : 'uniqueness_unreviewed',
    'difficulty_unreviewed',
    'current_grader_mutation_unproven',
  ].filter(Boolean);

  return {
    question_id: id,
    tier: id.startsWith('AGI') ? 'AGI' : `L${question.level}`,
    rubric_id: question.rubric_id,
    prompt_sha256: sha256(normalizedPrompt(String(question.prompt))),
    exact_duplicate_peers: exactPeers.get(id) ?? [],
    executable_candidate: !COINBENCH_V1_QUARANTINE_IDS.has(id),
    masked_similarity_peers: maskedPeers.get(id) ?? [],
    expected_values_present: Object.keys(question.expected_values ?? {}).length > 0,
    canonical_validation_fields: Object.keys(rubric._agi_canonical?.validation ?? {}),
    old_training_split_contamination: contaminatedTrainIds.has(id),
    historical_mutation: historical ? {
      status: mutationEvidenceCurrent ? 'current' : 'stale_current_grader_changed',
      covered: historical.covered,
      canonical_pass: historical.canonicalPass,
      true_leaks: historical.trueLeaks ?? [],
      threshold_leaks: historical.thresholdLeaks ?? [],
    } : { status: 'missing' },
    solvable: proofAllRowsPass ? 'independently_derived_from_prompt' : 'unreviewed',
    unique_answer: proofAllRowsPass ? 'independent_derivation_no_blocker' : 'unreviewed',
    canonical_correct: proofAllRowsPass ? 'independent_derivation_passes_current_grader' : 'unreviewed',
    grader_fair: proofAllRowsPass ? 'semantic_mutation_suite_current' : 'unreviewed',
    temporal_integrity: 'unreviewed',
    difficulty: 'unreviewed',
    blockers,
    disposition: 'quarantine',
  };
});

const lockReadiness = {
  benchmark: 'CoinBench',
  candidate_version: 'v1',
  source: {
    questions_sha256: currentQuestionsHash,
    rubrics_sha256: rubricHash,
    grader_sha256: currentGraderHash,
  },
  counts: {
    source_questions: questions.length,
    executable_candidate_questions: executableQuestions.length,
    quarantined_exact_duplicate_rows: COINBENCH_V1_EXACT_DUPLICATE_QUARANTINE_IDS.size,
    quarantined_repair_rows: COINBENCH_V1_REPAIR_QUARANTINE_IDS.size,
    unique_ids: new Set(ids).size,
    referenced_rubrics: rubricIds.length,
    missing_rubrics: missingRubrics.length,
    exact_duplicate_groups: exactGroups.length,
    exact_duplicate_rows: exactPeers.size,
    executable_exact_duplicate_groups: executableExactGroups.length,
    masked_similarity_groups: maskedGroups.length,
    old_training_split_contamination_rows: contaminatedTrainIds.size,
  },
  historical_mutation_evidence: historicalMutationSummary ? {
    status: mutationEvidenceCurrent ? 'current' : 'stale_current_grader_changed',
    covered: historicalMutationSummary.covered,
    rows_with_true_leaks: historicalMutationSummary.rowsWithTrueLeaks,
    rows_with_threshold_leaks: historicalMutationSummary.rowsWithThresholdLeaks,
  } : { status: 'missing' },
  independent_prompt_proofs: proof ? {
    status: proofAllRowsPass ? 'current_all_pass' : 'missing_or_stale_or_incomplete',
    expected: proof.expected,
    received: proof.received,
    status_counts: proof.statusCounts,
  } : { status: 'missing' },
  content_addressed_bundle: bundle ? {
    status: bundleEvidenceCurrent ? 'current_hashes_intact' : 'stale_or_hash_mismatch',
    version: bundle.version,
    files: bundle.files.length,
  } : { status: 'missing' },
  gates: {
    source_cardinality: 'PASS',
    rubric_join: 'PASS',
    exact_duplicates: executableExactGroups.length === 0 ? 'PASS' : 'FAIL',
    training_contamination: contaminatedTrainIds.size === 0 ? 'PASS' : 'FAIL',
    all_row_solvability: proofAllRowsPass ? 'PASS' : 'UNKNOWN',
    all_row_uniqueness: proofAllRowsPass ? 'PASS' : 'UNKNOWN',
    current_grader_mutation_robustness:
      mutationEvidenceCurrent && historicalMutationSummary.gate === 'PASS' ? 'PASS' : 'UNKNOWN',
    difficulty_calibration: 'UNKNOWN',
    immutable_bundle: bundleEvidenceCurrent ? 'PASS' : 'FAIL',
  },
  lock_ready: false,
};

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'question-audit.jsonl'), `${rows.map(row => JSON.stringify(row)).join('\n')}\n`);
fs.writeFileSync(
  path.join(OUT, 'duplicate-candidates.csv'),
  ['kind,question_ids',
    ...exactGroups.map(group => ['exact', group.map(question => question.id)].map(csv).join(',')),
    ...maskedGroups.map(group => ['masked_candidate', group.map(question => question.id)].map(csv).join(',')),
  ].join('\n') + '\n',
);
fs.writeFileSync(path.join(OUT, 'lock-readiness.json'), `${JSON.stringify(lockReadiness, null, 2)}\n`);

console.log(JSON.stringify(lockReadiness, null, 2));
