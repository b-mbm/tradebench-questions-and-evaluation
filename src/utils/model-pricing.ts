/**
 * Model Pricing Database
 * Prices are in USD per 1M tokens (input and output separately where applicable)
 * Updated as of October 2025
 */

export interface ModelPrice {
  inputPer1M: number;
  outputPer1M: number;
  provider: string;
}

export const MODEL_PRICING: Record<string, ModelPrice> = {
  // OpenAI Models
  'gpt-5': { inputPer1M: 5.0, outputPer1M: 15.0, provider: 'openai' },
  'gpt-5-mini': { inputPer1M: 2.5, outputPer1M: 7.5, provider: 'openai' },
  'gpt-5-nano': { inputPer1M: 1.0, outputPer1M: 3.0, provider: 'openai' },
  'gpt-4.1': { inputPer1M: 2.5, outputPer1M: 10.0, provider: 'openai' },
  'gpt-4.1-mini': { inputPer1M: 0.15, outputPer1M: 0.6, provider: 'openai' },
  'gpt-4o': { inputPer1M: 2.5, outputPer1M: 10.0, provider: 'openai' },
  'gpt-4o-mini': { inputPer1M: 0.15, outputPer1M: 0.6, provider: 'openai' },
  'o1': { inputPer1M: 15.0, outputPer1M: 60.0, provider: 'openai' },
  'o1-mini': { inputPer1M: 3.0, outputPer1M: 12.0, provider: 'openai' },
  'o3': { inputPer1M: 20.0, outputPer1M: 80.0, provider: 'openai' },
  'o3-mini': { inputPer1M: 5.0, outputPer1M: 20.0, provider: 'openai' },
  'o4-mini': { inputPer1M: 5.0, outputPer1M: 20.0, provider: 'openai' },
  
  // Anthropic Claude Models
  'claude-sonnet-4-5-20250929': { inputPer1M: 3.0, outputPer1M: 15.0, provider: 'anthropic' },
  'claude-opus-4-1-20250805': { inputPer1M: 15.0, outputPer1M: 75.0, provider: 'anthropic' },
  'claude-opus-4-20250514': { inputPer1M: 15.0, outputPer1M: 75.0, provider: 'anthropic' },
  'claude-sonnet-4-20250514': { inputPer1M: 3.0, outputPer1M: 15.0, provider: 'anthropic' },
  'claude-3-5-sonnet-20241022': { inputPer1M: 3.0, outputPer1M: 15.0, provider: 'anthropic' },
  'claude-3-opus-20240229': { inputPer1M: 15.0, outputPer1M: 75.0, provider: 'anthropic' },
  
  // Google Gemini Models
  'gemini-2.5-pro': { inputPer1M: 1.25, outputPer1M: 5.0, provider: 'google' },
  'gemini-2.5-flash': { inputPer1M: 0.075, outputPer1M: 0.3, provider: 'google' },
  'gemini-2.5-flash-lite': { inputPer1M: 0.0375, outputPer1M: 0.15, provider: 'google' },
  'gemini-2.5-flash-lite-preview-09-2025': { inputPer1M: 0.0375, outputPer1M: 0.15, provider: 'google' },
  'gemini-2.0-flash-exp': { inputPer1M: 0.0, outputPer1M: 0.0, provider: 'google' }, // Free tier
  'gemini-1.5-pro': { inputPer1M: 1.25, outputPer1M: 5.0, provider: 'google' },
  'gemini-1.5-flash': { inputPer1M: 0.075, outputPer1M: 0.3, provider: 'google' },
  
  // Groq Models (subsidized pricing)
  'llama-3.3-70b-versatile': { inputPer1M: 0.59, outputPer1M: 0.79, provider: 'groq' },
  'llama-3.1-8b-instant': { inputPer1M: 0.05, outputPer1M: 0.08, provider: 'groq' },
  'llama-3.1-70b-versatile': { inputPer1M: 0.59, outputPer1M: 0.79, provider: 'groq' },
  
  // OpenRouter Models (approximate pricing)
  'meta-llama/llama-4-maverick': { inputPer1M: 1.5, outputPer1M: 2.0, provider: 'openrouter' },
  'meta-llama/llama-4-scout': { inputPer1M: 0.5, outputPer1M: 1.0, provider: 'openrouter' },
  'mistralai/mixtral-8x7b-instruct': { inputPer1M: 0.24, outputPer1M: 0.24, provider: 'openrouter' },
  'meta-llama/llama-3.1-405b-instruct': { inputPer1M: 2.7, outputPer1M: 2.7, provider: 'openrouter' },
  'qwen/qwen3-235b-a22b-2507': { inputPer1M: 1.8, outputPer1M: 1.8, provider: 'openrouter' },
};

export interface CostCalculation {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  costPer1KTokens: number;
  modelId: string;
  provider: string;
}

/**
 * Calculate the cost of a model inference based on token usage
 */
export function calculateCost(
  modelId: string,
  inputTokens: number,
  outputTokens: number
): CostCalculation {
  const pricing = MODEL_PRICING[modelId];
  
  if (!pricing) {
    // Return zero cost for unknown models but log warning
    console.warn(`⚠️  No pricing data for model: ${modelId}`);
    return {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      inputCost: 0,
      outputCost: 0,
      totalCost: 0,
      costPer1KTokens: 0,
      modelId,
      provider: 'unknown',
    };
  }
  
  const inputCost = (inputTokens / 1_000_000) * pricing.inputPer1M;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPer1M;
  const totalCost = inputCost + outputCost;
  const totalTokens = inputTokens + outputTokens;
  const costPer1KTokens = totalTokens > 0 ? (totalCost / totalTokens) * 1000 : 0;
  
  return {
    inputTokens,
    outputTokens,
    totalTokens,
    inputCost,
    outputCost,
    totalCost,
    costPer1KTokens,
    modelId,
    provider: pricing.provider,
  };
}

/**
 * Format cost as USD string
 */
export function formatCost(cost: number): string {
  if (cost < 0.0001) return '$0.0000';
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  if (cost < 1) return `$${cost.toFixed(3)}`;
  return `$${cost.toFixed(2)}`;
}

/**
 * Format token count with K/M suffix
 */
export function formatTokens(tokens: number): string {
  if (tokens < 1000) return `${tokens}`;
  if (tokens < 1_000_000) return `${(tokens / 1000).toFixed(1)}K`;
  return `${(tokens / 1_000_000).toFixed(2)}M`;
}

/**
 * Get pricing info for a model
 */
export function getPricing(modelId: string): ModelPrice | null {
  return MODEL_PRICING[modelId] || null;
}

/**
 * Check if a model has pricing data
 */
export function hasPricing(modelId: string): boolean {
  return modelId in MODEL_PRICING;
}
