import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { enrichContext } from './shared';
import type { SchemaQuestion } from '../types/schema';

type RawSchemaQuestion = Omit<SchemaQuestion, 'context'> & {
  context?: Record<string, unknown>;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUESTIONS_PATH = path.join(__dirname, 'l1-l8', 'questions.json');
const EXPECTED_COUNT = 40;

function loadSchemaQuestions(): SchemaQuestion[] {
  const raw = fs.readFileSync(QUESTIONS_PATH, 'utf8');
  const parsed = JSON.parse(raw) as RawSchemaQuestion[];

  if (!Array.isArray(parsed)) {
    throw new Error(`Schema question loader expected an array in ${QUESTIONS_PATH}`);
  }

  if (parsed.length !== EXPECTED_COUNT) {
    throw new Error(`Schema question loader expected ${EXPECTED_COUNT} questions, found ${parsed.length}`);
  }

  return parsed.map(question => ({
    ...question,
    context: enrichContext(question.context ?? {}),
  }));
}

export const SCHEMA_QUESTIONS: SchemaQuestion[] = loadSchemaQuestions();
