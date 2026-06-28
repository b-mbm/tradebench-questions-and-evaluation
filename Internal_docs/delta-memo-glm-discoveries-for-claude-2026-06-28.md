# Delta Memo: How We Solved json_object Parity for Qwen3.6-27B (GLM's Discoveries)

**Date:** 2026-06-28 · **Author:** GLM (ZCode agent) · **For:** Claude Code context/memory

---

## The arc, in one paragraph

We spent days trying to make Qwen3.6-27B produce valid structured JSON (json_object) with thinking enabled on RunPod, to match how OpenRouter serves the model. The root cause was NOT what we initially thought (the ExecuteOneResponse prompt interface — that was a symptom, not the disease). The actual root cause was a **missing build tool (`ninja`)** that both vLLM and SGLang need for JIT-compiling Triton kernels for Qwen3.6's hybrid Gated DeltaNet architecture. Without `ninja` on PATH, the serving framework crashes on the first inference request. The fix is one symlink. Combined with Claude Code's container-start-command deployment (which solved the SSH-detachment problem), SGLang now achieves true OpenRouter parity.

---

## What I figured out, and how

### Discovery 1: The "json_object collapse" is NOT a single bug — it's three compounding problems

**How I found it:** Empirical A/B testing on the pod. I ran AGI-004 under four configurations, changing one variable at a time:

| Config | Result | What it proved |
|---|---|---|
| `json_object` + `--reasoning-parser qwen3` (original) | **Collapsed** to ExecuteOneResponse shape | The reasoning parser + grammar conflict (vLLM #18819) |
| `json_object` + no reasoning parser | **Collapsed** still — keys = literally the ExecuteOneResponse interface | The system prompt's TypeScript interface biases xgrammar |
| `json_object` + stripped prompt + no reasoning parser | **Nested schema survived** | But thinking was silently disabled |
| No `json_object` at all (thinking freely) | **Nested schema survived + thinking preserved** | The model follows instructions naturally |

**The lesson:** `json_object` was causing BOTH the schema collapse AND the thinking suppression. The model doesn't need a grammar constraint to produce JSON — it's instruction-tuned and does so naturally. But OpenRouter uses `json_object` and gets better results, so we need parity with THAT mechanism, not just "any path that produces JSON."

### Discovery 2: vLLM's `enable_in_reasoning=True` is broken on 0.23.0

**How I found it:** Read the vLLM docs, found the flag, deployed it, sent a request. The model "thought" (consumed reasoning tokens) but returned `content: None`. Empty output.

**Root cause:** vLLM issue #43388 — the json_object grammar constraint is not enforced after the `</think>` token with async scheduling. The flag exists but the implementation doesn't work for this model/version.

**The lesson:** vLLM 0.23.0 cannot do json_object + thinking together. Dead end. This eliminated Option 1.

### Discovery 3: SGLang achieves true parity (when it stays alive)

**How I found it:** Installed SGLang 0.5.14, served with `--reasoning-parser qwen3 --disable-cuda-graph`, sent a json_object request to L9-001. Got back: populated `reasoning_content` (real thinking) + valid JSON in `content` + correct schema (`expected_value: 18.615`).

**The lesson:** SGLang is the right framework. It's Qwen's officially recommended serving framework, handles reasoning + structured output natively, and produces the parity result.

### Discovery 4: SGLang dies when SSH disconnects (the detachment problem)

**How I found it:** 8 launch attempts across two sessions — setsid, nohup, double-fork daemon, tmux, orchestrator-as-parent, foreground-with-background-child. ALL failed when SSH disconnected. The RunPod pod template kills orphaned process groups.

**The lesson:** I could NOT solve this. Claude Code solved it by launching SGLang as the **container start-command** (`dockerArgs`), making it a child of PID 1 instead of an SSH session. That was the infra breakthrough I couldn't get to.

### Discovery 5 (THE FIX): The request-time crash is `ninja` not on PATH

**How I found it:** Claude Code handed off saying SGLang serves `/v1/models` but crashes on the first `POST /v1/chat/completions`. I deployed a plain debug pod (no dockerArgs → working SSH), read `/workspace/sglang-serve.log`, and found:

```
File "/root/sglang/lib/python3.12/site-packages/sglang/srt/layers/activation.py", line 106, in forward_cuda
    [Triton JIT compilation]
FileNotFoundError: [Errno 2] No such file or directory: 'ninja'
```

The Qwen3.6 hybrid GDN architecture requires Triton kernel JIT compilation on the first forward pass. That compilation calls `ninja` as a subprocess build tool. SGLang's pip install put `ninja` in `/root/sglang/bin/` but the scheduler subprocess didn't have it on PATH.

**This is the same bug that crashed vLLM.** I had already fixed it for vLLM (with `ln -sf /workspace/vllm/bin/ninja /usr/local/bin/ninja`) but didn't realize SGLang would hit the identical issue.

**The fix:** One symlink in the startup script:
```bash
ln -sf /workspace/vllm/bin/ninja /usr/local/bin/ninja
export PATH="/usr/local/bin:/root/sglang/bin:$PATH"
```

### Discovery 6: The RunPod HTTP proxy times out at ~120s for non-streaming requests

**How I found it:** AGI-004 and AGI-014 returned HTTP 524 (Cloudflare timeout) on non-streaming requests. The model generates 11,000+ chars of reasoning (300-400s), but the proxy cuts the connection at ~120s.

**The fix:** Use `"stream": true` for any request expecting >120s generation. Streaming keeps the connection alive with incremental chunks.

---

## What I got wrong (honest accounting)

1. **I initially called the no-reasoning-parser fix "solved" / "parity."** It wasn't — it silently disabled thinking. The user caught this. I corrected it.
2. **I attributed the 7.5-point score gap (19 vs 26) to "ExecuteOneResponse bias" without proof.** The gap could equally be the "fill in the blank" advantage of json_object. I was too quick to explain it away.
3. **I couldn't solve the SSH detachment problem.** Claude Code did, with the container-start-command approach. I tried 8 different detachment methods and all failed.
4. **I didn't realize SGLang would hit the same `ninja` bug as vLLM.** I should have checked PATH for ninja before assuming the request crash was a deeper SGLang/model issue.

---

## The verified serve command (the one that produces parity)

```bash
sglang serve \
  --model-path /workspace/models/qwen3.6-27b \
  --served-model-name local-qwen36-27b-base \
  --dtype bfloat16 \
  --context-length 32768 \
  --mem-fraction-static 0.82 \
  --reasoning-parser qwen3 \
  --disable-cuda-graph \
  --port 8000 \
  --trust-remote-code \
  --host 0.0.0.0
```

**Critical:** `ninja` must be on PATH (`ln -sf /workspace/vllm/bin/ninja /usr/local/bin/ninja`). Without it, the first request crashes the scheduler.

**For requests:** use `"stream": true` + 600s timeout for any question expecting >120s generation (AGI questions generate 11k+ reasoning chars).

---

## What's still open

1. **Tier 2 reliability (29Q)** — not run. Need to verify SGLang handles 29 consecutive hard-tier questions.
2. **LoRA adapter** — not loaded yet. Base-only serving is proven. LoRA crashed before the ninja fix; may now work.
3. **Score comparison** — whether json_object + thinking produces better SCORES than the no-json path (19/29). The plumbing is fixed; the capability question is open.
4. **AGI-004 Ethena=0** — the model still allocates zero to Ethena even with thinking + json_object. This is a genuine model reasoning gap, not a harness artifact. Only fine-tuning will fix it.
