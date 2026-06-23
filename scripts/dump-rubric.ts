import { SCHEMA_QUESTIONS_300Q } from "../src/questions/schema-questions-300q";
import { loadRubric300q } from "../src/rubrics/loader-300q";
for (const qid of ["AGI-050","AGI-002"]) {
  const q:any = (SCHEMA_QUESTIONS_300Q as any[]).find(x=>x.id===qid);
  if(!q){console.log(qid,"not found");continue;}
  const r:any = loadRubric300q(q.rubric_id);
  console.log("==== "+qid+" | rubric_id: "+q.rubric_id+" ====");
  console.log(JSON.stringify(r, null, 1).slice(0, 1800));
  console.log();
}
