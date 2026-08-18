import type { AvalonBenchQuestion, JsonValue } from '../questions/avalonbench-questions-100q';

export type AvalonBenchGrade = {
  pass: boolean;
  benchmarkInvalid: boolean;
  fieldPasses: Record<string, boolean>;
  failures: string[];
  parsed: Record<string, JsonValue> | null;
};

function parse(raw: string): Record<string, JsonValue> | null {
  const trimmed = raw.trim();
  const fencedMatches = [...trimmed.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)];
  const fenced = fencedMatches.at(-1)?.[1]?.trim() ?? trimmed;
  try {
    const value = JSON.parse(fenced);
    return value && typeof value === 'object' && !Array.isArray(value)
      ? value as Record<string, JsonValue>
      : null;
  } catch {
    return null;
  }
}

function at(object: Record<string, JsonValue>, field: string): JsonValue | undefined {
  let value: JsonValue | undefined = object;
  for (const part of field.split('.')) {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return undefined;
    value = value[part];
  }
  return value;
}

function stringEquivalent(actual: string, expected: string): boolean {
  const normalize = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  return normalize(actual) === normalize(expected);
}

function equivalent(actual: JsonValue | undefined, expected: JsonValue, tolerance: number, unordered: boolean): boolean {
  if (actual === undefined) return false;
  if (typeof expected === 'number') {
    return typeof actual === 'number' && Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance;
  }
  if (typeof expected === 'string') return typeof actual === 'string' && stringEquivalent(actual, expected);
  if (expected === null || typeof expected === 'boolean') return actual === expected;
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual) || actual.length !== expected.length) return false;
    if (!unordered) return expected.every((value, index) => equivalent(actual[index], value, tolerance, false));
    const used = new Array(actual.length).fill(false);
    const assign = (expectedIndex: number): boolean => {
      if (expectedIndex === expected.length) return true;
      for (let actualIndex = 0; actualIndex < actual.length; actualIndex += 1) {
        if (used[actualIndex] || !equivalent(actual[actualIndex], expected[expectedIndex], tolerance, false)) continue;
        used[actualIndex] = true;
        if (assign(expectedIndex + 1)) return true;
        used[actualIndex] = false;
      }
      return false;
    };
    return assign(0);
  }
  if (typeof actual !== 'object' || actual === null || Array.isArray(actual)) return false;
  return Object.entries(expected).every(([key, value]) => equivalent(actual[key], value, tolerance, false));
}

export function gradeAvalonBenchResponse(raw: string, question: AvalonBenchQuestion): AvalonBenchGrade {
  const parsed = parse(raw);
  if (!parsed) return { pass: false, benchmarkInvalid: false, fieldPasses: {}, failures: ['invalid_json'], parsed: null };
  if (!question.criticalFields.length) {
    return { pass: false, benchmarkInvalid: true, fieldPasses: {}, failures: ['invalid_benchmark_no_critical_fields'], parsed };
  }

  const fieldPasses: Record<string, boolean> = {};
  const failures: string[] = [];
  for (const field of question.criticalFields) {
    const expected = at(question.expected, field);
    if (expected === undefined) {
      fieldPasses[field] = false;
      failures.push(`invalid_benchmark_missing_expected:${field}`);
      continue;
    }
    const candidates = [expected, ...(question.acceptedAlternates?.[field] ?? [])];
    const numericTolerance = typeof expected === 'number'
      ? Math.abs(expected) * 1e-9 + 1e-9
      : 0;
    const passed = candidates.some(candidate => equivalent(
      at(parsed, field),
      candidate,
      question.tolerances?.[field] ?? numericTolerance,
      question.unorderedFields?.includes(field) ?? false,
    ));
    fieldPasses[field] = passed;
    if (!passed) failures.push(`mismatch:${field}`);
  }
  const benchmarkInvalid = failures.some(failure => failure.startsWith('invalid_benchmark'));
  return { pass: failures.length === 0, benchmarkInvalid, fieldPasses, failures, parsed };
}
