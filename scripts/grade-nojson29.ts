import fs from "fs";
import { SCHEMA_QUESTIONS_300Q } from "../src/questions/schema-questions-300q";
import { loadRubric300q } from "../src/rubrics/loader-300q";
import { gradeSchemaResponse } from "../src/grading/schema-grader-300q";

const outs:any = JSON.parse(fs.readFileSync("nojson29-outputs.json","utf8"));
const Q:any = (SCHEMA_QUESTIONS_300Q as any[]).reduce((a:any,q:any)=>(a[q.id]=q,a),{});
const tierOf=(id:string)=> id.startsWith("AGI")?"AGI": id.startsWith("L10")?"L10": id.startsWith("L9")?"L9":"nonAGI";
const blank=()=>({n:0,pass:0,parse:{} as any,tier:{nonAGI:[0,0],L9:[0,0],L10:[0,0],AGI:[0,0]} as any,err:0,trunc:0,missing:0});
const agg:any={base:blank(),tuned:blank()}; const rows:any[]=[];

for (const k of Object.keys(outs)){
  const e=outs[k]; const q=Q[e.questionId]; if(!q){console.log("WARN unknown id",e.questionId);continue;}
  const m=e.model.endsWith("base")?"base":"tuned"; const a=agg[m]; const t=tierOf(e.questionId);
  a.n++;
  if(e.finish_reason==="ERROR"){a.err++;}
  if(e.finish_reason==="length"){a.trunc++;}
  if(!e.raw){a.missing++;}
  const g:any=gradeSchemaResponse(e.raw||"", q, loadRubric300q(q.rubric_id));
  if(g.pass){a.pass++; a.tier[t][0]++;} a.tier[t][1]++;
  const pm=g.parsingMethod||"none"; a.parse[pm]=(a.parse[pm]||0)+1;
  rows.push({model:m,questionId:e.questionId,tier:t,finish:e.finish_reason,pass:g.pass,score:g.score,parsingMethod:g.parsingMethod,parsed:!!g.normalizedResponse,failureReasons:(g.failureReasons||[]).slice(0,3),rawLen:(e.raw||"").length,raw:e.raw,normalized:g.normalizedResponse});
}

console.log("=== 29-ROW NO-JSON GATE — graded with real gradeSchemaResponse ===\n");
for(const m of ["base","tuned"]){const a=agg[m];
  console.log(`${m.toUpperCase()}: ${a.pass}/${a.n} pass`);
  console.log(`  tier pass:  nonAGI ${a.tier.nonAGI[0]}/${a.tier.nonAGI[1]} | L9 ${a.tier.L9[0]}/${a.tier.L9[1]} | L10 ${a.tier.L10[0]}/${a.tier.L10[1]} | AGI ${a.tier.AGI[0]}/${a.tier.AGI[1]}`);
  console.log(`  errors=${a.err} truncated(length)=${a.trunc} missing=${a.missing} | parse=${JSON.stringify(a.parse)}`);
}
console.log("\n--- FAILED ROWS ---");
for(const r of rows.filter(r=>!r.pass).sort((a,b)=>a.model.localeCompare(b.model)||a.questionId.localeCompare(b.questionId)))
  console.log(`  ${r.model} ${r.questionId} fin=${r.finish} parse=${r.parsingMethod} score=${(r.score||0).toFixed(2)} :: ${(r.failureReasons||[]).join(" | ")||"(no reason)"}`);

const base=agg.base, tuned=agg.tuned;
const verdict = base.err>2 ? "DIRTY (>2 base errors — rerun)" : base.pass>=20 ? "PASS → recommend full 300" : base.pass<=12 ? "FAIL → diagnose before 300" : "AMBIGUOUS (13-19) → owner decision";
console.log(`\n=== GATE VERDICT: ${verdict} ===`);
console.log(`base ${base.pass}/29 | tuned ${tuned.pass}/29 | FT delta ${tuned.pass-base.pass>=0?"+":""}${tuned.pass-base.pass}`);

const stamp=process.env.STAMP||"unstamped";
const out=`results/community/300/nojson29-gate-graded-${stamp}.json`;
fs.mkdirSync("results/community/300",{recursive:true});
fs.writeFileSync(out, JSON.stringify({verdict,agg,rows},null,2));
console.log("\nsaved:", out);
