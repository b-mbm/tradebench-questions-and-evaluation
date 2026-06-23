import fs from "fs";
import { SCHEMA_QUESTIONS_300Q } from "../src/questions/schema-questions-300q";
import { loadRubric300q } from "../src/rubrics/loader-300q";
const out = JSON.parse(fs.readFileSync("results/community/300/runpod-qwen36-27b-sft-300-2026-06-23T01-35-07-238Z.json","utf8"));
const byId:Record<string,any>={}; for(const e of out.evaluations) byId[e.questionId]=e;
const nums=(s:string)=>[...s.matchAll(/-?\d[\d,]*\.?\d*/g)].map(m=>parseFloat(m[0].replace(/,/g,""))).filter(n=>!isNaN(n));
let tF=0,hF=0; const per:any[]=[];
for(const q of (SCHEMA_QUESTIONS_300Q as any[]).filter(x=>x.id.startsWith("AGI"))){
  const r:any=loadRubric300q(q.rubric_id); const val=r?._agi_canonical?.validation; if(!val)continue;
  const raw=byId[q.id]?.raw||""; if(raw.length<10){per.push({id:q.id,blank:true});continue;}
  const N=nums(raw), low=raw.toLowerCase(); let f=0,h=0;
  for(const [field,spec] of Object.entries(val) as any){
    if(field==="self_check")continue; f++;tF++; let hit=false;
    if(spec.range){const[lo,hi]=spec.range;hit=N.some(n=>n>=lo&&n<=hi);}
    else if(spec.expected!==undefined){const ex=String(spec.expected).toLowerCase();hit=low.includes(ex)||(typeof spec.expected==="number"&&N.includes(spec.expected));}
    if(hit){h++;hF++;}
  }
  per.push({id:q.id,hit:h,of:f,rate:h/f});
}
const g=per.filter(p=>!p.blank);
console.log(`AGI VALUE-MATCH ignoring structure: ${hF}/${tF} expected values found anywhere = ${(100*hF/tF).toFixed(0)}%`);
console.log(`blank: ${per.filter(p=>p.blank).length} / ${per.length}`);
const b:Record<string,number>={}; for(const p of g){const k=p.rate>=0.7?"a) >=70% values right (would plausibly pass)":p.rate>=0.4?"b) 40-69%":"c) <40% values right";b[k]=(b[k]||0)+1;}
console.log("per-question value-coverage:", JSON.stringify(b,null,1));
