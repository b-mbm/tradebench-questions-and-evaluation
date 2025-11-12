#!/usr/bin/env tsx

import fs from "fs";

type EvalRow = { modelId: string; questionId: string; grade?: { pass: boolean; score: number; confidence: number } };

function usage() {
  console.error("Usage: npx tsx Tradebench-lite-full-test/scripts/report-combined.ts <combined.json>");
}

function loadJson(p: string): any {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function summarize(rows: EvalRow[]) {
  const byModel = new Map<string, { total: number; passed: number; score: number }>();
  for (const r of rows) {
    const g = r.grade || { pass: false, score: 0, confidence: 0 };
    const entry = byModel.get(r.modelId) || { total: 0, passed: 0, score: 0 };
    entry.total += 1;
    entry.passed += g.pass ? 1 : 0;
    entry.score += g.score || 0;
    byModel.set(r.modelId, entry);
  }
  for (const [model, s] of byModel) {
    const passRate = s.total ? (s.passed / s.total) * 100 : 0;
    const avgScore = s.total ? s.score / s.total : 0;
    console.log(`${model}: ${s.passed}/${s.total} passed (${passRate.toFixed(1)}%), avg score ${avgScore.toFixed(3)}`);
  }
}

async function run() {
  const file = process.argv[2];
  if (!file) {
    usage();
    process.exit(1);
  }
  const data = loadJson(file);
  const rows: EvalRow[] = data.evaluations || [];
  console.log(`Models: ${new Set(rows.map(r => r.modelId)).size}`);
  console.log(`Questions: ${new Set(rows.map(r => r.questionId)).size}`);
  console.log("\nSummary by model:");
  summarize(rows);
}

run().catch(err => {
  console.error("❌ report-combined failed:", err);
  process.exit(1);
});

