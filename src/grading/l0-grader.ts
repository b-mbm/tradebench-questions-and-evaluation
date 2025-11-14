import { sanitizeModelResponse } from '../utils/response-sanitizer';
import type { GradeResult, L0Question } from '../types/schema';

function clampScore(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function parseNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.replace(/[^0-9+-.eE]/g, '');
    const num = Number(normalized);
    if (Number.isFinite(num)) return num;
  }
  return null;
}

export function gradeL0Response(raw: string, question: L0Question): GradeResult {
  const sanitized = sanitizeModelResponse(raw);
  let parsed: any = null;
  try {
    parsed = JSON.parse(sanitized);
  } catch {
    parsed = null;
  }

  const finalAnswer = parsed ? parseNumber(parsed.final_answer) : null;
  const withinRange =
    finalAnswer !== null &&
    finalAnswer >= question.range[0] &&
    finalAnswer <= question.range[1];

  const expected = question.expected;
  const diff = finalAnswer === null ? Infinity : Math.abs(finalAnswer - expected);
  const tolerance = Math.max(1e-9, question.range[1] - question.range[0]);
  const score = finalAnswer === null ? 0 : clampScore(1 - diff / Math.max(tolerance, Math.abs(expected) || 1));
  const pass = withinRange;

  return {
    pass,
    confidence: pass ? 0.95 : 0.25,
    score: pass ? Math.max(0.7, score) : score,
    fieldScores: { final_answer: score },
    normalizedResponse: parsed && typeof parsed === 'object' ? parsed : null,
    failureReasons: pass ? [] : ['numeric_mismatch'],
    parsingMethod: parsed ? 'json' : 'none',
  };
}
