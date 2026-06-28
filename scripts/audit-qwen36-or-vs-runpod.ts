#!/usr/bin/env tsx
// READ-ONLY audit: recompute OpenRouter vs RunPod Qwen3.6-27B numbers from raw data.
// No API calls, no pods. Pure local aggregation over committed JSON.

import { readFileSync } from "node:fs";

function readJSON<T = any>(p: string): T {
  return JSON.parse(readFileSync(p, "utf8"));
}
function tierOf(qid: string): string {
  if (qid.startsWith("AGI")) return "AGI";
  const m = qid.match(/^L(\d+)-/);
  if (!m) return "?";
  const n = Number(m[1]);
  if (n >= 1 && n <= 8) return "L1-8";
  if (n === 9) return "L9";
  if (n === 10) return "L10";
  return "?";
}
const TIERS = ["L1-8", "L9", "L10", "AGI"] as const;
function isBlank(s: unknown): boolean {
  if (s == null) return true;
  if (typeof s === "string") return s.trim().length === 0;
  return false;
}
interface Eval {
  modelId?: string;
  modelLabel?: string;
  questionId: string;
  raw: string | null;
  grade?: { pass?: boolean; score?: number } | null;
  repairMeta?: any;
  durationMs?: number;
  finishReason?: string;
}
function emptyTier() {
  return { n: 0, pass: 0, blank: 0 };
}

function rows(evals: Eval[]) {
  return evals.map((e) => ({
    questionId: e.questionId,
    pass: !!e.grade?.pass,
    blank: isBlank(e.raw),
    raw: e.raw,
    score: e.grade?.score ?? 0,
    repair: e.repairMeta,
  }));
}

function tierTable(evals: Eval[]) {
  const t: Record<string, ReturnType<typeof emptyTier>> = {};
  for (const tg of TIERS) t[tg] = emptyTier();
  for (const r of rows(evals)) {
    const tg = tierOf(r.questionId);
    if (!t[tg]) continue;
    t[tg].n++;
    if (r.pass) t[tg].pass++;
    if (r.blank) t[tg].blank++;
  }
  return t;
}

// dedupe latest-by-questionId, preferring non-blank over blank (matches consolidation)
function dedupeLatest(evals: Eval[]): Eval[] {
  const byId = new Map<string, Eval>();
  for (const e of evals) {
    const ex = byId.get(e.questionId);
    if (!ex) {
      byId.set(e.questionId, e);
      continue;
    }
    const exBlank = isBlank(ex.raw);
    const eBlank = isBlank(e.raw);
    if (eBlank && !exBlank) continue; // keep non-blank
    byId.set(e.questionId, e);
  }
  return [...byId.values()];
}

function countPass(evals: Eval[]) {
  return evals.filter((e) => e.grade?.pass).length;
}

// ============================ FILES ============================
const CKPT = "results/community/300/openrouter-qwen-open-weight-n1-final-from-checkpoint-2026-06-14T23-28-55-760Z.json";
const CONS = "results/community/300/qwen36-openrouter-consolidated.json";
const RP = "results/community/300/runpod-qwen36-27b-sft-300-2026-06-23T01-35-07-238Z.json";
const NJ29 = "results/community/300/nojson29-gate-graded-2026-06-23.json";
const NJAGI6 = "nojson-agi6-outputs.json";
const REPAIR_CKPT = "results/repair-checkpoints/top20-no-openai-pro-dirty-repair.jsonl";

const hr = "=".repeat(70);

// ============================ PART 1 ============================
console.log(hr);
console.log("PART 1: OpenRouter qwen3.6-27b — honest score (from RAW checkpoint)");
console.log(hr);

const ckpt = readJSON<{ models: any[]; questionIds: string[]; evaluations: Eval[] }>(CKPT);
const qeRaw = ckpt.evaluations.filter((e) => (e.modelLabel ?? "").includes("qwen3.6-27b"));
console.log("qwen3.6-27b evals in checkpoint (raw, incl dupes):", qeRaw.length);
const dupeIds = qeRaw.length - new Set(qeRaw.map((e) => e.questionId)).size;
console.log("duplicate questionIds (repaired rows re-run):", dupeIds);

// show what the duplicates are
const seen = new Map<string, number>();
for (const e of qeRaw) seen.set(e.questionId, (seen.get(e.questionId) ?? 0) + 1);
const dupQids = [...seen.entries()].filter(([, c]) => c > 1).map(([q]) => q);
console.log("questionIds with >1 eval (repaired):", dupQids.join(", ") || "(none)");

const qe = dedupeLatest(qeRaw);
const qPass = countPass(qe);
const qBlank = qe.filter((e) => isBlank(e.raw));
console.log("\nAFTER dedupe (latest, prefer non-blank):");
console.log("  rows:", qe.length, "| pass:", qPass, "| blank-raw:", qBlank.length);
console.log("  blank questionIds:", qBlank.map((b) => b.questionId).sort().join(", "));

