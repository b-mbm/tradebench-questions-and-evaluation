# Qwen3.6-27B — OpenRouter vs RunPod 300Q Audit (verified from raw data)

**Date:** 2026-06-26 · **Mode:** read-only recomputation, no API calls, no pods.
Everything below was recomputed from the committed JSON; the three existing analysis
docs were checked against the data and **two of their claims are corrected** below.

Aggregation scripts (committed, re-runnable): `scripts/audit-qwen36-or-vs-runpod.ts`,
`scripts/audit-tier-compare.ts`, `scripts/audit-agi6.ts`.

---

## 1. Honest OpenRouter `qwen/qwen3.6-27b` score — **164 clean / 166 post-repair (confirmed)**

Recomputed directly from the canonical checkpoint
`results/community/300/openrouter-qwen-open-weight-n1-final-from-checkpoint-2026-06-14T23-28-55-760Z.json`
(300 evaluations, `modelLabel=…qwen3.6-27b`, no duplicate questionIds):

| Source | pass | total | blank-raw | notes |
|---|---|---|---|---|
| Checkpoint (raw) | **164** | 300 | 6 | matches dirty-rows ledger exactly |
| `qwen36-openrouter-consolidated.json` | 164 | 300 | 6 | cross-checked: **0 pass mismatches** |
| Dirty-rows ledger (`current-n1-dirty-rows`) | 164 | 300 | 6 dirty | `pass:164, clean:294, answered_fail:130` |
| June-15 final archive | **166** | 300 | 0 | **post-repair** (`pass_at_1:166, clean:300`) |

**The 6 dirty rows** (identical in checkpoint, consolidated, and ledger):
`L8-003, L10-008, L10-051, AGI-073, AGI-078, AGI-081`.

### Dirty/repair accounting (verified from `repair-checkpoints/top20-no-openai-pro-dirty-repair.jsonl`, 17 qwen3.6-27b rows)

| Dirty ID | repair attempts | outcome | net |
|---|---|---|---|
| **L8-003** | 2 | repaired → **pass** (score 0.91) | +1 |
| **L10-008** | 1 | repaired → **pass** (score 1.00) | +1 |
| L10-051 | 6 | 5 blank + 1 non-blank, all fail | still fail |
| AGI-073 | 3 | 2 blank + 1 non-blank, fail | still fail |
| AGI-078 | 4 | 3 blank + 1 non-blank, fail | still fail |
| AGI-081 | 1 | 1 non-blank, fail | still fail |

→ **164 → 166 after repair.** **6 distinct rows ever dirty; all 6 repaired; 2 recovered to pass.**

### ⚠️ Correction to the existing delta-audit doc

`Internal_docs/openrouter-vs-runpod-delta-audit.md` §1 calls the residual 4 rows
"unrecoverable transport failures." **They are not.** The repair file shows the 4
residual rows came back **non-blank** (rawLen 638–1254) and were *scored* — they were
real, wrong answers, not transport blanks. That is why the June-15 archive reports
`clean:300, dirty:0`: every question eventually produced an answer; 4 just happened
to be wrong. Net effect on the headline is the same (166), but the *character* of the
residual is "model got it wrong" not "provider dropped the row."

---

## 2. OpenRouter vs RunPod by tier + gap attribution

OpenRouter = stock `qwen/qwen3.6-27b`, OpenRouter `json_object`, temp 0.1, max_tokens 2200
(`scripts/parallel-runner.ts:499-500`, `scripts/run-300q.ts:253-254`).
RunPod = our fine-tune `local-qwen36-27b-sft`, vLLM bf16 `--enforce-eager`, `json_object`.

| Tier | n | OpenRouter | RunPod json_object | gap |
|---|---|---|---|---|
| L1-8 | 40 | 25 | 20 | +5 |
| L9 | 81 | 66 | 13 | +53 |
| L10 | 69 | 55 | 5 | +50 |
| AGI | 110 | 18 | 0 | +18 |
| **Total** | 300 | **164** | **38** | **126** |

**json-collapse isolation (same 29 hard-tier questions, RunPod only):**
RunPod `json_object` = **9/29** → no-json tuned = **20/29** (base 18/29) → **+11 from dropping `json_object`.**
No-json per-tier on that subset: L1-8 5/7, L9 7/8, L10 **8/8**, **AGI 0/6**.

