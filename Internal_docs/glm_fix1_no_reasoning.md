# GLM Fix 1 — No-Reasoning-Parser JSON (PARTIAL FIX, do not ship as parity)

**Date:** 2026-06-28
**Status:** ⚠️ PARTIAL — produces valid nested JSON, but **silently disables thinking**. NOT on par with OpenRouter. Recorded so we don't repeat it.

## What this fix is

A configuration that makes vLLM produce valid nested JSON (`allocation_usd: {Curve_3pool: 30000, ...}`) for AGI questions — solving the schema collapse — by removing two things:

1. **`--reasoning-parser qwen3` removed** from the vLLM serve command.
2. **`ExecuteOneResponse` TypeScript interface stripped** from the system prompt (`src/prompts/schema-prompts-300q.ts`), replaced with a generic "use the keys from the user prompt's Output Requirements" instruction.

## Why it works (the schema part)

- Bug 1 (reasoning parser): vLLM issue #18819 documents that `--reasoning-parser qwen3` + `json_object` produces broken/collapsed JSON. Removing the parser eliminates this conflict.
- Bug 2 (ExecuteOneResponse lock): vLLM's xgrammar, when handed bare `json_object` with no explicit schema, locks onto the TypeScript `interface ExecuteOneResponse` in the system prompt and forces every answer into the single-order shape (`intent/order_type/asset/size/venue`), collapsing AGI schemas. Stripping the interface removes the bait.

## Verified test results (2026-06-28, pod vfp294dpl2hbud)

Same pod, same model, vLLM, base `Qwen/Qwen3.6-27B`, `json_object` enabled, stripped system prompt:

| Question | Result | Shape |
|---|---|---|
| L9-001 | ✅ valid | `expected_value: 18.525` |
| AGI-004 | ✅ **nested preserved** | `allocation_usd: {Aave_USDC: 30000, Curve_3pool: 30000, Ethena_USDe: 0, GMX_GLP: 30000, Pendle_PT_stETH: 10000}` |
| AGI-014 | ✅ **nested preserved** | `perp_short_allocation_usd: {Binance: 150000, Bybit: 100000, Hyperliquid: 100000, OKX: 100000, dYdX: 50000}` |

The schema collapse is genuinely solved by this config. Reproduce via `scripts/test-prompt-stripped.py`.

## Why it is NOT on par with OpenRouter (the catch)

**This config silently disables thinking.** Here's the mechanism:

- Under `json_object`, vLLM's grammar constrains every generated token to be valid JSON.
- `<think>` is not valid JSON.
- Therefore the model **cannot emit a thinking block** when `json_object` is active and there is no reasoning parser to split it out.
- The AGI-004 answer above was produced **without the model thinking first** — direct JSON emission only.

OpenRouter's model thinks (reasoning models served there emit `<think>` blocks that get parsed). Ours would not under this config. **This is a worse model with cleaner plumbing, not parity.**

## Evidence that thinking matters (do not handicap the model)

- OptimalThinkingBench (arXiv:2508.13141): Qwen3 models score **≤20% accuracy in non-thinking mode** on reasoning benchmarks.
- Test-time compute gains are published: GPQA 90.3 → 92.8, LiveCodeBench 88.0 → 91.4.
- Qwen3 Technical Report (arXiv:2505.09388): chain-of-thought is what unlocks multi-step reasoning.
- On our own benchmark: AGI questions are the hardest tier; removing the reasoning budget likely costs real points on AGI-001/002/003 (genuine multi-step reasoning).

**Conclusion: reasoning is value-accretive. We must not ship a config that disables it.**

## What the fix IS good for

- It **proves the schema collapse root cause** definitively: the `ExecuteOneResponse` interface + xgrammar locking, compounded by the reasoning-parser conflict.
- The **prompt fix (strip ExecuteOneResponse) is still correct and should be kept** regardless of serving config — that interface is wrong for AGI and misleads the model under any decoding mode.
- It gives us a **known-working fallback** if all thinking-preserving configs fail: we can ship no-thinking + clean JSON as a degraded mode while we solve the thinking+JSON coexistence.

## The real fix (what we're moving to)

The goal: **thinking ON + valid nested JSON + reliable across 300 questions.** Three candidates under evaluation (see `Internal_docs/json-object-fix-verified-2026-06-28.md` and the SGLang research):

1. **SGLang + `qwen3-thinking` parser + reasoning-aware structured output** — SGLang has a dedicated feature for this (disables grammar inside `<think>`, enforces schema on the final answer). Qwen's officially recommended framework. `qwen3-thinking` parser is documented as more reliable than `qwen3` for structured output (SGLang #9259).
2. **Two-stage generation** — think freely in stage 1 (no json_object), format as JSON in stage 2 (json_object on, no thinking needed). 100% reliable JSON, full intelligence, 2× calls (negligible on own hardware). The architecturally sound approach.
3. **vLLM `--structured-outputs-config enable_in_reasoning=True` + `qwen3-thinking` parser** — may work but has open reliability bugs (#43388, #16182). Medium-low confidence for 300-question reliability.

## Reproduction

Serve command used (do NOT ship as final):
```bash
vllm serve /workspace/models/qwen3.6-27b \
  --served-model-name local-qwen36-27b-base \
  --enable-lora --lora-modules "local-qwen36-27b-sft=/workspace/out/sft" \
  --max-lora-rank 32 --max-num-seqs 8 --dtype bfloat16 \
  --max-model-len 32768 --gpu-memory-utilization 0.90 \
  --enforce-eager --port 8000 --trust-remote-code
  # NOTE: no --reasoning-parser flag (this is what disables thinking)
```
Test script: `scripts/test-prompt-stripped.py`
Stripped system prompt: hardcoded in `scripts/test-prompt-stripped.py` (`STRIPPED_SYSTEM`).
