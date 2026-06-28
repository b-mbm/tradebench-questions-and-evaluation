# SGLang Parity — ACHIEVED

**Date:** 2026-06-28 · **Pod:** 2ke3spanjt95vo (EXITED) · **Status:** ✅ SGLang serves json_object + thinking + nested schema. OpenRouter parity confirmed.

## The crash Claude hit (and the fix)

**Root cause:** `FileNotFoundError: [Errno 2] No such file or directory: 'ninja'`

SGLang's scheduler crashed on the **first inference request** because the Qwen3.6-27B hybrid GDN architecture requires Triton kernel JIT compilation during the forward pass (`activation.py:106 forward_cuda`). That compilation calls `ninja` as a subprocess build tool. SGLang's pip install put `ninja` in `/root/sglang/bin/` but the scheduler subprocess didn't have it on PATH.

**This is the same bug that crashed vLLM** — both frameworks hit the `ninja` missing-from-PATH issue on this pod template. The vLLM orchestrator fixed it with `ln -sf /workspace/vllm/bin/ninja /usr/local/bin/ninja`; SGLang needed the same.

**The fix:** Added to `sglang-startup.sh` (the container start-command):
```bash
ln -sf /workspace/vllm/bin/ninja /usr/local/bin/ninja
export PATH="/usr/local/bin:/root/sglang/bin:$PATH"
```

## Tier 1 Probe Results — ALL PASSED

Tested against the RunPod HTTP proxy (`https://<podId>-8000.proxy.runpod.net`) with the **original OpenRouter prompt** (ExecuteOneResponse intact) + `json_object`:

| Question | Thinking | JSON Valid | Schema | Key Detail |
|---|---|---|---|---|
| **L9-001** | ✅ YES | ✅ direct parse | `expected_value: 18.615` | correct |
| **AGI-004** | ✅ YES (11,500 chars) | ✅ direct parse | **NESTED OK** | `allocation_usd: {Aave: 20k, Curve: 30k, Ethena: 0, GMX: 30k, Pendle: 20k}` |
| **AGI-014** | ✅ YES (11,391 chars) | ✅ direct parse | **NESTED OK** | `perp_short_allocation_usd: {Binance: 150k, Bybit: 100k, OKX: 100k, Hyperliquid: 100k, dYdX: 50k}` |

**All three:** thinking present + valid JSON + correct nested schema (not collapsed to ExecuteOneResponse) + clean `finish=stop`. **This is true OpenRouter parity.**

## Reliability

- Server survived all requests, stayed alive across multiple probes.
- **Streaming required for AGI questions** — the RunPod HTTP proxy has a ~120s timeout on non-streaming requests (returns 524). AGI questions take 300-400s (11k+ tokens of reasoning). Use `stream: true` for any request expecting >120s generation.
- Simple questions work non-streaming but still generate ~800 chars of reasoning (the model thinks on everything).

## The deployment recipe (reusable)

1. **Deploy pod** with `dockerArgs: "bash /workspace/sglang-startup.sh"` (container start-command, survives SSH disconnect)
2. **Startup script** (`/workspace/sglang-startup.sh` on volume):
   - Symlinks `ninja` to `/usr/local/bin` (THE fix)
   - Installs SGLang to container disk `/root/sglang` (~5min)
   - Runs `sglang serve` in a restart loop
3. **Serve flags:** `--reasoning-parser qwen3 --disable-cuda-graph --mem-fraction-static 0.82 --context-length 32768`
4. **Access:** `https://<podId>-8000.proxy.runpod.net` (no SSH needed)
5. **For requests:** use `stream: true` + 600s timeout for AGI questions

## What this means

**SGLang on RunPod achieves OpenRouter parity for Qwen3.6-27B:**
- Same model, same prompt (ExecuteOneResponse intact), same `json_object`
- Thinking preserved (11k+ chars of reasoning on AGI questions)
- Nested schemas survive (allocation_usd with venue sub-keys)
- Persists without SSH (container start-command)
- Serves via HTTP proxy (no SSH tunnel needed)

**The json_object saga is over.** The path forward: serve SGLang with this recipe, run the full 29Q hard-tier set with `json_object` + streaming, and compare base-vs-tuned against OpenRouter's 26/29. This is the first true apples-to-apples comparison.
