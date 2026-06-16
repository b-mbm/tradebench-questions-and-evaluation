import OpenAI from "openai";

type CallOptions = {
  temperature?: number;
  maxTokens?: number;
};

const MIN_VISIBLE_CHARS = 20;

const hasVisibleContent = (text: string): boolean => text.replace(/\s/g, "").length >= MIN_VISIBLE_CHARS;

export function getLmStudioBaseURL(): string {
  return process.env.LMSTUDIO_BASE_URL || "http://localhost:1234/v1";
}

export async function callLmStudio(
  modelId: string,
  system: string,
  user: string,
  options: CallOptions = {},
) {
  const timeout = Number(process.env.LMSTUDIO_TIMEOUT_MS || 300000);
  const client = new OpenAI({
    baseURL: getLmStudioBaseURL(),
    apiKey: process.env.LMSTUDIO_API_KEY || "lm-studio",
    timeout,
    maxRetries: Number(process.env.LMSTUDIO_SDK_RETRIES || 0),
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
  const responseFormat = String(process.env.LMSTUDIO_RESPONSE_FORMAT || "none").toLowerCase();
  if (responseFormat !== "none") {
    requestConfig.response_format = { type: responseFormat };
  }

  const resp = await client.chat.completions.create(requestConfig);
  const text = resp.choices?.[0]?.message?.content ?? "";
  if (!hasVisibleContent(text)) {
    throw new Error("Empty or whitespace-only LM Studio response body");
  }
  return { text, durationMs: Date.now() - start };
}
