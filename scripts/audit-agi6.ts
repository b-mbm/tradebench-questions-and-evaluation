#!/usr/bin/env tsx
// READ-ONLY audit PART 3: AGI-6 token-budget hypothesis from nojson-agi6-outputs.json
import { readFileSync } from "node:fs";
function readJSON<T = any>(p: string): T {
  return JSON.parse(readFileSync(p, "utf8"));
}

const NJAGI6 = "nojson-agi6-outputs.json";
const NJ29 = "results/community/300/nojson29-gate-graded-2026-06-23.json";

interface AGIEntry {
  model: string;
  questionId: string;
  raw: string;
  finish_reason: string;
}
const agi6 = readJSON<Record<string, AGIEntry>>(NJAGI6);

console.log("=".repeat(70));
console.log("PART 3: AGI-6 token-budget hypothesis (nojson-agi6-outputs.json)");
console.log("=".repeat(70));
console.log("entries:", Object.keys(agi6).length, "(expect 12 = 6 rows x 2 models)\n");

// Expected AGI answers (from nojson29-agi-validator-diagnosis + rubrics)
const EXPECTED: Record<string, string> = {
  "AGI-001": "Short MATIC then SOL, nested shorts, risk reduction ~55-55.4%, residual PnL -74k..-73k",
  "AGI-002": "Private-first cross-venue buy: Dark_RFQ_B 10k, CEX_Y 8k, RFQ_A 7k, avg 2.4719-2.4726, slip 0.68-0.72%",
  "AGI-003": "Private delever to mandate floor: hedge 60 ETH, net 40 ETH, drawdown -13.8..-13.5%, funding -520..-460",
  "AGI-004": "Yield alloc: Curve 30k, Aave 20k, Ethena 20k, GMX 30k, APY 8.6-8.8%, profit 2120-2165, liq 50k",
  "AGI-014": "Multi-venue funding carry w/ caps, apr 28.7-29.2, pnl_30d 11750-12050, survives cascade",
  "AGI-024": "Event exec: private-first seq, nested venue fills, hidden public 7k, avg ~1.20686, slip ~0.57%",
};

function modelShort(m: string) {
  const s = String(m).toLowerCase();
  if (s.includes("tun") || s.includes("sft")) return "tuned";
  return "base";
}
function isLength(fin: string) {
  return /length|max_tokens|truncat/i.test(fin);
}

console.log(
  "qid     | model  | finish   | rawLen | token-fixable? | key economics in output?"
);
console.log("-".repeat(95));

for (const [key, e] of Object.entries(agi6)) {
  const qid = e.questionId;
  const m = modelShort(e.model);
  const fin = e.finish_reason || "?";
  const rawLen = (e.raw || "").length;
  const length = isLength(fin);
  // crude economic-value presence check from EXPECTED: look for the key numbers
  const nums = (EXPECTED[qid].match(/[\d.]+/g) || []).filter((s) => s.length >= 2).slice(0, 6);
  const hits = nums.filter((n) => (e.raw || "").includes(n));
  console.log(
    `${qid.padEnd(7)} | ${m.padEnd(6)} | ${fin.padEnd(8)} | ${String(rawLen).padEnd(6)} | ${length ? "TRUNCATED" : "completed"}      | ${hits.length}/${nums.length} key nums found (${hits.join(",")})`
  );
}

// Load the graded file for pass/score
const nj29 = readJSON<any>(NJ29);
const njRows: any[] = nj29.rows ?? nj29.results ?? nj29.evaluations ?? nj29.graded ?? [];
const gradedAgi = njRows.filter((r: any) => r.tier === "AGI" || String(r.questionId).startsWith("AGI"));
console.log("\nGraded AGI rows from nojson29-gate (pass/score):");
console.log(
  "qid     | model  | pass  | score | finish | parsingMethod | failureReasons"
);
for (const r of gradedAgi) {
  const m = modelShort(r.model || r.variant || "");
  console.log(
    `${String(r.questionId).padEnd(7)} | ${m.padEnd(6)} | ${String(!!r.pass).padEnd(5)} | ${(r.score ?? 0).toFixed(3)} | ${r.finish ?? r.finishReason ?? "?"} | ${r.parsingMethod ?? "?"} | ${JSON.stringify(r.failureReasons ?? []).slice(0, 60)}`
  );
}

// Count base vs tuned passes overall
const basePass = gradedAgi.filter((r) => modelShort(r.model || "") === "base" && r.pass).length;
const tunedPass = gradedAgi.filter((r) => modelShort(r.model || "") === "tuned" && r.pass).length;
const baseN = gradedAgi.filter((r) => modelShort(r.model || "") === "base").length;
const tunedN = gradedAgi.filter((r) => modelShort(r.model || "") === "tuned").length;
console.log(`\nAGI gate summary: base ${basePass}/${baseN}, tuned ${tunedPass}/${tunedN}`);

// finish=length counts
const baseLen = gradedAgi.filter((r) => modelShort(r.model || "") === "base" && isLength(String(r.finish ?? r.finishReason ?? ""))).length;
const tunedLen = gradedAgi.filter((r) => modelShort(r.model || "") === "tuned" && isLength(String(r.finish ?? r.finishReason ?? ""))).length;
console.log(`finish=length: base ${baseLen}/${baseN}, tuned ${tunedLen}/${tunedN}`);
