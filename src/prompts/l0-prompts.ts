import type { L0Question } from '../types/schema';

export interface Prompt {
  system: string;
  user: string;
}

export function buildL0Prompt(question: L0Question): Prompt {
  const system = `You are a precise quantitative trading assistant. Always return valid JSON with keys final_answer (number), unit (string), and reasoning (array of short strings). Do not include prose outside JSON.`;

  const tolerance = Math.abs(question.range[1] - question.range[0]);
  const toleranceNote = tolerance > 0 ? `The answer must fall between ${question.range[0]} and ${question.range[1]} ${question.unit}.` : `The answer must equal ${question.expected} ${question.unit}.`;

  const user = `Question: ${question.prompt}\n${toleranceNote}\nRespond with:\n{\n  "final_answer": <number>,\n  "unit": "${question.unit}",\n  "reasoning": ["step 1", "step 2"]\n}`;

  return { system, user };
}
