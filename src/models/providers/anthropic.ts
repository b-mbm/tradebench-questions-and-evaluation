import Anthropic from "@anthropic-ai/sdk";

type CallOptions = {
  temperature?: number;
  maxTokens?: number;
};

export async function callAnthropic(
  modelId: string,
  system: string,
  user: string,
  options: CallOptions = {},
) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const start = Date.now();
  const resp = await client.messages.create({
    model: modelId,
    max_tokens: options.maxTokens ?? 1024,
    temperature: options.temperature ?? 0,
    system,
    messages: [{ role: "user", content: user }],
  });
  const text = (resp.content ?? [])
    .map(part => ("text" in part ? part.text : ""))
    .join("");
  return { text, durationMs: Date.now() - start };
}
