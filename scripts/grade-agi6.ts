import fs from "fs";
import { SCHEMA_QUESTIONS_300Q } from "../src/questions/schema-questions-300q";
import { loadRubric300q } from "../src/rubrics/loader-300q";
import { gradeSchemaResponse } from "../src/grading/schema-grader-300q";

const outs:any = JSON.parse(fs.readFileSync("nojson-agi6-outputs.json","utf8"));
const Q:any = (SCHEMA_QUESTIONS_300Q as any[]).reduce((a:any,q:any)=>(a[q.id]=q,a),{});

const LABEL=["intent","chosen_strategy"];
const STRUCT=["execution_sequence","shorts","ladder","legs","steps"];
function classify(r:any):string{
  if(r.pass) return "pass";
  const frs:string[]=r.failureReasons||[];
  const valFields=frs.filter(x=>x.startsWith("agi_validation_failed:")).map(x=>x.split(":")[1]);
  const hasParse=frs.some(x=>x.includes("parse_failed"))|| !r.parsed;
  const hasMissing=frs.some(x=>x.includes("missing_field"));
  if(r.finish==="length") return "TRUNCATION (finish=length"+((valFields.length||hasMissing)?", cut mid-output)":")");
  if(hasParse) return "PARSER/NESTING (no valid JSON extracted)";
  const labelF=valFields.filter(f=>LABEL.includes(f));
  const structF=valFields.filter(f=>STRUCT.includes(f));
  const numF=valFields.filter(f=>!LABEL.includes(f)&&!STRUCT.includes(f));
  if(numF.length) return "GENUINE WRONG VALUE (numeric): "+numF.join(",");
  if(structF.length) return "PARSER/NESTING (structural): "+structF.join(",");
  if(labelF.length) return "EXACT-LABEL/TEXT-MATCH: "+labelF.join(",");
  if(hasMissing) return "MISSING FIELD (schema or truncation)";
  return "OTHER: "+frs.join(",");
}

const agg:any={base:{n:0,pass:0,parse:{} as any,finish:{} as any},tuned:{n:0,pass:0,parse:{} as any,finish:{} as any}};
const rows:any[]=[];
for(const k of Object.keys(outs)){
  const e=outs[k]; const q=Q[e.questionId]; if(!q){console.log("WARN unknown",e.questionId);continue;}
  const m=e.model.endsWith("base")?"base":"tuned"; const a=agg[m]; a.n++;
  const fr=e.finish_reason||"?"; a.finish[fr]=(a.finish[fr]||0)+1;
  const g:any=gradeSchemaResponse(e.raw||"", q, loadRubric300q(q.rubric_id));
  if(g.pass) a.pass++;
  const pm=g.parsingMethod||"none"; a.parse[pm]=(a.parse[pm]||0)+1;
  const row={model:m,questionId:e.questionId,finish:fr,pass:g.pass,score:g.score,parsingMethod:pm,parsed:!!g.normalizedResponse,failureReasons:(g.failureReasons||[]),rawLen:(e.raw||"").length,raw:e.raw,normalized:g.normalizedResponse,classification:""};
  row.classification=classify(row);
  rows.push(row);
}

console.log("=== AGI-ONLY NO-JSON DIAGNOSTIC (6 ids x 2 models, max_tokens 9000) ===\n");
for(const m of ["base","tuned"]){const a=agg[m];
  console.log(`${m.toUpperCase()}: ${a.pass}/${a.n} pass | finish=${JSON.stringify(a.finish)} | parse=${JSON.stringify(a.parse)}`);
}
console.log("\n--- PER-ROW (classification) ---");
for(const r of rows.sort((a,b)=>a.model.localeCompare(b.model)||a.questionId.localeCompare(b.questionId)))
  console.log(`  ${r.model} ${r.questionId} fin=${r.finish} pass=${r.pass} parse=${r.parsingMethod} score=${(r.score||0).toFixed(2)} rawLen=${r.rawLen}\n     -> ${r.classification}\n     reasons: ${r.failureReasons.join(" | ")||"(none)"}`);

const stamp=process.env.STAMP||"unstamped";
const out=`results/community/300/nojson-agi6-graded-${stamp}.json`;
fs.mkdirSync("results/community/300",{recursive:true});
fs.writeFileSync(out, JSON.stringify({agg,rows},null,2));
console.log("\nsaved (raw+normalized for every row):", out);
console.log(`SUMMARY base ${agg.base.pass}/6 | tuned ${agg.tuned.pass}/6`);
