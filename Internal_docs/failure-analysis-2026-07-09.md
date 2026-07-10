# L9/L10 Failure Analysis — 2026-07-09

## Method

Re-graded 350 existing model responses (5 variance runs × 35 questions + 1 gate run × 175 questions) from `results/grpo-preconditions/`. All responses were already on disk from prior benchmark runs — no GPU spend required.

Used the proven TypeScript grader (`scripts/grade_scores_tmp.ts` → `src/grading/schema-grader-300q.ts`) to produce per-response scores (0.0-1.0), then categorized each failure.

---

## Reward Signal Distribution by Level (175-gate run)

| Level | N | Mean | 0.0 | 0.1-0.9 | 1.0 | % partial | Signal type |
|---|---|---|---|---|---|---|---|
| L1 | 3 | 0.89 | 0 | 2 | 1 | 67% | Dense |
| L2 | 4 | 0.79 | 0 | 4 | 0 | 100% | Dense |
| L3 | 1 | 0.56 | 0 | 1 | 0 | 100% | Dense |
| L4 | 4 | 0.38 | 1 | 3 | 0 | 75% | Dense |
| L5 | 4 | 0.59 | 1 | 3 | 0 | 75% | Dense |
| L6 | 3 | 0.72 | 0 | 3 | 0 | 100% | Dense |
| L7 | 4 | 0.57 | 1 | 3 | 0 | 75% | Dense |
| L8 | 9 | 0.93 | 0 | 6 | 3 | 67% | Dense |
| L9 | 68 | 0.87 | 9 | 0 | 59 | 0% | Binary |
| L10 | 63 | 0.85 | 9 | 1 | 53 | 2% | Binary |
| L11 | 12 | 0.41 | 0 | 12 | 0 | 100% | Dense |

**Key finding:** L1-L8 and L11 have dense partial credit (67-100%). L9/L10 are effectively binary (0-2% partial). The grader's L9/L10 scoring functions use exact set equality or exact numeric range match — no partial credit for "close" answers.

---

## Per-Question Variance (35-question subset, 5 runs at temp 0.1)

### 13 "flipping" questions (pass in some runs, fail in others — ideal GRPO targets)

| Question | Level | Scores (5 runs) | Pass rate | Mean |
|---|---|---|---|---|
| L9-005 | L9 | 0,0,0,0,1 | 20% | 0.20 |
| L9-024 | L9 | 0,0,0,1,1 | 40% | 0.40 |
| L9-040 | L9 | 0,1,1,0,1 | 60% | 0.60 |
| L9-051 | L9 | 0,0,1,0,1 | 40% | 0.40 |
| L9-055 | L9 | 0,1,0,0,0 | 20% | 0.20 |
| L9-059 | L9 | 1,1,1,0,1 | 80% | 0.80 |
| L9-064 | L9 | 1,1,0,0,1 | 60% | 0.60 |
| L10-006 | L10 | 0,0,0,1,1 | 40% | 0.40 |
| L10-017 | L10 | 1,0,1,0,0 | 40% | 0.40 |
| L10-043 | L10 | 1,0,1,0,1 | 60% | 0.60 |
| L10-046 | L10 | 0,0,1,1,1 | 60% | 0.60 |
| L10-047 | L10 | 1,1,0,1,1 | 80% | 0.80 |
| L10-056 | L10 | 0,0,0,0,1 | 20% | 0.20 |

All 13 have purely binary scores (0 or 1). No partial credit at all.

### Non-flipping questions (always pass or always fail)

