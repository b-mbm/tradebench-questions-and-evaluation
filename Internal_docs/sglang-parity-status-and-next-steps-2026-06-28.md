# SGLang Parity Status + Next Steps (Delta Memo)

**Date:** 2026-06-28 · **Status:** ✅ json_object + thinking parity ACHIEVED on SGLang. Ready for full eval.

---

## Where we were (the blocker)

SGLang was serving `/v1/models` (200 OK) but **crashing on the first inference request** — the scheduler died with `SIGQUIT` on every `POST /v1/chat/completions`. Claude Code had solved the persistence problem (container start-command via `dockerArgs`) but couldn't serve a single request. The crash traceback was at `/workspace/sglang-serve.log`.

## Where we are now (the fix + validation)

### The crash root cause
`FileNotFoundError: [Errno 2] No such file or directory: 'ninja'`

The Qwen3.6-27B hybrid GDN architecture requires **Triton kernel JIT compilation** during the first forward pass (`activation.py:106 → forward_cuda`). That compilation calls `ninja` as a subprocess build tool. SGLang's pip install put `ninja` in `/root/sglang/bin/` but the scheduler subprocess didn't have it on PATH. **This is the same bug that crashed vLLM** — both frameworks hit the missing-`ninja` issue on this pod template (`runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404`).

### The fix
Added to `/workspace/sglang-startup.sh` (the container start-command):
```bash
ln -sf /workspace/vllm/bin/ninja /usr/local/bin/ninja
export PATH="/usr/local/bin:/root/sglang/bin:$PATH"
```
One symlink. The `ninja` binary already existed on the volume (from the vLLM venv at `/workspace/vllm/bin/ninja`) — it just wasn't on PATH for SGLang's scheduler subprocess.

### Tier 1 Probe Results — ALL PASSED

Tested via RunPod HTTP proxy with the **original OpenRouter prompt** (ExecuteOneResponse intact) + `response_format: {"type": "json_object"}`:

| Question | Thinking | JSON | Schema | Values |
|---|---|---|---|---|
| L9-001 | ✅ YES | ✅ direct | `expected_value: 18.615` | correct |
| **AGI-004** | ✅ 11,500 chars | ✅ direct | **NESTED OK**: `allocation_usd: {Aave: 20k, Curve: 30k, Ethena: 0, GMX: 30k, Pendle: 20k}` | venue sub-keys preserved |
| **AGI-014** | ✅ 11,391 chars | ✅ direct | **NESTED OK**: `perp_short_allocation_usd: {Binance: 150k, Bybit: 100k, OKX: 100k, Hyperliquid: 100k, dYdX: 50k}` | venue sub-keys preserved |

**This is true OpenRouter parity:** same model, same prompt, same `json_object`, thinking preserved, nested schemas survive (not collapsed to `ExecuteOneResponse`).

### Reliability
- Server survived all requests across multiple probes.
- **Streaming required for AGI** — the RunPod HTTP proxy times out non-streaming requests at ~120s (returns HTTP 524). AGI questions take 300-400s (11k+ tokens of reasoning). Use `"stream": true` + 600s timeout.
- Simple questions work non-streaming but the model still generates ~800 chars of reasoning on every request.

## The deployment recipe (proven, reusable)

**Pod deploy:**
```
RunPod podFindAndDeployOnDemand:
  cloudType: SECURE
  gpuTypeId: "NVIDIA H100 80GB HBM3"
  containerDiskInGb: 80
  dataCenterId: "US-MO-1"  (must match volume)
  networkVolumeId: "qqz94ksxmn"
  volumeMountPath: "/workspace"
  imageName: "runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404"
  ports: "8000/http,22/tcp"
  dockerArgs: "bash /workspace/sglang-startup.sh"
```

**Startup script:** `/workspace/sglang-startup.sh` (on the volume, persists across pod stop/resume)
- Symlinks `ninja` to `/usr/local/bin` (THE fix)
- Installs SGLang 0.5.14 to container disk `/root/sglang` (~5min)
- Runs `sglang serve` in a `while true` restart loop
- Serve flags: `--reasoning-parser qwen3 --disable-cuda-graph --mem-fraction-static 0.82 --context-length 32768`
- Starts sshd for debugging (optional)

**Access:** `https://<podId>-8000.proxy.runpod.net` — no SSH needed for serving.

**Current pod:** `2ke3spanjt95vo` (EXITED). Resume to restart serving.

## What's NOT done yet

1. **Tier 2 reliability test (29Q base-only)** — not run. Need to verify SGLang handles 29 consecutive hard-tier questions without crashing.
2. **LoRA adapter** — not loaded. The serve command above is **base-only**. LoRA loading crashed SGLang's scheduler in one earlier session. Need to test `--lora-paths` with the ninja fix in place (the LoRA crash may have been a secondary effect of the ninja crash).
3. **Full base-vs-tuned comparison** — the actual eval. Run 29Q × base + 29Q × sft with `json_object` + streaming, compare to OpenRouter's 26/29 and to each other.

## Environment reference
- **Volume:** `qqz94ksxmn` (US-MO-1), mounted at `/workspace`
- **Model:** `/workspace/models/qwen3.6-27b` (Qwen/Qwen3.6-27B, ~54GB, Apache-2.0)
- **LoRA adapter:** `/workspace/out/sft/` (adapter_config.json + adapter_model.safetensors, rank 32)
- **Prompts:** `/workspace/prompts-300q.json`
- **RunPod API key:** `~/.runpod_key`
- **Repo:** `/Users/bradleymiles/Documents/tradebench-questions-and-evaluation`, branch `codex-work`
- **Scripts:** `scripts/sglang-startup.sh`, `scripts/probe-parity-curl.py`, `scripts/probe-parity-remote.py`
- **Balance:** ~$71

## Related docs
- `Internal_docs/sglang-parity-achieved-2026-06-28.md` — the parity achievement report
- `Internal_docs/delta-memo-json-parity-2026-06-28.md` — the full delta from "strip the prompt" to "deploy SGLang"
- `Internal_docs/sglang-handoff-to-glm-2026-06-28.md` — Claude Code's handoff (persistence solved, request crash open)
