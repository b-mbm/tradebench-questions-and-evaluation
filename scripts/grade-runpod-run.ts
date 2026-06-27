#!/usr/bin/env tsx
// Grade a runpod-runner.py output dir with the real gradeSchemaResponse + full failure taxonomy.
// Usage: OUT_DIR=results/community/300/<run> npx tsx scripts/grade-runpod-run.ts
//   (or pass the dir as argv[2]; it reads <dir>/generations.jsonl)
import fs from "fs";
import path from "path";
import { SCHEMA_QUESTIONS_300Q } from "../src/questions/schema-questions-300q";
import { loadRubric300q } from "../src/rubrics/loader-300q";
import { gradeSchemaResponse } from "../src/grading/schema-grader-300q";

const DIR = process.argv[2] || process.env.OUT_DIR || "results/community/300/runpod-run";
const GEN = path.join(DIR, "generations.jsonl");
if (!fs.existsSync(GEN)) { console.error("no generations.jsonl in", DIR); process.exit(1); }

const Q: any = (SCHEMA_QUESTIONS_300Q as any[]).reduce((a: any, q: any) => (a[q.id] = q, a), {});
const tierOf = (id: string) => id.startsWith("AGI") ? "AGI" : id.startsWith("L10") ? "L10" : id.startsWith("L9") ? "L9" : "nonAGI";
const LABEL = ["intent", "chosen_strategy"];
const STRUCT = ["execution_sequence", "shorts", "ladder", "legs", "steps"];

// Taxonomy uses BOTH the transport status (from the runner) and the grade reasons.
function classify(g: any, row: any): string {
  if (row.status === "error") return "TRANSPORT";
  if (row.status === "blank") return "BLANK/BUDGET (empty even after escalation)";
  if (row.status === "truncated") return "TRUNCATION (finish=length at max budget)";
  if (g.pass) return "pass";
  const frs: string[] = g.failureReasons || [];
  if (frs.some((x: string) => x.includes("parse_failed")) || !g.normalizedResponse) return "PARSER/NESTING";
  const vf = frs.filter((x: string) => x.startsWith("agi_validation_failed:")).map((x: string) => x.split(":")[1]);
  const num = vf.filter((f: string) => !LABEL.includes(f) && !STRUCT.includes(f));
  const struct = vf.filter((f: string) => STRUCT.includes(f));
  const label = vf.filter((f: string) => LABEL.includes(f));
  if (num.length) return "GENUINE WRONG VALUE: " + num.join(",");
  if (struct.length) return "PARSER/NESTING (structural): " + struct.join(",");
  if (label.length) return "EXACT-LABEL/TEXT-MATCH: " + label.join(",");
  if (frs.some((x: string) => x.includes("missing_field"))) return "MISSING FIELD";
  return "OTHER: " + frs.join(",");
}

const blank = () => ({ n: 0, pass: 0, tier: { nonAGI: [0, 0], L9: [0, 0], L10: [0, 0], AGI: [0, 0] } as any,
  status: {} as any, finish: {} as any, tax: {} as any, ctok: [] as number[], rtok: [] as number[] });
const agg: Record<string, any> = {};
const rows: any[] = [];

for (const line of fs.readFileSync(GEN, "utf8").split("\n").filter(Boolean)) {
  let r: any; try { r = JSON.parse(line); } catch { continue; }
  const q = Q[r.questionId]; if (!q) { console.log("WARN unknown id", r.questionId); continue; }
  const m = String(r.model);
  if (!agg[m]) agg[m] = blank();
  const a = agg[m]; const t = tierOf(r.questionId); a.n++;
  a.status[r.status] = (a.status[r.status] || 0) + 1;
  a.finish[r.finish_reason] = (a.finish[r.finish_reason] || 0) + 1;
  if (typeof r.completion_tokens === "number") a.ctok.push(r.completion_tokens);
  if (typeof r.reasoning_tokens === "number") a.rtok.push(r.reasoning_tokens);
  const g: any = gradeSchemaResponse(r.raw || "", q, loadRubric300q(q.rubric_id));
  if (g.pass) { a.pass++; a.tier[t][0]++; } a.tier[t][1]++;
  const tax = classify(g, r);
  const taxKey = tax.split(":")[0].split("(")[0].trim();
  a.tax[taxKey] = (a.tax[taxKey] || 0) + 1;
  rows.push({ model: m, questionId: r.questionId, tier: t, status: r.status, finish: r.finish_reason,
    completion_tokens: r.completion_tokens, budget_used: r.budget_used, attempts: r.attempts,
    pass: g.pass, score: g.score, parsingMethod: g.parsingMethod, classification: tax,
    failureReasons: g.failureReasons || [], raw: r.raw, normalized: g.normalizedResponse });
}

const med = (xs: number[]) => xs.length ? xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)] : 0;
console.log(`=== RUNPOD RUN GRADED (no-json, reasoning-aware) — ${DIR} ===\n`);
for (const m of Object.keys(agg)) {
  const a = agg[m]; if (!a.n) continue;
  console.log(`${m}: ${a.pass}/${a.n} pass`);
  console.log(`  tier: nonAGI ${a.tier.nonAGI[0]}/${a.tier.nonAGI[1]} | L9 ${a.tier.L9[0]}/${a.tier.L9[1]} | L10 ${a.tier.L10[0]}/${a.tier.L10[1]} | AGI ${a.tier.AGI[0]}/${a.tier.AGI[1]}`);
  console.log(`  transport status: ${JSON.stringify(a.status)} | finish: ${JSON.stringify(a.finish)}`);
  console.log(`  completion_tokens med=${med(a.ctok)} max=${Math.max(0, ...a.ctok)}  (watch for budget pressure)`);
  if (a.rtok.length) console.log(`  reasoning_tokens med=${med(a.rtok)} max=${Math.max(0, ...a.rtok)}  (reasoning-model signal)`);
  console.log(`  failure taxonomy: ${JSON.stringify(a.tax)}`);
}
const truncated = rows.filter(r => r.status === "truncated").map(r => r.questionId);
const blanks = rows.filter(r => r.status === "blank").map(r => r.questionId);
if (truncated.length) console.log(`\n!! STILL TRUNCATED at max budget (raise BUDGET_LADDER/MAX_MODEL_LEN): ${truncated.join(", ")}`);
if (blanks.length) console.log(`!! BLANK after escalation (investigate): ${blanks.join(", ")}`);

const baseKey = Object.keys(agg).find(k => k.endsWith("base"));
const tunedKey = Object.keys(agg).find(k => k.includes("sft") || k.includes("tuned"));
if (baseKey && tunedKey) {
  const d = agg[tunedKey].pass - agg[baseKey].pass;
  console.log(`\nFINE-TUNE DELTA: ${d >= 0 ? "+" : ""}${d}  (${baseKey} ${agg[baseKey].pass} -> ${tunedKey} ${agg[tunedKey].pass})`);
}

const stamp = process.env.STAMP || "unstamped";
const out = path.join(DIR, `graded-${stamp}.json`);
fs.writeFileSync(out, JSON.stringify({ agg, rows }, null, 2));
console.log(`\nsaved (raw+normalized+taxonomy per row): ${out}`);
