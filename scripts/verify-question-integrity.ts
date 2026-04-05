#!/usr/bin/env tsx

import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";

import { L0_QUESTIONS } from "../src/questions/l0-questions";
import { SCHEMA_QUESTIONS } from "../src/questions/schema-questions";

type NormalizedL0Question = {
  id: string;
  prompt: string;
  expected: number;
  range: [number, number];
  unit: string;
  difficulty: number;
};

type NormalizedSchemaQuestion = {
  id: string;
  level: number;
  prompt: string;
  rubric_id: string;
  expected_values: Record<string, unknown>;
  context: Record<string, unknown>;
};

type IntegritySnapshot<T> = {
  count: number;
  ids: string[];
  hash: string;
  questions: T[];
};

type IntegrityBaseline = {
  version: 1;
  captured_at: string;
  smoke_question_ids: string[];
  l0: IntegritySnapshot<NormalizedL0Question>;
  schema: IntegritySnapshot<NormalizedSchemaQuestion>;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_PATH = path.resolve(__dirname, "..", "src", "questions", "fixtures", "question-integrity-baseline.json");
const EXPECTED_L0_COUNT = 20;
const EXPECTED_SCHEMA_COUNT = 40;
const SMOKE_QUESTION_IDS = ["L0-order_book_execution", "L1-001", "L8-009"] as const;

function stableClone<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item => stableClone(item)) as T;
  }

  if (value && typeof value === "object") {
    const clone: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      clone[key] = stableClone((value as Record<string, unknown>)[key]);
    }
    return clone as T;
  }

  return value;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(stableClone(value));
}

function hashValue(value: unknown): string {
  return createHash("sha256").update(stableStringify(value)).digest("hex");
}

function normalizeL0Questions(): NormalizedL0Question[] {
  return L0_QUESTIONS.map(question => ({
    id: question.id,
    prompt: question.prompt,
    expected: question.expected,
    range: [Number(question.range[0]), Number(question.range[1])],
    unit: question.unit,
    difficulty: question.difficulty,
  }));
}

function normalizeSchemaQuestions(): NormalizedSchemaQuestion[] {
  return SCHEMA_QUESTIONS.map(question => ({
    id: question.id,
    level: question.level,
    prompt: question.prompt,
    rubric_id: question.rubric_id,
    expected_values: stableClone(question.expected_values),
    context: stableClone(question.context ?? {}),
  }));
}

function buildBaseline(): IntegrityBaseline {
  const l0 = normalizeL0Questions();
  const schema = normalizeSchemaQuestions();

  return {
    version: 1,
    captured_at: new Date().toISOString(),
    smoke_question_ids: [...SMOKE_QUESTION_IDS],
    l0: {
      count: l0.length,
      ids: l0.map(question => question.id),
      hash: hashValue(l0),
      questions: l0,
    },
    schema: {
      count: schema.length,
      ids: schema.map(question => question.id),
      hash: hashValue(schema),
      questions: schema,
    },
  };
}

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): void {
  if (!condition) {
    fail(message);
  }
}

function firstMismatch<T extends { id: string }>(expected: T[], actual: T[]): string | null {
  const max = Math.max(expected.length, actual.length);
  for (let index = 0; index < max; index += 1) {
    const expectedItem = expected[index];
    const actualItem = actual[index];

    if (!expectedItem) {
      return `Unexpected extra question at index ${index}: ${actualItem?.id ?? "<missing id>"}`;
    }
    if (!actualItem) {
      return `Missing question at index ${index}: expected ${expectedItem.id}`;
    }
    if (expectedItem.id !== actualItem.id) {
      return `Question order mismatch at index ${index}: expected ${expectedItem.id}, found ${actualItem.id}`;
    }
    if (stableStringify(expectedItem) !== stableStringify(actualItem)) {
      return `Question payload mismatch for ${expectedItem.id}`;
    }
  }

  return null;
}

