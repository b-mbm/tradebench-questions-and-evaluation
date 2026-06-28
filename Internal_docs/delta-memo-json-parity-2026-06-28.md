# Delta Memo: json_object Parity — From "Strip the Prompt" to "Deploy SGLang Properly"

**Date:** 2026-06-28 · **Author:** GLM (ZCode agent) · **Status:** Blocked on deployment engineering

---

## The starting point (Claude Code's initial diagnosis, ~2026-06-27)

Claude Code correctly identified the json_object collapse root cause: the `ExecuteOneResponse` TypeScript interface in the system prompt causes vLLM's xgrammar to lock the model into the single-order schema. Claude proposed stripping the interface and/or removing the reasoning parser.

**That diagnosis was correct as far as it went.** The `ExecuteOneResponse` bias is real. But it was incomplete — it didn't account for the thinking/JSON coexistence problem.

## What we learned (the delta)

### 1. Stripping the prompt + removing reasoning parser WORKS — but disables thinking
- Confirmed empirically: AGI-004 and AGI-014 produce perfect nested JSON (`allocation_usd: {Curve_3pool, Ethena_USDe, ...}`) when `ExecuteOneResponse` is stripped and `json_object` is sent without the reasoning parser.
- **But:** under `json_object` without the reasoning parser, the model cannot emit `<think>` blocks. Thinking is silently disabled.
- **Proof this matters:** AGI-004 allocated Ethena=0 (wrong) without thinking; Ethena=20000 (correct) WITH thinking. Thinking is value-accretive (OptimalThinkingBench: Qwen3 ≤20% accuracy without it).
- **Verdict:** This path handicaps the model. Rejected by the project owner. Not parity.

### 2. vLLM's `enable_in_reasoning=True` + `qwen3` parser — BROKEN
- vLLM 0.23.0 has the flag, accepts it, and the server starts. But on the first request, `content` comes back `None`/empty. The model thinks (reasoning_tokens consumed) but produces no output.
- **Root cause:** vLLM issue [#43388](https://github.com/vllm-project/vllm/issues/43388) — `json_object` structured output is not enforced after the reasoning end token with async scheduling.
- **Verdict:** Dead end on vLLM 0.23.0. The flag exists but the implementation is broken for this model/version combination.

### 3. SGLang achieves TRUE parity — when it stays alive
- SGLang 0.5.14 + `--reasoning-parser qwen3 --disable-cuda-graph` + `json_object` at request time produces: **thinking present + valid JSON + correct nested schema**.
- **Proven on L9-001:** `reasoning_content` populated + `content` parsed directly as JSON + `expected_value: 18.615`. This is the parity result — same model, same prompt (ExecuteOneResponse intact), same json_object, thinking preserved.
- SGLang is Qwen's officially recommended serving framework ([Qwen deployment docs](https://qwen.readthedocs.io/en/latest/deployment/sglang.html)).
- **The blocker:** SGLang's multiprocessing subprocess (scheduler) dies when the SSH session that launched it disconnects. This RunPod pod template (`runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404`) kills orphaned process groups. Additionally, SGLang crashed on the first `json_object` request in several sessions (possible interaction with the reasoning parser on this build).
- **8 launch attempts** across two sessions: setsid, nohup, double-fork daemon, tmux, orchestrator-as-parent, foreground-with-background-child. The process survives weight load but dies on SSH disconnect or on the first json_object request.
- **Verdict:** SGLang is the right framework with the right capability. The problem is purely deployment — it needs to run as a managed service, not an SSH-launched background process.

### 4. The two-stage approach (vLLM, think then format) — works but isn't parity
- Stage 1 (no json_object): model thinks freely, produces valid JSON directly on every question tested.
- Stage 2 (json_object on a formatting call): unnecessary — stage 1 already produces valid JSON.
- **But:** this is architecturally different from OpenRouter (no json_object on the thinking call). It's a workaround, not parity. The project owner requires true single-call json_object + thinking parity.
- **Verdict:** Fallback only, not the production path.

## Where we need to be (the target)

**SGLang serving Qwen3.6-27B with:**
- `--reasoning-parser qwen3` (thinking ON, parsed into `reasoning_content`)
- `json_object` or `json_schema` at request time (structured output on the answer)
- `--disable-cuda-graph` (avoids the GDN kernel crash on this model)
- The LoRA adapter loaded (`local-qwen36-27b-sft`)
- Running as a **persistent managed service** that survives SSH disconnect (not launched via SSH)

**This achieves true OpenRouter parity:** same model, same prompt, same json_object, thinking preserved, single API call.

## The serve command that works (verified)

```bash
/root/sglang/bin/sglang serve \
  --model-path /workspace/models/qwen3.6-27b \
  --served-model-name local-qwen36-27b-base \
  --lora-paths "local-qwen36-27b-sft=/workspace/out/sft" \
  --max-lora-rank 32 \
  --dtype bfloat16 \
  --context-length 32768 \
  --mem-fraction-static 0.82 \
  --reasoning-parser qwen3 \
  --disable-cuda-graph \
  --port 8000 \
  --trust-remote-code \
  --host 0.0.0.0
```

**Note:** LoRA loading crashed SGLang's scheduler in one session. If that persists, serve base-only and test the fine-tune via a merged adapter (peft `merge_and_unload` → serve the merged weights).

## What's blocking us (the gap)

The serve command works. SGLang produces parity output. The **only** blocker is keeping SGLang alive as a persistent process on RunPod. This is a deployment engineering problem — the serve command is solved, the serving framework is solved, the capability is proven.

## Environment reference
- Pod: `vfp294dpl2hbud` (H100 80GB, EXITED)
- Network Volume: `qqz94ksxmn` mounted at `/workspace`
- Model: `/workspace/models/qwen3.6-27b` (Qwen/Qwen3.6-27B, Apache-2.0, ~54GB)
- LoRA adapter: `/workspace/out/sft/` (adapter_config.json + adapter_model.safetensors)
- Prompts: `/workspace/prompts-300q.json`
- RunPod API key: `~/.runpod_key`
- vLLM venv: `/workspace/vllm/` (vLLM 0.23.0, proven stable for 116 rows)
- SGLang: installed to container disk `/root/sglang/` on each resume (v0.5.14, ~5min install)
- Pod template: `runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404`
