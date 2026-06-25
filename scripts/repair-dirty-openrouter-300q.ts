#!/usr/bin/env tsx

import "dotenv/config";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";

import OpenAI from "openai";

import { gradeSchemaResponse } from "../src/grading/schema-grader-300q";
import { buildExecuteOnePrompts } from "../src/prompts/schema-prompts-300q";
import { SCHEMA_QUESTIONS_300Q } from "../src/questions/schema-questions-300q";
import { loadRubric300q } from "../src/rubrics/loader-300q";
import type { GradeResult, SchemaQuestion } from "../src/types/schema";

type EvaluationRow = {
  modelId: string;
  modelLabel: string;
  questionId: string;
  raw: string;
  durationMs: number;
  grade: GradeResult;
  error?: string;
  repairMeta?: Record<string, unknown>;
};

type ResultFile = {
  runAt: string;
  label: string;
  suite: "r5e1-300q";
  models: string[];
  questionIds: string[];
  evaluations: EvaluationRow[];
};

type LatestRow = {
  runAt: number;
  sourceFile: string;
  evaluation: EvaluationRow;
};

type CheckpointRow = {
  runAt: string;
  label: string;
  modelId: string;
  questionId: string;
  evaluation: EvaluationRow;
  dirty: boolean;
  dirtyTypes: string[];
  attempts: number;
};

type CliArgs = {
  models: string[];
  sourceDir: string;
  checkpoint: string;
  outDir: string;
  label: string;
  maxRetries: number;
  timeoutMs: number;
  maxTokens: number;
  temperature: number;
  concurrency: number;
  limit: number;
  questionIds: string[];
  stream: boolean;
  dryRun: boolean;
  includeN2: boolean;
  responseFormat: boolean;
  reasoningExclude: boolean;
  reasoningEffort: string;
  reasoningMaxTokens: number | null;
  disableThinking: boolean;
};

const DEFAULT_SOURCE_DIR = path.join(process.cwd(), "results", "community", "300");
const DEFAULT_OUT_DIR = path.join(process.cwd(), "results", "community", "300");
const DEFAULT_CHECKPOINT = path.join(process.cwd(), "results", "repair-checkpoints", "dirty-openrouter-300q.jsonl");
const QUESTIONS_BY_ID = new Map(SCHEMA_QUESTIONS_300Q.map(question => [question.id, question]));

