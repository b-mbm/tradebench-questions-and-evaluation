# Llama 3.3 70B — TradeBench fairness re-run delta

**Run config (both runs identical):** `meta-llama/llama-3.3-70b-instruct` via OpenRouter, temp 0.1, max_tokens 2200, N=1, 300 questions
**Δ between runs:** Fix 1 (data-driven L10/AGI schema hints) + Fix 2 (L4-002/L4-004 synonym widening), shipped in PR #34
**v1:** 2026-06-05 05:17 UTC (pre-fix)
**v2:** 2026-06-05 15:02 UTC (post-fix)

## Headline

**47 → 100 passes (+53), 15.7% → 33.3% (+17.7 pp). Zero regressions across all 300 questions.**

## Per-level

| Level | Q   | v1 pass | v2 pass | Δ   | v1 rate | v2 rate | Δ rate  |
|------:|----:|--------:|--------:|----:|--------:|--------:|--------:|
| L1    | 3   | 3       | 3       | +0  | 1.000   | 1.000   | +0.000  |
| L2    | 4   | 2       | 2       | +0  | 0.500   | 0.500   | +0.000  |
| L3    | 3   | 1       | 1       | +0  | 0.333   | 0.333   | +0.000  |
| L4    | 5   | 0       | 0       | +0  | 0.000   | 0.000   | +0.000  |
| L5    | 5   | 2       | 2       | +0  | 0.400   | 0.400   | +0.000  |
| L6    | 5   | 3       | 3       | +0  | 0.600   | 0.600   | +0.000  |
| L7    | 5   | 2       | 2       | +0  | 0.400   | 0.400   | +0.000  |
| L8    | 10  | 7       | 7       | +0  | 0.700   | 0.700   | +0.000  |
| **L9**| 81  | 26      | **75**  | **+49** | 0.321 | 0.926 | **+0.605** |
| L10   | 69  | 0       | 1       | +1  | 0.000   | 0.014   | +0.014  |
| L11   | 110 | 1       | 4       | +3  | 0.009   | 0.036   | +0.027  |
| **TOT** | 300 | 47    | **100** | **+53** | 0.157 | **0.333** | **+0.177** |

## What actually moved

### L9 — the surprise (+49 passes)
- **All 81 L9 rubrics require `expected_value`** as a top-level field — the same schema gap we saw in L10
- They had no entries in `RUBRIC_SCHEMA_HINTS`, so the model was silently emitting the default `ExecuteOneResponse` shape (intent/order_type/asset/...) and missing `expected_value` entirely
- Fix 1 derived hint kicked in: the model now emits `{intent, expected_value, reasoning}` and 75/81 pass
- **The audit underestimated Fix 1's reach.** We anticipated impact on L10 (69 Q) + L11 (110 Q); didn't realize L9 (81 Q) had the same gap

### L10 — Fix 1 working as designed (+1 pass)
- Schema is now correct: model emits `{intent, expected_value, reasoning}` cleanly (e.g., L10-029 passed at 0.86)
- Remaining 68 failures are **the model's actual ceiling** — it emits the right shape but computes the wrong numeric value
- Avg score Δ per question: +0.022 (small, because most failures still score 0.00 — full miss on the value, not a partial score)
- **This is exactly the framing you asked for**: model has enough info to answer; it just answers incorrectly. Fair fail.

### L11 / AGI (+3 passes)
- 110 unique signatures, derived hints fired for most
- Score Δ per question: −0.011 (slightly negative; some questions scored higher pre-fix because the default ExecuteOneResponse shape happened to overlap with what the rubric checked)
- 4 passes vs 1; no regressions (1 prior pass held; 3 new passes added)
- Model ceiling is real here

### L4 — Fix 2 worked, unmasked the next layer (+0 passes, but real progress)
- **L4-002:** v1 failed on `correlation_invalid_intent`; v2 fails on `correlation_invalid_order_type`
  - Model said `intent: "analyze"` (now allowed) → passes the intent gate
  - Model said `order_type: "none"` → fails the next gate
- **L4-004:** v1 failed on `stress_test_invalid_order_type`; v2 fails on `stress_test_invalid_size`
  - Model said `order_type: "simulation"` (now allowed) → passes the order_type gate
  - Model said `size: "100%"` (string) → fails size validation
- **L4-001 partial recovery:** score jumped 0.00 → 0.64 (just below the 0.68 threshold)
- Both fixes worked. The model now reaches deeper checks; we're seeing model-truth, not vocabulary-truth

### L1-L3, L5-L8 — unchanged (as expected)
- All required fields are in `DEFAULT_INTERFACE_FIELDS`, so no derived hint triggered
- v1 results reproduced exactly (47/300 → 47 across these levels in both runs)
- Confirms determinism + non-disturbance of the existing prompt path

## Bug found and fixed during re-run

`AGI/questions/agi-questions.ts` on `main` had unescaped newlines in the AGI-002 prompt JSON-string, which broke the tsx compiler. The previous Llama-300 run worked because it was on a branch with the fix; main doesn't have it. Pulled the working version from `llama-300-run-2026-06-05` into the fix branch (commit `74a3a1c`).

## What this means

| Question                                                          | Answer                                  |
|-------------------------------------------------------------------|-----------------------------------------|
| Did Fix 1 deliver fair schema info to L10 + AGI?                  | Yes (and to L9 — bonus)                 |
| Did Fix 2 fix L4-002/L4-004 vocabulary failures?                  | Yes (both unmasked downstream gates)    |
| Did anything regress?                                             | No                                      |
| Is Llama 70B's ceiling now visible?                               | Yes — most failures are now real failures |

## Open items (not part of this PR)

1. **Fix 3** — pending more-info request from you. Smallest version: add `bridge_and_buy` synonym for L3-001 and a couple analyzer verbs for L2-004. Touches rubric JSONs.
2. **L4 next layer** — Both L4-002/L4-004 still 0/5. Are `order_type: "none"` (L4-002) and `size: "100%"` (L4-004) **fair** failures, or do those rules need similar widening? Worth a focused audit pass.
3. **L4-001** scored 0.64 vs 0.68 threshold — the model is at the edge; one more rubric synonym could push it over. Worth examining.