| Question | Level | Scores | Status |
|---|---|---|---|
| L3-001 | L3 | 0.6,0.6,0.6,0.5,0.4 | Always partial (never passes) |
| L3-003 | L3 | 0.8,0.6,0.6,0.6,0.6 | Always partial |
| L4-001 | L4 | 0.7,0.0,0.5,0.7,0.5 | Always partial |
| L5-003 | L5 | 0.5,0.5,0.7,0.6,0.4 | Always partial |
| L6-001 | L6 | 0.0,0.0,0.0,0.0,0.0 | Always fails |
| L6-003 | L6 | 0.7,0.6,0.0,0.0,0.7 | Always partial |
| L7-003 | L7 | 0.0,0.0,0.0,0.0,0.0 | Always fails |
| L8-001 | L8 | 0.9,0.9,0.9,0.9,0.9 | Always partial (score 0.9 but never 1.0) |
| L9-006 | L9 | 0,0,0,0,0 | Always fails |
| L9-027 | L9 | 1,1,1,1,1 | Always passes |
| L10-022 | L10 | 1,1,1,1,1 | Always passes |
| L10-050 | L10 | 1,1,1,1,1 | Always passes |

---

## L9/L10 Failure Categorization (97 failures across all runs)

### Category breakdown

| Category | Count | % of fails | Fixable? |
|---|---|---|---|
| Decimal→percentage (×100 post-process) | 12 | 12% | YES ($0) |
| Schema contamination (strip extra fields) | 2 | 2% | YES ($0) |
| Near-miss (within 2× of correct answer) | 8 | 8% | MAYBE (grader tolerance) |
| Missing expected_value entirely | 22 | 23% | NO (structural) |
| Wrong number (>2× off, genuine error) | 53 | 55% | NO (capability gap) |

### Detail: Decimal-vs-percentage (12 cases, fixable)

Example: L10-017 outputs `expected_value: 0.15` — reasoning says "achieving exactly 15% ROI ($9,750/$65,000)". The model computed the correct percentage but emitted it as a decimal.

Example: L10-015 outputs `expected_value: 0.7884` — should be 78.84 (percentage).

Example: L9-007 outputs `expected_value: 0.438` — should be 43.8 (percentage).

These are all cases where the rubric expects a number ≥1 (a percentage) but the model output a decimal between 0 and 1.

### Detail: Schema contamination (2 cases, fixable)

Example: L10-024 outputs `{intent, expected_value, reasoning, order_type, asset, size, unit, venue, venue_name, risk_controls}` — the extra ExecuteOneResponse fields don't affect the answer but may confuse the grader's field extraction.

Example: L9-021 outputs similar contamination with `expected_value: 167.91` (correct answer) plus extra fields.

### Detail: Near-miss (8 cases, maybe fixable via grader tolerance)

| Question | Failed EV | Passing EV | Ratio |
|---|---|---|---|
| L9-051 | 361,331 | 226,600 | 1.595× |
| L9-051 | 361,406 | 226,600 | 1.595× |
| L9-051 | 361,331 | 226,600 | 1.595× |
| L9-055 | 296,880 | 232,200 | 1.279× |
| L9-055 | 296,880 | 232,200 | 1.279× |
| L9-055 | 296,880 | 232,200 | 1.279× |
| L9-055 | 296,880 | 232,200 | 1.279× |
| L9-059 | 705,202 | 547,200 | 1.289× |

These are genuine math errors (25-60% off) but in the right direction. The grader's exact-match or tight range doesn't accept them. Widening the grader's acceptable range would catch some of these.

### Detail: Missing expected_value (22 cases)

The model outputs a valid JSON response but doesn't include the `expected_value` field. Instead it includes generic ExecuteOneResponse fields like `order_type, asset, size, venue`. The reasoning often contains the correct answer in prose, but it's not extracted into the `expected_value` field.

This is a structural issue — the model isn't producing the required field at all.

### Detail: Wrong number (53 cases, genuine capability gaps)

The model outputs a number in `expected_value` but it's more than 2× off from the correct answer. These are genuine mathematical reasoning errors. Examples:
- L9-005: outputs 12,400,000 vs correct 6,200,000 (2× off)
- L10-006: outputs 6,200,000 vs correct 1,200,000 (5× off)

No format fix or post-processing rule can help these. This is the capability gap that GRPO (or any training) would need to close.

---

## Concrete Pass/Fail Examples

### L10-017: Format error (decimal vs percentage)

