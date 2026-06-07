import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import type { SchemaRubric } from '../types/schema';

const RUBRIC_DIR = path.dirname(fileURLToPath(import.meta.url));

const cache = new Map<string, SchemaRubric>();

function loadRubricFromDisk(id: string): SchemaRubric {
  const filePath = path.join(RUBRIC_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Rubric not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);

  if (!data || typeof data !== 'object') {
    throw new Error(`Rubric ${id} is not a valid JSON object.`);
  }

  return {
    ...data,
    id: data.id ?? id,
    expected_fields: Array.isArray(data.expected_fields) ? data.expected_fields : [],
    required_fields: Array.isArray(data.required_fields) ? data.required_fields : [],
    field_weights: typeof data.field_weights === 'object' && data.field_weights !== null ? data.field_weights : {},
    synonyms: typeof data.synonyms === 'object' && data.synonyms !== null ? data.synonyms : undefined,
    pass_threshold: typeof data.pass_threshold === 'number' ? data.pass_threshold : 0.7,
  };
}

export function loadRubric300q(id: string): SchemaRubric {
  if (cache.has(id)) {
    return cache.get(id)!;
  }

  const rubric = loadRubricFromDisk(id);
  cache.set(id, rubric);
  return rubric;
}

export function clearRubric300qCache(): void {
  cache.clear();
}
