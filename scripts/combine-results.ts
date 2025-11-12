#!/usr/bin/env tsx

import fs from "fs";

function parseArgs(argv: string[]) {
  const args: Record<string, any> = {};
  const inputs: string[] = [];
  for (let i = 2; i < argv.length; i++) {
    const t = argv[i];
    if (t === "--label") args.label = argv[++i];
    else if (t === "--out") args.out = argv[++i];
    else inputs.push(t);
  }
  if (!inputs.length || !args.out) {
    console.error("Usage: npx tsx Tradebench-lite-full-test/scripts/combine-results.ts <file1.json> [file2.json..] --label <label> --out <out.json>");
    process.exit(1);
  }
  return { inputs, label: args.label || "combined", out: args.out };
}

function loadJson(p: string): any {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

async function run() {
  const { inputs, label, out } = parseArgs(process.argv);
  const files = inputs.map(loadJson);
  const all = files.flatMap(f => f.evaluations || []);
  const models = unique(all.map((r: any) => r.modelId));
  const questionIds = unique(all.map((r: any) => r.questionId));
  const payload = {
    combinedLabel: label,
    runAt: new Date().toISOString(),
    sources: inputs,
    models,
    questionIds,
    evaluations: all,
  };
  fs.writeFileSync(out, JSON.stringify(payload, null, 2));
  console.log(`✅ Combined ${inputs.length} file(s) into ${out}`);
}

run().catch(err => {
  console.error("❌ combine-results failed:", err);
  process.exit(1);
});

