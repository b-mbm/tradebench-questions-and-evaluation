#!/usr/bin/env tsx

import "dotenv/config";
import fs from "fs";
import path from "path";

import {
  MODELS,
  callExecuteOneModel,
  getModelLabel,
  DEFAULT_MODEL_OPTIONS,
  type ExecuteOneCallOptions,
  type ModelConfig,
  type Provider,
} from "../../src/models/model-runner";
import { SCHEMA_QUESTIONS } from "../../src/questions/schema-questions";
import { loadRubric } from "../../src/rubrics/loader";
import { gradeSchemaResponse } from "../../src/grading/schema-grader";
import type { GradeResult } from "../../src/types/schema";

type CliArgs = {
  ids?: string[];
  label?: string;
  filePrefix?: string;
  noCall?: boolean;
};

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {};
  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];
    if (token === "--ids") {
      const value = argv[++i] || "";
      args.ids = value.split(",").map(s => s.trim()).filter(Boolean);
    } else if (token === "--label") {
      args.label = argv[++i];
    } else if (token === "--file-prefix") {
      args.filePrefix = argv[++i];
    } else if (token === "--no-call") {
      args.noCall = true;
    }
  }
  return args;
}

const OUTPUT_DIR = path.join(process.cwd(), "Tradebench-lite-full-test", "results");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const delay = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));

type EvaluationRow = {
  modelId: string;
  modelLabel: string;
  questionId: string;
  raw: string;
  durationMs: number;
  grade: GradeResult;
  error?: string;
};

type ResultFile = {
  runAt: string;
  label: string;
  models: string[];
  questionIds: string[];
  evaluations: EvaluationRow[];
};

type RetryCategory = "timeout" | "429" | "503" | "blank" | "parse" | "other";

function classifyError(err: unknown): RetryCategory {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  if (/timeout/.test(msg)) return "timeout";
  if (/429/.test(msg)) return "429";
  if (/503|unavailable|overloaded/.test(msg)) return "503";
  if (/empty|whitespace-only|no content/.test(msg)) return "blank";
  return "other";
}

