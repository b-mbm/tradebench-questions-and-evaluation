# json_object Parity Synthesis — How to play the same game as OpenRouter

**Date:** 2026-06-28 · Five-subagent exploration, synthesized.

---

## The converged diagnosis (all 5 reports agree)

**1. There is exactly ONE system prompt, shared byte-identical by all 300 questions.**
Every question — including all 110 AGI — gets the same `interface ExecuteOneResponse` (single-order shape: `intent, order_type, asset, size, venue, risk_controls`). Verified: 300/300 questions hash to one interface string (`src/prompts/schema-prompts-300q.ts:19-41`).

**2. AGI (and L8/L9/L10) rubrics grade on a COMPLETELY DIFFERENT schema.**
AGI-004 needs `allocation_usd: {Curve_3pool, GMX_GLP, Ethena_USDe, Aave_USDC}`. AGI-014 needs `perp_short_allocation_usd: {Binance, Bybit, ...}`. AGI-024 needs `venue_fills: {Dark_RFQ, ...}` + `execution_sequence`. **None of these exist in `ExecuteOneResponse`.** The correct schema lives only in each question's user-prompt "Output Requirements" block and the rubric's `_agi_canonical.validation`.

**3. Every non-L1 prompt contains a self-contradiction.**
The user prompt ends with *"Respond with a valid JSON object matching ExecuteOneResponse"* — but ALSO contains an "Output Requirements" block listing the *correct, different* keys. The model has to resolve "match ExecuteOneResponse" vs "use exactly these keys" on its own.

## The key correction (this changes the fix)

**OpenRouter is NOT "constraining the model to the right schema." It's doing the opposite — it's being LOOSE.** Verified from OR's docs + our runner code:

- OR's `{type: "json_object"}` enforces **"valid, parseable JSON" and NOTHING else.** No shape constraint, no schema extraction from the prompt. The model obeys the per-question Output Requirements *freely*.
- OR adds a **"Response Healing" plugin** that repairs malformed JSON post-hoc (~80% defect reduction).
- OR's `json_object` ≠ vLLM's `json_object`. vLLM's xgrammar, when handed bare `json_object`, **over-constrains**: it locks onto the `ExecuteOneResponse` shape implied by the prompt and forces every answer into the single-order shape. That is the collapse (76/110 AGI rows flattened to `order_type/asset/size/venue`).

**So the score to beat (164) was achieved by a model running essentially "free-text JSON + guaranteed validity + a repair pass" — NOT by constrained decoding.** That's a crucial distinction. It means our no-json path (19/29) is *closer to OR's actual mechanism than I told you* — what it's missing is the JSON-validity guarantee and the healing pass, not a schema constraint.

## What this means for the fix (two distinct strategies)

This gives us **two viable paths to parity**, and they're not mutually exclusive:

### Strategy A — Replicate OR's exact mechanism on vLLM (loose JSON + healing)
Make vLLM do "valid JSON only, no shape lock," then add a repair pass. Two ways to kill the xgrammar lock:
1. **Remove `ExecuteOneResponse` from the system prompt** so xgrammar has no wrong shape to lock onto. The per-question Output Requirements already supply the correct keys. The grader reads the *rubric*, not the prompt — so this is safe.
2. **Switch the guided-decoding backend** from xgrammar to `guidance` (handles bare `json_object` without over-constraining) OR pass a permissive schema (`additionalProperties: true`).
Then add an OR-style healing pass: on malformed JSON, attempt a tolerant repair before recording `status: error`.

**Pros:** This is literally what OR does. Lowest conceptual risk. The no-json data proves the model CAN produce the right shape when not locked.
**Cons:** "Loose JSON" still relies on the model following instructions — same fidelity ceiling as OR (which is only 164/300).

### Strategy B — Do it BETTER than OR (guided_json with correct per-question schemas)
Extract a JSON Schema from each rubric's `_agi_canonical.validation` (the schema is already there — 105 distinct shapes) and pass it as `guided_json` / `json_schema` per request. This would force the CORRECT nested schema per question — stronger than OR's loose approach.