### Factor attribution (magnitudes, recomputed)

**(a) vLLM `json_object` xgrammar schema collapse — dominant (~95–105 of the 126).**
Verified, and stronger than the existing doc states. Of RunPod's 110 AGI rows under
`json_object`: **18 blank, 76 collapsed to a single-execute schema** (`intent/order_type/asset/size/venue`,
no nested AGI shapes), 16 emitted partial question-specific shape, **0 passed**.
The collapse is visible in the raw output — e.g. AGI-001, a two-asset hedge requiring nested
`shorts.MATIC`/`shorts.SOL`, is emitted as a single `order_type:"perp_short", asset:"SOL", size:"180000"`
order. The same 29 questions jumped from 9→20 (tuned) once `json_object` was removed — that +11, scaled
across L9+L10+AGI, is the bulk of the gap. **Largest single factor.**

**(b) Token-budget / truncation in the no-json path — secondary, tier-specific (~5–15).**
Qwen3.6-27B is a reasoning model; in no-json mode it emits 12k–17k chars of *visible* reasoning
and hits `finish=length` under 6k–9k token caps. On the 29-row gate: 3/6 AGI and a handful of L9
rows truncated. On OpenRouter the endpoint returns *compact* JSON (no visible reasoning) so 2200
tokens sufficed — truncation is **RunPod-elicitation-specific, not a weight property.** Mostly
fixable with a 16k budget. Note: on OpenRouter, the *same* AGI rows passed **despite truncation
risk**, so budget is not the binding constraint there.

**(c) AGI validator / parse-strictness — affects the AGI ceiling, but smaller than the doc claims (~1–3).**
The AGI verifier exact-matches string fields (`scoreAgiValidation`, `schema-grader-300q.ts:535`),
and `intent`/`chosen_strategy` have **hidden expecteds the prompt never discloses** (verified:
AGI-024 expects `intent=adversarial_event_execution`, `chosen_strategy=private_first_hidden_completion`;
prompt contains neither). The no-json AGI rows also carried `missing_field` from nested shapes that
the no-json parse didn't capture → `agiStructuralSatisfied` hard-fails on `missing_field`
(`schema-grader-300q.ts:3870-3877`), and the no-json parse path takes a **0.6** confidence multiplier
vs 1.0 for clean JSON (`:3865`) right at the `confidence >= 0.6` gate (`:3925`).

### ⚠️ Correction to the existing delta-audit doc (factor c)

The doc says the hidden `intent`/`chosen_strategy` exact-match "caps the AGI ceiling (~2–3 rows)."
**That is overstated.** `intent`/`chosen_strategy` are **string, not `object`**, fields — so they do
*not* trigger `agiStructuralSatisfied`; they only lower `normalizedScore`. Proof: **all 18 OpenRouter
AGI passes had an `intent` value that did NOT match the hidden expected label** (e.g. AGI-024 emitted
`intent:"buy"`, expected `adversarial_event_execution`; AGI-014 emitted `execute_delta_neutral_carry`,
expected `resilient_funding_basis`) — **and passed anyway**, on the score threshold. So the exact-label
match is a *soft* penalty, not a gate. The real AGI ceiling-killer for RunPod is the **schema
collapse + the `missing_field` structural hard-fail from the no-json parse**, not the label check.

**(d) Quantization / precision — UNKNOWN, assumed ~0.**
RunPod is bf16 (full precision). **OpenRouter provider precision for `qwen/qwen3.6-27b` is not
recorded anywhere in this repo** — flagged unknown. bf16 is ≥ a typical hosted fp8 serve, so precision
does not plausibly explain RunPod scoring *lower*. Assumed negligible; cannot be confirmed without
recording OR's provider precision.

**(e) Genuine model differences — small but real (~2–3 AGI rows).**
RunPod = our fine-tune; OpenRouter = stock. On the no-json gate, base ≈ tuned overall (18 vs 20),
and both genuinely miss AGI-003, AGI-014, AGI-002 (wrong economics/route/formula — not labels, not
budget). The fine-tune showed real AGI-004 promise (correct economics where base was wrong) but did
not solve AGI broadly. A handful of genuine capability misses remain regardless of harness.

