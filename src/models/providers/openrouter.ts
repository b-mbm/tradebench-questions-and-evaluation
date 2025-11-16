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
  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": "tradebench-lite",
      "X-Title": "Tradebench 60Q Harness",
    },
  });

  const start = Date.now();
  const resp = await client.chat.completions.create({
    model: modelId,
    temperature: options.temperature ?? 0,
    max_tokens: options.maxTokens,
    // Prefer structured JSON to reduce parsing failures
    response_format: { type: "json_object" as const },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  const text = resp.choices?.[0]?.message?.content ?? "";
  return { text, durationMs: Date.now() - start };
}
