# Chunk 4 — SageMaker PROVISIONED via Model Customization (stopped before training)

Provision-and-stop complete. **No training launched** (Chunk 5 = owner-present).

## Path decision (corrected, doc-grounded)
- ❌ JumpStart fine-tuning — Qwen is NOT in its [fine-tune catalog](https://docs.aws.amazon.com/sagemaker/latest/dg/jumpstart-foundation-models-fine-tuning.html).
- ❌ Hand-rolled HF-DLC QLoRA job — works, but reinvents the managed flow (kept as deprecated fallback `train_sft.py`).
- ✅ **SageMaker AI Model Customization (serverless)** — purpose-built for Qwen3.6 27B
  ([AWS, May 2026](https://aws.amazon.com/about-aws/whats-new/2026/05/amazon-sagemaker-ft-qwen3-6/)); SFT + DPO + RLVR/RLAIF; auto-provisions P5/P4de/P4d/G5.

## Provisioned + verified (dry-run green)
- AWS profile `benchmark-design` (us-east-1); exec role `benchmark-design-sagemaker-exec` (verified).
- S3 `benchmark-design-sft-347011900516` (public access blocked).
- **SFT data in the customization schema `{prompt, completion}`** (converted from messages via `to_smcustomize_sft.py`):
  `s3://…/sft-1500q-v2/smc/train.jsonl` (1346) + `…/smc/val.jsonl` (148). System+user → prompt; assistant → completion.
- `sagemaker/launch.py` uses `sagemaker.train.SFTTrainer(training_type=LORA, …)`; dry-run validates role+S3+identity, does NOT launch.

## Open items before launch (Chunk 5)
1. **Exact customization model id** — placeholder `qwen3.6-27b`; confirm literal from SageMaker Studio > Models.
2. Installed `sagemaker` SDK exposes `sagemaker.train.SFTTrainer` (+ `validation_dataset`/hyperparameter kwargs).
3. One conversion assumption to verify against the SFT spec: system folded into `prompt` (the doc SFT sample had no system field).

## Bonus: Chunk 6 GRPO = RLVR (managed)
RLVR takes a **custom reward Lambda** (`custom_reward(answer, ground_truth) -> float`) — our deterministic
schema field-scorer ports directly. RLVR dataset = `{"prompt":[messages],"reward_model":{"ground_truth","style":"rule"}}`.
So SFT (Chunk 5) and GRPO/RLVR (Chunk 6) both run in this one managed flow.

## Status: Chunks 0–4 COMPLETE (path corrected to Model Customization). Stop for owner (training = Chunk 5).
