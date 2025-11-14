#!/usr/bin/env tsx

import fs from "fs";
import path from "path";

type SiteModel = {
  id: string;
  total?: number;
  passed?: number;
  passRate?: number;
  avgScore?: number;
  avgTimeMs?: number | null;
  byLevel?: Record<string, { total: number; passed: number }>;
  [key: string]: any;
};

type SitePayload = {
  schemaVersion?: string;
  suiteId?: string;
  publishedAt?: string;
  models?: SiteModel[];
  [key: string]: any;
};

function usage() {
  console.error(
    "Usage: npx tsx scripts/merge-site-json.ts --source results/site-current.json --dest website/public/data/current.json [--seed data/legacy-leaderboard.json]"
  );
}

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];
    if (token === "--source") args.source = argv[++i];
    else if (token === "--dest") args.dest = argv[++i];
    else if (token === "--seed") args.seed = argv[++i];
  }
  if (!args.source || !args.dest) {
    usage();
    process.exit(1);
  }
  return args;
}

function readJson(filePath: string): SitePayload | null {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as SitePayload;
}

function normalizeModels(payload: SitePayload | null): SiteModel[] {
  if (!payload || !Array.isArray(payload.models)) return [];
  return payload.models.filter(m => m && typeof m.id === "string");
}

function main() {
  const args = parseArgs(process.argv);
  const sourcePath = path.isAbsolute(args.source) ? args.source : path.join(process.cwd(), args.source);
  const destPath = path.isAbsolute(args.dest) ? args.dest : path.join(process.cwd(), args.dest);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source summary not found: ${sourcePath}`);
  }

  const patch = readJson(sourcePath);
  if (!patch) throw new Error("Patch summary is empty.");

  const seedPath = args.seed ? (path.isAbsolute(args.seed) ? args.seed : path.join(process.cwd(), args.seed)) : null;
  const seed = seedPath ? readJson(seedPath) : null;
  const existing = readJson(destPath);

  const merged = new Map<string, SiteModel>();
  for (const m of normalizeModels(seed)) {
    merged.set(m.id, m);
  }
  for (const m of normalizeModels(existing)) {
    merged.set(m.id, m);
  }
  for (const m of normalizeModels(patch)) {
    merged.set(m.id, m);
  }

  const mergedModels = Array.from(merged.values()).sort((a, b) => {
    const rateA = typeof a.passRate === "number" ? a.passRate : 0;
    const rateB = typeof b.passRate === "number" ? b.passRate : 0;
    if (rateA !== rateB) return rateB - rateA;
    const timeA = typeof a.avgTimeMs === "number" ? a.avgTimeMs : Number.POSITIVE_INFINITY;
    const timeB = typeof b.avgTimeMs === "number" ? b.avgTimeMs : Number.POSITIVE_INFINITY;
    return timeA - timeB;
  });

  const output: SitePayload = {
    schemaVersion: patch.schemaVersion || existing?.schemaVersion || seed?.schemaVersion || "1.0",
    suiteId: patch.suiteId || existing?.suiteId || seed?.suiteId,
    publishedAt: patch.publishedAt || existing?.publishedAt || seed?.publishedAt || new Date().toISOString(),
    models: mergedModels,
  };

  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, JSON.stringify(output, null, 2));
  console.log(`✅ Merged ${mergedModels.length} models into ${destPath}`);
}

main();