**Pros:** Could beat OR, not just match it. Eliminates structural failures entirely.
**Cons:** **Known landmine.** vLLM issue [#18819](https://github.com/vllm-project/vllm/issues/18819): reasoning-parser (`qwen3`) + guided_json is **broken without `enable_in_reasoning=True`**. Alibaba officially states Qwen thinking models "don't support structured output." Issue [#36010](https://github.com/vllm-project/vllm/issues/36010) flags Qwen3.5/3.6 guided-decoding instability. **This must be validated empirically before trusting it.**

### Strategy C — Keep no-json, add the missing OR features (healing + validity)
Our no-json path already produces the right shapes. The gaps vs OR are: (1) no JSON-validity guarantee, (2) no healing/repair pass, (3) the grader penalizes non-clean-JSON confidence (0.6–0.8 vs 1.0). Adding a healing pass + tightening the extraction could close much of the gap cheaply.

**This is the highest-confidence, lowest-cost path, but it does NOT give you `json_object` parity — it gives you "no-json but made reliable."** Include it as a fallback if A and B both struggle with the reasoning-parser conflict.

## Recommended experiment order

**Step 1 — Validate the reasoning-parser + structured-output interaction (cheap, decisive).**
On one pod session, serve with `--guided-decoding-backend guidance --structured-outputs-config '{"enable_in_reasoning": true}'`, send ONE AGI question with its correct `json_schema`. Pass criterion: the output has `allocation_usd` with venue sub-keys intact (not collapsed). This single test tells us whether Strategy B is viable at all. ~15 min cold start + 1 question.

**Step 2A — If Step 1 passes:** Run the collapse-zone tier (L9/L10/AGI, ~29 rows) with guided_json + correct per-question schemas, with `ExecuteOneResponse` REMOVED from the system prompt. Compare to the no-json 19/29 baseline. Target: ≥24/29 (closing toward OR's 26).

**Step 2B — If Step 1 fails:** Drop to Strategy A — serve with `guidance` backend + bare `json_object` (loose), strip `ExecuteOneResponse` from the prompt, add a healing pass. This replicates OR's mechanism.

**Step 3 — Either way, add the repair/healing pass** to the runner (OR has one; we don't). ~20 lines: on `status: error`/`blank`, attempt tolerant JSON repair (strip trailing commas, balance braces, extract first-`{`-to-last-`}`), then re-grade.

## The one risk to watch (be honest about it)
**Alibaba says Qwen3.6 thinking + structured output is unsupported.** vLLM #36010 confirms instability on this exact architecture. Strategy B may work on our current vLLM build and break on the next. **Pin the vLLM version** the moment we find a working config, and treat structured output on this model as "works on my build," not "supported."

## What we need to build (concrete)
1. **Schema extractor** (`src/grading/rubric-to-jsonschema.ts`): rubric `_agi_canonical.validation` → JSON Schema (number/string/array/boolean + nested dotted paths + enums/ranges). Handle the 105 distinct shapes. ~1 file.
2. **System prompt fix** (`src/prompts/schema-prompts-300q.ts`): strip `ExecuteOneResponse` block + the closing "matching ExecuteOneResponse" line. Keep per-question Output Requirements. Grader needs no change.
3. **Runner wire-up** (`scripts/runpod-runner.py`): add `guided_json`/`response_format: json_schema` to the request body (it's a plain dict — just add the key). Add the healing/repair pass.
4. **Serve flags** (`scripts/pod-serve-launch.sh`): add `--guided-decoding-backend guidance --structured-outputs-config '{"enable_in_reasoning": true}'`.

## Bottom line
The gap is **not** "OR constrains the model and we don't." It's the opposite: **OR stays out of the model's way (loose JSON), while vLLM's xgrammar actively locks the model into the wrong shape.** The fix is to stop vLLM from locking (remove the `ExecuteOneResponse` bait + switch backend) OR to lock it into the RIGHT shape (guided_json with rubric schemas). Strategy B is the higher-ceiling play; Strategy A is the safer replication of OR. Step 1's one-question probe decides which is viable for this model.
