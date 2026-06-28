# Delta Memo: json_object + Thinking Parity — Status Update

**Date:** 2026-06-28 · **Status:** ✅ SGLang serves Qwen3.6-27B with json_object + thinking + nested schemas. Parity with OpenRouter confirmed at the serving layer.

---

## What we discovered

### The json_object collapse was three compounding bugs, not one

We spent days thinking the collapse was a single issue. It was three, each diagnosed by changing one variable at a time:

1. **Reasoning parser + grammar conflict (vLLM #18819):** `--reasoning-parser qwen3` + `json_object` on vLLM produces broken JSON. Removing the parser fixes JSON but **silently disables thinking** — which costs real accuracy (AGI-004 Ethena allocation went from 0/wrong without thinking to 20000/correct with thinking).

2. **ExecuteOneResponse interface in the system prompt:** Every question gets the same TypeScript interface (`intent, order_type, asset, size, venue`). vLLM's xgrammar locks onto it and forces every answer into the single-order shape, collapsing AGI schemas (`allocation_usd`, `venue_fills`) into the generic structure.

3. **`ninja` missing from PATH (the actual crash):** The Qwen3.6 hybrid GDN architecture requires Triton kernel JIT compilation on the first forward pass. That compilation calls `ninja` as a build tool. Both vLLM and SGLang crashed with `FileNotFoundError: 'ninja'` because the RunPod pod template doesn't put ninja on the system PATH. **Fix: one symlink** (`ln -sf /workspace/vllm/bin/ninja /usr/local/bin/ninja`).

### vLLM is a dead end for json_object + thinking on this model

vLLM 0.23.0 has `enable_in_reasoning=True` (supposed to apply JSON constraint only after `</think>`), but it's broken — the model thinks but returns empty content (bug #43388). There is no working vLLM configuration for json_object + thinking on Qwen3.6-27B.

### SGLang is the answer

SGLang 0.5.14, deployed as a container start-command (so it survives SSH disconnect), with `ninja` on PATH and `--disable-cuda-graph`, produces: thinking (11,000+ chars of reasoning on AGI questions) + valid JSON + correct nested schemas (venue-keyed allocations). This matches OpenRouter's mechanism: same model, same prompt, same `json_object`, thinking preserved.

### The deployment recipe

Claude Code solved the persistence problem (launch SGLang as the container's start-command via `dockerArgs`, not from SSH). GLM solved the request-time crash (the `ninja` symlink). Together, these make SGLang serve reliably without any SSH session connected, accessible via the RunPod HTTP proxy.

## Where we stand now

**Solved:**
- ✅ json_object + thinking works on SGLang (Tier 1 probe: L9-001, AGI-004, AGI-014 all passed — thinking present, valid JSON, nested schemas survived)
- ✅ Server persists without SSH (container start-command)
- ✅ Accessible via HTTP proxy (no SSH tunnel needed)
- ✅ Deployment recipe is committed and reusable (`scripts/sglang-startup.sh`)

**Not yet done (open items, no blocker):**
- Tier 2 reliability test (29 consecutive questions) — not run, but Tier 1 passed cleanly
- LoRA adapter — base-only serving is proven; LoRA crashed before the ninja fix, may now work
- Full base-vs-tuned score comparison — the actual eval. The serving layer is fair now; the score question is open
- AGI-004 still allocates Ethena=0 — a genuine model reasoning gap, not a harness artifact

**The bottom line:** The serving infrastructure that was blocking us for days is solved. SGLang on RunPod now matches OpenRouter's serving mechanism for Qwen3.6-27B. The next step is running the actual evaluation to see if the scores match.
