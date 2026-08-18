#!/usr/bin/env tsx

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { gradeAvalonBenchResponse } from '../src/grading/avalonbench-grader';
import { AVALONBENCH_QUESTIONS_100Q } from '../src/questions/avalonbench-questions-100q';

type Generation = {
  model: string;
  questionId: string;
  status: string;
  raw?: string;
  provider?: string;
  durationMs?: number;
  error?: string;
};

const input = process.argv[2];
if (!input) throw new Error('Usage: tsx scripts/grade-avalonbench-run.ts <generations.jsonl> [report.json]');

const rows = fs.readFileSync(input, 'utf8').trim().split('\n').filter(Boolean).map(line => JSON.parse(line) as Generation);
const latest = new Map<string, Generation>();
for (const row of rows) latest.set(`${row.model}:${row.questionId}`, row);

const evaluations = [...latest.values()].map(row => {
  const question = AVALONBENCH_QUESTIONS_100Q.find(candidate => candidate.id === row.questionId);
  if (!question) throw new Error(`Unknown AvalonBench question ${row.questionId}`);
  const scored = row.status === 'ok' && !!row.raw?.trim();
  return {
    ...row,
    tier: question.tier,
    family: question.family,
    scored,
    grade: scored ? gradeAvalonBenchResponse(row.raw!, question) : null,
  };
});

const scored = evaluations.filter(row => row.scored);
const passed = scored.filter(row => row.grade?.pass);
const group = (key: 'tier' | 'family') => Object.fromEntries(
  [...new Set(evaluations.map(row => row[key]))].sort().map(value => {
    const members = evaluations.filter(row => row[key] === value);
    const membersScored = members.filter(row => row.scored);
    const membersPassed = membersScored.filter(row => row.grade?.pass).length;
    return [value, {
      total: members.length,
      scored: membersScored.length,
      passed: membersPassed,
      passRate: membersScored.length ? membersPassed / membersScored.length : null,
    }];
  }),
);

const hash = (file: string) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const report = {
  generatedAt: new Date().toISOString(),
  source: path.resolve(input),
  hashes: {
    questions: hash(path.join(process.cwd(), 'src/questions/avalonbench-questions-100q.ts')),
    grader: hash(path.join(process.cwd(), 'src/grading/avalonbench-grader.ts')),
    generator: hash(path.join(process.cwd(), 'scripts/openrouter-runner.py')),
    prompts: fs.existsSync(path.join(path.dirname(input), 'prompts.json'))
      ? hash(path.join(path.dirname(input), 'prompts.json'))
      : null,
  },
  summary: {
    expected: AVALONBENCH_QUESTIONS_100Q.length,
    received: evaluations.length,
    scored: scored.length,
    transportUnscored: evaluations.length - scored.length,
    passed: passed.length,
    failed: scored.length - passed.length,
    passRate: scored.length ? passed.length / scored.length : null,
  },
  byTier: group('tier'),
  byFamily: group('family'),
  evaluations,
};

const output = process.argv[3] ?? path.join(path.dirname(input), 'report.json');
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ output: path.resolve(output), ...report.summary, byTier: report.byTier, byFamily: report.byFamily }, null, 2));
