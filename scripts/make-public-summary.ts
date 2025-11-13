#!/usr/bin/env tsx

import fs from "fs";
import path from "path";

type Grade = { pass?: boolean; score?: number };
type EvalRow = { modelId: string; questionId: string; grade?: Grade; durationMs?: number };

function usage() {
  console.error(
    "Usage: npx tsx scripts/make-public-summary.ts --in results/official-combined.json --out site-current.json [--suite r5e1-60q]"
  );
}

function parseArgs(argv: string[]) {
  const args: Record<string, string> = { suite: "r5e1-60q" };
  for (let i = 2; i < argv.length; i++) {
    const t = argv[i];
    if (t === "--in") args.in = argv[++i];
    else if (t === "--out") args.out = argv[++i];
    else if (t === "--suite") args.suite = argv[++i];
  }
  if (!args.in || !args.out) usage();
  return args;
}

function levelFromQid(id: string): string {
  const m = id.match(/^([A-Z]+\d?)/i) || id.match(/^(L\d+)/i);
  if (m) return m[1].toUpperCase();
  const m2 = id.match(/^L(\d+)/i);
  return m2 ? `L${m2[1]}` : "L?";
}

async function main() {
  const args = parseArgs(process.argv);
  const inPath = path.isAbsolute(args.in) ? args.in : path.join(process.cwd(), args.in);
  const outPath = path.isAbsolute(args.out) ? args.out : path.join(process.cwd(), args.out);

  const combined = JSON.parse(fs.readFileSync(inPath, "utf8"));
  const rows: EvalRow[] = combined.evaluations || [];

  // Aggregate per model
const models = new Map<string, {
  total: number;
  passed: number;
  scoreSum: number;
  durationSum: number;
  samples: number;
  byLevel: Record<string, { total: number; passed: number }>;
}>();
  for (const r of rows) {
    if (!r || !r.modelId || !r.questionId) continue;
    const level = levelFromQid(r.questionId);
    const g = r.grade || { pass: false, score: 0 };
    const m =
      models.get(r.modelId) ||
      { total: 0, passed: 0, scoreSum: 0, durationSum: 0, samples: 0, byLevel: {} };
    m.total += 1;
    if (g.pass) m.passed += 1;
    m.scoreSum += Number(g.score || 0);
    if (typeof r.durationMs === "number") {
      m.durationSum += r.durationMs;
      m.samples += 1;
    }
    const bl = m.byLevel[level] || { total: 0, passed: 0 };
    bl.total += 1;
    if (g.pass) bl.passed += 1;
    m.byLevel[level] = bl;
    models.set(r.modelId, m);
  }

  const payload = {
    schemaVersion: "1.0",
    suiteId: args.suite,
    publishedAt: new Date().toISOString(),
    models: Array.from(models.entries()).map(([id, m]) => ({
      id,
      total: m.total,
      passed: m.passed,
      passRate: m.total ? m.passed / m.total : 0,
      avgScore: m.total ? m.scoreSum / m.total : 0,
      avgTimeMs: m.samples ? m.durationSum / m.samples : null,
      byLevel: m.byLevel,
    })),
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(`✅ Wrote sanitized summary to ${outPath}`);
}

main().catch(err => {
  console.error("❌ make-public-summary failed:", err);
  process.exit(1);
});
