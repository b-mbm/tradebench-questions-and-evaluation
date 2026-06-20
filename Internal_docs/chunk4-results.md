# Chunk 4 — SageMaker PROVISIONED (stopped before training)

Provision-and-stop complete. **No training launched** (Chunk 5 = owner-present, incurs spend).

## Provisioned + verified (dry-run green)
- **AWS:** profile `benchmark-design`, us-east-1, identity `arn:aws:iam::347011900516:user/benchmark-design`
- **Exec role:** `arn:aws:iam::347011900516:role/benchmark-design-sagemaker-exec` (verified present)
- **S3 bucket:** `benchmark-design-sft-347011900516` (created; public access blocked)
- **Data uploaded (meta-stripped → messages only):**
  - `s3://.../sft-1500q-v2/train.jsonl` — 1346 rows / 3.17 MB
  - `s3://.../sft-1500q-v2/val.jsonl` — 148 rows / 363 KB
- **Code (in lite-tests `sagemaker/`):** `train_sft.py` (QLoRA SFT entry, anti-forgetting defaults:
  LoRA r16, lr 1e-4, 2 epochs), `launch.py` (dry-run default / `--launch` to spend), `requirements.txt`, `README.md`
- **Dry-run:** `python3 launch.py` → role OK, both S3 inputs OK, identity OK, **"NOT launching (no spend)"**.

## Owner checklist before `python3 launch.py --launch` (Chunk 5)
1. Confirm exact base-model HF repo id (placeholder `Qwen/Qwen3.6-27B`).
2. Pick instance (default `ml.g5.12xlarge` QLoRA; `p4d.24xlarge` for speed) + confirm SageMaker quota.
3. Confirm HuggingFace DLC versions available in us-east-1.
Then re-eval ALL tiers after training (anti-forgetting) vs clean 27B base → GRPO round 1.

## Status: Chunks 0–4 COMPLETE. Stop here for owner (training = Chunk 5).
Open owner decisions (non-blocking, from Chunk 1): defer L5-001/L5-002/L7-001 repairs to Tranche 2?
keep L9-043 fixed? — see chunk1-repair-decisions.md.