async function runModelOnQuestion(
  model: ModelConfig,
  question: (typeof SCHEMA_QUESTIONS)[number],
  overrides: ExecuteOneCallOptions | undefined,
  maxAttempts: number,
  baseDelayMs: number,
  noCall: boolean
): Promise<EvaluationRow> {
  const rubric = loadRubric(question.rubric_id);
  let attempt = 0;
  let lastErr: any = null;
  let started = Date.now();

  while (attempt < Math.max(1, maxAttempts)) {
    attempt += 1;
    started = Date.now();
    let raw = "";
    try {
      if (noCall) {
        throw new Error("--no-call scaffolding mode enabled");
      }
      const result = await callExecuteOneModel(model.id, question, { ...DEFAULT_MODEL_OPTIONS, ...overrides });
      raw = result.text ?? "";

      const grade = gradeSchemaResponse(raw, question, rubric);

      const parseFailed = !grade.normalizedResponse;
      if (parseFailed && attempt < maxAttempts) {
        const wait = Math.min(baseDelayMs * attempt, 8000);
        await delay(wait);
        lastErr = new Error("parse failure");
        continue;
      }

      return {
        modelId: model.id,
        modelLabel: getModelLabel(model.id),
        questionId: question.id,
        raw,
        durationMs: Date.now() - started,
        grade,
      };
    } catch (error) {
      lastErr = error;
      const cat = classifyError(error);
      if (attempt < maxAttempts && ["timeout", "429", "503", "blank"].includes(cat)) {
        const wait = Math.min(baseDelayMs * attempt, 12000);
        await delay(wait);
        continue;
      }
      return {
        modelId: model.id,
        modelLabel: getModelLabel(model.id),
        questionId: question.id,
        raw,
        durationMs: Date.now() - started,
        grade: {
          pass: false,
          confidence: 0,
          score: 0,
          fieldScores: {},
          normalizedResponse: null,
          failureReasons: ["error"],
          parsingMethod: "none",
        },
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Fallback if loop exits unexpectedly
  return {
    modelId: model.id,
    modelLabel: getModelLabel(model.id),
    questionId: question.id,
    raw: "",
    durationMs: 0,
    grade: {
      pass: false,
      confidence: 0,
      score: 0,
      fieldScores: {},
      normalizedResponse: null,
      failureReasons: ["error"],
      parsingMethod: "none",
    },
    error: lastErr instanceof Error ? lastErr.message : String(lastErr),
  };
}

function selectModels(): ModelConfig[] {
  const env = (process.env.MODEL_IDS || "").trim();
  if (!env) return MODELS;
  const ids = new Set(env.split(",").map(s => s.trim()).filter(Boolean));
  const chosen = MODELS.filter(m => ids.has(m.id));
  const missing = Array.from(ids).filter(id => !chosen.some(m => m.id === id));
  if (missing.length) {
    console.warn(`⚠️ Requested models not available in roster/env: ${missing.join(", ")}`);
  }
  if (!chosen.length) {
    throw new Error("No models selected; check MODEL_IDS or API keys.");
  }
  return chosen;
}

function selectQuestions(ids?: string[]) {
  if (!ids || !ids.length) return SCHEMA_QUESTIONS;
  const set = new Set(ids);
  const selected = SCHEMA_QUESTIONS.filter(q => set.has(q.id));
  const missing = Array.from(set).filter(id => !selected.some(q => q.id === id));
  if (missing.length) {
    console.warn(`⚠️ Question IDs not found: ${missing.join(", ")}`);
  }
  if (!selected.length) {
    throw new Error("No questions selected; check --ids value.");
  }
  return selected;
}

async function run(): Promise<void> {
  const args = parseArgs(process.argv);
  const models = selectModels();
  const questions = selectQuestions(args.ids);

  const label = args.label || "60q-run";
  const filePrefix = args.filePrefix || label;

  const retryAttempts = Number(process.env.RETRY_ATTEMPTS || 2);
  const retryBaseDelayMs = Number(process.env.RETRY_BASE_DELAY_MS || 700);
  const callSpacingMs = Number(process.env.CALL_SPACING_MS || 0);
  const modelSpacingMs = Number(process.env.MODEL_SPACING_MS || 0);

  const overrides: ExecuteOneCallOptions = {};

  const rows: EvaluationRow[] = [];

  console.log(`✨ Running ${questions.length} questions across ${models.length} model(s)`);
  console.log(`Label: ${label}`);

  for (const [mi, model] of models.entries()) {
    if (mi > 0 && modelSpacingMs > 0) {
      console.log(`\n⌛ Waiting ${modelSpacingMs}ms before next model...`);
      await delay(modelSpacingMs);
    }
    console.log(`\n=== Model: ${model.label} ===`);

    for (const [qi, question] of questions.entries()) {
      if (qi > 0 && callSpacingMs > 0) {
        await delay(callSpacingMs);
      }
      process.stdout.write(`▶ ${question.id} ... `);
      const result = await runModelOnQuestion(
        model,
        question,
        overrides,
        retryAttempts,
        retryBaseDelayMs,
        !!args.noCall
      );
      rows.push(result);
      const icon = result.grade.pass ? "✅" : "❌";
      console.log(`${icon} score=${result.grade.score.toFixed(3)} | conf=${result.grade.confidence.toFixed(2)}${result.error ? ` | ${result.error}` : ""}`);
    }
  }

  const payload: ResultFile = {
    runAt: new Date().toISOString(),
    label,
    models: models.map(m => m.id),
    questionIds: questions.map(q => q.id),
    evaluations: rows,
  };

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = path.join(OUTPUT_DIR, `${filePrefix}-${timestamp}.json`);
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(`\n✅ Results written to ${outPath}`);
}

run().catch(err => {
  console.error("❌ run-60q failed:", err);
  process.exit(1);
});
