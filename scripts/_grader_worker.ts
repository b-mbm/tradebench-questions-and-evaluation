
import { createInterface } from 'readline';
import { SCHEMA_QUESTIONS_300Q } from '../src/questions/schema-questions-300q';
import { loadRubric300q } from '../src/rubrics/loader-300q';
import { gradeSchemaResponse } from '../src/grading/schema-grader-300q';

// Build a lookup: id -> { question, rubric }
const QUESTIONS: Record<string, any> = {};
for (const q of SCHEMA_QUESTIONS_300Q as any[]) {
  try {
    QUESTIONS[q.id] = { q, rubric: loadRubric300q(q.rubric_id) };
  } catch (e) {
    // rubric may not load for some; mark as missing
    QUESTIONS[q.id] = { q, rubric: null };
  }
}

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });

rl.on('line', (line) => {
  if (!line.trim()) return;
  let batch: any[];
  try { batch = JSON.parse(line); } catch (e) { process.stdout.write(JSON.stringify({error: 'parse: '+e.message}) + '\n'); return; }
  const out = batch.map((row) => {
    try {
      const lookup = QUESTIONS[row.id];
      if (!lookup) return { id: row.id, score: 0.0, pass: false, detail: 'no question' };
      const { q, rubric } = lookup;
      if (!rubric) return { id: row.id, score: 0.0, pass: false, detail: 'no rubric' };
      // The response is the model's raw text. Grade it.
      const raw = typeof row.response === 'string' ? row.response : JSON.stringify(row.response);
      const result = gradeSchemaResponse(raw, q, rubric);
      return {
        id: row.id,
        score: result.pass ? 1.0 : 0.0,
        pass: result.pass,
        detail: result.pass ? 'pass' : (result.reason || 'fail'),
        raw_score: result.score,
      };
    } catch (e) {
      return { id: row.id || '?', score: 0.0, pass: false, detail: 'error: '+e.message };
    }
  });
  process.stdout.write(JSON.stringify(out) + '\n');
});

rl.on('close', () => process.exit(0));
