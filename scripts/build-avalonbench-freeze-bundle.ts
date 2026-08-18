#!/usr/bin/env tsx

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { AVALONBENCH_QUESTIONS_100Q } from '../src/questions/avalonbench-questions-100q';

const ROOT = process.cwd();
const AIX_ROOT = process.env.AIX_ROOT ?? path.resolve(ROOT, '../aix');
const VERSION = 'v0.1.0';
const OUT = path.join(ROOT, 'reports', 'avalonbench', 'frozen', VERSION);
const VERIFICATION_RECEIPT = path.join(ROOT, 'reports', 'avalonbench', 'v0.1.0-verification.txt');
const REFERENCE_ROOT = path.join(ROOT, 'results', 'avalonbench', 'v0.1-qwen36-27b-20260818', 'canonical');
const SYSTEM = 'You are Avalon 1 under evaluation. Use only the frozen episode. Return exactly one JSON object with every required field. Do not include prose outside JSON.';
const sha256 = (file: string) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const relative = (file: string) => path.relative(ROOT, file);

if (fs.existsSync(OUT)) throw new Error(`Refusing to overwrite frozen bundle: ${OUT}`);
if (!fs.existsSync(AIX_ROOT)) throw new Error(`AIX source root missing: ${AIX_ROOT}`);

const questions = AVALONBENCH_QUESTIONS_100Q;
const expectedFamilies = { intent: 10, research: 15, strategy: 15, tools: 10, backtest: 15, agent: 10, execution: 15, recovery: 10 };
const expectedDifficulty = { L7: 11, L8: 27, L9: 35, L10: 23, AGI: 4 };
const count = (key: 'family' | 'tier') => Object.fromEntries(
  [...new Set(questions.map(question => question[key]))].map(value => [value, questions.filter(question => question[key] === value).length]),
);
const families = count('family');
const difficulty = count('tier');
if (questions.length !== 100 || JSON.stringify(families) !== JSON.stringify(expectedFamilies) || JSON.stringify(difficulty) !== JSON.stringify(expectedDifficulty)) {
  throw new Error(`Unexpected corpus: rows=${questions.length} families=${JSON.stringify(families)} difficulty=${JSON.stringify(difficulty)}`);
}

const prompts = questions.map(question => ({
  id: question.id,
  level: question.level,
  rubric_id: 'avalonbench-v0.1',
  system: SYSTEM,
  user: question.prompt,
}));
const referencePrompts = JSON.parse(fs.readFileSync(path.join(REFERENCE_ROOT, 'prompts.json'), 'utf8'));
if (JSON.stringify(prompts) !== JSON.stringify(referencePrompts)) throw new Error('Current prompt packet differs from the retained reference run');

const sourceContracts = [...new Set(questions.flatMap(question => question.sourceContracts))].sort();
const sourceContractHashes = sourceContracts.map(contract => {
  const file = path.join(AIX_ROOT, contract);
  if (!fs.existsSync(file)) throw new Error(`Source contract missing: ${contract}`);
  return { path: contract, sha256: sha256(file) };
});

if (!fs.existsSync(VERIFICATION_RECEIPT) || !fs.readFileSync(VERIFICATION_RECEIPT, 'utf8').includes('GATE: PASS')) {
  throw new Error(`Passing verification receipt missing: ${VERIFICATION_RECEIPT}`);
}

const source = {
  questions_sha256: sha256(path.join(ROOT, 'src/questions/avalonbench-questions-100q.ts')),
  grader_sha256: sha256(path.join(ROOT, 'src/grading/avalonbench-grader.ts')),
  verifier_sha256: sha256(path.join(ROOT, 'scripts/verify-avalonbench.ts')),
  grade_runner_sha256: sha256(path.join(ROOT, 'scripts/grade-avalonbench-run.ts')),
  hosted_runner_sha256: sha256(path.join(ROOT, 'scripts/openrouter-runner.py')),
};
const promptHash = createHash('sha256').update(`${JSON.stringify(prompts, null, 2)}\n`).digest('hex');
const referenceReport = JSON.parse(fs.readFileSync(path.join(REFERENCE_ROOT, 'report.json'), 'utf8'));
if (
  referenceReport.hashes.questions !== source.questions_sha256
  || referenceReport.hashes.grader !== source.grader_sha256
  || referenceReport.hashes.generator !== source.hosted_runner_sha256
  || referenceReport.hashes.prompts !== promptHash
  || referenceReport.summary.expected !== 100
  || referenceReport.summary.scored !== 100
  || referenceReport.summary.transportUnscored !== 0
  || referenceReport.summary.passed !== 82
) throw new Error('Reference report does not match the current frozen sources and expected complete baseline');

