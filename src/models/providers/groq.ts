import Groq from "groq-sdk";

type CallOptions = {
  temperature?: number;
  maxTokens?: number;
};

export async function callGroq(
  modelId: string,
  system: string,
  user: string,
  options: CallOptions = {},
) {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const start = Date.now();
  const resp = await client.chat.completions.create({
    model: modelId,
    temperature: options.temperature ?? 0,
    max_tokens: options.maxTokens,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  const text = resp.choices?.[0]?.message?.content ?? "";
  return { text, durationMs: Date.now() - start };
}
