import fs from "node:fs";
import { STOCKBENCH_QUESTIONS_300Q } from "../src/questions/stockbench-questions-300q";
const ids = JSON.parse(fs.readFileSync("/tmp/fresh30.json","utf8")) as string[];
const idSet = new Set(ids);
const out: any[] = [];
for (const q of (STOCKBENCH_QUESTIONS_300Q as any[])) {
  if (idSet.has(q.id)) out.push(q);
}
fs.writeFileSync("/tmp/fresh30_rows.json", JSON.stringify(out, null, 2));
console.log("count", out.length);