const inputs = [
  'src/questions/avalonbench-questions-100q.ts',
  'src/grading/avalonbench-grader.ts',
  'scripts/verify-avalonbench.ts',
  'scripts/grade-avalonbench-run.ts',
  'scripts/openrouter-runner.py',
  'scripts/build-avalonbench-freeze-bundle.ts',
  'Internal_docs/AVALONBENCH-AND-LEARNING-LOOP-SPEC-v0.1.md',
  'docs/avalonbench-v0.1-FREEZE.md',
  relative(VERIFICATION_RECEIPT),
  relative(path.join(REFERENCE_ROOT, 'generations.jsonl')),
  relative(path.join(REFERENCE_ROOT, 'report.json')),
  relative(path.join(REFERENCE_ROOT, 'failure-map.json')),
].map(file => path.join(ROOT, file));

fs.mkdirSync(OUT, { recursive: true });
const entries = inputs.map(file => {
  if (!fs.existsSync(file)) throw new Error(`Bundle input missing: ${file}`);
  const destination = path.join(OUT, relative(file));
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(file, destination);
  return { path: relative(file), sha256: sha256(file) };
});

const generated = {
  'prompts.json': prompts,
  'difficulty-distribution.json': {
    distribution: difficulty,
    claim: 'Frozen author labels only; not a psychometric calibration claim.',
  },
  'source-contract-hashes.json': {
    source_root_label: 'proprietary Avalon implementation; source files are not redistributed in this bundle',
    files: sourceContractHashes,
  },
};
for (const [name, value] of Object.entries(generated)) {
  const file = path.join(OUT, name);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
  entries.push({ path: name, sha256: sha256(file) });
}
entries.sort((left, right) => left.path.localeCompare(right.path));

const manifest = {
  benchmark: 'AvalonBench',
  version: VERSION,
  frozen_at: '2026-08-18',
  status: 'content_addressed_frozen_static_release_independent_implementation_audit_pending',
  scope: 'synthetic_product_contract_development_and_cross_model_suite',
  scoring: { primary: 'strict_binary_pass_at_1', tasks: 100, partial_credit: false },
  purposes: [
    'Avalon champion-versus-candidate regression under an identical harness',
    'Avalon-versus-other-model comparison under an identical Avalon scaffold',
  ],
  cross_model_rule: 'Use byte-identical prompts, system scaffold, runner settings, and grader. Require 100 scoreable responses before ranking. Report exact model, provider, endpoint, cost, latency, and transport completeness.',
  limitations: [
    'Not a complete live Avalon product journey benchmark',
    'Not evidence of profitable trading or general trading intelligence',
    'Inspected during failure mapping, so post-training gains are not untouched generalization evidence',
  ],
  source,
  prompt_sha256: promptHash,
  difficulty: generated['difficulty-distribution.json'],
  source_contracts: { count: sourceContractHashes.length, manifest_sha256: createHash('sha256').update(`${JSON.stringify(generated['source-contract-hashes.json'], null, 2)}\n`).digest('hex') },
  reference_run: {
    model: 'qwen/qwen3.6-27b',
    serving: 'OpenRouter hosted base-model reference; not the complete Avalon product',
    passed: 82,
    total: 100,
    report_sha256: sha256(path.join(REFERENCE_ROOT, 'report.json')),
  },
  audit: {
    deterministic_gate: 'PASS',
    specification_review: 'Claude Code CLEAN ACCEPT retained in the specification',
    independent_executable_implementation_review: 'PENDING',
  },
  files: entries,
};
const manifestFile = path.join(OUT, 'manifest.json');
fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
const checksummed = [...entries, { path: 'manifest.json', sha256: sha256(manifestFile) }].sort((left, right) => left.path.localeCompare(right.path));
fs.writeFileSync(path.join(OUT, 'SHA256SUMS'), `${checksummed.map(entry => `${entry.sha256}  ${entry.path}`).join('\n')}\n`);

console.log(JSON.stringify({ out: OUT, files: checksummed.length, source, prompt_sha256: promptHash, difficulty, families, reference: '82/100' }, null, 2));
