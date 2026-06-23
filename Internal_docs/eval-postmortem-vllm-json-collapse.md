# Eval Post-Mortem: the 38/300 was a vLLM `json_object` artifact, not a failed fine-tune

**Date:** 2026-06-23 · **Status:** RESOLVED (root cause found); the true fine-tune effect is still UNMEASURED (needs a no-json run).

## TL;DR
We fine-tuned Qwen3.6-27B (LoRA, 2 epochs, RunPod H100) and evaluated it on the 300Q schema benchmark. It scored **38/300** on our RunPod/vLLM stack vs the official OpenRouter base **164/300** (166 in the final archive). After a disciplined controlled investigation we proved:

- **The fine-tune is NOT the cause.** Base ≈ tuned on our stack everywhere.
- **38/300 was a serving artifact:** vLLM's `json_object` (xgrammar guided decoding) **collapsed the model's output to a generic execution schema** on the hard tiers (L9/L10/AGI), for base AND tuned alike.
- **Without `json_object`, the model reasons correctly and emits the question-specific schema** (proven by direct probe: L9-002 computed the right answer, "$2M × 0.003 = $6,000 fees, 59% liquidity share").
- We have **not yet measured the fine-tune's true effect** — that needs a proper no-json base-vs-tuned run. The path is clear.

## What we were measuring
Tuned vs base on the 300Q, **strict `grade.pass` count**, vs official `qwen/qwen3.6-27b` = **164** (exact OpenRouter run) / **166** (final archive). Baseline config: OpenRouter, temp 0.1, max_tokens 2200, retries 2, `response_format: json_object`.