console.log("\n  tier table (OpenRouter checkpoint):");
const qT = tierTable(qe);
for (const tg of TIERS) console.log(`    ${tg}: ${qT[tg].pass}/${qT[tg].n}  (blank ${qT[tg].blank})`);

// cross-check vs consolidated.json
const cons = readJSON<Array<{ questionId: string; pass: boolean; raw: string; score: number }>>(CONS);
let mismatch = 0;
for (const c of cons) {
  const e = qe.find((x) => x.questionId === c.questionId);
  if (!e || !!e.grade?.pass !== c.pass) mismatch++;
}
console.log("\n  cross-check vs consolidated.json: pass mismatches =", mismatch, "(0 = match)");

// ---- Repair checkpoint: what recovered to pass? ----
function readJSONLIfExists(p: string): Eval[] {
  try {
    const txt = readFileSync(p, "utf8");
    return txt
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}
const rep = readJSONLIfExists(REPAIR_CKPT).filter((e: any) => (e.modelLabel ?? "").includes("qwen3.6-27b"));
console.log("\n  repair checkpoint entries for qwen3.6-27b:", rep.length);
// group repair outcomes by questionId
const repById = new Map<string, any[]>();
for (const r of rep as any[]) {
  const a = repById.get(r.questionId) ?? [];
  a.push(r);
  repById.set(r.questionId, a);
}
console.log("  distinct dirty questionIds in repair:", repById.size);
for (const [qid, arr] of repById) {
  const anyPass = arr.some((a) => a.grade?.pass);
  const anyBlankAll = arr.every((a) => isBlank(a.raw));
  console.log(
    `    ${qid}: attempts=${arr.length} anyPass=${anyPass} allBlank=${anyBlankAll}`
  );
}

// Pre-repair count: count pass EXCLUDING repair-derived overrides to get raw
// Simplest raw read: count blanks as they'd be WITHOUT repair = the dirty set.
console.log(
  "\n  RAW (pre-repair) pass estimate: 164 minus repair-recovered-passes (see per-row above)."
);

// ============================ PART 2: RunPod json_object 300 ============================
console.log("\n" + hr);
console.log("PART 2: RunPod json_object full-300 (local-qwen36-27b-sft)");
console.log(hr);
const rp = readJSON<{ models: any[]; evaluations: Eval[] }>(RP);
const rpe = dedupeLatest(rp.evaluations);
const rpPass = countPass(rpe);
const rpBlank = rpe.filter((e) => isBlank(e.raw));
console.log("rows:", rpe.length, "| pass:", rpPass, "| blank:", rpBlank.length);
console.log("tier table (RunPod json_object):");
const rpT = tierTable(rpe);
for (const tg of TIERS) console.log(`  ${tg}: ${rpT[tg].pass}/${rpT[tg].n}  (blank ${rpT[tg].blank})`);
console.log("\nAGI rows in RunPod: pass=", rpT.AGI.pass, "blank=", rpT.AGI.blank, "/ 110");

// ============================ PART 2b: no-json 29 gate ============================
console.log("\n" + hr);
console.log("PART 2b: RunPod no-json 29-row gate (json-collapse isolation)");
console.log(hr);
const nj29 = readJSON<any>(NJ29);
// Explore shape
function summarize(o: any, d = 0): string {
  if (d > 2) return "...";
  if (Array.isArray(o)) return `array[${o.length}]` + (o[0] ? " {" + Object.keys(o[0]).join(",") + "}" : "");
  if (o && typeof o === "object") {
    const ks = Object.keys(o);
    return "{ " + ks.slice(0, 6).map((k) => `${k}:${summarize(o[k], d + 1)}`).join(", ") + " }";
  }
  return JSON.stringify(o).slice(0, 30);
}
console.log("shape:", summarize(nj29));

// Find rows: typically {questionId, model ('base'|'tuned'), pass, score, finish, ...}
function extractRows(o: any): any[] {
  if (Array.isArray(o)) return o;
  for (const k of ["rows", "results", "evaluations", "graded"]) if (o[k]) return o[k];
  return [];
}
const njRows = extractRows(nj29);
console.log("rows:", njRows.length, "sample:", njRows[0] ? Object.keys(njRows[0]).join(",") : "n/a");

// Build base/tuned pass counts
const byModel: Record<string, { n: number; pass: number; length: number }> = {};
for (const r of njRows) {
  const m = r.model ?? r.variant ?? r.kind ?? "?";
  const k = String(m).toLowerCase().includes("tun") || String(m).toLowerCase() === "tuned" ? "tuned" : "base";
  if (!byModel[k]) byModel[k] = { n: 0, pass: 0, length: 0 };
  byModel[k].n++;
  if (r.pass) byModel[k].pass++;
  const fin = r.finishReason ?? r.finish ?? r.finish_reason ?? "";
  if (String(fin).toLowerCase().includes("length")) byModel[k].length++;
}
console.log("no-json 29 gate by model:", JSON.stringify(byModel));