function parseList(value: string): string[] {
  return value
    .split(/[,\s]+/)
    .map(item => item.trim())
    .filter(Boolean);
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    models: [],
    sourceDir: DEFAULT_SOURCE_DIR,
    checkpoint: DEFAULT_CHECKPOINT,
    outDir: DEFAULT_OUT_DIR,
    label: `openrouter-dirty-repair-300q-${new Date().toISOString().replace(/[:.]/g, "-")}`,
    maxRetries: 6,
    timeoutMs: Number(process.env.OPENROUTER_TIMEOUT_MS || 600000),
    maxTokens: Number(process.env.SMOKE_MAX_TOKENS || 6000),
    temperature: Number(process.env.SMOKE_TEMP || 0.1),
    concurrency: 1,
    limit: 0,
    questionIds: [],
    stream: true,
    dryRun: false,
    includeN2: false,
    responseFormat: true,
    reasoningExclude: false,
    reasoningEffort: "",
    reasoningMaxTokens: null,
    disableThinking: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--models") {
      args.models = parseList(argv[++i] || "");
    } else if (token === "--source-dir") {
      const value = argv[++i] || args.sourceDir;
      args.sourceDir = path.isAbsolute(value) ? value : path.join(process.cwd(), value);
    } else if (token === "--checkpoint") {
      const value = argv[++i] || args.checkpoint;
      args.checkpoint = path.isAbsolute(value) ? value : path.join(process.cwd(), value);
    } else if (token === "--out-dir") {
      const value = argv[++i] || args.outDir;
      args.outDir = path.isAbsolute(value) ? value : path.join(process.cwd(), value);
    } else if (token === "--label") {
      args.label = argv[++i] || args.label;
    } else if (token === "--max-retries") {
      args.maxRetries = Math.max(0, Number(argv[++i] || args.maxRetries));
    } else if (token === "--timeout-ms") {
      args.timeoutMs = Math.max(1000, Number(argv[++i] || args.timeoutMs));
    } else if (token === "--max-tokens") {
      args.maxTokens = Math.max(1, Number(argv[++i] || args.maxTokens));
    } else if (token === "--temperature") {
      args.temperature = Number(argv[++i] || args.temperature);
    } else if (token === "--concurrency") {
      args.concurrency = Math.max(1, Number(argv[++i] || args.concurrency));
    } else if (token === "--limit") {
      args.limit = Math.max(0, Number(argv[++i] || args.limit));
    } else if (token === "--question-ids") {
      args.questionIds = parseList(argv[++i] || "");
    } else if (token === "--no-stream") {
      args.stream = false;
    } else if (token === "--include-n2") {
      args.includeN2 = true;
    } else if (token === "--no-response-format") {
      args.responseFormat = false;
    } else if (token === "--reasoning-exclude") {
      args.reasoningExclude = true;
    } else if (token === "--reasoning-effort") {
      args.reasoningEffort = argv[++i] || "";
    } else if (token === "--reasoning-max-tokens") {
      args.reasoningMaxTokens = Math.max(0, Number(argv[++i] || 0));
    } else if (token === "--disable-thinking") {
      args.disableThinking = true;
    } else if (token === "--dry-run") {
      args.dryRun = true;
    } else if (token === "--help" || token === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown arg: ${token}`);
    }
  }

  if (!args.models.length) {
    throw new Error("--models is required");
  }

  return args;
}

function printHelp(): void {
  console.log(`Usage:
  DOTENV_CONFIG_PATH=/path/.env npx tsx scripts/repair-dirty-openrouter-300q.ts \\
    --models "moonshotai/kimi-k2.5 moonshotai/kimi-k2.6" \\
    --checkpoint results/repair-checkpoints/kimi.jsonl \\
    --label openrouter-kimi-dirty-repair

Options:
  --models LIST       OpenRouter model IDs to repair.
  --source-dir PATH   Existing result JSON directory, default results/community/300.
  --checkpoint PATH   Resumable JSONL checkpoint.
  --out-dir PATH      Directory for old-compatible aggregate JSON.
  --label LABEL       Label/file prefix for aggregate result.
  --max-retries N     Retries after first attempt, default 6.
  --timeout-ms N      Per-request timeout, default OPENROUTER_TIMEOUT_MS or 600000.
  --max-tokens N      Max completion tokens, default SMOKE_MAX_TOKENS or 6000.
  --concurrency N     Exact dirty row concurrency, default 1.
  --limit N           Repair at most N dirty rows for canaries.
  --question-ids LIST Repair only these question IDs.
  --no-stream         Use non-streaming chat completions.
  --include-n2        Include files whose names contain n2.
  --no-response-format
                      Do not request OpenRouter JSON-mode response_format.
  --reasoning-exclude
                      Ask OpenRouter to exclude reasoning tokens from content.
  --reasoning-effort VALUE
                      OpenRouter reasoning effort, e.g. none/minimal/low.
  --reasoning-max-tokens N
                      OpenRouter reasoning token cap for supported models.
  --disable-thinking  Pass provider-specific enable_thinking=false hints.
  --dry-run           Print dirty rows without making calls.`);
}

function keyOf(modelId: string, questionId: string): string {
  return `${modelId}\u0000${questionId}`;
}

function modelLabel(modelId: string): string {
  return `openrouter:${modelId}`;
}

function shouldReadResultFile(fileName: string, args: CliArgs): boolean {
  if (!fileName.endsWith(".json")) return false;
  if (!args.includeN2 && /n2/i.test(fileName)) return false;
  if (/one-row-repro|timeout-smoke/i.test(fileName)) return false;
  return true;
}

function readResultFiles(args: CliArgs): LatestRow[] {
  const rows: LatestRow[] = [];
  const modelSet = new Set(args.models);
  if (!fs.existsSync(args.sourceDir)) return rows;

  for (const fileName of fs.readdirSync(args.sourceDir).sort()) {
    if (!shouldReadResultFile(fileName, args)) continue;
    const filePath = path.join(args.sourceDir, fileName);
    let parsed: ResultFile;
    try {
      parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
      continue;
    }
    if (!Array.isArray(parsed.evaluations)) continue;
    const runAt = Date.parse(parsed.runAt || "") || 0;
    for (const evaluation of parsed.evaluations) {
      if (!modelSet.has(evaluation.modelId)) continue;
      rows.push({ runAt, sourceFile: fileName, evaluation });
    }
  }

  return rows;
}

function readCheckpointRows(checkpoint: string, models: Set<string>): LatestRow[] {
  if (!fs.existsSync(checkpoint)) return [];
  const rows: LatestRow[] = [];
  const raw = fs.readFileSync(checkpoint, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      const checkpointRow = JSON.parse(line) as CheckpointRow;
      if (!models.has(checkpointRow.modelId)) continue;
      rows.push({
        runAt: Date.parse(checkpointRow.runAt || "") || 0,
        sourceFile: path.basename(checkpoint),
        evaluation: checkpointRow.evaluation,
      });
    } catch {
      // Keep a corrupt partial line from breaking resume.
    }
  }
  return rows;
}

function latestByKey(rows: LatestRow[]): Map<string, LatestRow> {
  const latest = new Map<string, LatestRow>();
  for (const row of rows) {
    const key = keyOf(row.evaluation.modelId, row.evaluation.questionId);
    const existing = latest.get(key);
    if (
      !existing ||
      row.runAt > existing.runAt ||
      (row.runAt === existing.runAt && row.sourceFile > existing.sourceFile)
    ) {
      latest.set(key, row);
    }
  }
  return latest;
}

function dirtyTypes(evaluation: EvaluationRow | null | undefined): string[] {
  if (!evaluation) return ["missing"];
  const types: string[] = [];
  const raw = String(evaluation.raw ?? "");
  const reasons = (evaluation.grade?.failureReasons || []).map(String);
  if (!raw.trim()) types.push("empty_raw");
  if (evaluation.error) types.push("explicit_error");
  for (const reason of reasons) {
    if (
      reason === "transport_error" ||
      reason === "truncated_response" ||
      reason === "error" ||
      reason === "provider_aborted_request" ||
      reason === "parse_failed" ||
      reason === "generation_failed"
    ) {
      types.push(reason);
    }
  }
  if (!evaluation.grade) types.push("missing_grade");
  return Array.from(new Set(types));
}

function isDirty(evaluation: EvaluationRow | null | undefined): boolean {
  return dirtyTypes(evaluation).length > 0;
}

function makeErrorGrade(error: string): GradeResult {
  const reasons = /abort/i.test(error)
    ? ["provider_aborted_request", "error"]
    : ["error"];
  return {
    pass: false,
    confidence: 0,
    score: 0,
    fieldScores: {},
    normalizedResponse: null,
    failureReasons: reasons as any,
    parsingMethod: "none",
  };
}

function retryable(error: unknown): boolean {
  const status = typeof error === "object" && error !== null ? (error as any).status : undefined;
  if (status === 402 || status === 408 || status === 409 || status === 425 || status === 429) return true;
  if (typeof status === "number" && status >= 500) return true;
  const message = (error instanceof Error ? error.message : String(error)).toLowerCase();
  return /402|insufficient credits|429|rate limit|timeout|temporarily|unavailable|overloaded|abort|connection error|network|econnreset|socket hang up|fetch failed|premature close|read etimedout|blank|empty|whitespace-only|no content|invalid json response body|unexpected end of json input|parse failure|non-scoreable/.test(message);
}

function retryDelayMs(attempt: number): number {
  const base = Math.min(2000 * 2 ** Math.max(0, attempt - 1), 60000);
  const jitter = Math.floor(Math.random() * Math.min(1500, base * 0.25));
  return base + jitter;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callOpenRouter(
  client: OpenAI,
  modelId: string,
  question: SchemaQuestion,
  args: CliArgs
): Promise<{ raw: string; durationMs: number }> {
  const rubric = loadRubric300q(question.rubric_id);
  const prompts = buildExecuteOnePrompts(question, rubric);
  const start = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), args.timeoutMs);

  try {
    const request = {
      model: modelId,
      temperature: args.temperature,
      max_tokens: args.maxTokens,
      messages: [
        { role: "system" as const, content: prompts.system },
        { role: "user" as const, content: prompts.user },
      ],
    };
    if (args.responseFormat) {
      (request as any).response_format = { type: "json_object" as const };
    }
    const reasoning: Record<string, unknown> = {};
    if (args.reasoningEffort) {
      reasoning.effort = args.reasoningEffort;
    }
    if (args.reasoningMaxTokens !== null) {
      reasoning.max_tokens = args.reasoningMaxTokens;
    }
    if (args.reasoningExclude) {
      reasoning.exclude = true;
    }
    if (Object.keys(reasoning).length) {
      (request as any).reasoning = reasoning;
    }
    if (args.disableThinking) {
      (request as any).enable_thinking = false;
      (request as any).chat_template_kwargs = { enable_thinking: false };
    }

    if (args.stream) {
      const stream = await client.chat.completions.create(
        { ...request, stream: true },
        { signal: controller.signal }
      );
      let raw = "";
      for await (const chunk of stream as any) {
        raw += chunk.choices?.[0]?.delta?.content ?? "";
      }
      return { raw, durationMs: Date.now() - start };
    }

    const response = await client.chat.completions.create(request, { signal: controller.signal });
    return {
      raw: response.choices?.[0]?.message?.content ?? "",
      durationMs: Date.now() - start,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function repairOne(
  client: OpenAI,
  modelId: string,
  question: SchemaQuestion,
  args: CliArgs
): Promise<{ evaluation: EvaluationRow; attempts: number }> {
  let lastError: unknown = null;
  let lastRaw = "";
  let lastDurationMs = 0;
  let lastGrade: GradeResult | null = null;
  let attempts = 0;

  for (let attempt = 0; attempt <= args.maxRetries; attempt += 1) {
    attempts = attempt + 1;
    if (attempt > 0) {
      await sleep(retryDelayMs(attempt));
    }

    try {
      const result = await callOpenRouter(client, modelId, question, args);
      lastRaw = result.raw;
      lastDurationMs = result.durationMs;
      lastGrade = gradeSchemaResponse(result.raw, question, loadRubric300q(question.rubric_id));

      const evaluation: EvaluationRow = {
        modelId,
        modelLabel: modelLabel(modelId),
        questionId: question.id,
        raw: result.raw,
        durationMs: result.durationMs,
        grade: lastGrade,
      };

      const types = dirtyTypes(evaluation);
      if (!types.length) {
        return { evaluation, attempts };
      }

      lastError = new Error(`non-scoreable response: ${types.join("+")}`);
      if (attempt >= args.maxRetries) {
        return { evaluation, attempts };
      }
    } catch (error) {
      lastError = error;
      if (attempt >= args.maxRetries || !retryable(error)) {
        break;
      }
    }
  }

  const errorMessage = lastError instanceof Error ? lastError.message : String(lastError);
  return {
    attempts,
    evaluation: {
      modelId,
      modelLabel: modelLabel(modelId),
      questionId: question.id,
      raw: lastRaw,
      durationMs: lastDurationMs,
      grade: lastGrade || makeErrorGrade(errorMessage),
      error: errorMessage,
    },
  };
}

class Semaphore {
  private active = 0;
  private waiters: Array<() => void> = [];

  constructor(private readonly limit: number) {}

  async acquire(): Promise<() => void> {
    if (this.active >= this.limit) {
      await new Promise<void>(resolve => this.waiters.push(resolve));
    }
    this.active += 1;
    return () => {
      this.active -= 1;
      const next = this.waiters.shift();
      if (next) next();
    };
  }
}

async function appendCheckpoint(filePath: string, row: CheckpointRow): Promise<void> {
  await fsp.mkdir(path.dirname(filePath), { recursive: true });
  await fsp.appendFile(filePath, `${JSON.stringify(row)}\n`, "utf8");
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv);
  if (!process.env.OPENROUTER_API_KEY && !args.dryRun) {
    throw new Error("OPENROUTER_API_KEY is required. Set DOTENV_CONFIG_PATH or export the key.");
  }

  const modelSet = new Set(args.models);
  const questionSet = new Set(args.questionIds);
  const sourceRows = readResultFiles(args);
  const checkpointRows = readCheckpointRows(args.checkpoint, modelSet);
  const latest = latestByKey([...sourceRows, ...checkpointRows]);
  const tasks: Array<{ modelId: string; question: SchemaQuestion; types: string[] }> = [];

  for (const modelId of args.models) {
    for (const question of SCHEMA_QUESTIONS_300Q) {
      if (questionSet.size && !questionSet.has(question.id)) continue;
      const row = latest.get(keyOf(modelId, question.id));
      const types = dirtyTypes(row?.evaluation);
      if (types.length) {
        tasks.push({ modelId, question, types });
      }
    }
  }

  const selectedTasks = args.limit > 0 ? tasks.slice(0, args.limit) : tasks;
  console.log(`Models: ${args.models.join(", ")}`);
  console.log(`Source rows: ${sourceRows.length}; checkpoint rows: ${checkpointRows.length}`);
  console.log(`Dirty tasks: ${tasks.length}; selected: ${selectedTasks.length}`);
  console.log(`Options: stream=${args.stream} responseFormat=${args.responseFormat} timeoutMs=${args.timeoutMs} maxTokens=${args.maxTokens} retries=${args.maxRetries} concurrency=${args.concurrency} reasoningEffort=${args.reasoningEffort || "(default)"} reasoningMaxTokens=${args.reasoningMaxTokens ?? "(default)"} reasoningExclude=${args.reasoningExclude} disableThinking=${args.disableThinking}`);

  const byModel = new Map<string, number>();
  for (const task of tasks) {
    byModel.set(task.modelId, (byModel.get(task.modelId) || 0) + 1);
  }
  for (const [modelId, count] of byModel) {
    console.log(` - ${modelId}: ${count} dirty`);
  }

  if (args.dryRun) {
    selectedTasks.slice(0, 40).forEach(task => {
      console.log(`   ${task.modelId} ${task.question.id} ${task.types.join("+")}`);
    });
    if (selectedTasks.length > 40) console.log(`   ... ${selectedTasks.length - 40} more`);
    return;
  }

  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    timeout: args.timeoutMs,
    maxRetries: 0,
    defaultHeaders: {
      "HTTP-Referer": "tradebench-lite",
      "X-Title": "TradeBench 300Q Dirty Repair",
    },
  });

  const semaphore = new Semaphore(args.concurrency);
  let completed = 0;

  await Promise.all(selectedTasks.map(async task => {
    const release = await semaphore.acquire();
    try {
      const result = await repairOne(client, task.modelId, task.question, args);
      const types = dirtyTypes(result.evaluation);
      const row: CheckpointRow = {
        runAt: new Date().toISOString(),
        label: args.label,
        modelId: task.modelId,
        questionId: task.question.id,
        evaluation: {
          ...result.evaluation,
          repairMeta: {
            repairedBy: path.basename(process.argv[1] || "repair-dirty-openrouter-300q.ts"),
            priorDirtyTypes: task.types,
            attempts: result.attempts,
          },
        },
        dirty: types.length > 0,
        dirtyTypes: types,
        attempts: result.attempts,
      };
      await appendCheckpoint(args.checkpoint, row);
      latest.set(keyOf(task.modelId, task.question.id), {
        runAt: Date.parse(row.runAt),
        sourceFile: path.basename(args.checkpoint),
        evaluation: row.evaluation,
      });

      completed += 1;
      const status = row.dirty ? "dirty" : row.evaluation.grade.pass ? "pass" : "clean-fail";
      console.log(`[${completed}/${selectedTasks.length}] ${status} ${task.modelId} ${task.question.id} attempts=${row.attempts}${row.dirty ? ` types=${row.dirtyTypes.join("+")}` : ""}`);
    } finally {
      release();
    }
  }));

  const aggregateRows: EvaluationRow[] = [];
  for (const modelId of args.models) {
    for (const question of SCHEMA_QUESTIONS_300Q) {
      const row = latest.get(keyOf(modelId, question.id));
      if (row) aggregateRows.push(row.evaluation);
    }
  }

  await fsp.mkdir(args.outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = path.join(args.outDir, `${args.label}-${stamp}.json`);
  const payload: ResultFile = {
    runAt: new Date().toISOString(),
    label: args.label,
    suite: "r5e1-300q",
    models: args.models,
    questionIds: SCHEMA_QUESTIONS_300Q.map(question => question.id),
    evaluations: aggregateRows,
  };
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(`Aggregate written: ${outPath}`);

  for (const modelId of args.models) {
    const rows = aggregateRows.filter(row => row.modelId === modelId);
    const clean = rows.filter(row => !isDirty(row)).length;
    const dirty = rows.length - clean;
    const pass = rows.filter(row => row.grade?.pass).length;
    console.log(`${modelId}: clean=${clean} dirty=${dirty} pass=${pass}/300`);
  }
}

main().catch(error => {
  console.error("repair-dirty-openrouter-300q failed:", error);
  process.exit(1);
});
