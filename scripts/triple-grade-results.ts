#!/usr/bin/env tsx

import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";

import type { EvaluationRow, FullTestQuestion, SuiteResultFile } from "../types";
import { loadAllQuestions } from "../questions";
import { getGrader } from "../rubrics";

// Schema-specific imports to allow shuffled rubric/question stability checks
import type { SchemaQuestion, SchemaRubric } from "../../Round-5-Extension-1-schema/src/types/schema";
import { loadRubric } from "../../Round-5-Extension-1-schema/src/rubrics/loader";
import { gradeSchemaResponse } from "../../Round-5-Extension-1-schema/src/grading/schema-grader";

const RESULTS_DIR = path.resolve(__dirname, "..", "results");
const RUNS = 3;
const VARIANCE_WARNING_THRESHOLD = 0.02; // flag if variance > 0.02

function nowStamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(input: T[], seed: number): T[] {
  const arr = input.slice();
  const rng = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function cloneRubric(rubric: SchemaRubric): SchemaRubric {
  return JSON.parse(JSON.stringify(rubric)) as SchemaRubric;
}

function shuffleRubric(rubric: SchemaRubric, seed: number): SchemaRubric {
  const clone = cloneRubric(rubric);
  clone.expected_fields = shuffleWithSeed(clone.expected_fields, seed + 11);
  clone.required_fields = shuffleWithSeed(clone.required_fields, seed + 17);
  const weightEntries = Object.entries(clone.field_weights);
  clone.field_weights = Object.fromEntries(shuffleWithSeed(weightEntries, seed + 23));
  if (clone.synonyms) {
    clone.synonyms = Object.fromEntries(shuffleWithSeed(Object.entries(clone.synonyms), seed + 29));
  }
  return clone;
}

function shuffleSchemaQuestion(question: SchemaQuestion, seed: number): SchemaQuestion {
  const q = JSON.parse(JSON.stringify(question)) as SchemaQuestion;
  q.expected_values = Object.fromEntries(
    shuffleWithSeed(Object.entries(q.expected_values), seed + 37),
  );
  return q;
}

async function loadQuestionsMap(): Promise<Map<string, FullTestQuestion>> {
  const all = await loadAllQuestions();
  const map = new Map<string, FullTestQuestion>();
  for (const q of all) map.set(q.id, q);
  return map;
}

function variance(values: number[]): number {
  const n = values.length;
  if (!n) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / n;
  return values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
}

async function tripleGradeFile(filePath: string, questions: Map<string, FullTestQuestion>): Promise<string | null> {
  const raw = await readFile(filePath, "utf8");
  const data = JSON.parse(raw) as SuiteResultFile;

  const flagged: Array<{
    modelId: string;
    modelLabel: string;
    questionId: string;
    source: string;
    scores: number[];
    variance: number;
  }> = [];

  for (const row of data.evaluations as EvaluationRow[]) {
    const question = questions.get(row.questionId);
    if (!question) continue;

    const scores: number[] = [];

    if (question.source === "r5e1") {
      // Schema: use shuffled rubric/question per run to verify determinism
      const schemaQuestion = (question.meta as any)?.question as SchemaQuestion;
      if (!schemaQuestion) continue;
      const rubric = loadRubric(schemaQuestion.rubric_id);
      for (let i = 0; i < RUNS; i += 1) {
        const base = (i + 1) * 1000;
        const qSeed = base + hashString(schemaQuestion.id);
        const rSeed = base + hashString(schemaQuestion.rubric_id);
        const qShuffled = shuffleSchemaQuestion(schemaQuestion, qSeed);
        const rShuffled = shuffleRubric(rubric, rSeed);
        const grade = gradeSchemaResponse(row.sanitized || row.raw, qShuffled, rShuffled);
        scores.push(Math.max(0, Math.min(1, grade.score)));
      }
    } else {
      // Other sources (r4e4, l9, l10, agi): grade deterministically three times
      const grader = getGrader(question.graderId);
      for (let i = 0; i < RUNS; i += 1) {
        const grade = await grader({
          question,
          rawResponse: row.raw,
          sanitizedResponse: row.sanitized || row.raw,
        });
        scores.push(Math.max(0, Math.min(1, grade.score)));
      }
    }

    const v = variance(scores);
    if (v > VARIANCE_WARNING_THRESHOLD) {
      flagged.push({
        modelId: row.modelId,
        modelLabel: row.modelLabel,
        questionId: row.questionId,
        source: row.questionSource,
        scores,
        variance: v,
      });
    }
  }

  if (!flagged.length) return null;

  const base = path.basename(filePath, ".json");
  const outCsv = path.join(
    path.dirname(filePath),
    `${base}-triple-grade-variance-${nowStamp()}.csv`,
  );
  const header = "modelId,modelLabel,questionId,source,score1,score2,score3,variance\n";
  const body = flagged
    .map(
      f =>
        [
          f.modelId,
          f.modelLabel,
          f.questionId,
          f.source,
          f.scores[0].toFixed(4),
          f.scores[1].toFixed(4),
          f.scores[2].toFixed(4),
          f.variance.toFixed(4),
        ].join(","),
    )
    .join("\n");
  await writeFile(outCsv, header + body, "utf8");
  return outCsv;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  let files: string[] = [];
  if (args.length) {
    // explicit files passed
    files = args
      .map(p => path.resolve(p))
      .filter(p => p.endsWith(".json"));
  } else {
    // default: all 60q-* result files in results/
    const entries = await readdir(RESULTS_DIR);
    files = entries
      .filter(name => name.startsWith("60q-") && name.endsWith(".json"))
      .map(name => path.join(RESULTS_DIR, name));
  }

  if (!files.length) {
    console.log("No 60q JSON files found to triple-grade.");
    return;
  }

  const qmap = await loadQuestionsMap();
  const outputs: string[] = [];

  for (const f of files) {
    console.log(`\n🔁 Triple-grading ${f}`);
    const out = await tripleGradeFile(f, qmap);
    if (out) {
      console.log(`⚠️ Variance report: ${out}`);
      outputs.push(out);
    } else {
      console.log("✅ Stable (no variance > 0.02 detected)");
    }
  }

  if (outputs.length) {
    console.log("\nCompleted with variance flags. Reports:");
    for (const o of outputs) console.log(`- ${o}`);
  } else {
    console.log("\nAll files stable across triple-grade recheck.");
  }
}

main().catch(err => {
  console.error("❌ triple-grade-results failed:", err);
  process.exit(1);
});

