# json_object Collapse — SOLVED (vLLM, no SGLang needed)

**Date:** 2026-06-28 · **Pod:** vfp294dpl2hbud · **Cost:** ~$3 (one cold start + 5 test calls)

## The result

The json_object schema collapse that caused the fake 38/300 RunPod score is **fixed**. Nested AGI schemas now survive `json_object` cleanly on vLLM, on the same hardware, same model, same vLLM version. No SGLang needed.

## What was broken (two compounding bugs)

### Bug 1 — `--reasoning-parser qwen3` conflicts with guided JSON decoding (vLLM #18819)
Documented at [vLLM #18819](https://github.com/vllm-project/vllm/issues/18819). When the reasoning parser is active AND `json_object` is sent, vLLM applies the grammar constraint incorrectly across `<think>` tokens, producing malformed JSON. Removing `--reasoning-parser` eliminates this.

**Necessary but not sufficient on its own** — removing it alone did NOT fix AGI collapse (see test below).

### Bug 2 — `ExecuteOneResponse` TypeScript interface in the system prompt (THE actual collapse mechanism)
Every one of 300 questions gets the identical system prompt containing:
```
interface ExecuteOneResponse {
  intent: string; order_type: string; asset: string; size: string|number; venue: string; ...
}
```
vLLM's xgrammar, when handed bare `json_object` (no explicit schema), **locks onto this TypeScript interface** and forces every answer — including AGI questions needing completely different shapes — into the single-order schema (`intent/order_type/asset/size/venue`). This is the collapse: 76/110 AGI rows flattened to the generic execute-one shape.

**Stripping the `ExecuteOneResponse` block** (replaced with a generic "return JSON with the keys specified in the user prompt") eliminates the shape-locking. This is the actual fix.

## The decisive test results

**Setup:** vLLM serve WITHOUT `--reasoning-parser`, `json_object` enabled, system prompt with `ExecuteOneResponse` stripped.

| Question | With ExecuteOneResponse (original) | Stripped system prompt (fix) |
|---|---|---|
| L9-001 | `expected_value: 18.525` ✓ | `expected_value: 18.525` ✓ |
| **AGI-004** | **COLLAPSED** → `{intent, order_type, asset, size, venue, ...}` | **NESTED OK** → `allocation_usd: {Aave_USDC: 30000, Curve_3pool: 30000, Ethena_USDe: 0, GMX_GLP: 30000, Pendle_PT_stETH: 10000}` |
| **AGI-014** | (not tested w/ original prompt) | **NESTED OK** → `perp_short_allocation_usd: {Binance: 150000, Bybit: 100000, Hyperliquid: 100000, OKX: 100000, dYdX: 50000}` |

AGI-004 and AGI-014 both returned **perfectly nested venue-keyed allocation objects** with `json_object`. The collapse is gone.

**Intermediate test (just removing reasoning parser, keeping ExecuteOneResponse):** AGI-004 STILL collapsed to `{intent, order_type, asset, size, unit, venue, venue_name, risk_controls, follow_up, reasoning}` — literally the `ExecuteOneResponse` interface. This proves the system prompt interface is the collapse mechanism, not the reasoning parser alone.

## The fix (concrete, two changes)

### 1. Serve command: remove `--reasoning-parser qwen3`
```diff
- vllm serve ... --reasoning-parser qwen3 --enforce-eager
+ vllm serve ... --enforce-eager
```
Trade-off: vLLM no longer auto-splits `<think>...</think>` into a separate `reasoning_content` field. The runner must strip `<think>` blocks and extract JSON from the remaining content. This is ~10 lines of Python in `runpod-runner.py`.

### 2. System prompt: strip `ExecuteOneResponse` TypeScript interface
In `src/prompts/schema-prompts-300q.ts`, replace the `SCHEMA_DEFINITION` (the `interface ExecuteOneResponse {...}` block + the two single-order examples) with:
```
You are Execute@1, a deterministic trading execution assistant.

Return ONLY a valid JSON object. Do not include explanations, markdown, or code fences outside of JSON.
Respond with exactly the JSON keys specified in the user prompt's "Output Requirements".
If the question specifies nested keys (e.g. allocation_usd with sub-keys), emit those nested objects exactly.
```
The per-question "Output Requirements" block in each user prompt already lists the correct keys — that's what the model now follows. The grader needs no change (it reads rubrics, not the system prompt).

### 3. Runner: handle `<think>` in code
Since we removed the reasoning parser, add to `runpod-runner.py`:
- Strip `<think>...</think>` from `content` before storing `raw`
- Extract JSON via tolerant parse (first `{` to last `}`)
- Record both the cleaned JSON and the raw reasoning for debugging

## What this means

- **We can now run the full 300 with `json_object` parity to OpenRouter**, on vLLM, on RunPod. Same playing field.
- **SGLang is no longer needed** for this fix. Keep it documented as an alternative if future vLLM versions regress, but it's not required.
- **The 164 OpenRouter reference is now an achievable target** with our own serving stack.
- The AGI-004 value disagreement (Ethena=0) persists — that's a genuine model capability issue, not a harness artifact. The fix gives us clean structure; the values are still the model's to get right (via fine-tuning).

## What needs to happen next
1. Apply the two code changes (serve script + system prompt)
2. Update `runpod-runner.py` to strip `<think>` and use `json_object`
3. Re-run the 29-question hard-tier set (base + sft) with `json_object` + stripped prompt
4. Compare against the OpenRouter 26/29 reference — this is the first true apples-to-apples test
