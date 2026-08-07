#!/usr/bin/env tsx
import { gradeSchemaResponse } from '../src/grading/schema-grader-300q';
import { STOCKBENCH_QUESTIONS_300Q } from '../src/questions/stockbench-questions-300q';
import { loadRubric300q } from '../src/rubrics/loader-300q';

const CONSISTENCY_FAILURES = new Set([
  'no_trade_but_feasible',
  'infeasible_but_trade_decision',
]);

const rows = STOCKBENCH_QUESTIONS_300Q as any[];
const canaries = ['trade', 'no_trade'].map(expectedDecision => {
  const question = rows.find(q =>
    q.expected_values?.decision === expectedDecision &&
    q.expected_values?.feasibility === (expectedDecision === 'trade' ? 'feasible' : 'infeasible')
  );
  if (!question) throw new Error(`No coherent ${expectedDecision} canary found`);

  const rubric = loadRubric300q(question.rubric_id);
  const canonical = gradeSchemaResponse(JSON.stringify(question.expected_values), question, rubric);
  if (!canonical.pass) throw new Error(`${question.id}: canonical answer failed`);

  const mutant = {
    ...question.expected_values,
    decision: expectedDecision === 'trade' ? 'no_trade' : 'trade',
    feasibility: expectedDecision === 'trade' ? 'infeasible' : 'feasible',
  };
  const result = gradeSchemaResponse(JSON.stringify(mutant), question, rubric);
  const decisionFailed = result.failureReasons.includes('agi_validation_failed:decision');
  const consistencyFailed = result.failureReasons.some(reason => CONSISTENCY_FAILURES.has(reason));

  if (result.pass || !decisionFailed || consistencyFailed) {
    throw new Error(`${question.id}: categorical decision canary was not isolated`);
  }

  return {
    id: question.id,
    expected: question.expected_values.decision,
    received: mutant.decision,
    pass: result.pass,
    decision_field_score: result.fieldScores.decision,
    failure_reasons: result.failureReasons,
  };
});

console.log(JSON.stringify({ gate: 'PASS', canaries }, null, 2));
