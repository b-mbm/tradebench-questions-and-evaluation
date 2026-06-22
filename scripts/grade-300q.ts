#!/usr/bin/env tsx
// Grade locally-generated outputs (id -> raw text) with the real grader. Handles partial sets.
import fs from "fs";
import { SCHEMA_QUESTIONS_300Q } from "../src/questions/schema-questions-300q";
import { loadRubric300q } from "../src/rubrics/loader-300q";
import { gradeSchemaResponse } from "../src/grading/schema-grader-300q";

const file = process.argv[2] || "outputs-300q.json";
const outputs = JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, string>;
let scoreSum = 0, passCount = 0, graded = 0, parsed = 0;
const perLevel: Record<number, { n: number; score: number; pass: number }> = {};
for (const q of SCHEMA_QUESTIONS_300Q as any[]) {
  const raw = outputs[q.id];
  if (raw === undefined) continue;
  graded++;
  const rubric = loadRubric300q(q.rubric_id);
  const g = gradeSchemaResponse(raw, q, rubric);
  scoreSum += g.score; if (g.pass) passCount++; if (g.normalizedResponse) parsed++;
  const L = q.level; perLevel[L] = perLevel[L] || { n: 0, score: 0, pass: 0 };
  perLevel[L].n++; perLevel[L].score += g.score; if (g.pass) perLevel[L].pass++;
}
console.log(`graded ${graded}/300 | parsed ${parsed}/${graded} | scoreSum ${scoreSum.toFixed(1)} | passCount ${passCount}`);
if (graded < 300) console.log(`projected full-300 (if rate holds): score ${(scoreSum / graded * 300).toFixed(0)}, pass ${(passCount / graded * 300).toFixed(0)}`);
console.log("per-level:");
for (const L of Object.keys(perLevel).map(Number).sort((a, b) => a - b)) {
  const p = perLevel[L];
  console.log(`  L${L}: ${p.pass}/${p.n} pass | score ${p.score.toFixed(1)}/${p.n} | parsed-rate ${(p.score / p.n).toFixed(2)}`);
}
