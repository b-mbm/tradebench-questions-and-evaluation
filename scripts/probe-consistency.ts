import { gradeSchemaResponse } from '../src/grading/schema-grader-300q';
import { STOCKBENCH_QUESTIONS_300Q } from '../src/questions/stockbench-questions-300q';
import { STOCKBENCH_GENERATED_QUESTIONS } from '../src/questions/stockbench-generated-questions';
import * as fs from 'fs';

const all = [...(STOCKBENCH_QUESTIONS_300Q as any), ...(STOCKBENCH_GENERATED_QUESTIONS as any)];

const probeIds = ['SB-AGI-009','SB-AGI-064','SB-AGI-109','SB-AGI-033','SB-AGI-028','SB-L9-019','SB-L10-053','SB-AGI-071','SB-AGI-100','SB-AGI-008'];

for (const id of probeIds) {
  const q = all.find((x:any) => x.id === id);
  if (!q) { console.log(`${id}: NOT FOUND`); continue; }
  const rubricPath = `src/rubrics/${q.rubric_id}.json`;
  if (!fs.existsSync(rubricPath)) { console.log(`${id}: rubric missing (${q.rubric_id})`); continue; }
  const rubric = JSON.parse(fs.readFileSync(rubricPath,'utf8'));
  
  const correct = JSON.parse(JSON.stringify(q.expected_values));
  if (!('self_check' in correct)) correct.self_check = ['ok'];
  
  const r1 = gradeSchemaResponse(JSON.stringify(correct), q, rubric);
  
  const noSC = JSON.parse(JSON.stringify(correct));
  delete noSC.self_check;
  const r2 = gradeSchemaResponse(JSON.stringify(noSC), q, rubric);

  const natSC = JSON.parse(JSON.stringify(correct));
  natSC.self_check = ['margin_ok','feasibility_verified','sanity_passed'];
  const r3 = gradeSchemaResponse(JSON.stringify(natSC), q, rubric);

  if ('selected_route' in correct && Array.isArray(correct.rejected_routes)) {
    const contra = JSON.parse(JSON.stringify(correct));
    contra.rejected_routes = [...contra.rejected_routes, contra.selected_route];
    const r4 = gradeSchemaResponse(JSON.stringify(contra), q, rubric);
    console.log(`${id}: correct=${r1.pass}(s=${(r1 as any).score?.toFixed(3)}) omit_sc=${r2.pass}(s=${(r2 as any).score?.toFixed(3)}) nat_sc=${r3.pass}(s=${(r3 as any).score?.toFixed(3)}) contradict=${r4.pass}(s=${(r4 as any).score?.toFixed(3)}) reason=${((r4 as any).failureReasons||[]).slice(0,2).join('|')}`);
  } else {
    console.log(`${id}: correct=${r1.pass}(s=${(r1 as any).score?.toFixed(3)}) omit_sc=${r2.pass}(s=${(r2 as any).score?.toFixed(3)}) nat_sc=${r3.pass}(s=${(r3 as any).score?.toFixed(3)}) no_routes`);
  }
}
