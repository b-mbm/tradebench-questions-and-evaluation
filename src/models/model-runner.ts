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

const BENCHMARK_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'Trading Reasoning Round 4',
  'Round-4-Extension-4',
  'benchmark.json'
);

const PROVIDER_ENV: Record<Provider, string> = {
  openai: 'OPENAI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
  google: 'GOOGLE_API_KEY',
  groq: 'GROQ_API_KEY',
  openrouter: 'OPENROUTER_API_KEY',
};

function readBenchmarkModels(): string[] {
  try {
    const payload = JSON.parse(fs.readFileSync(BENCHMARK_PATH, 'utf8'));
    if (!Array.isArray(payload.models)) {
      console.warn('⚠️ No model list found in benchmark payload.');
      return [];
    }
    return payload.models;
  } catch (error) {
    console.warn(
      `⚠️ Unable to load model roster from ${BENCHMARK_PATH}: ${error instanceof Error ? error.message : String(error)}`
    );
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
