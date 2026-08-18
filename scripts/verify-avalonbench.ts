#!/usr/bin/env tsx

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { gradeAvalonBenchResponse } from '../src/grading/avalonbench-grader';
import { AVALONBENCH_QUESTIONS_100Q, type AvalonBenchQuestion, type JsonValue } from '../src/questions/avalonbench-questions-100q';

const AIX_ROOT = process.env.AIX_ROOT ?? path.resolve(process.cwd(), '../aix');
const failures: string[] = [];
const fail = (message: string) => failures.push(message);

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function at(object: Record<string, JsonValue>, field: string): JsonValue | undefined {
  let value: JsonValue | undefined = object;
  for (const part of field.split('.')) {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return undefined;
    value = value[part];
  }
  return value;
}

function setAt(object: Record<string, JsonValue>, field: string, next: JsonValue): void {
  const parts = field.split('.');
  let current: Record<string, JsonValue> = object;
  for (const part of parts.slice(0, -1)) {
    const value = current[part];
    if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Invalid path ${field}`);
    current = value;
  }
  current[parts.at(-1)!] = next;
}

function mutant(value: JsonValue): JsonValue {
  if (typeof value === 'number') return value + 1_000_003;
  if (typeof value === 'string') return '__construct_relevant_wrong_value__';
  if (typeof value === 'boolean') return !value;
  if (value === null) return '__not_null__';
  if (Array.isArray(value)) return value.length ? value.slice(1) : ['__unexpected_item__'];
  return { __wrong__: true };
}

function expectedIds(): string[] {
  const groups: Array<[string, number]> = [['A', 10], ['B', 15], ['C', 15], ['D', 10], ['E', 15], ['F', 10], ['G', 15], ['H', 10]];
  return groups.flatMap(([group, count]) => Array.from({ length: count }, (_, index) => `AVB-${group}${String(index + 1).padStart(2, '0')}`));
}

function skeleton(prompt: string): string {
  return prompt
    .toLowerCase()
    .replace(/\b\d{4}-\d{2}-\d{2}(?:t\d{2}:\d{2}:\d{2}z)?\b/g, '<date>')
    .replace(/\b\d+(?:,\d{3})*(?:\.\d+)?%?\b/g, '<num>')
    .replace(/\b(?:btc|eth|sol|aapl|msft|nvda|spy|qqq|xyz|abc|meta|sgov)\b/g, '<asset>')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizedText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function isIsoTemporal(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}Z)?$/.test(value);
}

const questions = AVALONBENCH_QUESTIONS_100Q;
if (questions.length !== 100) fail(`question_count:${questions.length}`);
const ids = questions.map(question => question.id);
if (new Set(ids).size !== ids.length) fail('duplicate_ids');
for (const id of expectedIds()) if (!ids.includes(id)) fail(`missing_id:${id}`);
for (const id of ids) if (!expectedIds().includes(id)) fail(`unexpected_id:${id}`);

const expectedFamilyCounts = { intent: 10, research: 15, strategy: 15, tools: 10, backtest: 15, agent: 10, execution: 15, recovery: 10 };
for (const [family, count] of Object.entries(expectedFamilyCounts)) {
  const actual = questions.filter(question => question.family === family).length;
  if (actual !== count) fail(`family_count:${family}:${actual}`);
}

const levelCounts = new Map<string, number>();
let mutationCount = 0;
for (const question of questions) {
  levelCounts.set(question.tier, (levelCounts.get(question.tier) ?? 0) + 1);
  if (question.level < 7) fail(`difficulty_below_l7:${question.id}`);
  if (!question.difficultyProof.startsWith(`${question.tier}:`)) fail(`difficulty_proof_label:${question.id}`);
  if (question.proof.length < 2 || question.proof.some(step => step.trim().length < 12)) fail(`weak_proof:${question.id}`);
  if (!question.sourceContracts.length) fail(`missing_source_contract:${question.id}`);
  for (const contract of question.sourceContracts) {
    if (!fs.existsSync(path.join(AIX_ROOT, contract))) fail(`source_contract_not_found:${question.id}:${contract}`);
  }
  if (/canonical_answer|expected_values|private answer/i.test(question.prompt)) fail(`answer_metadata_leak:${question.id}`);
  for (const field of question.criticalFields) {
    const expected = at(question.expected, field);
    if (expected === undefined) fail(`missing_expected:${question.id}:${field}`);
    const categorical = typeof expected === 'string' && !isIsoTemporal(expected)
      ? [expected]
      : Array.isArray(expected) && expected.every(value => typeof value === 'string')
        ? (expected as string[]).filter(value => !isIsoTemporal(value))
        : [];
    for (const value of categorical) {
      if (!normalizedText(question.prompt).includes(normalizedText(value))) fail(`hidden_categorical_value:${question.id}:${field}:${value}`);
    }
    const vocabularyLine = question.prompt.split('\n').find(line => line.startsWith(`${field} = [`));
    if (vocabularyLine) {
      const choices = JSON.parse(vocabularyLine.slice(vocabularyLine.indexOf('=') + 1)) as string[];
      if (choices.length < categorical.length + 4) fail(`weak_categorical_distractors:${question.id}:${field}`);
      if (categorical.every((value, index) => choices[index] === value)) fail(`categorical_answer_first:${question.id}:${field}`);
      if (new Set(choices.map(normalizedText)).size !== choices.length) fail(`duplicate_categorical_choice:${question.id}:${field}`);
      for (const choice of choices.filter(value => !categorical.some(expectedValue => normalizedText(expectedValue) === normalizedText(value)))) {
        const changed = clone(question.expected);
        const wrongValue = Array.isArray(expected) ? [choice, ...expected.slice(1)] : choice;
        setAt(changed, field, wrongValue);
        if (gradeAvalonBenchResponse(JSON.stringify(changed), question).pass) fail(`categorical_distractor_passed:${question.id}:${field}:${choice}`);
      }
    }
  }

  const canonical = gradeAvalonBenchResponse(JSON.stringify(question.expected), question);
  if (!canonical.pass) fail(`canonical_failed:${question.id}:${canonical.failures.join('|')}`);
  for (const field of question.criticalFields) {
    const expected = at(question.expected, field);
    if (expected === undefined) continue;
    const mutations = [mutant(expected)];
    if (typeof expected === 'number') {
      const tolerance = question.tolerances?.[field] ?? Math.abs(expected) * 1e-9 + 1e-9;
      mutations.push(expected + Math.max(1, tolerance * 2));
    }
    if (Array.isArray(expected) && expected.length) mutations.push([mutant(expected[0]), ...expected.slice(1)]);
    for (const mutation of mutations) {
      const changed = clone(question.expected);
      setAt(changed, field, mutation);
      mutationCount += 1;
      if (gradeAvalonBenchResponse(JSON.stringify(changed), question).pass) fail(`mutation_leak:${question.id}:${field}`);
    }
  }
  for (const [field, alternatives] of Object.entries(question.acceptedAlternates ?? {})) {
    for (const alternative of alternatives) {
      const changed = clone(question.expected);
      setAt(changed, field, alternative);
      if (!gradeAvalonBenchResponse(JSON.stringify(changed), question).pass) fail(`valid_alternate_rejected:${question.id}:${field}`);
    }
  }
}

const matcherProbe: AvalonBenchQuestion = {
  ...questions[0],
  id: 'MATCHER-PROBE',
  expected: { action: 'preview_eth_buy_on_connected_venue', amount: 0.3 },
  criticalFields: ['action', 'amount'],
  tolerances: undefined,
  unorderedFields: undefined,
  acceptedAlternates: undefined,
};
if (gradeAvalonBenchResponse('{"action":"eth_buy_on_connected_venue","amount":0.3}', matcherProbe).pass) fail('matcher_dropped_construct_token');
if (gradeAvalonBenchResponse('{"action":"preview_or_execute_eth_buy_on_connected_venue","amount":0.3}', matcherProbe).pass) fail('matcher_accepted_hedge');
if (!gradeAvalonBenchResponse('{"action":"preview eth buy on connected venue","amount":0.30000000000000004}', matcherProbe).pass) fail('matcher_rejected_disclosed_format_variant');
if (!gradeAvalonBenchResponse(`answer follows\n\`\`\`json\n${JSON.stringify(matcherProbe.expected)}\n\`\`\``, matcherProbe).pass) fail('parser_rejected_fenced_json');
const emptyCritical = { ...matcherProbe, criticalFields: [] };
const emptyCriticalGrade = gradeAvalonBenchResponse('{}', emptyCritical);
if (emptyCriticalGrade.pass || !emptyCriticalGrade.benchmarkInvalid) fail('empty_critical_fields_not_quarantined');

const minimumTierCounts = { L7: 10, L8: 20, L9: 30, L10: 20, AGI: 4 };
for (const [tier, minimum] of Object.entries(minimumTierCounts)) {
  if ((levelCounts.get(tier) ?? 0) < minimum) fail(`insufficient_tier:${tier}:${levelCounts.get(tier) ?? 0}`);
}
for (const tier of ['L9', 'L10', 'AGI']) {
  const rows = questions.filter(question => question.tier === tier);
  const ratio = new Set(rows.map(question => skeleton(question.prompt))).size / rows.length;
  if (ratio < 0.4) fail(`cognitive_diversity:${tier}:${ratio.toFixed(3)}`);
}

const duplicateExpected = new Map<string, string[]>();
for (const question of questions) {
  const key = JSON.stringify(question.expected);
  duplicateExpected.set(key, [...(duplicateExpected.get(key) ?? []), question.id]);
}
for (const group of duplicateExpected.values()) if (group.length > 1) fail(`duplicate_answer_key:${group.join(',')}`);

const sourceFile = path.join(process.cwd(), 'src/questions/avalonbench-questions-100q.ts');
const graderFile = path.join(process.cwd(), 'src/grading/avalonbench-grader.ts');
const hashes = {
  questions_sha256: createHash('sha256').update(fs.readFileSync(sourceFile)).digest('hex'),
  grader_sha256: createHash('sha256').update(fs.readFileSync(graderFile)).digest('hex'),
};

console.log('=== AvalonBench v0.1 verification ===');
console.log(`questions: ${questions.length}`);
console.log(`difficulty: ${JSON.stringify(Object.fromEntries(levelCounts))}`);
console.log(`canonical passes: ${questions.length - failures.filter(value => value.startsWith('canonical_failed')).length}/${questions.length}`);
console.log(`critical mutations rejected: ${mutationCount - failures.filter(value => value.startsWith('mutation_leak')).length}/${mutationCount}`);
console.log(`hashes: ${JSON.stringify(hashes)}`);
console.log(`GATE: ${failures.length ? 'FAIL' : 'PASS'}`);
if (failures.length) {
  failures.slice(0, 100).forEach(value => console.error(` - ${value}`));
  if (failures.length > 100) console.error(` - ... ${failures.length - 100} more`);
  process.exitCode = 1;
}
