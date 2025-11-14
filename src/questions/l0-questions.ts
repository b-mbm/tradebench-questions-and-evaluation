import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import type { L0Question } from '../types/schema';

interface L0BenchmarkEntry {
  question_id: string;
  prompt: string;
  expected: number;
  range?: [number, number];
  unit?: string;
  difficulty?: number;
  [key: string]: unknown;
}

interface L0BenchmarkFile {
  questions: L0BenchmarkEntry[];
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BENCHMARK_PATH = path.join(__dirname, "..", "..", "data", "l0", "benchmark.json");

const EXPECTED_COUNT = 20;

export function loadL0Questions(): L0Question[] {
  const raw = fs.readFileSync(BENCHMARK_PATH, 'utf8');
  const data = JSON.parse(raw) as L0BenchmarkFile;
  const entries = Array.isArray(data.questions) ? data.questions : [];

  if (entries.length !== EXPECTED_COUNT) {
    throw new Error(`L0 loader expected ${EXPECTED_COUNT} questions, found ${entries.length}`);
  }

  return entries.map((entry, index) => {
    const range = Array.isArray(entry.range) && entry.range.length === 2 ? entry.range : [entry.expected, entry.expected];
    return {
      type: 'l0',
      id: `L0-${entry.question_id || index + 1}`,
      level: 0,
      prompt: entry.prompt ?? '',
      expected: entry.expected,
      range: [Number(range[0]), Number(range[1])],
      unit: entry.unit ?? 'units',
      difficulty: typeof entry.difficulty === 'number' ? entry.difficulty : 0,
      sourceQuestion: entry,
    } satisfies L0Question;
  });
}

export const L0_QUESTIONS = loadL0Questions();