**PASS (run 1):**
```json
{
  "intent": "execute_validator_upgrade_plan",
  "expected_value": 15,
  "reasoning": "Phase 1: Hardware refresh ($50k) restores performance to 95%, adding $6,750 net profit. Phase 2: Jito MEV setup ($15k) adds $3,000 net profit. Total spend $65k yields $9,750 incremental profit, achieving exactly 15% ROI ($9,750/$65,000). Phase 3: Lower commission to 6% to halt delegation decline. Total cost $65k fits within $200k budget. Premium RPC excluded from 6-month ROI per constraints."
}
```

**FAIL (run 2):**
```json
{
  "intent": "execute_validator_upgrade_plan",
  "expected_value": 0.15,
  "reasoning": "Phase 1: Hardware refresh ($50k) restores performance to 95%, adding $6,750 net profit. Phase 2: Jito MEV setup ($15k) adds $3,000 net profit. Total spend $65k yields $9,750 incremental profit, achieving exactly 15% ROI ($9,750/$65,000). Phase 3: Lower commission to 6% stabilizes delegations without affecting the 6-month ROI numerator. Total cost $65k remains well within the $200k budget."
}
```

Identical reasoning. Identical calculation. Different output format. Zero credit on the fail.

### L9-040: Schema contamination

**PASS (run 2):**
```json
{
  "intent": "restake",
  "expected_value": ["A1", "A3", "A5"],
  "reasoning": "Computed net scores: A1=7.1%, A2=8.96% (fails slashing multiplier <=3), A3=7.58%, A4=6.65% (fails capacity >=250), A5=8.08%. Eligible AVSs are A1, A3, A5. Selected exactly 3 by highest net score."
}
```

**FAIL (run 1):**
```json
{
  "intent": "restake",
  "order_type": "limit",
  "asset": "stETH",
  "size": "250",
  "unit": "stETH",
  "venue": "eigenlayer",
  "risk_controls": {},
  "follow_up": "confirm_restake",
  "reasoning": "Selected AVSs: A1, A3, A5. A2 rejected (slashing multiplier 3.2 > 3). A4 rejected (capacity 200 < 250). Net scores: A5=8.08%, A3=7.58%, A1=7.1%."
}
```

The model identified the correct AVSs (A1, A3, A5) in the reasoning of BOTH runs. But the fail run didn't include `expected_value` at all — it used the generic ExecuteOneResponse fields instead.

---

## Prompt Conflict (structural finding)

The system prompt (shared across ALL 300 questions) defines:
```typescript
interface ExecuteOneResponse {
  intent: string;
  order_type: string;
  asset: string;
  size: string | number;
  unit?: string;
  price?: string | number;
  venue: string;
  venue_name?: string;
  risk_controls: { ... };
  follow_up?: string;
  reasoning?: string;
  requires_follow_up?: boolean;
  follow_up_description?: string;
}
```

The per-question user prompt says:
```
Output Requirements:
- Return a single JSON object with exactly these top-level keys: intent, expected_value, reasoning.
- Do not include any additional top-level keys.
- Use numeric JSON values (not quoted strings) for: expected_value.
```

These two instructions CONFLICT. The system prompt defines 12+ fields with no `expected_value`. The user prompt asks for exactly 3 fields including `expected_value`. The model sometimes follows the system prompt's schema (producing the contamination seen in L9-040 fail case). This is a structural tension in the benchmark design.

---

## Code Fix Applied

**File:** `scripts/grpo_reward.py`, line 69 (TSX worker embedded in Python)

**Before (bug):**
```typescript
score: result.pass ? 1.0 : 0.0,
```

**After (fix):**
```typescript
score: result.score,
```

The TS grader (`gradeSchemaResponse`) returns `result.score` (0.0-1.0 normalized) and `result.pass` (boolean). The TSX worker was converting to binary, discarding partial credit. Now it passes through the raw score.

**Impact:** Minimal for L9/L10 (grader is genuinely binary there). Matters for L1-L8 and L11 where partial credit exists. The training loop (`grpo_null_loop.py:490`) reads the `score` field, so no change needed there.
