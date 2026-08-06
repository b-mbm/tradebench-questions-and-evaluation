#!/usr/bin/env tsx

/** Builds mutation inputs only from independent prompt-only derivation records. */
import fs from 'node:fs';
import path from 'node:path';
import { SCHEMA_QUESTIONS_300Q } from '../src/questions/schema-questions-300q';
import { loadRubric300q } from '../src/rubrics/loader-300q';
import { gradeSchemaResponse } from '../src/grading/schema-grader-300q';

type Proof = { question_id: string; answer?: unknown; derivation?: string; status?: string };
const ROOT = process.cwd();
const proofDir = path.join(ROOT, 'reports', 'coinbench', 'v1');
const proofFiles = fs.readdirSync(proofDir)
  .filter(file => /^independent-derivations-[A-Za-z0-9_-]+\.jsonl$/.test(file))
  .sort()
  .map(file => path.join(proofDir, file));
const proofs = new Map<string, Proof>();
for (const file of proofFiles) {
  for (const line of fs.readFileSync(file, 'utf8').split(/\n+/).filter(Boolean)) {
    const proof = JSON.parse(line) as Proof;
    proofs.set(proof.question_id, proof); // later corrected records supersede earlier blocked records
  }
}

const rows: string[] = [];
for (const question of SCHEMA_QUESTIONS_300Q as any[]) {
  const proof = proofs.get(question.id);
  if (!proof) continue;
  if (proof.status === 'BLOCKED' || !proof.answer || !proof.derivation) {
    throw new Error(`Independent derivation missing or blocked for ${question.id}`);
  }
  const grade = gradeSchemaResponse(JSON.stringify(proof.answer), question, loadRubric300q(question.rubric_id));
  if (!grade.pass) throw new Error(`Independent derivation does not pass ${question.id}: ${grade.failureReasons.join(',')}`);
  rows.push(JSON.stringify({
    question_id: question.id,
    evidence: 'independent_prompt_derivation',
    derivation: proof.derivation,
    answer: grade.normalizedResponse,
  }));
}

if (rows.length !== proofs.size) throw new Error(`Expected ${proofs.size} proof rows; built ${rows.length}`);
const out = path.join(ROOT, 'reports', 'coinbench', 'v1', 'repair-canonical-fixture.jsonl');
fs.writeFileSync(out, `${rows.join('\n')}\n`);
console.log(JSON.stringify({ rows: rows.length, out }, null, 2));
