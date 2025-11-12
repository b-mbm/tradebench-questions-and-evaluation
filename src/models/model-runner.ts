import 'dotenv/config';
import fs from 'fs';
import path from 'path';

import { callOpenAI } from './providers/openai';
import { callAnthropic } from './providers/anthropic';
import { callGemini } from './providers/gemini';
import { callGroq } from './providers/groq';
import { callOpenRouter } from './providers/openrouter';
import { buildExecuteOnePrompts } from '../prompts/schema-prompts';

export type Provider = 'openai' | 'anthropic' | 'google' | 'groq' | 'openrouter';

export interface ModelConfig {
  id: string;
  provider: Provider;
  label: string;
}

export interface ExecuteOneCallOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface ExecuteOneCallResult {
  text: string;
  durationMs: number;
}

export interface ExecuteOnePrompts {
  system: string;
  user: string;
}

const DEFAULT_TEMPERATURE = 0.1;
const DEFAULT_MAX_TOKENS = 2200;

// Roster resolution order (first existing wins):
// 1) MODEL_ROSTER env (absolute or relative to cwd)
// 2) repo-local default: src/config/model-roster.json
// 3) legacy path kept for back-compat: Trading Reasoning Round 4/.../benchmark.json
const DEFAULT_LOCAL_ROSTER = path.join(__dirname, '..', 'config', 'model-roster.json');
const LEGACY_ROSTER = path.join(
  __dirname,
  '..',
  '..',
  'Trading Reasoning Round 4',
  'Round-4-Extension-4',
  'benchmark.json',
);

function resolveRosterPath(): string | null {
  const fromEnv = (process.env.MODEL_ROSTER || '').trim();
  const candidates = [fromEnv || null, DEFAULT_LOCAL_ROSTER, LEGACY_ROSTER].filter(Boolean) as string[];
  for (const p of candidates) {
    try {
      const abs = path.isAbsolute(p) ? p : path.join(process.cwd(), p);
      if (fs.existsSync(abs)) return abs;
    } catch {}
  }
  return null;
}

const PROVIDER_ENV: Record<Provider, string> = {
  openai: 'OPENAI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
  google: 'GOOGLE_API_KEY',
  groq: 'GROQ_API_KEY',
  openrouter: 'OPENROUTER_API_KEY',
};

function readBenchmarkModels(): string[] {
  const rosterPath = resolveRosterPath();
  if (!rosterPath) {
    console.warn('⚠️ No model roster found. Set MODEL_ROSTER or create src/config/model-roster.json.');
    return [];
  }
  try {
    const payload = JSON.parse(fs.readFileSync(rosterPath, 'utf8'));
    if (!Array.isArray(payload.models)) {
      console.warn(`⚠️ No model list found in roster file ${rosterPath}.`);
      return [];
    }
    if (rosterPath === LEGACY_ROSTER) {
      console.warn(`ℹ️ Using legacy roster path (${rosterPath}); consider moving to src/config/model-roster.json or MODEL_ROSTER env.`);
    }
    return payload.models;
  } catch (error) {
    console.warn(`⚠️ Unable to load model roster from ${rosterPath}: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

function inferProvider(modelId: string): Provider {
  if (modelId.startsWith('gpt-5') || modelId.startsWith('gpt-4') || modelId.startsWith('gpt-4o') || modelId.startsWith('o')) {
    return 'openai';
  }
  if (modelId.startsWith('claude')) {
    return 'anthropic';
  }
  if (modelId.startsWith('gemini')) {
    return 'google';
  }
  if (modelId.startsWith('llama-3.3') || modelId.startsWith('llama-3.1')) {
    return 'groq';
  }
  if (modelId.includes('/')) {
    return 'openrouter';
  }
  if (modelId.startsWith('mistral') || modelId.startsWith('qwen')) {
    return 'openrouter';
  }
  throw new Error(`Unable to infer provider for model ${modelId}`);
}

function hasProviderAccess(provider: Provider): boolean {
  const envKey = PROVIDER_ENV[provider];
  return !!envKey && !!process.env[envKey];
}

const missingProviders = new Set<Provider>();

export const MODELS: ModelConfig[] = readBenchmarkModels()
  .map(modelId => {
    const provider = inferProvider(modelId);
    return {
      id: modelId,
      provider,
      label: `${provider}:${modelId}`,
    };
  })
  .filter(model => {
    if (!hasProviderAccess(model.provider)) {
      missingProviders.add(model.provider);
      return false;
    }
    return true;
  });

if (missingProviders.size) {
  const details = Array.from(missingProviders)
    .map(provider => `${provider} (requires ${PROVIDER_ENV[provider]})`)
    .join(', ');
  console.warn(`⚠️ Skipping models for missing API keys: ${details}`);
}

const MODEL_MAP = new Map(MODELS.map(model => [model.id, model]));

export async function callExecuteOneModel(
  modelId: string,
  question: Record<string, any>,
  options: ExecuteOneCallOptions = {}
): Promise<ExecuteOneCallResult> {
  const config = MODEL_MAP.get(modelId);
  if (!config) {
    throw new Error(`Model ${modelId} not present in benchmark roster.`);
  }

  const { system, user } = buildExecuteOnePrompts(question);
  const temperature = options.temperature ?? DEFAULT_TEMPERATURE;
  const maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS;

  switch (config.provider) {
    case 'openai':
      return await callOpenAI(modelId, system, user, { temperature, maxTokens });
    case 'anthropic':
      return await callAnthropic(modelId, system, user, { temperature, maxTokens });
    case 'google':
      return await callGemini(modelId, system, user, { temperature, maxTokens });
    case 'groq':
      return await callGroq(modelId, system, user, { temperature, maxTokens });
    case 'openrouter':
      return await callOpenRouter(modelId, system, user, { temperature, maxTokens });
    default:
      throw new Error(`Unsupported provider ${config.provider} for model ${modelId}`);
  }
}

export function getModelLabel(modelId: string): string {
  return MODEL_MAP.get(modelId)?.label ?? modelId;
}

export const DEFAULT_MODEL_OPTIONS: ExecuteOneCallOptions = {
  temperature: DEFAULT_TEMPERATURE,
  maxTokens: DEFAULT_MAX_TOKENS,
};
