import fs from "fs";
import { SCHEMA_QUESTIONS_300Q } from "../src/questions/schema-questions-300q";
import { loadRubric300q } from "../src/rubrics/loader-300q";
import { gradeSchemaResponse } from "../src/grading/schema-grader-300q";
const outs:any = JSON.parse(fs.readFileSync("nojson16-outputs.json","utf8"));
const Q:any = (SCHEMA_QUESTIONS_300Q as any[]).reduce((a:any,q:any)=>(a[q.id]=q,a),{});
const rows:any[]=[]; const agg:any={base:{n:0,pass:0,parse:{} as any},tuned:{n:0,pass:0,parse:{} as any}};
for (const k of Object.keys(outs)){
  const e=outs[k]; const q=Q[e.questionId]; if(!q) continue;
  const g:any=gradeSchemaResponse(e.raw||"", q, loadRubric300q(q.rubric_id));
  const m=e.model.endsWith("base")?"base":"tuned"; agg[m].n++; if(g.pass) agg[m].pass++;
  const pm=g.parsingMethod||"none"; agg[m].parse[pm]=(agg[m].parse[pm]||0)+1;
  rows.push({model:e.model,questionId:e.questionId,finish:e.finish_reason,pass:g.pass,score:g.score,parsingMethod:g.parsingMethod,parsed:!!g.normalizedResponse,failureReasons:(g.failureReasons||[]).slice(0,3),raw:e.raw,normalized:g.normalizedResponse});
}
console.log("=== NO-JSON 16-ROW PROOF — graded with real gradeSchemaResponse ===");
for(const m of ["base","tuned"]){const a=agg[m];console.log(`${m}: ${a.pass}/${a.n} pass | parse: ${JSON.stringify(a.parse)}`);}
console.log("\nper-row:");
for(const r of rows.sort((a,b)=>a.model.localeCompare(b.model)||a.questionId.localeCompare(b.questionId))) console.log(`  ${r.model.slice(-4)} ${r.questionId} fin=${r.finish} pass=${r.pass} parse=${r.parsingMethod} score=${r.score.toFixed(2)} ${(r.failureReasons||[]).slice(0,2).join(",")}`);
fs.writeFileSync("results/community/300/nojson-proof-16-graded-"+Date.now()+".json", JSON.stringify(rows,null,2));
console.log("\nsaved full result with raw+normalized.");
