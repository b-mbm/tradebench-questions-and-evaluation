#!/usr/bin/env tsx

import { gradeSchemaResponse } from "../src/grading/schema-grader-300q";
import { SCHEMA_QUESTIONS_300Q } from "../src/questions/schema-questions-300q";
import { loadRubric300q } from "../src/rubrics/loader-300q";

function question(id: string) {
  const found = SCHEMA_QUESTIONS_300Q.find(q => q.id === id);
  if (!found) {
    throw new Error(`Question not found: ${id}`);
  }
  return found;
}

function canonicalRaw(id: string): string {
  const q = question(id);
  const rubric = loadRubric300q(q.rubric_id) as any;
  const canonical = rubric._l9_canonical;
  if (!canonical || !Object.prototype.hasOwnProperty.call(canonical, "expected_value")) {
    throw new Error(`Missing _l9_canonical.expected_value for ${id}`);
  }
  return JSON.stringify({
    intent: "canonical_check",
    expected_value: canonical.expected_value,
    reasoning: canonical.grading_notes ?? "canonical value",
  });
}

function expectGrade(id: string, raw: string, expectedPass: boolean, label: string): void {
  const q = question(id);
  const rubric = loadRubric300q(q.rubric_id);
  const grade = gradeSchemaResponse(raw, q, rubric);
  if (grade.pass !== expectedPass) {
    throw new Error(
      `${label}: expected ${id} pass=${expectedPass}, got pass=${grade.pass}, score=${grade.score}, reasons=${grade.failureReasons.join("|")}`
    );
  }
}

const falsePassRegressions = [
  ["L9-001", { intent: "arbitrage", expected_value: 21.91, reasoning: "wrong leveraged APR" }],
  ["L9-003", { intent: "cross_chain", expected_value: 33.33, reasoning: "wrong SOL saved" }],
  ["L9-005", { intent: "flash_loan", expected_value: 132000, reasoning: "wrong capital scale" }],
  ["L9-009", { intent: "restaking", expected_value: 3, reasoning: "scalar count, not selected AVS set" }],
  ["L9-010", { intent: "flash_loan", expected_value: 22750, reasoning: "wrong EV" }],
] as const;

for (const [id, response] of falsePassRegressions) {
  expectGrade(id, JSON.stringify(response), false, `${id} false-pass regression`);
}

const allL9Ids = SCHEMA_QUESTIONS_300Q
  .filter(q => q.id.startsWith("L9-"))
  .map(q => q.id)
  .sort();

for (const id of allL9Ids) {
  expectGrade(id, canonicalRaw(id), true, `${id} canonical pass`);
}

console.log(`L9 canonical grading verification passed for ${allL9Ids.length} questions.`);
