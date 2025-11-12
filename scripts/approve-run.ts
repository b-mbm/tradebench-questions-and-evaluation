#!/usr/bin/env tsx

import fs from "fs";
import path from "path";

type ResultFile = {
  runAt: string;
  label: string;
  models: string[];
  questionIds: string[];
  evaluations: Array<{ modelId: string; [k: string]: any }>;
};

type Manifest = {
  updatedAt: string | null;
  entries: Record<
    string,
    {
      file: string;
      runAt: string;
      approvedAt: string;
      label: string;
      source: string;
    }
  >;
};

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];
    if (token === "--source") {
      args.source = argv[++i];
    } else if (token === "--dest-name") {
      args.destName = argv[++i];
    }
  }
  if (!args.source) {
    console.error("Usage: npx tsx scripts/approve-run.ts --source results/community/<file>.json [--dest-name custom.json]");
    process.exit(1);
  }
  return args;
}

const ROOT = process.cwd();
const RESULTS_DIR = path.join(ROOT, "results");
const OFFICIAL_DIR = path.join(RESULTS_DIR, "official");
const MANIFEST_PATH = path.join(RESULTS_DIR, "official-manifest.json");

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function loadManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return { updatedAt: null, entries: {} };
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
}

function saveManifest(manifest: Manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function nextAvailablePath(baseDir: string, desiredName: string) {
  const { name, ext } = path.parse(desiredName);
  let candidate = path.join(baseDir, desiredName);
  let counter = 1;
  while (fs.existsSync(candidate)) {
    candidate = path.join(baseDir, `${name}-${counter}${ext}`);
    counter += 1;
  }
  return candidate;
}

async function main() {
  const args = parseArgs(process.argv);
  const sourcePath = path.isAbsolute(args.source) ? args.source : path.join(ROOT, args.source);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file not found: ${sourcePath}`);
  }

  const payload = JSON.parse(fs.readFileSync(sourcePath, "utf8")) as ResultFile;
  if (!Array.isArray(payload.models) || !payload.models.length) {
    throw new Error("Result file is missing models array.");
  }

  ensureDir(OFFICIAL_DIR);
  const desiredName = args.destName || path.basename(sourcePath);
  const destPath = nextAvailablePath(OFFICIAL_DIR, desiredName);
  fs.copyFileSync(sourcePath, destPath);

  const manifest = loadManifest();
  const approvedAt = new Date().toISOString();
  const relDest = path.relative(ROOT, destPath);
  const relSource = path.relative(ROOT, sourcePath);

  for (const modelId of payload.models) {
    manifest.entries[modelId] = {
      file: relDest,
      runAt: payload.runAt,
      approvedAt,
      label: payload.label,
      source: relSource,
    };
  }
  manifest.updatedAt = approvedAt;
  saveManifest(manifest);

  console.log(`✅ Approved ${payload.models.length} model(s). Copied to ${relDest} and updated manifest.`);
}

main().catch(err => {
  console.error("❌ approve-run failed:", err);
  process.exit(1);
});
