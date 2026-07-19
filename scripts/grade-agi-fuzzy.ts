#!/usr/bin/env tsx
// grade-agi-fuzzy.ts — Re-grade AGI responses with the fuzzy-matching grader
import fs from "fs";
import { SCHEMA_QUESTIONS_300Q } from "../src/questions/schema-questions-300q";
import { loadRubric300q } from "../src/rubrics/loader-300q";
import { gradeSchemaResponse } from "../src/grading/schema-grader-300q";

// Load the existing graded results to get model outputs
const gradedFile = process.argv[2] || "results/community/300/run300-sft-thinkon-2026-06-29/graded-sft_on.json";
const graded = JSON.parse(fs.readFileSync(gradedFile, "utf8"));
const rows = graded.rows || [];

// Build question lookup
const qById: Record<string, any> = {};
for (const q of SCHEMA_QUESTIONS_300Q as any[]) qById[q.id] = q;

let oldPass = 0, newPass = 0;
let oldScoreSum = 0, newScoreSum = 0;
let flippedToPass = 0, flippedToFail = 0;
const perQuestion: any[] = [];

for (const row of rows) {
  const qid = row.questionId;
  if (!qid?.startsWith("AGI")) continue;

  const q = qById[qid];
  if (!q) continue;

  const oldScore = row.score || 0;
  const oldPassed = row.pass || false;

  // Re-grade with the fuzzy matcher
  const raw = row.raw || "";
  const rubric = loadRubric300q(q.rubric_id);
  const g = gradeSchemaResponse(raw, q, rubric);

  const newScore = g.score;
  const newPassed = g.pass;

  oldScoreSum += oldScore;
  newScoreSum += newScore;
  if (oldPassed) oldPass++;
  if (newPassed) newPass++;

  if (newPassed && !oldPassed) {
    flippedToPass++;
    console.log(`✅ ${qid}: ${oldScore.toFixed(3)} → ${newScore.toFixed(3)} (FLIPPED TO PASS)`);
  } else if (!newPassed && oldPassed) {
    flippedToFail++;
    console.log(`❌ ${qid}: ${oldScore.toFixed(3)} → ${newScore.toFixed(3)} (REGRESSION!)`);
  } else if (newScore > oldScore + 0.01) {
    console.log(`📈 ${qid}: ${oldScore.toFixed(3)} → ${newScore.toFixed(3)} (improved but still ${newPassed ? "pass" : "fail"})`);
  }

  perQuestion.push({ qid, oldScore, newScore, oldPassed, newPassed, oldFailures: row.failureReasons || [], newFailures: g.failureReasons || [] });
}

console.log(`\n${"=".repeat(70)}`);
console.log(`AGI RE-GRADING RESULTS (fuzzy matching)`);
console.log(`${"=".repeat(70)}`);
console.log(`\nOld: ${oldPass}/110 passed, mean score ${oldScoreSum.toFixed(1)}`);
console.log(`New: ${newPass}/110 passed, mean score ${newScoreSum.toFixed(1)}`);
console.log(`\nFlipped to PASS: +${flippedToPass}`);
console.log(`Flipped to FAIL: -${flippedToFail} (should be 0)`);
console.log(`Net gain: +${flippedToPass - flippedToFail} questions`);

// Show the near-miss bucket changes
const oldNearMiss = perQuestion.filter(p => p.oldScore >= 0.5 && p.oldScore < 0.7);
const newNearMiss = perQuestion.filter(p => p.newScore >= 0.5 && p.newScore < 0.7);
console.log(`\nNear-miss bucket (0.5-0.69): ${oldNearMiss.length} → ${newNearMiss.length}`);

// How many near-misses crossed to pass?
const crossed = perQuestion.filter(p => p.oldScore >= 0.5 && p.oldScore < 0.7 && p.newPassed);
console.log(`Near-misses that crossed to pass: ${crossed.length}`);

// Show remaining failures
const stillFailing = perQuestion.filter(p => !p.newPassed);
console.log(`\nStill failing: ${stillFailing.length}/110`);
const stillNearMiss = stillFailing.filter(p => p.newScore >= 0.5);
console.log(`  Of which still near-miss (0.5-0.69): ${stillNearMiss.length}`);
const lowScore = stillFailing.filter(p => p.newScore < 0.5);
console.log(`  Of which low score (<0.5): ${lowScore.length}`);
