import OpenAI from "openai";

type CallOptions = {
  temperature?: number;
  maxTokens?: number;
};

export async function callOpenRouter(
  modelId: string,
  system: string,
  user: string,
  options: CallOptions = {},
) {
  const timeout = Number(process.env.OPENROUTER_TIMEOUT_MS || 180000);
  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    timeout,
    maxRetries: Number(process.env.OPENROUTER_SDK_RETRIES || 0),
    defaultHeaders: {
      "HTTP-Referer": "tradebench-lite",
      "X-Title": "Tradebench 60Q Harness",
    },
  });

  const start = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const resp = await client.chat.completions.create(
      {
        model: modelId,
        temperature: options.temperature ?? 0,
        max_tokens: options.maxTokens,
        // Prefer structured JSON to reduce parsing failures
        response_format: { type: "json_object" as const },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      },
      { signal: controller.signal },
    );
    const text = resp.choices?.[0]?.message?.content ?? "";
    return { text, durationMs: Date.now() - start };
  } finally {
    clearTimeout(timeoutId);
  }
}
