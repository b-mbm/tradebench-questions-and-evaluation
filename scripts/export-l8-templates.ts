#!/usr/bin/env tsx

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { loadAllQuestions } from "../questions";
import type { FullTestQuestion } from "../types";
import type { SchemaQuestion, SchemaRubric } from "../../Round-5-Extension-1-schema/src/types/schema";
import { loadRubric } from "../../Round-5-Extension-1-schema/src/rubrics/loader";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = path.resolve(__dirname, "..", "results");
const OUT_DIR = path.join(RESULTS_DIR, "l8-templates");

function ensureSchemaQuestion(meta: Record<string, unknown> | undefined): SchemaQuestion | null {
  if (!meta) return null;
  const q = (meta as any).question;
  if (q && typeof q === "object") return q as SchemaQuestion;
  return null;
}

function defaultValueForField(field: string): unknown {
  const f = field.toLowerCase();
  if (/(rate|apr|pct|percentage|price|amount|size|days|duration|liquidity|value|usd)$/.test(f)) return 0;
  if (/^(meets_|within_|requires_)/.test(f)) return false;
  if (/^(intent|order_type|asset|venue|venue_name|reasoning|follow_up|follow_up_description|rationale)$/.test(f)) return "";
  return "";
}

function buildTemplate(schemaQ: SchemaQuestion, rubric: SchemaRubric): Record<string, unknown> {
  const template: Record<string, unknown> = {};
  const expected = new Set(rubric.expected_fields || []);

  // Seed with known expected_values from question for realistic examples
  for (const [k, v] of Object.entries(schemaQ.expected_values || {})) {
    template[k] = v as unknown;
  }

  // Ensure all expected fields are present
  for (const field of expected) {
    if (!(field in template)) {
      template[field] = defaultValueForField(field);
    }
  }

  // Helpful extras often used across schema
  if (!("reasoning" in template)) template["reasoning"] = "";
  if (!("requires_follow_up" in template)) template["requires_follow_up"] = false;
  if (!("follow_up_description" in template)) template["follow_up_description"] = "";

  return template;
}

async function main(): Promise<void> {
  const all = await loadAllQuestions();
  const l8 = all.filter(q => {
    if (q.source !== "r5e1") return false;
    const schemaQ = ensureSchemaQuestion(q.meta);
    const sid = schemaQ?.id || "";
    return /^L8-/.test(sid);
  });
  if (!l8.length) {
    console.log("No L8 questions found in r5e1.");
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });

  const index: Array<{ id: string; rubric_id: string; file: string }> = [];

  for (const q of l8) {
    const schemaQ = ensureSchemaQuestion(q.meta);
    if (!schemaQ) continue;
    const rubric = loadRubric(schemaQ.rubric_id);
    const template = buildTemplate(schemaQ, rubric);
    const fname = `l8-template-${q.id}.json`;
    const fpath = path.join(OUT_DIR, fname);
    await writeFile(fpath, JSON.stringify(template, null, 2), "utf8");
    index.push({ id: q.id, rubric_id: schemaQ.rubric_id, file: fpath });
  }

  const indexPath = path.join(OUT_DIR, "index.json");
  await writeFile(indexPath, JSON.stringify(index, null, 2), "utf8");
  console.log(`Exported ${index.length} L8 templates to ${OUT_DIR}`);
}

main().catch(err => {
  console.error("export-l8-templates failed:", err);
  process.exit(1);
});
