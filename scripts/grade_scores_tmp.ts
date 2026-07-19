import fs from "fs";
import { SCHEMA_QUESTIONS_300Q } from "../src/questions/schema-questions-300q";
import { loadRubric300q } from "../src/rubrics/loader-300q";
import { gradeSchemaResponse } from "../src/grading/schema-grader-300q";

const outputs = JSON.parse(fs.readFileSync("/tmp/combined-outputs.json", "utf8")) as Record<string, string>;
const mapping = JSON.parse(fs.readFileSync("/tmp/combined-mapping.json", "utf8")) as Record<string, string>;

// Build question lookup
const qById: Record<string, any> = {};
for (const q of SCHEMA_QUESTIONS_300Q as any[]) qById[q.id] = q;

// Grade every response, output: composite_key, questionId, level, score, pass
const results: any[] = [];
for (const [compositeKey, raw] of Object.entries(outputs)) {
  const qid = mapping[compositeKey];
  const q = qById[qid];
  if (!q) { continue; }
  const rubric = loadRubric300q(q.rubric_id);
  const g = gradeSchemaResponse(raw, q, rubric);
  results.push({
    key: compositeKey,
    questionId: qid,
    level: q.level,
    score: g.score,
    pass: g.pass,
  });
}

// Output as JSONL
for (const r of results) {
  fs.writeSync(1, JSON.stringify(r) + "\n");
}
