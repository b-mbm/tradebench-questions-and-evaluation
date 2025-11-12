// Pricing per 1M tokens (input / output) as of 2025-01
// Source: Provider pricing pages

export interface ModelPricing {
  inputPer1M: number;
  outputPer1M: number;
  cached?: number; // Cached input pricing if different
}

export const MODEL_PRICING: Record<string, ModelPricing> = {
  // OpenAI
  'gpt-5': { inputPer1M: 10.0, outputPer1M: 30.0 }, // Estimated reasoning model pricing
  'gpt-5-mini': { inputPer1M: 0.15, outputPer1M: 0.60 },
  'gpt-5-nano': { inputPer1M: 0.05, outputPer1M: 0.20 },
  'gpt-4.1': { inputPer1M: 2.50, outputPer1M: 10.00 },
  'gpt-4.1-mini': { inputPer1M: 0.15, outputPer1M: 0.60 },
  'gpt-4o': { inputPer1M: 2.50, outputPer1M: 10.00 },
  'o3': { inputPer1M: 10.0, outputPer1M: 30.0 }, // Estimated reasoning model pricing
  'o3-mini': { inputPer1M: 1.10, outputPer1M: 4.40 },
  'o4-mini': { inputPer1M: 1.10, outputPer1M: 4.40 },

  // Anthropic
  'claude-sonnet-4-5-20250929': { inputPer1M: 3.0, outputPer1M: 15.0 },
  'claude-opus-4-1-20250805': { inputPer1M: 15.0, outputPer1M: 75.0 },
  'claude-opus-4-20250514': { inputPer1M: 15.0, outputPer1M: 75.0 },
  'claude-sonnet-4-20250514': { inputPer1M: 3.0, outputPer1M: 15.0 },

  // Google
  'gemini-2.5-pro': { inputPer1M: 1.25, outputPer1M: 5.0 },
  'gemini-2.5-flash': { inputPer1M: 0.075, outputPer1M: 0.30 },
  'gemini-2.5-flash-lite': { inputPer1M: 0.0375, outputPer1M: 0.15 },

  // Groq (free tier or minimal cost)
  'llama-3.3-70b-versatile': { inputPer1M: 0.0, outputPer1M: 0.0 },
  'llama-3.1-8b-instant': { inputPer1M: 0.0, outputPer1M: 0.0 },

  // OpenRouter (pass-through pricing, approximate)
  'meta-llama/llama-4-maverick': { inputPer1M: 0.50, outputPer1M: 1.50 },
  'meta-llama/llama-4-scout': { inputPer1M: 0.20, outputPer1M: 0.80 },
  'mistralai/mixtral-8x7b-instruct': { inputPer1M: 0.24, outputPer1M: 0.24 },
  'meta-llama/llama-3.1-405b-instruct': { inputPer1M: 2.70, outputPer1M: 2.70 },
  'qwen/qwen3-235b-a22b-2507': { inputPer1M: 1.80, outputPer1M: 1.80 },
};

export function calculateCost(modelId: string, promptTokens: number, completionTokens: number): number {
  const pricing = MODEL_PRICING[modelId];
  if (!pricing) {
    return 0; // Unknown model, no cost tracking
  }
  
  const inputCost = (promptTokens / 1_000_000) * pricing.inputPer1M;
  const outputCost = (completionTokens / 1_000_000) * pricing.outputPer1M;
  
  return inputCost + outputCost;
}

export function formatCost(cost: number): string {
  if (cost === 0) return '$0.00';
  if (cost < 0.01) return `$${(cost * 1000).toFixed(3)}m`; // millicents
  return `$${cost.toFixed(4)}`;
}
