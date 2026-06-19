import OpenAI from "openai";

type CallOptions = {
  temperature?: number;
  maxTokens?: number;
};

const MIN_VISIBLE_CHARS = 20;

const hasVisibleContent = (text: string): boolean => text.replace(/\s/g, "").length >= MIN_VISIBLE_CHARS;

// Together exposes an OpenAI-compatible API, so we reuse the OpenAI SDK pointed at
// Together's base URL. Used for both the stock base model (serverless) and our
// fine-tuned model (dedicated endpoint) so the comparison runs on one identical stack.
export async function callTogether(
  modelId: string,
  system: string,
  user: string,
  options: CallOptions = {},
) {
  const client = new OpenAI({
    baseURL: process.env.TOGETHER_BASE_URL || "https://api.together.xyz/v1",
    apiKey: process.env.TOGETHER_API_KEY,
    timeout: Number(process.env.TOGETHER_TIMEOUT_MS || 300000),
    maxRetries: Number(process.env.TOGETHER_SDK_RETRIES || 2),
  });

  const start = Date.now();
  const requestConfig: Record<string, any> = {
    model: modelId,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: options.temperature ?? 0,
  };
  if (options.maxTokens !== undefined) requestConfig.max_tokens = options.maxTokens;

  const resp = await client.chat.completions.create(requestConfig);
  const text = resp.choices?.[0]?.message?.content ?? "";
  if (!hasVisibleContent(text)) {
    throw new Error("Empty or whitespace-only Together response body");
  }
  return { text, durationMs: Date.now() - start };
}
