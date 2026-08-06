#!/usr/bin/env tsx

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { SCHEMA_QUESTIONS_300Q } from '../src/questions/schema-questions-300q';
import { gradeSchemaResponse } from '../src/grading/schema-grader-300q';
import { loadRubric300q } from '../src/rubrics/loader-300q';

type Proof = { question_id: string; answer?: unknown; derivation?: string; status?: string; reason?: string };
const ROOT = process.cwd();
const QUESTIONS_PATH = path.join(ROOT, 'src', 'questions', 'schema-questions-300q.ts');
const GRADER_PATH = path.join(ROOT, 'src', 'grading', 'schema-grader-300q.ts');
const questions = new Map((SCHEMA_QUESTIONS_300Q as any[]).map(question => [question.id, question]));
const proofDir = path.join(ROOT, 'reports', 'coinbench', 'v1');
const paths = fs.readdirSync(proofDir)
  .filter(file => /^independent-derivations-[A-Za-z0-9_-]+\.jsonl$/.test(file))
  .sort()
  .map(file => path.join(proofDir, file));
const expected = new Set(questions.keys());
const proofs: Proof[] = paths.flatMap(file => fs.existsSync(file)
  ? fs.readFileSync(file, 'utf8').split(/\n+/).filter(Boolean).map(line => JSON.parse(line))
  : []);
const byId = new Map(proofs.map(proof => [proof.question_id, proof]));
const results = [...expected].sort().map(id => {
  const proof = byId.get(id);
  const question = questions.get(id);
  if (!proof || !question) return { question_id: id, status: 'MISSING' };
  if (proof.status === 'BLOCKED' || !proof.answer || !proof.derivation) return { question_id: id, status: 'BLOCKED', reason: proof.reason ?? 'missing answer/derivation' };
  const grade = gradeSchemaResponse(JSON.stringify(proof.answer), question, loadRubric300q(question.rubric_id));
  return {
    question_id: id,
    status: grade.pass ? 'PASS' : 'GRADE_FAIL',
    score: grade.score,
    reasons: grade.failureReasons,
    derivation_sha256: createHash('sha256').update(proof.derivation).digest('hex'),
  };
});
const statusCounts = Object.fromEntries([...new Set(results.map(row => row.status))].map(status => [status, results.filter(row => row.status === status).length]));
const rubricIds = [...new Set([...questions.values()].map(question => String(question.rubric_id)))].sort();
const source = {
  questions_sha256: createHash('sha256').update(fs.readFileSync(QUESTIONS_PATH)).digest('hex'),
  rubrics_sha256: createHash('sha256').update(
    rubricIds.map(id => fs.readFileSync(path.join(ROOT, 'src', 'rubrics', `${id}.json`))).join('\n')
  ).digest('hex'),
  grader_sha256: createHash('sha256').update(fs.readFileSync(GRADER_PATH)).digest('hex'),
};
const out = path.join(ROOT, 'reports', 'coinbench', 'v1', 'independent-derivation-verification.json');
fs.writeFileSync(out, `${JSON.stringify({ expected: expected.size, received: proofs.length, source, statusCounts, results }, null, 2)}\n`);
console.log(JSON.stringify({ expected: expected.size, received: proofs.length, source, statusCounts, out }, null, 2));
if (results.some(row => row.status !== 'PASS')) process.exitCode = 1;
