#!/usr/bin/env tsx
// Row-by-row control: of the questions stock Qwen3.6-27B PASSED on OpenRouter,
// how many does the same model reproduce on RunPod? This is THE harness-honesty test.
// Usage: OUT_DIR=results/community/300/<runpod-run> npx tsx scripts/compare-or-vs-runpod.ts
//   OR_FILE defaults to the consolidated OpenRouter file; MODEL defaults to the *base* model in the run.
import fs from "fs";
import path from "path";
import { SCHEMA_QUESTIONS_300Q } from "../src/questions/schema-questions-300q";
import { loadRubric300q } from "../src/rubrics/loader-300q";
import { gradeSchemaResponse } from "../src/grading/schema-grader-300q";

const DIR = process.argv[2] || process.env.OUT_DIR || "results/community/300/runpod-run";
const OR_FILE = process.env.OR_FILE || "results/community/300/qwen36-openrouter-consolidated.json";
const GEN = path.join(DIR, "generations.jsonl");
if (!fs.existsSync(GEN)) { console.error("no generations.jsonl in", DIR); process.exit(1); }
if (!fs.existsSync(OR_FILE)) { console.error("no OpenRouter reference at", OR_FILE); process.exit(1); }

const Q: any = (SCHEMA_QUESTIONS_300Q as any[]).reduce((a: any, q: any) => (a[q.id] = q, a), {});
const tierOf = (id: string) => id.startsWith("AGI") ? "AGI" : id.startsWith("L10") ? "L10" : id.startsWith("L9") ? "L9" : "easy";

// OpenRouter stock per-row outcome
const or: Record<string, boolean> = {};
for (const r of JSON.parse(fs.readFileSync(OR_FILE, "utf8"))) or[r.questionId] = !!r.pass;

// RunPod rows, grouped by model, graded with the real grader
const runByModel: Record<string, Record<string, any>> = {};
for (const line of fs.readFileSync(GEN, "utf8").split("\n").filter(Boolean)) {
  let r: any; try { r = JSON.parse(line); } catch { continue; }
  const q = Q[r.questionId]; if (!q) continue;
  const g: any = gradeSchemaResponse(r.raw || "", q, loadRubric300q(q.rubric_id));
  (runByModel[r.model] ||= {})[r.questionId] = { pass: !!g.pass, status: r.status, finish: r.finish_reason,
    ctok: r.completion_tokens, rtok: r.reasoning_tokens, reasons: (g.failureReasons || []).slice(0, 2) };
}

const models = Object.keys(runByModel);
const baseModel = process.env.MODEL || models.find(m => m.endsWith("base")) || models[0];

for (const model of models) {
  const run = runByModel[model];
  const ids = Object.keys(run).filter(id => id in or);
  const cell = { a: 0, b: 0, c: 0, d: 0 } as any;            // a=ORpass&RPpass b=ORpass&RPfail c=ORfail&RPpass d=both-fail
  const perTier: Record<string, any> = {};
  const regressions: string[] = [], gains: string[] = [];
  for (const id of ids) {
    const op = or[id], rp = run[id].pass; const t = tierOf(id);
    perTier[t] ||= { a: 0, b: 0, c: 0, d: 0 };
    const key = op && rp ? "a" : op && !rp ? "b" : !op && rp ? "c" : "d";
    cell[key]++; perTier[t][key]++;
    if (key === "b") regressions.push(id);
    if (key === "c") gains.push(id);
  }
  const orPass = cell.a + cell.b, repro = orPass ? (100 * cell.a / orPass).toFixed(0) : "—";
  const tag = model === baseModel ? "  <-- CONTROL (base)" : "";
  console.log(`\n=== ${model}${tag} ===  (${ids.length} rows overlap with OpenRouter)`);
  console.log(`REPRODUCED ${cell.a}/${orPass} of OpenRouter's passes (${repro}%)`);
  console.log(`  matrix: OR-pass&RP-pass=${cell.a}  OR-pass&RP-FAIL=${cell.b}  OR-fail&RP-pass=${cell.c}  both-fail=${cell.d}`);
  console.log(`  per tier (reproduced / OR-passes):`);
  for (const t of ["easy", "L9", "L10", "AGI"]) {
    const x = perTier[t]; if (!x) continue;
    console.log(`    ${t}: ${x.a}/${x.a + x.b} reproduced  (RP also gained ${x.c} that OR failed)`);
  }
  if (regressions.length) {
    console.log(`  !! OR-PASS but RP-FAIL (investigate — these are the harness/stack tells):`);
    for (const id of regressions) {
      const r = run[id];
      console.log(`     ${id}  status=${r.status} finish=${r.finish} ctok=${r.ctok} rtok=${r.rtok} :: ${r.reasons.join(", ")}`);
    }
  }
  if (gains.length) console.log(`  (+) RP passed where OR failed: ${gains.join(", ")}`);
}

const stamp = process.env.STAMP || "unstamped";
const out = path.join(DIR, `or-reproduction-${stamp}.json`);
fs.writeFileSync(out, JSON.stringify({ baseModel, runByModel, or }, null, 2));
console.log(`\nVERDICT: a high reproduction% for the base model = harness is honest. saved: ${out}`);