function verifyCounts(): void {
  assert(L0_QUESTIONS.length === EXPECTED_L0_COUNT, `Expected ${EXPECTED_L0_COUNT} L0 questions, found ${L0_QUESTIONS.length}`);
  assert(
    SCHEMA_QUESTIONS.length === EXPECTED_SCHEMA_COUNT,
    `Expected ${EXPECTED_SCHEMA_COUNT} schema questions, found ${SCHEMA_QUESTIONS.length}`,
  );
}

function verifySmokeSubsetExists(): void {
  const ids = new Set([...L0_QUESTIONS.map(question => question.id), ...SCHEMA_QUESTIONS.map(question => question.id)]);
  for (const id of SMOKE_QUESTION_IDS) {
    assert(ids.has(id), `Smoke question ${id} is missing from loaded questions`);
  }
}

function loadBaseline(): IntegrityBaseline {
  assert(fs.existsSync(FIXTURE_PATH), `Baseline fixture not found at ${FIXTURE_PATH}`);
  return JSON.parse(fs.readFileSync(FIXTURE_PATH, "utf8")) as IntegrityBaseline;
}

function writeBaseline(baseline: IntegrityBaseline): void {
  fs.mkdirSync(path.dirname(FIXTURE_PATH), { recursive: true });
  fs.writeFileSync(FIXTURE_PATH, JSON.stringify(baseline, null, 2) + "\n", "utf8");
}

function verifyAgainstBaseline(baseline: IntegrityBaseline): void {
  verifyCounts();
  verifySmokeSubsetExists();

  const actualL0 = normalizeL0Questions();
  const actualSchema = normalizeSchemaQuestions();

  assert(baseline.l0.count === EXPECTED_L0_COUNT, `Baseline L0 count is ${baseline.l0.count}, expected ${EXPECTED_L0_COUNT}`);
  assert(
    baseline.schema.count === EXPECTED_SCHEMA_COUNT,
    `Baseline schema count is ${baseline.schema.count}, expected ${EXPECTED_SCHEMA_COUNT}`,
  );

  assert(
    stableStringify(baseline.smoke_question_ids) === stableStringify([...SMOKE_QUESTION_IDS]),
    "Baseline smoke question IDs do not match the required verification subset",
  );

  const l0Hash = hashValue(actualL0);
  const schemaHash = hashValue(actualSchema);

  assert(l0Hash === baseline.l0.hash, `L0 hash mismatch: expected ${baseline.l0.hash}, found ${l0Hash}`);
  assert(schemaHash === baseline.schema.hash, `Schema hash mismatch: expected ${baseline.schema.hash}, found ${schemaHash}`);

  assert(
    stableStringify(baseline.l0.ids) === stableStringify(actualL0.map(question => question.id)),
    "L0 ordered question IDs differ from baseline",
  );
  assert(
    stableStringify(baseline.schema.ids) === stableStringify(actualSchema.map(question => question.id)),
    "Schema ordered question IDs differ from baseline",
  );

  const l0Mismatch = firstMismatch(baseline.l0.questions, actualL0);
  if (l0Mismatch) {
    fail(l0Mismatch);
  }

  const schemaMismatch = firstMismatch(baseline.schema.questions, actualSchema);
  if (schemaMismatch) {
    fail(schemaMismatch);
  }
}

function main(): void {
  const args = new Set(process.argv.slice(2));
  const capture = args.has("--capture");

  const baseline = buildBaseline();

  if (capture) {
    verifyCounts();
    verifySmokeSubsetExists();
    writeBaseline(baseline);
    console.log(`Captured question-integrity baseline at ${FIXTURE_PATH}`);
    console.log(`L0 hash: ${baseline.l0.hash}`);
    console.log(`Schema hash: ${baseline.schema.hash}`);
    return;
  }

  const expected = loadBaseline();
  verifyAgainstBaseline(expected);
  console.log("Question integrity verification passed.");
  console.log(`L0 hash: ${expected.l0.hash}`);
  console.log(`Schema hash: ${expected.schema.hash}`);
}

main();
