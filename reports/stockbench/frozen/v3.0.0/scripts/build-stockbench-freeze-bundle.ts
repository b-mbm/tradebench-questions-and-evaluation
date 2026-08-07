#!/usr/bin/env tsx

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { STOCKBENCH_QUESTIONS_300Q } from '../src/questions/stockbench-questions-300q';

const ROOT = process.cwd();
const VERSION = 'v3.0.0';
const OUT = path.join(ROOT, 'reports', 'stockbench', 'frozen', VERSION);
const sha256 = (file: string) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const rubricContentHash = (rubricIds: string[]): string => {
  const bytes = rubricIds.flatMap((id, index) =>
    index
      ? [Buffer.from('\n'), fs.readFileSync(path.join(ROOT, 'src', 'rubrics', `${id}.json`))]
      : [fs.readFileSync(path.join(ROOT, 'src', 'rubrics', `${id}.json`))]
  );
  return createHash('sha256').update(Buffer.concat(bytes)).digest('hex');
};
const relative = (file: string) => path.relative(ROOT, file);
const treeFiles = (directory: string): string[] => fs.readdirSync(directory, { recursive: true })
  .filter((entry): entry is string => typeof entry === 'string')
  .map(entry => path.join(directory, entry))
  .filter(file => fs.statSync(file).isFile());

if (fs.existsSync(OUT)) throw new Error(`Refusing to overwrite existing bundle: ${OUT}`);

const questions = STOCKBENCH_QUESTIONS_300Q as any[];
const expectedDistribution = { L1: 3, L2: 4, L3: 3, L4: 5, L5: 5, L6: 5, L7: 5, L8: 10, L9: 81, L10: 69, AGI: 110 };
const distribution: Record<string, number> = {};
for (const question of questions) {
  const tier = String(question.context?.stockbench?.tier ?? (question.level === 11 ? 'AGI' : `L${question.level}`));
  distribution[tier] = (distribution[tier] ?? 0) + 1;
}
const distributionMatches = Object.entries(expectedDistribution).every(([tier, count]) => distribution[tier] === count)
  && Object.keys(distribution).length === Object.keys(expectedDistribution).length;
if (questions.length !== 300 || !distributionMatches) {
  throw new Error(`Unexpected StockBench corpus: rows=${questions.length} distribution=${JSON.stringify(distribution)}`);
}

const proofRoots = ['docs/reverse-derivation/results', 'docs/reverse-derivation/codex-results']
  .map(directory => path.join(ROOT, directory));
for (const directory of proofRoots) {
  const count = fs.readdirSync(directory).filter(file => file.endsWith('.json')).length;
  if (count !== 300) throw new Error(`Expected 300 independent proof files in ${directory}; got ${count}`);
}

const rubricIds = [...new Set(questions.map(question => String(question.rubric_id)))].sort();
const files = [
  'src/questions/stockbench-questions-300q.ts',
  'src/grading/schema-grader-300q.ts',
  'src/prompts/schema-prompts-300q.ts',
  'scripts/run-300q.ts',
  'scripts/stockbench-quality-gate.ts',
  'scripts/mutation-test-stockbench.ts',
  'scripts/verify-stockbench-decision-categorical.ts',
  'scripts/prove-stockbench-solvability.ts',
  'scripts/build-stockbench-freeze-bundle.ts',
  'docs/stockbench-300q-FREEZE.md',
  'docs/stockbench-solvability-proofs.jsonl',
  'docs/stockbench-solvability-proofs.csv',
  'docs/stockbench-solvability-proof-summary.md',
  'docs/reverse-derivation/LEDGER.csv',
  'docs/reverse-derivation/AUDIT-SUMMARY.md',
  'Internal_docs/STOCKBENCH-V3-FREEZE-PLAN-2026-08-06.md',
  'reports/stockbench/v3/v3-provenance-ledger-2026-08-06.md',
  'reports/stockbench/v3/fable-pre-audit-2026-08-06.md',
  ...treeFiles(path.join(ROOT, 'docs/reverse-derivation/results')).map(relative),
  ...treeFiles(path.join(ROOT, 'docs/reverse-derivation/codex-results')).map(relative),
  ...rubricIds.map(id => path.join('src', 'rubrics', `${id}.json`)),
].map(file => path.join(ROOT, file));

fs.mkdirSync(OUT, { recursive: true });
const entries = files.map(file => {
  if (!fs.existsSync(file)) throw new Error(`Bundle input missing: ${file}`);
  const destination = path.join(OUT, relative(file));
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(file, destination);
  return { path: relative(file), sha256: sha256(file) };
}).sort((a, b) => a.path.localeCompare(b.path));

const difficulty = {
  distribution,
  claim: 'Frozen label distribution only; not a psychometric calibration claim.',
};
fs.writeFileSync(path.join(OUT, 'difficulty-distribution.json'), `${JSON.stringify(difficulty, null, 2)}\n`);
entries.push({ path: 'difficulty-distribution.json', sha256: sha256(path.join(OUT, 'difficulty-distribution.json')) });
entries.sort((a, b) => a.path.localeCompare(b.path));

const manifest = {
  benchmark: 'StockBench',
  version: VERSION,
  status: 'content-addressed_release_candidate_pending_fable_and_council_terminus',
  source: {
    questions_sha256: sha256(path.join(ROOT, 'src/questions/stockbench-questions-300q.ts')),
    grader_sha256: sha256(path.join(ROOT, 'src/grading/schema-grader-300q.ts')),
    runner_sha256: sha256(path.join(ROOT, 'scripts/run-300q.ts')),
    parallel_runner_sha256: sha256(path.join(ROOT, 'scripts/parallel-runner.ts')),
    prompt_builder_sha256: sha256(path.join(ROOT, 'src/prompts/schema-prompts-300q.ts')),
    rubrics_sha256: rubricContentHash(rubricIds),
  },
  runner_roles: {
    runner_sha256: 'run-300q.ts — bundle-canonical single-model runner',
    parallel_runner_sha256: 'parallel-runner.ts — production panel-execution runner (--suite stockbench)',
  },
  difficulty,
  files: entries,
};
fs.writeFileSync(path.join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(OUT, 'SHA256SUMS'), `${entries.map(entry => `${entry.sha256}  ${entry.path}`).join('\n')}\n`);
console.log(JSON.stringify({ out: OUT, files: entries.length, source: manifest.source, difficulty }, null, 2));
