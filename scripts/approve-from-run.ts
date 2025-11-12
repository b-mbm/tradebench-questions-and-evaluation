#!/usr/bin/env tsx

import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

function usage() {
  console.error(
    "Usage: npx tsx scripts/approve-from-run.ts --run-id <id> [--owner <owner>] [--repo <repo>] [--artifact-contains results] [--dest-name <file.json>]"
  );
}

function parseArgs(argv: string[]) {
  const args: Record<string, string> = { artifactContains: "results" };
  for (let i = 2; i < argv.length; i++) {
    const t = argv[i];
    if (t === "--run-id") args.runId = argv[++i];
    else if (t === "--owner") args.owner = argv[++i];
    else if (t === "--repo") args.repo = argv[++i];
    else if (t === "--artifact-contains") args.artifactContains = argv[++i];
    else if (t === "--dest-name") args.destName = argv[++i];
  }
  return args;
}

async function ghJson(url: string, token: string) {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } });
  if (!r.ok) throw new Error(`GitHub API ${r.status}: ${await r.text()}`);
  return r.json();
}

async function ghBuffer(url: string, token: string) {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } });
  if (!r.ok) throw new Error(`GitHub API ${r.status}: ${await r.text()}`);
  const ab = await r.arrayBuffer();
  return Buffer.from(ab);
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.runId) {
    usage();
    process.exit(1);
  }
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
  if (!token) throw new Error("GITHUB_TOKEN/GH_TOKEN is required");
  const repoFull = process.env.GITHUB_REPOSITORY || "";
  const owner = args.owner || repoFull.split("/")[0];
  const repo = args.repo || repoFull.split("/")[1];
  if (!owner || !repo) throw new Error("Owner/repo not resolved; set --owner/--repo or GITHUB_REPOSITORY");

  // List artifacts for the run
  const listUrl = `https://api.github.com/repos/${owner}/${repo}/actions/runs/${args.runId}/artifacts`;
  const list = await ghJson(listUrl, token);
  const artifacts = (list?.artifacts || []) as Array<{ id: number; name: string; archive_download_url: string }>;
  const match = artifacts.find(a => a.name.includes(args.artifactContains || "results"));
  if (!match) throw new Error("No matching artifact found for the run");

  // Download zip
  const zipBuf = await ghBuffer(match.archive_download_url, token);
  const zip = new AdmZip(zipBuf);
  const tmpDir = fs.mkdtempSync(path.join(process.cwd(), "tmp-approve-"));
  zip.extractAllTo(tmpDir, true);

  // Find a JSON file inside
  const files = fs.readdirSync(tmpDir).filter(f => f.endsWith(".json"));
  if (!files.length) throw new Error("No JSON found inside artifact");
  const chosen = files[0];
  const srcPath = path.join(tmpDir, chosen);

  // Place it under results/community for traceability
  const communityDir = path.join(process.cwd(), "results", "community");
  fs.mkdirSync(communityDir, { recursive: true });
  const destCommunity = path.join(communityDir, args.destName || chosen);
  fs.copyFileSync(srcPath, destCommunity);

  // Call approve-run to copy to official and update manifest
  const { spawnSync } = await import("node:child_process");
  const res = spawnSync("npx", ["tsx", "scripts/approve-run.ts", "--source", path.relative(process.cwd(), destCommunity)], {
    stdio: "inherit",
  });
  if (res.status !== 0) throw new Error("approve-run failed");

  console.log(`✅ Approved from run ${args.runId}: ${destCommunity}`);
}

main().catch(err => {
  console.error("❌ approve-from-run failed:", err);
  process.exit(1);
});

