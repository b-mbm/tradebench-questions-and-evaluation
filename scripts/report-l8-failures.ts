#!/usr/bin/env tsx

import { writeFile } from "fs/promises";
import path from "path";

import type { SuiteResultFile, EvaluationRow } from "../types";
import { RESULTS_DIR } from "./shared";
import { readFileSync } from "fs";

function csvEscape(s: unknown): string {
  const t = String(s ?? "");
  if (t === "") return "";
  const needs = /[",\n]/.test(t);
  return needs ? `"${t.replace(/"/g, '""')}"` : t;
}

async function main(): Promise<void> {
  const fileArg = process.argv[2] || path.join(RESULTS_DIR, "combined-60q-all.json");
  const raw = readFileSync(fileArg, "utf8");
  const data = JSON.parse(raw) as SuiteResultFile;
  const rows: EvaluationRow[] = data.evaluations || [];

  const l8Fails = rows.filter(r => r.questionSource === "r5e1" && /^r5e1-L8-/.test(r.questionId) && !r.grade.pass);

  const out: string[] = [];
  out.push([
    "modelId",
    "modelLabel",
    "questionId",
    "details",
    "hasNormalized",
    "sanitizedLength",
    "endsWithBrace"
  ].map(csvEscape).join(","));

  for (const r of l8Fails) {
    const d = r.grade?.details ?? "";
    const diag = (r.grade as any)?.diagnostics ?? {};
    const hasNorm = Object.prototype.hasOwnProperty.call(diag, "normalizedResponse") && diag.normalizedResponse != null;
    const text = (r.sanitized || r.raw || "").toString();
    const ends = /}\s*$/.test(text);
    out.push([
      r.modelId,
      r.modelLabel,
      r.questionId,
      d,
      hasNorm ? "true" : "false",
      String(text.length),
      ends ? "true" : "false",
    ].map(csvEscape).join(","));
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = path.join(RESULTS_DIR, `l8-failures-${stamp}.csv`);
  await writeFile(outPath, out.join("\n"), "utf8");
  console.log(`Wrote L8 failures CSV: ${outPath} (${l8Fails.length} rows)`);
}

main().catch(err => {
  console.error("report-l8-failures failed:", err);
  process.exit(1);
});

