#!/usr/bin/env tsx

import { gradeSchemaResponse } from "../src/grading/schema-grader-300q";
import { SCHEMA_QUESTIONS_300Q } from "../src/questions/schema-questions-300q";
import { loadRubric300q } from "../src/rubrics/loader-300q";

function question(id: string) {
  const found = SCHEMA_QUESTIONS_300Q.find(q => q.id === id);
  if (!found) {
    throw new Error(`Question not found: ${id}`);
  }
  return found;
}

function setPath(target: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split(".");
  let current = target;
  for (const part of parts.slice(0, -1)) {
    if (!current[part] || typeof current[part] !== "object" || Array.isArray(current[part])) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]] = value;
}

function canonicalValue(spec: any): unknown {
  if (spec.type === "number") {
    if (typeof spec.expected === "number") return spec.expected;
    if (Array.isArray(spec.range) && spec.range.length === 2) {
      return (Number(spec.range[0]) + Number(spec.range[1])) / 2;
    }
    return 1;
  }
  if (spec.type === "boolean") {
    return spec.expected ?? true;
  }
  if (spec.type === "array") {
    if (Array.isArray(spec.expected_order)) return spec.expected_order;
    if (Array.isArray(spec.expected_set)) return spec.expected_set;
    return ["canonical"];
  }
  if (spec.type === "object") {
    return { canonical: true };
  }
  return spec.expected ?? "canonical";
}

function canonicalRaw(id: string): string {
  const q = question(id);
  const rubric = loadRubric300q(q.rubric_id) as any;
  const validation = rubric._agi_canonical?.validation;
  if (!validation || typeof validation !== "object") {
    throw new Error(`Missing _agi_canonical.validation for ${id}`);
  }

  const response: Record<string, unknown> = {
    reasoning: rubric._agi_canonical.derivation ?? "canonical value",
  };

  for (const [field, spec] of Object.entries(validation)) {
    setPath(response, field, canonicalValue(spec));
  }

  return JSON.stringify(response);
}

function expectGrade(id: string, raw: string, expectedPass: boolean, label: string): void {
  const q = question(id);
  const rubric = loadRubric300q(q.rubric_id);
  const grade = gradeSchemaResponse(raw, q, rubric);
  if (grade.pass !== expectedPass) {
    throw new Error(
      `${label}: expected ${id} pass=${expectedPass}, got pass=${grade.pass}, score=${grade.score}, reasons=${grade.failureReasons.join("|")}`
    );
  }
}

const falsePassRegressions = [
  [
    "AGI-004",
    {
      intent: "allocate",
      chosen_strategy: "liquid_barbell_capped_tail",
      allocation_usd: {
        Aave_USDC: 30000,
        Curve_3pool: 30000,
        Ethena_USDe: 0,
        GMX_GLP: 0,
      },
      expected_net_apy_pct: 5.93,
      expected_90d_profit_usd: 1482.5,
      liquidity_48h_usd: 60000,
      reasoning: "Matches strategy label but misses most canonical numeric fields.",
    },
  ],
  [
    "AGI-015",
    {
      intent: "buy",
      chosen_strategy: "capacity_capped_best_execution",
      venue_allocation_usd: {
        Velodrome_Optimism: 400000,
        Uniswap_Arbitrum: 400000,
        Kraken: 500000,
        Curve_ETH: 400000,
        Binance: 600000,
      },
      expected_eth_received: 665.56,
      effective_price: 3003.91,
      reasoning: "Close but wrong Binance allocation and effective price.",
    },
  ],
  [
    "AGI-113",
    {
      intent: "tax_loss_factor_neutral_optimization",
      chosen_strategy: "net_after_tax_alpha_with_tracking_constraint",
      lots_to_harvest: ["SOL", "LINK"],
      replacement_basket: "definitely_wrong_value",
      harvested_loss_usd: 103000,
      immediate_tax_alpha_usd: 38110,
      carryforward_loss_usd: 0,
      implementation_cost_usd: 3588,
      net_tax_alpha_usd: 34522,
      tracking_gap_pct: 8.91,
      self_check: [
        "wash_sale_avoided",
        "tracking_gap_within_limit",
        "tax_alpha_reconciles",
      ],
      reasoning: "All values are canonical except replacement_basket has the wrong shape.",
    },
  ],
] as const;

for (const [id, response] of falsePassRegressions) {
  expectGrade(id, JSON.stringify(response), false, `${id} false-pass regression`);
}

const allAgiIds = SCHEMA_QUESTIONS_300Q
  .filter(q => q.id.startsWith("AGI-"))
  .map(q => q.id)
  .sort();

for (const id of allAgiIds) {
  expectGrade(id, canonicalRaw(id), true, `${id} canonical pass`);
}

console.log(`AGI canonical grading verification passed for ${allAgiIds.length} questions.`);