## Timeline (what happened)
1. **Offline pipeline** (`runpod/gen-300q.py`, transformers): protocol mismatch — no JSON mode, thinking leakage, greedy decode, parser salvage. Scrapped per Codex audit. Useful only as a probe.
2. **Pivot to vLLM serving** (Codex's call) — correct.
3. **vLLM serve gauntlet** (brand-new arch on a slow network volume; each blocker hidden behind the last, each needing a reload):
   - case-sensitive id → `Qwen/Qwen3.6-27B`
   - `huggingface-cli` removed in hub 1.20 → `snapshot_download`
   - stop/resume wipes container-disk pip → venv on `/workspace`
   - arch is a VLM (`Qwen3_5ForConditionalGeneration`) → load text-only (`language_model_only` / `AutoModelForCausalLM`)
   - **ninja** missing (gated-delta-net kernel JIT) → symlink `/workspace/vllm/bin/ninja` → `/usr/local/bin/ninja`
   - `max_num_seqs` > Mamba cache blocks → `--max-num-seqs 256`
   - LoRA rank 32 > default 16 → `--max-lora-rank 32`
   - **CUDA graph capture hangs intermittently** → `--enforce-eager` (the big one — caused two "all connection errors" dirty runs)
4. **Tuned full-300:** 38/300 (dirty: 18 blank AGI rows). Alarming but uninterpretable.
5. **My auto-stop clipped the base control** (GPU-idle governor stopped the pod between the tuned run and the base run).
6. **Base-control gate (29 stratified, official-passed):** BASE **8/29**, TUNED **9/29**, OFFICIAL **26/29**. Easy non-AGI reproduced 7/7; L9/L10/AGI collapsed. → decision-table cell: *"local base ≪ official base, tuned ≈ local base → stack/checkpoint mismatch; training inconclusive."*
7. **No-json A/B:** dirty (serve hung in graph capture → 32/32 connection errors).
8. **Controlled no-json probe** (direct curl on the pod, `--enforce-eager`): L9-002/L10-001/AGI-004 → **question-specific schema + correct reasoning.** RESOLVED.

## Root cause
vLLM `json_object` (xgrammar guided decoding) over-constrains this model: it satisfies "valid JSON" with a minimal/**generic execution schema** (`intent/order_type/asset/size/venue/...`) instead of the **question-specific** schema the hard tiers require (`chosen_strategy`, `execution_sequence`, `half_spread_bps`, nested `shorts`, etc.) → structural fail before numbers are even checked. **OpenRouter's `json_object` is looser** and produced the right schema (→164/166). The 38-vs-164 gap was serving stacks, not models.

Evidence (direct probe, base model, `RESPONSE_FORMAT=none`):
- L9-002: finish=stop, len 4648, GENERIC=False, **SPECIFIC=True**, math correct ($6,000).
- L10-001: SPECIFIC=True (truncated at 3000 — reasoning is long).
- AGI-004: SPECIFIC=True (truncated at 3000).
- Value-check under json_object earlier: only **23%** of expected AGI values appeared anywhere → confirms the json_object output was genuinely wrong, not just mis-shaped.

## Working vLLM serve recipe (this model, RunPod H100)
```
/workspace/vllm/bin/vllm serve /workspace/models/qwen3.6-27b \
  --served-model-name local-qwen36-27b-base \
  --enable-lora --lora-modules local-qwen36-27b-sft=/workspace/out/sft \
  --max-lora-rank 32 --max-num-seqs 256 \
  --dtype bfloat16 --max-model-len 8192 --gpu-memory-utilization 0.90 \
  --enforce-eager --port 8000 --trust-remote-code
```
Plus: `ln -sf /workspace/vllm/bin/ninja /usr/local/bin/ninja` before serving; fully free GPU between serves (`pkill -9 python`, then poll `nvidia-smi` until used < 3 GB, else the next serve hits "Free memory < utilization"). Startup with `--enforce-eager` ≈ 2-3 min; without it, the graph-capture step can hang indefinitely.

## Apples-to-apples caveat (important)
OpenRouter `json_object` ≠ vLLM xgrammar `json_object`. A **no-json local eval gives the valid base-vs-tuned causal delta** (both on identical serving) but is **NOT directly leaderboard-comparable to 166** unless we replicate OpenRouter's serving. Per the skill: *"local causal lift, not leaderboard-comparable yet."*

## Process mistakes (own them → fix next time)
- Acted on ambiguous go-aheads → fired the pod prematurely twice.
- GPU-idle auto-stop **clipped the base control** (the one run that makes everything interpretable).
- Overclaimed "the fine-tune is intact" before the control existed (conceded; n=4 smoke ≠ proof).
- Stopped the pod once before reading the crash log (recovered: log persists on the volume).
- Repeatedly under-estimated timing → now front-load ETAs.

**Cardinal lesson (benchmark-runner-design skill):** *Never interpret a model delta until the control model reproduces on the same stack.* Run **local base full** before reading any tuned number, and make the smoke include the hard tiers, not just easy rows.

## Validated vs Unknown
- **Validated:** FT not the cause; json_object/xgrammar collapses the schema; model is genuinely capable (correct reasoning); the serve recipe; `--enforce-eager` is required.
- **Unknown:** the FT's true effect (need no-json base-vs-tuned); the model's real 300Q score under correct serving; whether 166 is reproducible on our stack at all.

## Next steps (when credit is topped up)
1. Top up RunPod (~$10–20; balance is $0.38).
2. Serve with the recipe above (`--enforce-eager`).
3. Eval **base + tuned**, `LMSTUDIO_RESPONSE_FORMAT=none`, **max_tokens ~6000** (reasoning is long; 3000 truncated L10/AGI), with the runner **extracting the final JSON from the reasoning** (salvage parse). Hard-tier subset first → the causal fine-tune delta.
4. Decide whether to chase 166-comparability (match OpenRouter serving) or accept the local causal metric.

## Cost accounting
~$45 total credit ($25 initial + $20 top-up), spent to $0.38. Breakdown (approx): 54 GB model download + SFT training (~$9) + **eval infra debugging (the serve gauntlet, hung serves, dirty runs, the `--enforce-eager` discovery) — the bulk.** Next time the recipe is known, so eval cost should be ~$3–5, not ~$30.
