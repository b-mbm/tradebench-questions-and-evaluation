import OpenAI from "openai";

type CallOptions = {
  temperature?: number;
  maxTokens?: number;
};

const MIN_VISIBLE_CHARS = 20;

const hasVisibleContent = (text: string): boolean => text.replace(/\s/g, "").length >= MIN_VISIBLE_CHARS;

export async function callOpenAI(
  modelId: string,
  system: string,
  user: string,
  options: CallOptions = {},
) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const start = Date.now();

  const isResponsesModel =
    modelId.startsWith("gpt-5") ||
    modelId.startsWith("gpt-4o") ||
    modelId.startsWith("o3") ||
    modelId.startsWith("o4");

  if (isResponsesModel) {
    const payload: Record<string, any> = {
      model: modelId,
      input: [
        { role: "system", content: [{ type: "input_text", text: system }] },
        { role: "user", content: [{ type: "input_text", text: user }] },
      ],
      reasoning: { effort: "low" },
    };
    if (options.maxTokens !== undefined) {
      payload.max_output_tokens = options.maxTokens;
    }

    try {
      const resp: any = await (client as any).responses.create(payload);
      const text: string = resp?.output_text ?? "";
      if (!hasVisibleContent(text)) {
        throw new Error("Empty or whitespace-only response body");
      }
      return { text, durationMs: Date.now() - start };
    } catch (error: any) {
      const requestConfig: any = {
        model: modelId,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      };
      if (options.maxTokens !== undefined) {
        requestConfig.max_completion_tokens = options.maxTokens;
      }
      try {
        const resp2 = await client.chat.completions.create(requestConfig);
        const text2 = resp2.choices?.[0]?.message?.content ?? "";
        if (!hasVisibleContent(text2)) {
          throw new Error("Empty or whitespace-only response body (chat fallback)");
        }
        return { text: text2, durationMs: Date.now() - start };
      } catch (fallbackError: any) {
        throw error ?? fallbackError;
      }
    }
  }

  const useJsonFormat = system.toLowerCase().includes("json") || user.toLowerCase().includes("json");
  const requestConfig: Record<string, any> = {
    model: modelId,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: options.temperature ?? 0,
  };
  if (options.maxTokens !== undefined) requestConfig.max_tokens = options.maxTokens;
  if (useJsonFormat) requestConfig.response_format = { type: "json_object" };

  try {
    const resp = await client.chat.completions.create(requestConfig);
    const text = resp.choices?.[0]?.message?.content ?? "";
    if (!hasVisibleContent(text)) {
      throw new Error("Empty or whitespace-only response body");
    }
    return { text, durationMs: Date.now() - start };
  } catch (error: any) {
    if (error?.status === 404) {
      throw new Error(`Model ${modelId} not found. This model may not be available in your OpenAI account yet.`);
    }
    if (error?.status === 429) {
      throw new Error(`429 ${error?.message || "Rate limit or quota exceeded"}`);
    }
    if (error?.status === 401) {
      throw new Error("401 Invalid API key or authentication failed");
    }
    throw error;
  }
}
