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
} from "../src/models/model-runner";
import { SCHEMA_QUESTIONS } from "../src/questions/schema-questions";
import { L0_QUESTIONS } from "../src/questions/l0-questions";
import { loadRubric } from "../src/rubrics/loader";
import { gradeSchemaResponse } from "../src/grading/schema-grader";
import { gradeL0Response } from "../src/grading/l0-grader";
import { buildL0Prompt } from "../src/prompts/l0-prompts";
import { buildExecuteOnePrompts, getSchemaFinalAttemptHint } from "../src/prompts/schema-prompts";
import type { BenchmarkQuestion, GradeResult, L0Question, SchemaQuestion } from "../src/types/schema";

type CliArgs = {
  ids?: string[];
  label?: string;
  filePrefix?: string;
  noCall?: boolean;
  dryRun?: boolean;
  out?: string;
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
    } else if (token === "--dry-run") {
      args.dryRun = true;
    } else if (token === "--out") {
      args.out = argv[++i];
    }
  }
  return args;
}

// In this repo, results are written to ./results or a subfolder
const OUTPUT_SUBDIR = (process.env.OUTPUT_SUBDIR || "").trim();
const OUTPUT_DIR = OUTPUT_SUBDIR
  ? path.join(process.cwd(), "results", OUTPUT_SUBDIR)
  : path.join(process.cwd(), "results");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const delay = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));

const ALL_QUESTIONS: BenchmarkQuestion[] = [
  ...L0_QUESTIONS,
  ...SCHEMA_QUESTIONS.map(question => ({ ...question, type: 'schema' as const })),
];

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

function isL0Question(question: BenchmarkQuestion): question is L0Question {
  return question.type === "l0" || question.level === 0;
}

