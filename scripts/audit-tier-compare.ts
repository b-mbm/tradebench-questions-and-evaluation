#!/usr/bin/env tsx
// READ-ONLY audit PART 2: OpenRouter vs RunPod tier comparison + gap attribution.
import { readFileSync } from "node:fs";
function readJSON<T = any>(p: string): T {
  return JSON.parse(readFileSync(p, "utf8"));
}
function tierOf(qid: string): string {
  if (qid.startsWith("AGI")) return "AGI";
  const m = qid.match(/^L(\d+)-/);
  if (!m) return "?";
  const n = Number(m[1]);
  if (n <= 8) return "L1-8";
  if (n === 9) return "L9";
  if (n === 10) return "L10";
  return "?";
}
const TIERS = ["L1-8", "L9", "L10", "AGI"] as const;

interface Eval {
  modelLabel?: string; questionId: string; raw: string | null;
  grade?: { pass?: boolean; score?: number } | null; repairMeta?: any;
}
const isBlank = (s: unknown) => s == null || (typeof s === "string" && s.trim() === "");

const CKPT = readJSON<{ evaluations: Eval[] }>("results/community/300/openrouter-qwen-open-weight-n1-final-from-checkpoint-2026-06-14T23-28-55-760Z.json");
const orRows = CKPT.evaluations.filter((e) => (e.modelLabel ?? "").includes("qwen3.6-27b"));
const RP = readJSON<{ evaluations: Eval[] }>("results/community/300/runpod-qwen36-27b-sft-300-2026-06-23T01-35-07-238Z.json");
const rpRows = RP.evaluations;

function tierPass(evals: Eval[]) {
  const t: Record<string, { n: number; or?: number; rp?: number; blank: number }> = {};
  for (const tg of TIERS) t[tg] = { n: 0, blank: 0 };
  for (const e of evals) {
    const tg = tierOf(e.questionId);
    if (!t[tg]) continue;
    t[tg].n++;
    if (e.grade?.pass) (t[tg].or ??= 0), t[tg].or = (t[tg].or ?? 0) + 1;
    if (isBlank(e.raw)) t[tg].blank++;
  }
  return t;
}

const orT = tierPass(orRows);
const rpT = tierPass(rpRows);

console.log("=".repeat(64));
console.log("PART 2: OpenRouter (164) vs RunPod json_object (38) by tier");
console.log("=".repeat(64));
console.log("tier  | n   | OpenRouter | RunPod-json | gap  ");
console.log("-".repeat(48));
let orTotal = 0, rpTotal = 0;
for (const tg of TIERS) {
  const orp = orT[tg].or ?? 0;
  const rpp = rpRows.filter((e) => tierOf(e.questionId) === tg && e.grade?.pass).length;
  orTotal += orp; rpTotal += rpp;
  console.log(`${tg.padEnd(5)} | ${String(orT[tg].n).padEnd(3)} | ${String(orp).padEnd(10)} | ${String(rpp).padEnd(11)} | ${orp - rpp >= 0 ? "+" : ""}${orp - rpp}`);
}
console.log("-".repeat(48));
console.log(`TOTAL | 300 | ${orTotal}        | ${rpTotal}           | ${orTotal - rpTotal}`);

// AGI blanks in RunPod
const rpAgiBlank = rpRows.filter((e) => e.questionId.startsWith("AGI") && isBlank(e.raw)).length;
const rpAgiPass = rpRows.filter((e) => e.questionId.startsWith("AGI") && e.grade?.pass).length;
const rpAgiGeneric = rpRows.filter((e) => {
  if (!e.questionId.startsWith("AGI")) return false;
  if (isBlank(e.raw)) return false;
  // json_object collapse signature: generic execute-one schema with intent/order_type but no nested AGI shapes
  const r = e.raw || "";
  return /order_type|order_types|venue/.test(r) && !/shorts|venue_fills|allocation_usd|execution_sequence|hedge_notional/.test(r);
}).length;
console.log(`\nRunPod AGI: pass=${rpAgiPass} blank=${rpAgiBlank} generic-collapse-shape=${rpAgiGeneric} other=${110 - rpAgiPass - rpAgiBlank - rpAgiGeneric}`);

// json-collapse isolation: same 29 questions, json vs no-json
console.log("\n" + "=".repeat(64));
console.log("json-collapse isolation: same 29-Q subset, RunPod json vs no-json");
console.log("=".repeat(64));
const NJ29 = readJSON<any>("results/community/300/nojson29-gate-graded-2026-06-23.json");
const njRows: any[] = NJ29.rows ?? [];
const gateIds = [...new Set(njRows.map((r: any) => r.questionId))];
// RunPod json_object score on these same 29 IDs
const rpJsonGate = rpRows.filter((e) => gateIds.includes(e.questionId));
const rpJsonPass = rpJsonGate.filter((e) => e.grade?.pass).length;
const njTunedPass = njRows.filter((r: any) => String(r.model).includes("tun") && r.pass).length;
const njBasePass = njRows.filter((r: any) => !String(r.model).includes("tun") && r.pass).length;
console.log(`29-Q subset (hard tiers): json_object pass = ${rpJsonPass}/29`);
console.log(`                          no-json    base = ${njBasePass}/29, tuned = ${njTunedPass}/29`);
console.log(`                          Δ from dropping json_object (tuned): +${njTunedPass - rpJsonPass}`);

// per-tier no-json recovery
console.log("\nno-json per-tier on the 29 subset (tuned):");
function njTier(qid: string) {
  if (qid.startsWith("AGI")) return "AGI";
  if (qid.startsWith("L9")) return "L9";
  if (qid.startsWith("L10")) return "L10";
  return "L1-8";
}
for (const tg of TIERS) {
  const t = njRows.filter((r: any) => njTier(r.questionId) === tg && String(r.model).includes("tun"));
  const p = t.filter((r: any) => r.pass).length;
  if (t.length) console.log(`  ${tg}: ${p}/${t.length} (no-json tuned)`);
}
