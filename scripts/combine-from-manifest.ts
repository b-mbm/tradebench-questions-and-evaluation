#!/usr/bin/env tsx

import fs from "fs";
import path from "path";

type ResultFile = {
  evaluations: any[];
  models: string[];
  questionIds: string[];
};

type ManifestEntry = {
  file: string;
  label: string;
  runAt: string;
  approvedAt: string;
  source: string;
};

type Manifest = {
  updatedAt: string | null;
  entries: Record<string, ManifestEntry>;
};

function usage() {
  console.error("Usage: npx tsx scripts/combine-from-manifest.ts results/official-manifest.json --out results/official-combined.json --label official");
}

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  const positional: string[] = [];
  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];
    if (token === "--out") args.out = argv[++i];
    else if (token === "--label") args.label = argv[++i];
    else positional.push(token);
  }
  if (!positional.length) usage();
  return { manifestPath: positional[0], out: args.out, label: args.label || "official-combined" };
}

function loadManifest(p: string): Manifest {
  return JSON.parse(fs.readFileSync(p, "utf8")) as Manifest;
}

function loadResultFile(filePath: string): ResultFile {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as ResultFile;
}

async function main() {
  const { manifestPath, out, label } = parseArgs(process.argv);
  if (!manifestPath || !out) {
    usage();
    process.exit(1);
  }
  const manifest = loadManifest(manifestPath);
  const entries = Object.values(manifest.entries);
  if (!entries.length) {
    throw new Error("Manifest has no entries.");
  }
  const allEvaluations: any[] = [];
  const modelSet = new Set<string>();
  const qSet = new Set<string>();
  const sources: string[] = [];

  for (const entry of entries) {
    const filePath = path.isAbsolute(entry.file) ? entry.file : path.join(process.cwd(), entry.file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Manifest entry file not found: ${filePath}`);
    }
    const data = loadResultFile(filePath);
    allEvaluations.push(...data.evaluations);
    data.models.forEach(m => modelSet.add(m));
    data.questionIds.forEach(q => qSet.add(q));
    sources.push(entry.file);
  }

  const outPath = path.isAbsolute(out) ? out : path.join(process.cwd(), out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const payload = {
    combinedLabel: label,
    runAt: new Date().toISOString(),
    sources,
    models: Array.from(modelSet),
    questionIds: Array.from(qSet),
    evaluations: allEvaluations,
  };

  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(`✅ Combined ${entries.length} manifest entries into ${outPath}`);
}

main().catch(err => {
  console.error("❌ combine-from-manifest failed:", err);
  process.exit(1);
});
