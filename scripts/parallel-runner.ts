#!/usr/bin/env tsx

import "dotenv/config";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";

import OpenAI from "openai";

import { SCHEMA_QUESTIONS_300Q } from "../src/questions/schema-questions-300q";
import { loadRubric300q } from "../src/rubrics/loader-300q";
import { gradeSchemaResponse } from "../src/grading/schema-grader-300q";
import { buildExecuteOnePrompts } from "../src/prompts/schema-prompts-300q";
import type { GradeResult, SchemaQuestion } from "../src/types/schema";

type CliArgs = {
  concurrency: number;
  generate: boolean;
  score: boolean;
  models?: string;
  modelsFile?: string;
  resultsDir: string;
  ids?: string[];
  levels?: number[];
  retryFailed: boolean;
  dryRun: boolean;
  temperature: number;
  maxTokens: number;
  maxRetries: number;
  insufficientCreditsAbortThreshold: number;
  transportFailureAbortThreshold: number;
  freeModelMinIntervalMs: number;
};

type ModelSelection = {
  family: string;
  id: string;
  label: string;
};

type GenerationStatus = "ok" | "failed";
type ScoreStatus = "ok" | "failed";

type GenerationRow = {
  phase: "generation";
  runAt: string;
  family: string;
  model: string;
  modelLabel: string;
  questionId: string;
  questionLevel: number;
  rubricId: string;
  status: GenerationStatus;
  raw: string;
  durationMs: number;
  attempts: number;
  error?: string;
};

type ScoreRow = {
  phase: "score";
  scoredAt: string;
  family: string;
  model: string;
  modelLabel: string;
  questionId: string;
  status: ScoreStatus;
  score: number;
  pass: boolean;
  confidence: number;
  grade: GradeResult;
  error?: string;
};

type SummaryRow = {
  scope: "model" | "family";
  id: string;
  countDone: number;
  countFailed: number;
  countScored: number;
  meanScore: number | null;
};

const DEFAULT_RESULTS_DIR = path.join(process.cwd(), "results");
const DEFAULT_MODELS_FILE = path.join(process.cwd(), "models.yaml");
const DEFAULT_TEMPERATURE = 0.1;
const DEFAULT_MAX_TOKENS = 2200;
const OPENROUTER_TIMEOUT_MS = Number(process.env.OPENROUTER_TIMEOUT_MS || 180000);
const LMSTUDIO_TIMEOUT_MS = Number(process.env.LMSTUDIO_TIMEOUT_MS || 300000);
const LMSTUDIO_BASE_URL = process.env.LMSTUDIO_BASE_URL || "http://localhost:1234/v1";

function parseList(value: string): string[] {
  return value
    .split(/[,\s]+/)
    .map(item => item.trim())
    .filter(Boolean);
}

