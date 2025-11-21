export async function callHuggingFace(
  modelId: string,
  system: string,
  user: string,
  opts: { temperature: number; maxTokens: number }
): Promise<{ text: string; durationMs: number }> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error('Missing HUGGINGFACE_API_KEY for Hugging Face calls.');
  }

  const prompt = `${system.trim()}\n\nUser:\n${user.trim()}\n\nAssistant:`;
  const url = `https://api-inference.huggingface.co/models/${modelId}`;

  const body = {
    inputs: prompt,
    parameters: {
      max_new_tokens: opts.maxTokens,
      temperature: opts.temperature,
    },
  };

  const start = Date.now();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const durationMs = Date.now() - start;

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hugging Face inference error (${response.status}): ${errorText}`);
  }

  const payload = await response.json();

  let text: string | undefined;
  if (Array.isArray(payload) && payload.length && typeof payload[0]?.generated_text === 'string') {
    text = payload[0].generated_text;
  } else if (typeof payload === 'string') {
    text = payload;
  } else if (payload && typeof payload === 'object' && typeof (payload as any).generated_text === 'string') {
    text = (payload as any).generated_text;
  }

  if (!text) {
    throw new Error(`Hugging Face inference returned no text content: ${JSON.stringify(payload)}`);
  }

  return { text, durationMs };
}
