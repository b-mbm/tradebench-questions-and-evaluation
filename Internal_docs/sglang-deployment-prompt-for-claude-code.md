# PROMPT: Deploy SGLang as a persistent service on RunPod for Qwen3.6-27B

## Context
We need SGLang serving Qwen3.6-27B with structured output (json_object) + reasoning (thinking) as a **persistent managed service** on RunPod. This is the only path to OpenRouter parity for our post-training eval. vLLM cannot do this (vLLM 0.23.0 bug #43388: json_object + enable_in_reasoning produces empty content). SGLang CAN do this — it produced a verified parity result (thinking + valid nested JSON + correct schema) — but it crashes when launched via SSH because the RunPod pod kills orphaned process groups on SSH disconnect.

Read these for full context:
- `Internal_docs/delta-memo-json-parity-2026-06-28.md` (the delta from "strip the prompt" to "deploy SGLang")
- `Internal_docs/three-option-parity-results-2026-06-28.md` (all three options tested)

## The problem to solve
SGLang 0.5.14 works correctly when run in SSH foreground (loads in ~25s, serves valid requests). But it dies when:
1. SSH disconnects (RunPod kills the orphaned process group) — tried setsid, nohup, double-fork, tmux, orchestrator-as-parent. ALL fail.
2. (Sometimes) on the first json_object request (scheduler crash — may be a LoRA interaction)

## The serve command that works (verified on this model)
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
If LoRA crashes the scheduler, drop `--lora-paths` and `--max-lora-rank` (serve base-only first to validate, then solve LoRA separately).

## Access
- RunPod API key: `~/.runpod_key`
- Existing pod: `vfp294dpl2hbud` (H100 80GB, currently EXITED, network volume `qqz94ksxmn` at `/workspace` with model + LoRA + prompts + vLLM venv)
- You have full RunPod API access — you can create new pods, deploy templates, etc.
- Pod template used previously: `runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404`

## Approaches to try (in order)

### Approach 1: Custom RunPod template with startup script
Create a new pod with a startup command that launches SGLang at boot (not via SSH). RunPod supports `customEntryPoint` or you can write a startup script to `/workspace` and configure the pod to run it on start. This way SGLang is managed by the pod's init, not by an SSH session.

### Approach 2: Docker-in-Docker
Run SGLang inside a Docker container on the pod. The container's PID 1 (or a process manager like `supervisord` / `s6`) manages SGLang, isolated from the SSH session lifecycle. Install supervisord, write a config that launches SGLang, start the container.

### Approach 3: New pod with different template
The current template (`runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404`) may have aggressive orphan-kill behavior. Try a different RunPod template (e.g., a plain CUDA template, or a vLLM/SGLang-specific template if RunPod offers one) that doesn't kill background processes.

### Approach 4: RunPod Serverless
Deploy SGLang as a RunPod Serverless endpoint (not an on-demand pod). Serverless workers are designed to run a handler function persistently. This may require packaging SGLang into a worker image.

## Success criteria
1. SGLang stays alive and serving for **at least 60 minutes** without SSH connected.
2. `curl http://<pod>:8000/v1/models` returns 200 from a separate machine (not localhost).
3. Sending a request with `response_format: {"type": "json_object"}` to a Qwen3.6-27B AGI question returns: (a) populated `reasoning_content` field (thinking), (b) valid JSON in `content`, (c) nested schema survives (e.g., `allocation_usd` with venue sub-keys, not collapsed to `ExecuteOneResponse`).
4. The server survives 5+ consecutive requests without crashing.

## Test probe (run once SGLang is stable)
```python
# Send to the SGLang endpoint with json_object + the ORIGINAL prompt
# (ExecuteOneResponse intact — testing whether the model overcomes the bias via thinking)
import json, urllib.request
body = json.dumps({
    "model": "local-qwen36-27b-base",
    "messages": [system_prompt, user_prompt_for_AGI_004],
    "temperature": 0.1, "max_tokens": 16000,
    "response_format": {"type": "json_object"}
}).encode()
# PASS if: reasoning_content is non-empty AND content has allocation_usd with venue sub-keys
```

The full probe script is at `scripts/probe-parity.py` (tests L9-001, AGI-004, AGI-014).

## What NOT to do
- Do NOT strip `ExecuteOneResponse` from the prompt (breaks OpenRouter parity).
- Do NOT remove the reasoning parser (disables thinking — handicaps the model).
- Do NOT use vLLM for this (its enable_in_reasoning is broken on 0.23.0).
- Do NOT accept a no-json_object path (not parity).

## Budget
~$15-20 for pod time. SGLang install to container disk takes ~5min. Weight load takes ~25s. The model is ~54GB on the network volume at `/workspace/models/qwen3.6-27b`.