function parseArgs(argv: string[]): CliArgs {
  const explicitPhases = new Set<string>();
  const args: CliArgs = {
    concurrency: 50,
    generate: false,
    score: false,
    resultsDir: DEFAULT_RESULTS_DIR,
    retryFailed: false,
    dryRun: false,
    temperature: Number(process.env.SMOKE_TEMP || DEFAULT_TEMPERATURE),
    maxTokens: Number(process.env.SMOKE_MAX_TOKENS || DEFAULT_MAX_TOKENS),
    maxRetries: 6,
    insufficientCreditsAbortThreshold: 3,
    transportFailureAbortThreshold: Number(process.env.OPENROUTER_TRANSPORT_FAILURE_ABORT_THRESHOLD || 0),
    freeModelMinIntervalMs: Number(process.env.OPENROUTER_FREE_MODEL_MIN_INTERVAL_MS || 0),
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--concurrency") {
      args.concurrency = Math.max(1, Number(argv[++i] || args.concurrency));
    } else if (token === "--generate") {
      args.generate = true;
      explicitPhases.add("generate");
    } else if (token === "--score") {
      args.score = true;
      explicitPhases.add("score");
    } else if (token === "--models") {
      args.models = argv[++i] || "";
    } else if (token === "--models-file") {
      args.modelsFile = argv[++i] || "";
    } else if (token === "--results-dir") {
      const dir = argv[++i] || DEFAULT_RESULTS_DIR;
      args.resultsDir = path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
    } else if (token === "--ids") {
      args.ids = parseList(argv[++i] || "");
    } else if (token === "--levels") {
      args.levels = parseList(argv[++i] || "").map(Number).filter(Number.isFinite);
    } else if (token === "--retry-failed") {
      args.retryFailed = true;
    } else if (token === "--dry-run") {
      args.dryRun = true;
    } else if (token === "--temperature") {
      args.temperature = Number(argv[++i] || args.temperature);
    } else if (token === "--max-tokens") {
      args.maxTokens = Number(argv[++i] || args.maxTokens);
    } else if (token === "--max-retries") {
      args.maxRetries = Math.max(0, Number(argv[++i] || args.maxRetries));
    } else if (token === "--insufficient-credits-abort-threshold") {
      args.insufficientCreditsAbortThreshold = Math.max(0, Number(argv[++i] || args.insufficientCreditsAbortThreshold));
    } else if (token === "--transport-failure-abort-threshold") {
      args.transportFailureAbortThreshold = Math.max(0, Number(argv[++i] || args.transportFailureAbortThreshold));
    } else if (token === "--free-model-min-interval-ms") {
      args.freeModelMinIntervalMs = Math.max(0, Number(argv[++i] || args.freeModelMinIntervalMs));
    } else if (token === "--help" || token === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown arg: ${token}`);
    }
  }

  if (!explicitPhases.size) {
    args.generate = true;
    args.score = true;
  }

  return args;
}

function printHelp(): void {
  console.log(`Usage:
  npx tsx scripts/parallel-runner.ts --models "family=model,other/model" --concurrency 50
  npx tsx scripts/parallel-runner.ts --models-file models.yaml --generate
  npx tsx scripts/parallel-runner.ts --score

Options:
  --generate              Run generation phase
  --score                 Run scoring phase
  --concurrency N         Global in-flight request limit, default 50
  --models LIST           Comma/space list of model IDs, optionally family=model
  --models-file PATH      JSON or small YAML model config, default models.yaml when present
  --results-dir PATH      Output directory, default results
  --ids LIST              Question IDs to include
  --levels LIST           Question levels to include
  --retry-failed          Retry failed generation rows instead of treating them as checkpointed
  --dry-run               Print selected tasks without making API calls
  --temperature N         Sampling temperature, default 0.1
  --max-tokens N          Max tokens, default 2200
  --max-retries N         Retry count after first attempt, default 6
  --insufficient-credits-abort-threshold N
                          Abort generation after N insufficient-credit failures, default 3.
                          Use 0 to keep recording those failures.
  --transport-failure-abort-threshold N
                          Abort generation after N connection/network failures, default 0.
  --free-model-min-interval-ms N
                          Shared minimum delay between :free model requests, default 0.`);
}

function inferFamily(modelId: string): string {
  const lower = modelId.toLowerCase();
  if (lower.includes("gemini") || lower.startsWith("google/")) return "gemini";
  if (lower.includes("claude") || lower.startsWith("anthropic/")) return "claude";
  if (lower.startsWith("openai/") || lower.startsWith("gpt-") || lower.startsWith("o3") || lower.startsWith("o4")) return "openai";
  if (lower.includes("qwen")) return "qwen";
  if (lower.includes("glm") || lower.startsWith("z-ai/")) return "glm";
  if (lower.includes("kimi") || lower.startsWith("moonshotai/")) return "kimi";
  if (lower.includes("llama") || lower.startsWith("meta-llama/")) return "llama";
  if (lower.includes("grok") || lower.startsWith("x-ai/")) return "grok";
  if (lower.includes("/")) return lower.split("/")[0];
  return lower.split("-")[0] || "unknown";
}

function normalizeModel(id: string, family?: string): ModelSelection {
  const trimmed = id.trim();
  const resolvedFamily = (family || inferFamily(trimmed)).trim();
  return {
    family: resolvedFamily,
    id: trimmed,
    label: `${resolvedFamily}:${trimmed}`,
  };
}

function parseModelsArg(value: string): ModelSelection[] {
  return parseList(value).map(item => {
    const equalsIndex = item.indexOf("=");
    if (equalsIndex > 0) {
      const family = item.slice(0, equalsIndex).trim();
      const id = item.slice(equalsIndex + 1).trim();
      return normalizeModel(id, family);
    }
    return normalizeModel(item);
  });
}

function readDefaultRoster(): ModelSelection[] {
  const rosterPath = path.join(process.cwd(), "src", "config", "model-roster.json");
  const raw = fs.readFileSync(rosterPath, "utf8");
  const payload = JSON.parse(raw);
  if (!Array.isArray(payload.models)) {
    throw new Error(`No models array found in ${rosterPath}`);
  }
  return payload.models.map((id: string) => normalizeModel(id));
}

function parseModelsJson(raw: string): ModelSelection[] {
  const payload = JSON.parse(raw);
  if (Array.isArray(payload)) {
    return payload.map(item => typeof item === "string" ? normalizeModel(item) : normalizeModel(item.id, item.family));
  }
  if (payload && Array.isArray(payload.models)) {
    return payload.models.map((item: any) =>
      typeof item === "string" ? normalizeModel(item) : normalizeModel(item.id, item.family)
    );
  }
  if (payload && payload.families && typeof payload.families === "object") {
    const models: ModelSelection[] = [];
    for (const [family, ids] of Object.entries(payload.families)) {
      if (!Array.isArray(ids)) continue;
      ids.forEach(id => models.push(normalizeModel(String(id), family)));
    }
    return models;
  }
  throw new Error("Unsupported JSON model config. Use { models: [...] } or { families: { name: [...] } }.");
}

function parseSmallYaml(raw: string): ModelSelection[] {
  const models: ModelSelection[] = [];
  const lines = raw.split(/\r?\n/);
  let section: "models" | "families" | null = null;
  let currentFamily: string | null = null;

  for (const rawLine of lines) {
    const withoutComment = rawLine.replace(/\s+#.*$/, "");
    if (!withoutComment.trim()) continue;
    const indent = withoutComment.match(/^\s*/)?.[0].length ?? 0;
    const line = withoutComment.trim();

    if (indent === 0 && line === "models:") {
      section = "models";
      currentFamily = null;
      continue;
    }
    if (indent === 0 && line === "families:") {
      section = "families";
      currentFamily = null;
      continue;
    }

    if (section === "families") {
      if (indent === 2 && line.endsWith(":")) {
        currentFamily = line.slice(0, -1).trim();
        continue;
      }
      if (currentFamily && indent >= 4 && line.startsWith("- ")) {
        models.push(normalizeModel(unquote(line.slice(2).trim()), currentFamily));
        continue;
      }
    }

    if (section === "models" && indent >= 2 && line.startsWith("- ")) {
      const item = line.slice(2).trim();
      if (item.startsWith("id:")) {
        const id = unquote(item.slice(3).trim());
        const family = inferFamily(id);
        models.push(normalizeModel(id, family));
      } else if (item.includes("=")) {
        models.push(...parseModelsArg(item));
      } else {
        models.push(normalizeModel(unquote(item)));
      }
    }
  }

  if (!models.length) {
    throw new Error("Unsupported YAML model config. Use families: { family: [- model] } or models: [- model].");
  }
  return models;
}

function unquote(value: string): string {
  return value.replace(/^["']|["']$/g, "");
}

function loadModels(args: CliArgs): ModelSelection[] {
  let models: ModelSelection[];
  if (args.models?.trim()) {
    models = parseModelsArg(args.models);
  } else {
    const requestedPath = args.modelsFile
      ? (path.isAbsolute(args.modelsFile) ? args.modelsFile : path.join(process.cwd(), args.modelsFile))
      : DEFAULT_MODELS_FILE;
    if (fs.existsSync(requestedPath)) {
      const raw = fs.readFileSync(requestedPath, "utf8");
      models = raw.trim().startsWith("{") || raw.trim().startsWith("[")
        ? parseModelsJson(raw)
        : parseSmallYaml(raw);
    } else {
      models = readDefaultRoster();
    }
  }

  const seen = new Set<string>();
  return models.filter(model => {
    if (!model.id) return false;
    if (seen.has(model.id)) return false;
    seen.add(model.id);
    return true;
  });
}

function selectQuestions(args: CliArgs): SchemaQuestion[] {
  let questions = SCHEMA_QUESTIONS_300Q;

  if (args.levels?.length) {
    const levels = new Set(args.levels);
    questions = questions.filter(question => levels.has(question.level));
  }

  if (args.ids?.length) {
    const ids = new Set(args.ids);
    questions = questions.filter(question => ids.has(question.id));
  }

  if (!questions.length) {
    throw new Error("No questions selected; check --ids or --levels.");
  }

  return questions;
}

function keyOf(model: string, questionId: string): string {
  return `${model}\u0000${questionId}`;
}

function jsonlPath(resultsDir: string, fileName: string): string {
  return path.join(resultsDir, fileName);
}

function parseJsonLines<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf8");
  return raw
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => JSON.parse(line) as T);
}

function latestRowsByKey<T extends { model: string; questionId: string }>(rows: T[]): Map<string, T> {
  const map = new Map<string, T>();
  for (const row of rows) {
    map.set(keyOf(row.model, row.questionId), row);
  }
  return map;
}

class JsonlWriter {
  private chain: Promise<void> = Promise.resolve();

  constructor(private filePath: string) {}

  append(row: unknown): Promise<void> {
    const line = `${JSON.stringify(row)}\n`;
    this.chain = this.chain.then(() => fsp.appendFile(this.filePath, line, "utf8"));
    return this.chain;
  }

  async flush(): Promise<void> {
    await this.chain;
  }
}

class Semaphore {
  private active = 0;
  private waiters: Array<() => void> = [];

  constructor(private limit: number) {}

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

class RateGate {
  private chain: Promise<void> = Promise.resolve();
  private lastStartedAt = 0;

  constructor(private minIntervalMs: number) {}

  async wait(): Promise<void> {
    if (this.minIntervalMs <= 0) return;
    this.chain = this.chain.then(async () => {
      const elapsed = Date.now() - this.lastStartedAt;
      if (elapsed < this.minIntervalMs) {
        await sleep(this.minIntervalMs - elapsed);
      }
      this.lastStartedAt = Date.now();
    });
    await this.chain;
  }
}

function isRetryableError(error: unknown): boolean {
  const maybeStatus = typeof error === "object" && error !== null ? (error as any).status : undefined;
  if (maybeStatus === 429) return true;
  if (typeof maybeStatus === "number" && maybeStatus >= 500 && maybeStatus <= 599) return true;
  const msg = (error instanceof Error ? error.message : String(error)).toLowerCase();
  return /429|rate limit|5\d\d|timeout|temporarily|unavailable|overloaded|abort|connection error|network|econnreset|socket hang up|fetch failed|blank|empty|whitespace-only|no content|invalid json response body|unexpected end of json input/.test(msg);
}

function describeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function isInsufficientCreditsError(error: string | undefined): boolean {
  return /402|insufficient credits/i.test(error || "");
}

function isTransportFailureError(error: string | undefined): boolean {
  return /connection error|network|econnreset|socket hang up|fetch failed|read etimedout|premature close/i.test(error || "");
}

function isLmStudioModel(model: ModelSelection): boolean {
  return model.family === "lmstudio" || model.id.startsWith("local-") || model.id.startsWith("lmstudio-");
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function retryDelayMs(attempt: number): number {
  const base = Math.min(2000 * 2 ** Math.max(0, attempt - 1), 60000);
  const jitter = Math.floor(Math.random() * Math.min(1000, base * 0.25));
  return base + jitter;
}

async function callOpenRouter(
  client: OpenAI,
  model: string,
  system: string,
  user: string,
  options: { temperature: number; maxTokens: number }
): Promise<{ text: string; durationMs: number }> {
  const start = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS);
  try {
    const resp = await client.chat.completions.create(
      {
        model,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        response_format: { type: "json_object" as const },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      },
      { signal: controller.signal }
    );
    const text = resp.choices?.[0]?.message?.content ?? "";
    if (!text.trim()) {
      throw new Error("blank response");
    }
    return { text, durationMs: Date.now() - start };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function callLmStudio(
  client: OpenAI,
  model: string,
  system: string,
  user: string,
  options: { temperature: number; maxTokens: number }
): Promise<{ text: string; durationMs: number }> {
  const start = Date.now();
  const request: Record<string, any> = {
    model,
    temperature: options.temperature,
    max_tokens: options.maxTokens,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  };
  const responseFormat = String(process.env.LMSTUDIO_RESPONSE_FORMAT || "none").toLowerCase();
  if (responseFormat !== "none") {
    request.response_format = { type: responseFormat };
  }
  const resp = await client.chat.completions.create(request);
  const text = resp.choices?.[0]?.message?.content ?? "";
  if (!text.trim()) {
    throw new Error("blank response");
  }
  return { text, durationMs: Date.now() - start };
}

async function generateOne(
  clients: { openrouter?: OpenAI; lmstudio?: OpenAI },
  model: ModelSelection,
  question: SchemaQuestion,
  args: CliArgs,
  freeModelGate?: RateGate
): Promise<GenerationRow> {
  const rubric = loadRubric300q(question.rubric_id);
  const prompts = buildExecuteOnePrompts(question, rubric);
  const started = Date.now();
  let lastError: unknown = null;
  let attempts = 0;

  for (let attempt = 0; attempt <= args.maxRetries; attempt += 1) {
    attempts = attempt + 1;
    try {
      if (attempt > 0) {
        await sleep(retryDelayMs(attempt));
      }
      if (model.id.endsWith(":free")) {
        await freeModelGate?.wait();
      }
      const result = isLmStudioModel(model)
        ? await callLmStudio(requiredClient(clients.lmstudio, "LM Studio"), model.id, prompts.system, prompts.user, {
            temperature: args.temperature,
            maxTokens: args.maxTokens,
          })
        : await callOpenRouter(requiredClient(clients.openrouter, "OpenRouter"), model.id, prompts.system, prompts.user, {
            temperature: args.temperature,
            maxTokens: args.maxTokens,
          });
      return {
        phase: "generation",
        runAt: new Date().toISOString(),
        family: model.family,
        model: model.id,
        modelLabel: model.label,
        questionId: question.id,
        questionLevel: question.level,
        rubricId: question.rubric_id,
        status: "ok",
        raw: result.text,
        durationMs: result.durationMs,
        attempts: attempt + 1,
      };
    } catch (error) {
      lastError = error;
      if (attempt >= args.maxRetries || !isRetryableError(error)) {
        break;
      }
    }
  }

  return {
    phase: "generation",
    runAt: new Date().toISOString(),
    family: model.family,
    model: model.id,
    modelLabel: model.label,
    questionId: question.id,
    questionLevel: question.level,
    rubricId: question.rubric_id,
    status: "failed",
    raw: "",
    durationMs: Date.now() - started,
    attempts,
    error: describeError(lastError),
  };
}

function requiredClient(client: OpenAI | undefined, name: string): OpenAI {
  if (!client) {
    throw new Error(`${name} client is not configured.`);
  }
  return client;
}

async function runWithSemaphore<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>
): Promise<void> {
  const semaphore = new Semaphore(concurrency);
  await Promise.all(items.map(async item => {
    const release = await semaphore.acquire();
    try {
      await worker(item);
    } finally {
      release();
    }
  }));
}

async function runGeneration(
  args: CliArgs,
  models: ModelSelection[],
  questions: SchemaQuestion[],
  generationsPath: string
): Promise<void> {
  const needsOpenRouter = models.some(model => !isLmStudioModel(model));
  const needsLmStudio = models.some(isLmStudioModel);
  if (needsOpenRouter && !process.env.OPENROUTER_API_KEY && !args.dryRun) {
    throw new Error("OPENROUTER_API_KEY is required for generation.");
  }

  const existingRows = parseJsonLines<GenerationRow>(generationsPath);
  const existingByKey = latestRowsByKey(existingRows);
  const tasks = models.flatMap(model =>
    questions.map(question => ({ model, question }))
  ).filter(({ model, question }) => {
    const existing = existingByKey.get(keyOf(model.id, question.id));
    if (!existing) return true;
    return args.retryFailed && existing.status === "failed";
  });

  console.log(`Generation: ${tasks.length} pending of ${models.length * questions.length} total tasks`);
  if (args.dryRun) {
    tasks.slice(0, 20).forEach(task => console.log(` - ${task.model.family} ${task.model.id} ${task.question.id}`));
    if (tasks.length > 20) console.log(` - ... ${tasks.length - 20} more`);
    return;
  }

  const clients = {
    openrouter: needsOpenRouter
      ? new OpenAI({
          baseURL: "https://openrouter.ai/api/v1",
          apiKey: process.env.OPENROUTER_API_KEY,
          timeout: OPENROUTER_TIMEOUT_MS,
          maxRetries: 0,
          defaultHeaders: {
            "HTTP-Referer": "tradebench-lite",
            "X-Title": "TradeBench 300Q Parallel Runner",
          },
        })
      : undefined,
    lmstudio: needsLmStudio
      ? new OpenAI({
          baseURL: LMSTUDIO_BASE_URL,
          apiKey: process.env.LMSTUDIO_API_KEY || "lm-studio",
          timeout: LMSTUDIO_TIMEOUT_MS,
          maxRetries: 0,
        })
      : undefined,
  };
  const writer = new JsonlWriter(generationsPath);
  const freeModelGate = new RateGate(args.freeModelMinIntervalMs);
  let completed = 0;
  let insufficientCreditFailures = 0;
  let transportFailures = 0;
  let abortReason: string | null = null;

  try {
    await runWithSemaphore(tasks, args.concurrency, async ({ model, question }) => {
      if (abortReason) return;
      const row = await generateOne(clients, model, question, args, freeModelGate);
      await writer.append(row);
      completed += 1;
      const outcome = row.status === "ok" ? "ok" : "failed";
      console.log(`[gen ${completed}/${tasks.length}] ${outcome} ${model.id} ${question.id}${row.error ? ` error=${row.error}` : ""}`);
      if (row.status === "failed" && isInsufficientCreditsError(row.error) && args.insufficientCreditsAbortThreshold > 0) {
        insufficientCreditFailures += 1;
        if (insufficientCreditFailures >= args.insufficientCreditsAbortThreshold) {
          abortReason = `Aborting generation after ${insufficientCreditFailures} insufficient-credit failures. Add OpenRouter credits, then rerun with --retry-failed to resume from the checkpoint.`;
          throw new Error(abortReason);
        }
      }
      if (row.status === "failed" && isTransportFailureError(row.error) && args.transportFailureAbortThreshold > 0) {
        transportFailures += 1;
        if (transportFailures >= args.transportFailureAbortThreshold) {
          abortReason = `Aborting generation after ${transportFailures} transport failures. Check network/OpenRouter health, then rerun with --retry-failed to resume from the checkpoint.`;
          throw new Error(abortReason);
        }
      }
    });
  } finally {
    await writer.flush();
  }
}

function scoreGeneration(row: GenerationRow, questionById: Map<string, SchemaQuestion>): ScoreRow {
  const question = questionById.get(row.questionId);
  if (!question) {
    throw new Error(`Question not found: ${row.questionId}`);
  }

  if (row.status !== "ok") {
    const grade: GradeResult = {
      pass: false,
      confidence: 0,
      score: 0,
      fieldScores: {},
      normalizedResponse: null,
      failureReasons: ["generation_failed", row.error || "unknown_error"],
      parsingMethod: "none",
    };
    return {
      phase: "score",
      scoredAt: new Date().toISOString(),
      family: row.family,
      model: row.model,
      modelLabel: row.modelLabel,
      questionId: row.questionId,
      status: "failed",
      score: 0,
      pass: false,
      confidence: 0,
      grade,
      error: row.error,
    };
  }

  const rubric = loadRubric300q(question.rubric_id);
  const grade = gradeSchemaResponse(row.raw, question, rubric);
  return {
    phase: "score",
    scoredAt: new Date().toISOString(),
    family: row.family,
    model: row.model,
    modelLabel: row.modelLabel,
    questionId: row.questionId,
    status: "ok",
    score: grade.score,
    pass: grade.pass,
    confidence: grade.confidence,
    grade,
  };
}

async function runScoring(
  args: CliArgs,
  models: ModelSelection[],
  questions: SchemaQuestion[],
  generationsPath: string,
  scoresPath: string
): Promise<void> {
  const generations = latestRowsByKey(parseJsonLines<GenerationRow>(generationsPath));
  const existingScores = latestRowsByKey(parseJsonLines<ScoreRow>(scoresPath));
  const questionById = new Map(questions.map(question => [question.id, question]));
  const selectedModels = new Set(models.map(model => model.id));
  const rowsToScore = Array.from(generations.values()).filter(row => {
    if (!selectedModels.has(row.model)) return false;
    if (!questionById.has(row.questionId)) return false;
    const existing = existingScores.get(keyOf(row.model, row.questionId));
    if (!existing) return true;
    return args.retryFailed && existing.status === "failed";
  });

  console.log(`Scoring: ${rowsToScore.length} pending of ${generations.size} generation rows`);
  if (args.dryRun) {
    rowsToScore.slice(0, 20).forEach(row => console.log(` - ${row.model} ${row.questionId}`));
    if (rowsToScore.length > 20) console.log(` - ... ${rowsToScore.length - 20} more`);
    return;
  }

  const writer = new JsonlWriter(scoresPath);
  let completed = 0;
  await runWithSemaphore(rowsToScore, Math.min(args.concurrency, 100), async row => {
    const scoreRow = scoreGeneration(row, questionById);
    await writer.append(scoreRow);
    completed += 1;
    console.log(`[score ${completed}/${rowsToScore.length}] ${scoreRow.status} ${row.model} ${row.questionId} score=${scoreRow.score.toFixed(3)}`);
  });
  await writer.flush();
}

function summarize(generationRows: GenerationRow[], scoreRows: ScoreRow[]): SummaryRow[] {
  const latestGenerations = latestRowsByKey(generationRows);
  const latestScores = latestRowsByKey(scoreRows);
  const modelIds = new Set<string>();
  const familyIds = new Set<string>();
  const familyByModel = new Map<string, string>();

  for (const row of latestGenerations.values()) {
    modelIds.add(row.model);
    familyIds.add(row.family);
    familyByModel.set(row.model, row.family);
  }
  for (const row of latestScores.values()) {
    modelIds.add(row.model);
    familyIds.add(row.family);
    familyByModel.set(row.model, row.family);
  }

  const rows: SummaryRow[] = [];

  for (const model of Array.from(modelIds).sort()) {
    const generations = Array.from(latestGenerations.values()).filter(row => row.model === model);
    const scores = Array.from(latestScores.values()).filter(row => row.model === model && row.status === "ok");
    const failedKeys = new Set<string>();
    generations
      .filter(row => row.status === "failed")
      .forEach(row => failedKeys.add(keyOf(row.model, row.questionId)));
    Array.from(latestScores.values())
      .filter(row => row.model === model && row.status === "failed")
      .forEach(row => failedKeys.add(keyOf(row.model, row.questionId)));
    rows.push({
      scope: "model",
      id: model,
      countDone: generations.filter(row => row.status === "ok").length,
      countFailed: failedKeys.size,
      countScored: scores.length,
      meanScore: scores.length ? scores.reduce((sum, row) => sum + row.score, 0) / scores.length : null,
    });
  }

  for (const family of Array.from(familyIds).sort()) {
    const generations = Array.from(latestGenerations.values()).filter(row => row.family === family);
    const scores = Array.from(latestScores.values()).filter(row => row.family === family && row.status === "ok");
    const failedKeys = new Set<string>();
    generations
      .filter(row => row.status === "failed")
      .forEach(row => failedKeys.add(keyOf(row.model, row.questionId)));
    Array.from(latestScores.values())
      .filter(row => row.family === family && row.status === "failed")
      .forEach(row => failedKeys.add(keyOf(row.model, row.questionId)));
    rows.push({
      scope: "family",
      id: family,
      countDone: generations.filter(row => row.status === "ok").length,
      countFailed: failedKeys.size,
      countScored: scores.length,
      meanScore: scores.length ? scores.reduce((sum, row) => sum + row.score, 0) / scores.length : null,
    });
  }

  return rows;
}

async function writeSummary(resultsDir: string, models: ModelSelection[]): Promise<void> {
  const generationsPath = jsonlPath(resultsDir, "generations.jsonl");
  const scoresPath = jsonlPath(resultsDir, "scores.jsonl");
  const summaryPath = jsonlPath(resultsDir, "summary.csv");
  const selectedModels = new Set(models.map(model => model.id));
  const rows = summarize(
    parseJsonLines<GenerationRow>(generationsPath).filter(row => selectedModels.has(row.model)),
    parseJsonLines<ScoreRow>(scoresPath).filter(row => selectedModels.has(row.model))
  );

  const header = "scope,id,count_done,count_failed,count_scored,mean_score\n";
  const body = rows.map(row => [
    row.scope,
    csvEscape(row.id),
    row.countDone,
    row.countFailed,
    row.countScored,
    row.meanScore === null ? "" : row.meanScore.toFixed(6),
  ].join(",")).join("\n");
  await fsp.writeFile(summaryPath, `${header}${body}${body ? "\n" : ""}`, "utf8");

  console.log("\nSummary");
  rows.forEach(row => {
    const mean = row.meanScore === null ? "n/a" : row.meanScore.toFixed(3);
    console.log(`${row.scope} ${row.id}: done=${row.countDone} failed=${row.countFailed} scored=${row.countScored} mean=${mean}`);
  });
  console.log(`Summary written to ${summaryPath}`);
}

function csvEscape(value: string): string {
  if (!/[",\n]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv);
  const models = loadModels(args);
  const questions = selectQuestions(args);
  await fsp.mkdir(args.resultsDir, { recursive: true });

  const generationsPath = jsonlPath(args.resultsDir, "generations.jsonl");
  const scoresPath = jsonlPath(args.resultsDir, "scores.jsonl");

  console.log(`Models: ${models.length}`);
  console.log(`Questions: ${questions.length}`);
  console.log(`Results dir: ${args.resultsDir}`);
  console.log(`Concurrency: ${args.concurrency}`);
  console.log(`Phases: ${[args.generate ? "generate" : "", args.score ? "score" : ""].filter(Boolean).join(", ")}`);

  if (args.generate) {
    await runGeneration(args, models, questions, generationsPath);
  }
  if (args.score) {
    await runScoring(args, models, questions, generationsPath, scoresPath);
  }
  await writeSummary(args.resultsDir, models);
}

main().catch(error => {
  console.error("parallel-runner failed:", error);
  process.exit(1);
});
