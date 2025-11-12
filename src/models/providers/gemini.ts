import { GoogleGenerativeAI } from "@google/generative-ai";

type CallOptions = {
  temperature?: number;
  maxTokens?: number;
};

const MIN_VISIBLE_CHARS = 20;

export async function callGemini(
  modelId: string,
  system: string,
  user: string,
  options: CallOptions = {},
) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: modelId, systemInstruction: { text: system } });
  const start = Date.now();

  const generationConfig: Record<string, any> = {};
  if (options.temperature !== undefined) {
    generationConfig.temperature = options.temperature;
  }
  if (options.maxTokens !== undefined) {
    generationConfig.maxOutputTokens = options.maxTokens;
  }

  const resp = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: user }] }],
    generationConfig,
  });

  const candidates = resp?.response?.candidates ?? [];
  const text =
    candidates
      .flatMap(candidate => candidate?.content?.parts ?? [])
      .map(part => ("text" in part ? part.text ?? "" : ""))
      .find(part => part.trim().length) ||
    resp?.response?.text?.() ||
    "";

  const visible = text.replace(/\s/g, "").length;
  if (visible < MIN_VISIBLE_CHARS) {
    const finishReason = candidates[0]?.finishReason;
    if (finishReason === "MAX_TOKENS" && text) {
      return { text, durationMs: Date.now() - start };
    }
    throw new Error(`Empty or blocked Gemini response${finishReason ? ` (finishReason=${finishReason})` : ""}`);
  }

  return { text, durationMs: Date.now() - start };
}
