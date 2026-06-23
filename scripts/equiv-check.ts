import { SCHEMA_QUESTIONS_300Q } from "../src/questions/schema-questions-300q";
import { loadRubric300q } from "../src/rubrics/loader-300q";
import { buildExecuteOnePrompts } from "../src/prompts/schema-prompts-300q";
import fs from "fs";
const P = JSON.parse(fs.readFileSync("prompts-300q.json","utf8")).reduce((a:any,p:any)=>(a[p.id]=p,a),{});
const qid="L9-002"; const q:any=(SCHEMA_QUESTIONS_300Q as any[]).find(x=>x.id===qid);
const live=buildExecuteOnePrompts(q, loadRubric300q(q.rubric_id));
console.log("system match:", live.system===P[qid].system, "| user match:", live.user===P[qid].user);
