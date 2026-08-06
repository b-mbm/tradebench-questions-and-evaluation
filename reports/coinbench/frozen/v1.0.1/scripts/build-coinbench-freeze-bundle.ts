#!/usr/bin/env tsx

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { SCHEMA_QUESTIONS_300Q } from '../src/questions/schema-questions-300q';

const ROOT = process.cwd();
const VERSION = 'v1.0.1';
const OUT = path.join(ROOT, 'reports', 'coinbench', 'frozen', VERSION);
const sha256 = (file: string) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const relative = (file: string) => path.relative(ROOT, file);

if (fs.existsSync(OUT)) throw new Error(`Refusing to overwrite existing bundle: ${OUT}`);

const questions = SCHEMA_QUESTIONS_300Q as any[];
const expectedDistribution = { L1: 3, L2: 4, L3: 3, L4: 5, L5: 5, L6: 5, L7: 5, L8: 10, L9: 81, L10: 69, AGI: 110 };
const distribution: Record<string, number> = {};
for (const question of questions) {
  const tier = String(question.id).startsWith('AGI') ? 'AGI' : `L${question.level}`;
  distribution[tier] = (distribution[tier] ?? 0) + 1;
}
if (JSON.stringify(distribution) !== JSON.stringify(expectedDistribution)) {
  throw new Error(`Unexpected frozen difficulty distribution: ${JSON.stringify(distribution)}`);
}
if (questions.filter(question => String(question.id).startsWith('AGI')).some(question => question.level !== 11)) {
  throw new Error('An AGI row is no longer level 11');
}

const auditPath = path.join(ROOT, 'reports', 'coinbench', 'v1', 'lock-readiness.json');
const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
for (const gate of ['source_cardinality', 'rubric_join', 'exact_duplicates', 'training_contamination', 'all_row_solvability', 'all_row_uniqueness', 'current_grader_mutation_robustness']) {
  if (audit.gates[gate] !== 'PASS') throw new Error(`Cannot bundle: ${gate} is ${audit.gates[gate]}`);
}

const rubricIds = [...new Set(questions.map(question => String(question.rubric_id)))].sort();
const files = [
  'src/questions/schema-questions-300q.ts',
  'src/questions/coinbench-quarantine-v1.ts',
  'src/grading/schema-grader-300q.ts',
  'scripts/mutation-test-300q.ts',
  'scripts/verify-coinbench-independent-derivations.ts',
  'scripts/build-coinbench-repair-canonical-fixture.ts',
  'scripts/audit-coinbench-v1.ts',
  'scripts/build-coinbench-freeze-bundle.ts',
  'scripts/parallel-runner.ts',
  'scripts/audit-coinbench-difficulty-calibration.ts',
  'reports/coinbench/v1/independent-derivation-verification.json',
  'reports/coinbench/v1/repair-canonical-fixture.jsonl',
  'reports/coinbench/v1/l10-008-repair-2026-08-06.md',
  'results/mutation-test-300q-current/summary.json',
  'results/mutation-test-300q-current/row-results.json',
  'results/coinbench/calibration/v1.0.1-l10-008-repair-panel-2026-08-06/run-manifest.json',
  'results/coinbench/calibration/v1.0.1-l10-008-repair-panel-2026-08-06/run-attempts.jsonl',
  'results/coinbench/calibration/v1.0.1-l10-008-repair-panel-2026-08-06/generations.jsonl',
  'results/coinbench/calibration/v1.0.1-l10-008-repair-panel-2026-08-06/scores.jsonl',
  'results/coinbench/calibration/v1.0.1-l10-008-repair-panel-2026-08-06/summary.csv',
  'reports/coinbench/v1/lock-readiness.json',
  ...fs.readdirSync(path.join(ROOT, 'reports', 'coinbench', 'v1')).filter(file => /^independent-derivations-.*\.jsonl$/.test(file)).sort().map(file => path.join('reports', 'coinbench', 'v1', file)),
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
  agi_level: 11,
  agi_rows: distribution.AGI,
  claim: 'Frozen label distribution and AGI-level preservation; not a psychometric calibration claim.',
};
fs.writeFileSync(path.join(OUT, 'difficulty-distribution.json'), `${JSON.stringify(difficulty, null, 2)}\n`);
entries.push({ path: 'difficulty-distribution.json', sha256: sha256(path.join(OUT, 'difficulty-distribution.json')) });
entries.sort((a, b) => a.path.localeCompare(b.path));
const manifest = {
  benchmark: 'CoinBench',
  version: VERSION,
  status: 'content-addressed_frozen_static_release_difficulty_unclaimed',
  source: audit.source,
  difficulty,
  files: entries,
};
fs.writeFileSync(path.join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(path.join(OUT, 'SHA256SUMS'), `${entries.map(entry => `${entry.sha256}  ${entry.path}`).join('\n')}\n`);
console.log(JSON.stringify({ out: OUT, files: entries.length, source: audit.source, difficulty }, null, 2));
