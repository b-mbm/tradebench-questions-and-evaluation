# RunPod Post-Training Runbook — Qwen3.6-27B on our V2 set (166 → 189)

Pivot off AWS SageMaker (quota-blocked). Train + eval TEXT-ONLY. Base 166/300, target ~189.

## TL;DR
| Phase | HW | Method | Time | Cost |
|---|---|---|---|---|
| Smoke (40ex/1ep) | 1× H100 80GB | QLoRA | ~20 min | ~$1–2 |
| **Full SFT (2ep, 1855ex)** | **1× H100 80GB** | **QLoRA 4-bit** | ~1.5–3 h | ~$5–10 |
| Eval (300q, vLLM + our TS grader) | 1× H100 | bf16 TP=1 | ~30 min | ~$2 |
| GRPO/RLVR (only if SFT<189) | 2× H100 | TRL GRPO, vLLM server mode | 8–16 h | ~$50–105 |
| **Total SFT path** | | | ~half day | **~$25–32** |
| **Total + GRPO** | | | ~1.5–2 days | **~$80–145** |

Recommendation: **QLoRA SFT first** (highest ROI on 2,060 clean examples). GRPO only if SFT plateaus < 189. Skip full-FT, DPO/KTO/PPO, RLAIF, continued-pretraining, reward-modeling, distillation for this goal.

## GPU pricing (June 2026, /hr)
H100 80GB: RunPod Secure $3.29 · RunPod Community ~$1.8–2.4 · Vast $1.49–1.87 · Lambda $2.49–4.29. A100 80GB: $1.2–2.0. B200: ~$5/hr (lets you do LoRA-bf16 on one card).
- **RunPod Secure** = unattended SFT (persistent Network Volume). **Vast/Community** = smoke/eval/GRPO-gen to cut cost ~30–40%.

## VRAM (27B, text-only)
- Inference bf16 ~54GB → 1× H100 ✓. QLoRA 4-bit SFT ~30–45GB → 1× H100 comfortable ✓. LoRA bf16 SFT ~70–80GB → 1× H100 tight / 1× B200. Full FT ~430GB → 4–8× H100 (rejected).

## Stack (pin; verify on pod)
torch 2.6(cu124) · transformers 4.57.* (must have Qwen3.6 gated_delta class) · trl 0.21.* · peft 0.14.* · bitsandbytes 0.45.* · accelerate 1.4.* · vllm **≥0.19.0** · flash-attn 2.7.* · datasets 3.*
Verify: `python -c "from transformers import AutoConfig; print(AutoConfig.from_pretrained('Qwen/Qwen3.6-27B').model_type)"` and `vllm --version`. Weights: `huggingface-cli download Qwen/Qwen3.6-27B` (ungated apache-2.0, ~54GB) onto the Network Volume.

## SFT recipe (QLoRA)
r=32, alpha=64, dropout=0.05, target=all linear (q,k,v,o,gate,up,down); LR 1e-4 cosine warmup 3%; 2 epochs; max_seq 4096; per_device_bs 4 × grad_accum 8 (eff 32); grad-ckpt; bf16; paged_adamw_8bit; eval every 100 steps on the 205 val.
- **Chat template:** train with **thinking disabled** for the JSON task (grader scores final JSON; shorter/cheaper; removes a GRPO reward-hack surface). Keep a 10–15% maintenance slice (general CoT, thinking on) for anti-forgetting.
- **Completion-only loss:** mask the prompt (`assistant_only_loss=True` for messages format, or DataCollatorForCompletionOnlyLM) — verify the response template matches Qwen3.6 assistant header or masking silently no-ops.
- Anti-forgetting: LoRA + modest LR + 2 epochs + maintenance mix + **re-eval ALL tiers** vs base 166.

## Eval loop
Serve: `vllm serve <merged> --language-model-only --reasoning-parser qwen3 --max-model-len 8192 --gpu-memory-utilization 0.92` (TP=1), per-request `enable_thinking=false`, temp ~0.
**Wire OUR existing grader (it's TypeScript: `gradeSchemaResponse` in src/grading/schema-grader-300q.ts, 3936 lines — do NOT port to Python):** point `scripts/run-300q.ts` at the vLLM OpenAI endpoint (`http://<pod>:8000/v1`), grade with the existing TS path → apples-to-apples vs the 166 baseline.

## GRPO / RLVR (optional)
2× H100: GPU1 = vLLM gen server (`trl vllm-serve`), GPU0 = QLoRA GRPO from the SFT checkpoint. **Reward = our TS grader wrapped as a local HTTP service** (`POST /grade {question_id,completion}->{score}`), called from the Python reward fn (keeps the reward = the exact verifiable scorer). GRPO dataset = **trainer prompts only** (never the 300 eval rubrics). Config: num_generations 8, per_device_bs 8, LR 1e-6, beta 0 (→0.02–0.04 if drift), scale_rewards="batch", max_completion 1024, use_vllm server mode.
Guardrails: run mutation-test on the grader first; hard-0 non-parseable JSON; length/repetition penalty; KL leash if collapse; re-eval all tiers after.

## Persistence
RunPod Network Volume at /workspace (200–300GB, ~$15/mo): put HF_HOME, weights, venv, data, outputs there → survives pod death, resume_from_checkpoint. Back up the (small) LoRA adapter to S3/HF after each phase.

## Ordered runbook
1. Prep train.jsonl(1855)/val.jsonl(205) in messages format; build 10–15% maintenance mix; decide thinking off.
2. Run grader mutation-test (must pass before any RLVR).
3. RunPod pod: PyTorch 2.6/CUDA12.4 template, 1× H100 80GB Secure, attach 300GB Network Volume at /workspace.
4. Install + verify stack. 5. Download weights to volume.
6. **Smoke** (40ex/1ep) — gate: loss drops, save→merge→vLLM→grader returns scores.
7. **Full QLoRA SFT** (2ep). 8. Merge adapter, back up.
9. **Eval 300** via vLLM + TS grader; record total + per-tier vs 166.
10. ≥189 → ship. <189 climbing → 3rd epoch / rank sweep. <189 plateaued → GRPO.
11. **GRPO** (if needed) from SFT ckpt. 12. Final all-tier eval. 13. Pull adapter off, update records, tear down (keep volume if iterating).

## Surface area now open (raw GPU) — prioritized: DO QLoRA SFT → (if<189) GRPO → (if regressions) model-merge. SKIP full-FT / DPO / KTO / PPO / RLAIF / continued-pretrain / reward-model / distillation for the 166→189 goal.
