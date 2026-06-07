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
} from "../src/models/model-runner";
import { SCHEMA_QUESTIONS_300Q } from "../src/questions/schema-questions-300q";
import { loadRubric300q } from "../src/rubrics/loader-300q";
import { gradeSchemaResponse } from "../src/grading/schema-grader-300q";
import { buildExecuteOnePrompts } from "../src/prompts/schema-prompts-300q";
import type { GradeResult, SchemaQuestion } from "../src/types/schema";

type CliArgs = {
  ids?: string[];
  levels?: number[];
  label?: string;
  filePrefix?: string;
  noCall?: boolean;
  dryRun?: boolean;
  out?: string;
};

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
  suite: "r5e1-300q";
  models: string[];
  questionIds: string[];
  evaluations: EvaluationRow[];
};

function parseList(value: string): string[] {
  return value
    .split(/[,\s]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {};
  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];
    if (token === "--ids") {
      args.ids = parseList(argv[++i] || "");
    } else if (token === "--levels") {
      args.levels = parseList(argv[++i] || "").map(Number).filter(Number.isFinite);
    } else if (token === "--label") {
      args.label = argv[++i];
    } else if (token === "--file-prefix") {
      args.filePrefix = argv[++i];
    } else if (token === "--no-call") {
      args.noCall = true;
    } else if (token === "--dry-run") {
      args.dryRun = true;
    } else if (token === "--out") {
      args.out = argv[++i];
    }
  }
  return args;
}

const OUTPUT_SUBDIR = (process.env.OUTPUT_SUBDIR || "community/300").trim();
const OUTPUT_DIR = OUTPUT_SUBDIR
  ? path.join(process.cwd(), "results", OUTPUT_SUBDIR)
  : path.join(process.cwd(), "results");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const delay = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));

function classifyError(error: unknown): "timeout" | "429" | "503" | "blank" | "other" {
  const msg = (error instanceof Error ? error.message : String(error)).toLowerCase();
  if (/timeout/.test(msg)) return "timeout";
  if (/429|rate limit/.test(msg)) return "429";
  if (/503|unavailable|overloaded/.test(msg)) return "503";
  if (/empty|blank|whitespace-only|no content/.test(msg)) return "blank";
  return "other";
}

function selectModels(): ModelConfig[] {
  const env = (process.env.MODEL_IDS || "").trim();
  if (!env) return MODELS;
  const ids = new Set(parseList(env));
  const chosen = MODELS.filter(m => ids.has(m.id));
  const missing = Array.from(ids).filter(id => !chosen.some(m => m.id === id));
  if (missing.length) {
    console.warn(`Requested models not available in roster/env: ${missing.join(", ")}`);
  }
  if (!chosen.length) {
    throw new Error("No models selected; check MODEL_IDS or API keys.");
  }
  return chosen;
}

function selectQuestions(args: CliArgs): SchemaQuestion[] {
  let questions = SCHEMA_QUESTIONS_300Q;

  if (args.levels?.length) {
    const levels = new Set(args.levels);
    questions = questions.filter(q => levels.has(q.level));
  }

  if (args.ids?.length) {
    const ids = new Set(args.ids);
    questions = questions.filter(q => ids.has(q.id));
    const missing = Array.from(ids).filter(id => !questions.some(q => q.id === id));
    if (missing.length) {
      console.warn(`Question IDs not found: ${missing.join(", ")}`);
    }
  }

  if (!questions.length) {
    throw new Error("No questions selected; check --levels or --ids.");
  }

  return questions;
}

async function runModelOnQuestion(
  model: ModelConfig,
  question: SchemaQuestion,
  overrides: ExecuteOneCallOptions,
  noCall: boolean,
  maxAttempts: number,
  retryBaseDelayMs: number
): Promise<EvaluationRow> {
  const rubric = loadRubric300q(question.rubric_id);
  let started = Date.now();
  let raw = "";
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    started = Date.now();
    try {
      if (noCall) {
        throw new Error("--no-call scaffolding mode enabled");
      }

      const prompts = buildExecuteOnePrompts(question, rubric);
      const result = await callExecuteOneModel(model.id, question, overrides, prompts);
      raw = result.text ?? "";
      const grade = gradeSchemaResponse(raw, question, rubric);

      if (!grade.normalizedResponse && attempt < maxAttempts) {
        lastError = new Error("parse failure");
        await delay(Math.min(retryBaseDelayMs * attempt, 8000));
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
      lastError = error;
      const category = classifyError(error);
      if (!noCall && attempt < maxAttempts && ["timeout", "429", "503", "blank"].includes(category)) {
        await delay(Math.min(retryBaseDelayMs * attempt, 12000));
        continue;
      }
      break;
    }
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
    error: lastError instanceof Error ? lastError.message : String(lastError),
  };
}

