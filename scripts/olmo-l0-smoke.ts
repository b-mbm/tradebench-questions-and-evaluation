#!/usr/bin/env tsx

import 'dotenv/config';

import { callExecuteOneModel, DEFAULT_MODEL_OPTIONS } from '../src/models/model-runner';
import { L0_QUESTIONS } from '../src/questions/l0-questions';
import { buildL0Prompt } from '../src/prompts/l0-prompts';

async function main(): Promise<void> {
  const modelId = 'allenai/Olmo-3-32B-Think';
  const question = L0_QUESTIONS[0];
  if (!question) {
    throw new Error('No L0 questions available for smoke test.');
  }

  console.log(`Running L0 smoke test for ${modelId} on question ${question.id} (${question.prompt.slice(0, 60)}...)`);
  const prompts = buildL0Prompt(question);
  const result = await callExecuteOneModel(modelId, question as any, DEFAULT_MODEL_OPTIONS, prompts);

  console.log(`Duration: ${result.durationMs} ms`);
  console.log('Response preview:');
  console.log(result.text.slice(0, 500));
}

main().catch(err => {
  console.error('Olmo L0 smoke test failed:', err);
  process.exit(1);
});
