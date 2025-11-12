export function sanitizeModelResponse(raw: string): string {
  if (!raw) return raw;

  // 1) Drop common markdown fences entirely
  let text = raw.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "").trim();

  // Quick path: attempt full-parse if the whole thing is a single JSON object
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") {
      return JSON.stringify(parsed, null, 2);
    }
  } catch {
    // continue to targeted extraction
  }

  // 2) Extract the first top-level JSON object substring if present
  const firstBrace = text.indexOf("{");
  if (firstBrace !== -1) {
    const slice = text.slice(firstBrace);
    const end = findMatchingBrace(slice);
    if (end !== -1) {
      const candidate = slice.slice(0, end + 1);
      try {
        const parsed = JSON.parse(candidate);
        return JSON.stringify(parsed, null, 2);
      } catch {
        // ignore and fall through
      }
    }
  }

  // 3) As a last resort, return the original text
  return raw;
}

// Finds the index of the matching closing brace for the first character '{' in input,
// accounting for strings and escaped quotes. Returns -1 if not found.
function findMatchingBrace(input: string): number {
  let depth = 0;
  let inString: '"' | "'" | null = null;
  let escaped = false;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === inString) {
        inString = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = ch as '"' | "'";
      continue;
    }

    if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }

  return -1;
}

