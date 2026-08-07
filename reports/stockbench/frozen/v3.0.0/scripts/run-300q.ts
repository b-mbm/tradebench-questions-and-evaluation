#!/usr/bin/env tsx

import "dotenv/config";
import { createHash } from "node:crypto";
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
import { STOCKBENCH_QUESTIONS_300Q } from "../src/questions/stockbench-questions-300q";
import { COINBENCH_V1_QUARANTINE_IDS } from "../src/questions/coinbench-quarantine-v1";
import { loadRubric300q } from "../src/rubrics/loader-300q";
import { gradeSchemaResponse } from "../src/grading/schema-grader-300q";
import { buildExecuteOnePrompts, buildStockBenchPrompts } from "../src/prompts/schema-prompts-300q";
import type { GradeResult, SchemaQuestion } from "../src/types/schema";

type BenchmarkSuite = "coinbench" | "stockbench";

type CliArgs = {
  suite: BenchmarkSuite;
  includeQuarantined?: boolean;
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
  suite: "coinbench-v1-repair-candidate" | "coinbench-300q-legacy" | "stockbench-300q";
  models: string[];
  questionIds: string[];
  source?: {
    questions_sha256: string;
    rubrics_sha256: string;
    grader_sha256: string;
    runner_sha256?: string;
    prompt_builder_sha256?: string;
  };
  options: {
    temperature: number;
    maxTokens: number;
    concurrency: number;
    callSpacingMs: number;
    retryAttempts: number;
  };
  evaluations: EvaluationRow[];
};

function sha256File(file: string): string {
  return createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function coinBenchSource(): ResultFile["source"] {
  const rubricIds = [...new Set(SCHEMA_QUESTIONS_300Q.map(question => question.rubric_id))].sort();
  const rubricBytes = rubricIds.map(id => fs.readFileSync(path.join(process.cwd(), "src", "rubrics", `${id}.json`)));
  return {
    questions_sha256: sha256File(path.join(process.cwd(), "src", "questions", "schema-questions-300q.ts")),
    rubrics_sha256: createHash("sha256").update(Buffer.concat(rubricBytes.map((bytes, index) =>
      index === 0 ? bytes : Buffer.concat([Buffer.from("\n"), bytes])
    ))).digest("hex"),
    grader_sha256: sha256File(path.join(process.cwd(), "src", "grading", "schema-grader-300q.ts")),
  };
}

function stockBenchSource(): ResultFile["source"] {
  const rubricIds = [...new Set(STOCKBENCH_QUESTIONS_300Q.map(question => question.rubric_id))].sort();
  const rubricBytes = rubricIds.map(id => fs.readFileSync(path.join(process.cwd(), "src", "rubrics", `${id}.json`)));
  return {
    questions_sha256: sha256File(path.join(process.cwd(), "src", "questions", "stockbench-questions-300q.ts")),
    rubrics_sha256: createHash("sha256").update(Buffer.concat(rubricBytes.map((bytes, index) =>
      index === 0 ? bytes : Buffer.concat([Buffer.from("\n"), bytes])
    ))).digest("hex"),
    grader_sha256: sha256File(path.join(process.cwd(), "src", "grading", "schema-grader-300q.ts")),
    runner_sha256: sha256File(path.join(process.cwd(), "scripts", "run-300q.ts")),
    prompt_builder_sha256: sha256File(path.join(process.cwd(), "src", "prompts", "schema-prompts-300q.ts")),
  };
}

function parseList(value: string): string[] {
  return value
    .split(/[,\s]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { suite: "coinbench" };
  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];
    if (token === "--suite") {
      const suite = argv[++i];
      if (suite !== "coinbench" && suite !== "stockbench") {
        throw new Error(`Unknown suite: ${suite}. Expected coinbench or stockbench.`);
      }
      args.suite = suite;
    } else if (token === "--ids") {
      args.ids = parseList(argv[++i] || "");
    } else if (token === "--include-quarantined") {
      args.includeQuarantined = true;
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
  let questions = args.suite === "stockbench"
    ? STOCKBENCH_QUESTIONS_300Q
    : SCHEMA_QUESTIONS_300Q;

  if (args.suite === "coinbench" && !args.includeQuarantined) {
    const requestedQuarantined = (args.ids ?? []).filter(id =>
      COINBENCH_V1_QUARANTINE_IDS.has(id)
    );
    if (requestedQuarantined.length) {
      throw new Error(
        `Quarantined exact-duplicate IDs requested: ${requestedQuarantined.join(', ')}. ` +
        'Use --include-quarantined only for legacy reproduction.'
      );
    }
    questions = questions.filter(q => !COINBENCH_V1_QUARANTINE_IDS.has(q.id));
  }

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
  retryBaseDelayMs: number,
  suite: BenchmarkSuite
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

      const prompts = suite === "stockbench"
        ? buildStockBenchPrompts(question, rubric)
        : buildExecuteOnePrompts(question, rubric);
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
  retryBaseDelayMs: number,
  suite: BenchmarkSuite
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
      const row = await runModelOnQuestion(model, question, overrides, noCall, maxAttempts, retryBaseDelayMs, suite);
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

  const label = args.label || (args.suite === 'stockbench'
    ? 'stockbench-300q-run'
    : args.includeQuarantined ? 'coinbench-300q-legacy-run' : 'coinbench-v1-repair-candidate-run');
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
  const source = args.suite === "coinbench" ? coinBenchSource() : stockBenchSource();

  console.log(`Running ${questions.length} ${args.suite} questions across ${models.length} model(s)`);
  console.log(`Suite: ${args.suite}`);
  if (args.suite === "coinbench" && !args.includeQuarantined) {
    console.log(`Quarantined CoinBench rows excluded: ${COINBENCH_V1_QUARANTINE_IDS.size}`);
  }
  console.log(`Label: ${label}`);
  console.log(`Levels: ${Array.from(new Set(questions.map(q => q.level))).sort((a, b) => a - b).join(", ")}`);
  console.log(`Output dir: ${OUTPUT_DIR}`);
  console.log(`Options: temp=${temperature} maxTokens=${maxTokens} concurrency=${concurrency} callSpacingMs=${callSpacingMs} retryAttempts=${retryAttempts}`);

  if (args.dryRun) {
    console.log("Dry run requested (--dry-run). No API calls will be made.");
    console.log(`Source: ${JSON.stringify(source)}`);
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
      retryBaseDelayMs,
      args.suite
    );
    rows.push(...modelRows);
  }

  const payload: ResultFile = {
    runAt: new Date().toISOString(),
    label,
    suite: args.suite === "stockbench"
      ? "stockbench-300q"
      : args.includeQuarantined ? "coinbench-300q-legacy" : "coinbench-v1-repair-candidate",
    models: models.map(m => m.id),
    questionIds: questions.map(q => q.id),
    source,
    options: { temperature, maxTokens, concurrency, callSpacingMs, retryAttempts },
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
