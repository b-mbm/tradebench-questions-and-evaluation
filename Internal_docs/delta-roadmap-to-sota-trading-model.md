# Delta Roadmap → State-of-the-Art Trading Model

**Mission:** a specialist **Qwen3.6-27B** trading model that beats the strongest frontier baseline by ~20%
relative → **~189/300** on the TradeBench/CoinBench 300-question benchmark (base 27B = **166/300**). The
artifact behind the raise + the "frontier lab building the world's best trading model" identity.

## Where we are (2026-06-21)
- **V2 SFT set BUILT + gated + Codex GO.** `tradebench-lite-tests` branch `v2-failure-mode-build`:
  - `training/sft-1500q-v2/{train,val}.jsonl` = **1,855 / 205** (messages format) ; `…/smc/{train,val}.jsonl` = same in `{prompt,completion}`.
  - 2,060 total; gates clean: 0 reskins, 0 verbatim eval, 0 chosen_strategy leak, 0 undeclared fields, max-cos 0.597, label-correct-by-construction. Codex re-audit = **GO**.
- **AWS SageMaker ABANDONED** — every GPU quota = 0 (customization-serverless + all training instances), increase went to a support case (Basic plan, slow). Pivoted to RunPod.
- **RunPod pod LIVE.** Pod `z1n9i3xz6jxdf1`, **1× H100 80GB**, template PyTorch 2.8 (CUDA 12.8), region **US-MO-1**, network volume **`tradebench`** (200GB) mounted at `/workspace`.
  - SSH (supports SCP): `ssh root@64.247.201.49 -p 15066 -i ~/.ssh/id_ed25519`
  - RunPod API key stored at `~/.runpod_key` (chmod 600, NOT in repo). **Rotate after the run** (it was pasted in chat).
  - Billing: $3.29/hr only while RUNNING; ~$25 credit loaded; STOP (not delete) to pause cheaply, volume persists.

## The autonomous run (self-terminating, owner approved, deterministic)
Sequence (any failure → STOP pod + report; runtime guard ~5–6h; **NO GRPO autonomously**):
1. **Setup** — install stack on `/workspace` (transformers, trl, peft, bitsandbytes, accelerate, vllm, flash-attn).
2. **Download + VERIFY model with evidence** — `qwen/qwen3.6-27b` (= SageMaker `huggingface-vlm-qwen3-6-27b`, the same weights that scored 166). Assert param count ≈27B + config before training. Wrong model → STOP.
3. **Smoke (40 ex, 1 epoch) + self-validate** — train, then generate on a few val rows and assert outputs are valid JSON with expected keys (not just loss-drop). Smoke fail/invalid → STOP.
4. **Full SFT — 2 epochs** QLoRA (r=32, alpha=64, all-linear, LR 1e-4, seq 4096, completion-only via messages + chat template). 3rd epoch only if val still improving. Crash → STOP.
5. **Save adapter** to `/workspace/out` + back up.
6. **STOP pod** (Mac-side watcher auto-stops via the API key on DONE/FAILED) + report.
- **EVAL is the next DRIVEN step** (not in the fire-and-forget): serve tuned model with vLLM, point `scripts/run-300q.ts` at it, grade with the TS `gradeSchemaResponse` → 166 → X. Anti-forgetting: re-eval ALL tiers.

## Cost basis
Setup+smoke ~$2–3 · full SFT ~$5–10 · eval ~$2–3 → **SFT path ~$12–16** (within $25). GRPO later ~$50–105 (needs more credit + owner go).

## After SFT (driven)
- **Eval** → decision: ≥189 ship; else 3rd epoch / rank sweep; else **GRPO/RLVR** (Chunk 6): TRL GRPOTrainer, 2× H100, our TS grader wrapped as an HTTP reward service (verifiable reward) on item-disjoint trainer prompts. Guardrails: mutation-test reward, format gate, KL leash, re-eval all tiers.
- **Tranche 2** (after the win): loosen the **18 exact-label-gated AGI rows** (semantic match) → fairer benchmark; SFT/GRPO round 2.

## Open owner decisions (non-blocking)
1. Defer L5-001/L5-002/L7-001 benchmark repairs to Tranche 2? (rec: yes — fixing raises competitors)
2. Keep L9-043 fix? (rec: keep — integrity, negligible uplift)

## Key refs
- Runbook: `Internal_docs/runpod-posttraining-runbook.md`. Codex audit metaprompt: `Internal_docs/codex-v2-audit-METAPROMPT.md`. Skill: `Internal_docs/benchmark-design-first-principles.md` (+ `~/.claude/skills/benchmark-design/SKILL.md`).
- Grader: `tradebench-questions-and-evaluation/src/grading/schema-grader-300q.ts` (`gradeSchemaResponse`, TS — wrap as HTTP for GRPO; never port).
- Repos: lite-tests `v2-failure-mode-build` (data+generators), questions `codex-work` (eval+docs). Canonical 600 read-only @ pinned 5c4e679.
- Exact-label-gated AGI list: `Internal_docs/tranche2-exact-label-gated-agi.md` (18 rows).
- Memory: `~/.claude/.../memory/v3-greedy-training-strategy.md`.
