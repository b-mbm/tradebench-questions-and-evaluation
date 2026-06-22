#!/usr/bin/env tsx
// Dump the 300 official eval prompts (exact buildExecuteOnePrompts + rubrics) to JSON,
// so the tuned model can generate offline on the pod, then grade with the real grader.
import fs from "fs";
import { SCHEMA_QUESTIONS_300Q } from "../src/questions/schema-questions-300q";
import { loadRubric300q } from "../src/rubrics/loader-300q";
import { buildExecuteOnePrompts } from "../src/prompts/schema-prompts-300q";

const rows = SCHEMA_QUESTIONS_300Q.map((q: any) => {
  const rubric = loadRubric300q(q.rubric_id);
  const { system, user } = buildExecuteOnePrompts(q, rubric);
  return { id: q.id, level: q.level, rubric_id: q.rubric_id, system, user };
});
fs.writeFileSync("prompts-300q.json", JSON.stringify(rows));
console.log(`dumped ${rows.length} prompts -> prompts-300q.json`);
console.log(`sample id=${rows[0].id} system_len=${rows[0].system.length} user_len=${rows[0].user.length}`);