async function runQuestionPool(
  model: ModelConfig,
  questions: SchemaQuestion[],
  overrides: ExecuteOneCallOptions,
  noCall: boolean,
  concurrency: number,
  callSpacingMs: number,
  maxAttempts: number,
  retryBaseDelayMs: number
): Promise<EvaluationRow[]> {
  const rows: EvaluationRow[] = [];
  let next = 0;

  async function worker() {
    while (next < questions.length) {
      const index = next++;
      const question = questions[index];
      if (index > 0 && callSpacingMs > 0) {
        await delay(callSpacingMs);
      }
      process.stdout.write(`${question.id} ... `);
      const row = await runModelOnQuestion(model, question, overrides, noCall, maxAttempts, retryBaseDelayMs);
      rows.push(row);
      const icon = row.grade.pass ? "PASS" : "FAIL";
      console.log(`${icon} score=${row.grade.score.toFixed(3)} conf=${row.grade.confidence.toFixed(2)}${row.error ? ` error=${row.error}` : ""}`);
    }
  }

  const workers = Array.from(
    { length: Math.min(Math.max(1, concurrency), questions.length) },
    () => worker()
  );
  await Promise.all(workers);

  return rows.sort((a, b) => a.questionId.localeCompare(b.questionId));
}

async function run(): Promise<void> {
  const args = parseArgs(process.argv);
  const models = selectModels();
  const questions = selectQuestions(args);

  if (!args.dryRun && !models.length) {
    throw new Error("No models available; check model roster and API keys, or use --dry-run.");
  }

  const label = args.label || "300q-run";
  const filePrefix = args.filePrefix || label;
  const temperature = Number(process.env.SMOKE_TEMP || DEFAULT_MODEL_OPTIONS.temperature || 0.1);
  const maxTokens = Number(process.env.SMOKE_MAX_TOKENS || DEFAULT_MODEL_OPTIONS.maxTokens || 2200);
  const concurrency = Math.max(1, Number(process.env.SMOKE_CONCURRENCY || 4));
  const callSpacingMs = Number(process.env.CALL_SPACING_MS || 600);
  const retryAttempts = Math.max(1, Number(process.env.RETRY_ATTEMPTS || 2));
  const retryBaseDelayMs = Number(process.env.RETRY_BASE_DELAY_MS || 700);

  const overrides: ExecuteOneCallOptions = {
    temperature,
    maxTokens,
  };

  console.log(`Running ${questions.length} 300Q questions across ${models.length} model(s)`);
  console.log(`Label: ${label}`);
  console.log(`Levels: ${Array.from(new Set(questions.map(q => q.level))).sort((a, b) => a - b).join(", ")}`);
  console.log(`Output dir: ${OUTPUT_DIR}`);
  console.log(`Options: temp=${temperature} maxTokens=${maxTokens} concurrency=${concurrency} callSpacingMs=${callSpacingMs} retryAttempts=${retryAttempts}`);

  if (args.dryRun) {
    console.log("Dry run requested (--dry-run). No API calls will be made.");
    console.log("Models:");
    models.forEach(m => console.log(` - ${m.id}`));
    console.log("Questions:");
    questions.forEach(q => console.log(` - ${q.id} (L${q.level}, ${q.rubric_id})`));
    return;
  }

  const rows: EvaluationRow[] = [];
  for (const model of models) {
    console.log(`\n=== Model: ${model.label} ===`);
    const modelRows = await runQuestionPool(
      model,
      questions,
      overrides,
      !!args.noCall,
      concurrency,
      callSpacingMs,
      retryAttempts,
      retryBaseDelayMs
    );
    rows.push(...modelRows);
  }

  const payload: ResultFile = {
    runAt: new Date().toISOString(),
    label,
    suite: "r5e1-300q",
    models: models.map(m => m.id),
    questionIds: questions.map(q => q.id),
    evaluations: rows,
  };

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = args.out
    ? path.isAbsolute(args.out) ? args.out : path.join(process.cwd(), args.out)
    : path.join(OUTPUT_DIR, `${filePrefix}-${timestamp}.json`);
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(`\nResults written to ${outPath}`);
  console.log(`RESULT_FILE=${outPath}`);
}

run().catch(err => {
  console.error("run-300q failed:", err);
  process.exit(1);
});
