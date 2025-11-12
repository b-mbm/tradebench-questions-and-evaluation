#!/usr/bin/env tsx

import fs from "fs";

type EvaluationRow = {
  modelId: string;
  questionId: string;
  error?: string;
  [k: string]: any;
};

type ResultFile = {
  evaluations: EvaluationRow[];
  [k: string]: any;
};

function parseArgs(argv: string[]) {
  const args: Record<string, any> = { inplace: false };
  for (let i = 2; i < argv.length; i++) {
    const t = argv[i];
    if (t === "--base") args.base = argv[++i];
    else if (t === "--repairs") args.repairs = argv[++i];
    else if (t === "--out") args.out = argv[++i];
    else if (t === "--inplace") args.inplace = true;
  }
  if (!args.base || !args.repairs) {
    console.error("Usage: npx tsx Tradebench-lite-full-test/scripts/merge-repairs.ts --base <base.json> --repairs <retry.json[,..]> [--inplace|--out <path>]");
    process.exit(1);
  }
  return args;
}

function loadJson(p: string): any {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function saveJson(p: string, data: any) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

function merge(base: ResultFile, repairs: ResultFile[]): ResultFile {
  const key = (r: EvaluationRow) => `${r.modelId}::${r.questionId}`;
  const map = new Map<string, EvaluationRow>();
  for (const r of base.evaluations) map.set(key(r), r);
  for (const file of repairs) {
    for (const r of file.evaluations) {
      map.set(key(r), r);
    }
  }
  const merged: ResultFile = { ...base, evaluations: Array.from(map.values()) };
  return merged;
}

async function run() {
  const args = parseArgs(process.argv);
  const base: ResultFile = loadJson(args.base);
  const repairPaths = String(args.repairs).split(",").map((s: string) => s.trim()).filter(Boolean);
  const repairs: ResultFile[] = repairPaths.map(loadJson);
  const out = merge(base, repairs);
  const outPath = args.inplace ? args.base : args.out || args.base.replace(/\.json$/i, ".merged.json");
  saveJson(outPath, out);
  console.log(`✅ Merged ${repairs.length} repair file(s) into ${outPath}`);
}

run().catch(err => {
  console.error("❌ merge-repairs failed:", err);
  process.exit(1);
});