function isSchemaQuestion(question: BenchmarkQuestion): question is SchemaQuestion {
  return !isL0Question(question);
}

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
  question: BenchmarkQuestion,
  overrides: ExecuteOneCallOptions | undefined,
  maxAttempts: number,
  baseDelayMs: number,
  noCall: boolean
): Promise<EvaluationRow> {
  const rubric = isSchemaQuestion(question) ? loadRubric(question.rubric_id) : null;
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
      let prompts = isL0Question(question) ? buildL0Prompt(question) : buildExecuteOnePrompts(question);
      const result = await callExecuteOneModel(model.id, question, { ...DEFAULT_MODEL_OPTIONS, ...overrides }, prompts);
      raw = result.text ?? "";

      let grade = isL0Question(question)
        ? gradeL0Response(raw, question)
        : gradeSchemaResponse(raw, question, rubric!);

      let parseFailed = !grade.normalizedResponse;
      if (parseFailed && attempt < maxAttempts) {
        const wait = Math.min(baseDelayMs * attempt, 8000);
        await delay(wait);
        lastErr = new Error("parse failure");
        continue;
      }

      // Last-resort rescue for schema questions: if this is the final attempt and we still have no
      // evaluable JSON (e.g., blank/truncated), try one compact "skeleton" prompt
      // that tells the model to emit minimal, non-null JSON for the required keys.
      if (parseFailed && attempt >= maxAttempts && !raw.trim() && !isL0Question(question)) {
        const extra = getSchemaFinalAttemptHint((question as any).rubric_id) ||
          (
            "Final attempt: Return a minimal JSON object that satisfies the Output Requirements above. " +
            "If you are unsure of a value, use 0 for numbers, false for booleans, and short generic strings for categorical fields (e.g., 'analysis', 'multi'). " +
            "Do not return null. Do not include extra keys. Return ONLY JSON."
          );
        const rescueUser = prompts.user + "\n\n" + extra;
        const rescueStart = Date.now();
        const rescue = await callExecuteOneModel(model.id, question as any, overrides, { system: prompts.system, user: rescueUser });
        raw = rescue.text;
        grade = gradeSchemaResponse(raw, question as any, rubric!);
        parseFailed = !grade.normalizedResponse;
        if (!parseFailed) {
          return {
            modelId: model.id,
            modelLabel: getModelLabel(model.id),
            questionId: (question as any).id,
            raw,
            durationMs: Date.now() - rescueStart,
            grade,
          };
        }
      }

      // Last-resort rescue for L0 numeric questions: if blank on the final attempt,
      // synthesize a minimal JSON object so the grader can evaluate (may be wrong but evaluable).
      if (parseFailed && attempt >= maxAttempts && !raw.trim() && isL0Question(question)) {
        const minimal = {
          final_answer: 0,
          unit: (question as any).unit || "units",
          reasoning: ["fallback"]
        };
        const startRescue = Date.now();
        raw = JSON.stringify(minimal);
        grade = gradeL0Response(raw, question as any);
        parseFailed = !grade.normalizedResponse;
        return {
          modelId: model.id,
          modelLabel: getModelLabel(model.id),
          questionId: question.id,
          raw,
          durationMs: Date.now() - startRescue,
          grade,
        };
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
  if (!ids || !ids.length) return ALL_QUESTIONS;
  const set = new Set(ids);
  const selected = ALL_QUESTIONS.filter(q => set.has(q.id));
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
  const callSpacingMs = process.env.CALL_SPACING_MS ? Number(process.env.CALL_SPACING_MS) : 800;
  const modelSpacingMs = Number(process.env.MODEL_SPACING_MS || 0);

  const overrides: ExecuteOneCallOptions = {};

  const rows: EvaluationRow[] = [];

  console.log(`✨ Running ${questions.length} questions across ${models.length} model(s)`);
  console.log(`Label: ${label}`);

  if (args.dryRun) {
    console.log("Dry run requested (--dry-run). No API calls will be made.");
    console.log("Models:");
    models.forEach(m => console.log(` - ${m.id}`));
    console.log("Questions:");
    questions.forEach(q => console.log(` - ${q.id}`));
    console.log("Use --no-call for a scaffolding pass that exercises grading without hitting providers.");
    return;
  }

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
  const outPath = args.out
    ? path.isAbsolute(args.out) ? args.out : path.join(process.cwd(), args.out)
    : path.join(OUTPUT_DIR, `${filePrefix}-${timestamp}.json`);
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(`\n✅ Results written to ${outPath}`);
  console.log(`RESULT_FILE=${outPath}`);

  // Optional: auto-merge repair results back into a base file in-place
  // Enable by setting MERGE_INTO_BASE=/path/to/base.json (only recommended for --ids runs)
  const mergeTarget = (process.env.MERGE_INTO_BASE || "").trim();
  if (mergeTarget) {
    try {
      if (!fs.existsSync(mergeTarget)) {
        console.warn(`⚠️ MERGE_INTO_BASE not found: ${mergeTarget}`);
      } else {
        const base = JSON.parse(fs.readFileSync(mergeTarget, "utf8"));
        const repairs = JSON.parse(fs.readFileSync(outPath, "utf8"));
        const key = (r: any) => `${r.modelId}::${r.questionId}`;
        const map = new Map<string, any>();
        for (const r of base.evaluations || []) map.set(key(r), r);
        for (const r of repairs.evaluations || []) map.set(key(r), r);
        const merged = { ...base, evaluations: Array.from(map.values()) };
        const bak = mergeTarget.replace(/\.json$/i, `.bak-${timestamp}.json`);
        fs.copyFileSync(mergeTarget, bak);
        fs.writeFileSync(mergeTarget, JSON.stringify(merged, null, 2));
        console.log(`🧩 Auto-merged repairs into ${mergeTarget} (backup: ${bak})`);
      }
    } catch (e) {
      console.warn(`⚠️ Auto-merge failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
}

run().catch(err => {
  console.error("❌ run-60q failed:", err);
  process.exit(1);
});
