#!/usr/bin/env tsx

import fs from "fs";
import path from "path";
import { execFileSync, execSync } from "child_process";

type Args = {
  combined?: string;
  suite?: string;
  site?: string;
  message?: string;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {};
  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];
    if (token === "--combined") args.combined = argv[++i];
    else if (token === "--suite") args.suite = argv[++i];
    else if (token === "--site") args.site = argv[++i];
    else if (token === "--message") args.message = argv[++i];
  }
  return args;
}

function run(cmd: string) {
  execSync(cmd, { stdio: "inherit" });
}

async function main() {
  const args = parseArgs(process.argv);
  const combinedPath = path.resolve(
    args.combined || "../Tradebench-lite-full-test/results/combined-60q-all.json"
  );
  const suiteId = args.suite || "60q-all";
  const siteRepo = path.resolve(args.site || "../tradebench-site");
  const outPath = path.resolve("results/site-current.json");
  const commitMessage =
    args.message || `data: update leaderboard summary (${suiteId})`;

  if (!fs.existsSync(siteRepo)) {
    console.error(`Site repo not found at ${siteRepo}`);
    process.exit(1);
  }

  console.log("➡️  Building sanitized summary...");
  execFileSync(
    "npx",
    [
      "tsx",
      "scripts/make-public-summary.ts",
      "--in",
      combinedPath,
      "--out",
      outPath,
      "--suite",
      suiteId,
    ],
    { stdio: "inherit" }
  );

  const targetPath = path.join(siteRepo, "public", "data", "current.json");
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(outPath, targetPath);
  console.log(`📦 Copied summary to ${targetPath}`);

  console.log("📝 Committing and pushing to tradebench-site...");
  try {
    run(`git -C ${siteRepo} add public/data/current.json`);
    run(`git -C ${siteRepo} commit -m "${commitMessage}"`);
  } catch (error: any) {
    if (error?.status === 1) {
      console.warn("No changes to commit. Skipping push.");
      return;
    }
    throw error;
  }
  run(`git -C ${siteRepo} push`);
  console.log("✅ Published. Triggered Vercel redeploy automatically.");
}

main().catch(err => {
  console.error("❌ publish-site failed:", err);
  process.exit(1);
});