**Summary:** 126-gap = json_object collapse (a) **≫** no-json truncation (b) **>** AGI structural/parse
(c) **>** genuine model misses (e) **≫** precision (d ≈ 0). The gap is overwhelmingly **harness, not weights.**

---

## 3. Claim under test — **REFUTED**

> *"RunPod AGI failures are mostly a token-budget problem; with 16k–32k tokens no-json the model
> solves most of them."*

**Refuted.** From `nojson-agi6-outputs.json` (6 AGI rows × base+tuned, full no-json output):

| AGI row | finish | rawLen | token-fixable? | real cause (from graded output) |
|---|---|---|---|---|
| AGI-001 | length | 15.5k | partial | truncated **and** wrong economics + `missing_field` |
| AGI-002 | length | 14.5–14.9k | no | truncated but chose wrong (DEX) route — genuine miss |
| AGI-003 | **stop** | 14.5–15.3k | **no** | completed; drawdown sign + funding sign wrong — genuine |
| AGI-004 | length | 16.4–17.1k | **yes (tuned)** | tuned economics fully correct; fails only `missing_field` + label |
| AGI-014 | **stop** | 13.3–13.6k | **no** | completed; APR/PnL formula wrong — genuine |
| AGI-024 | **stop** | 12.1–12.6k | **no** | completed; economics right (avg 1.20686, slip 0.57%); fails `missing_field` (nested shapes) — parse artifact |

- **Token-fixable (truncated): 3/6** (AGI-001, 002, 004), all `finish=length`. But of these, AGI-002 is
  also a genuine route miss and AGI-001 also has wrong economics → **only ~1 (AGI-004 tuned) is a clean
  token+schema win.**
- **Completed but still failed: 3/6** (AGI-003, 014, 024), `finish=stop`, 12k–15k chars. **More tokens
  change nothing** for these.
- AGI gate result, both models, full no-json output: **0/6.**

**Decisive cross-check:** on OpenRouter — same model, *not* token-starved, compact JSON — stock qwen3.6-27b
**passed AGI-004, AGI-014, and AGI-024** (the rows RunPod failed even with full output), at only 2200
tokens. This proves (i) those rows are solvable, but the lever is the **clean-JSON path** (no
`missing_field`, confidence 1.0), not raw token count; and (ii) AGI is hard for this model class
regardless of harness — OpenRouter, fully un-truncated, still only passes **18/110** AGI.

**Conclusion:** adequate tokens recover the *truncated* L9/L10 rows strongly (9→20 on the gate), but
for AGI specifically, **tokens fix at most ~1–3 of the 6 hard rows; the rest are parse/structural
artifacts or genuine economic misses.** The "most would be solved with more tokens" framing overstates
the token factor. Token budget is *one* of three AGI failure modes, not the primary one.

---

## Unknowns / what I could not verify
- **OpenRouter provider precision** for `qwen/qwen3.6-27b` — not in repo; factor (d) stays unknown.
- **Exact repo revision** of the served weights on either stack (both nominally `Qwen/Qwen3.6-27B`).
- The fine-tune's **true** base-vs-tuned causal delta — needs a full no-json run on identical serving
  (gate is only 29 rows; n=6 for AGI). Not measurable from this data alone.
- Whether the 16 "partial-specific-shape" AGI rows under `json_object` would pass under guided-json
  with the *per-rubric* schema (not tested — would need a pod).

## Bottom line
- **OpenRouter: 164 clean, 166 post-repair** — confirmed to the row.
- **RunPod 38/300 is a serving artifact:** ~76 AGI rows collapsed to a generic single-execute schema
  under vLLM xgrammar, plus depressed L9/L10. Dropping `json_object` recovers L9/L10 (gate 9→20) but
  **AGI stays 0/6** even with full no-json output.
- The AGI gap is **not** mainly a token-budget problem (refuted); it's schema-collapse + structural
  parse-fail + a few genuine misses. The hidden-label validator is a soft penalty, not the gate the
  prior doc claimed.
- Existing docs were largely correct on (a), (b), (d), (e); **corrected on factor (c)** (validator
  strictness overstated) and on the **character of the 4 residual OpenRouter dirty rows** (wrong
  answers, not transport failures).
