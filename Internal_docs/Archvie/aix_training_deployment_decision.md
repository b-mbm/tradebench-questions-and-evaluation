# AIX Trading LLM — Training & Deployment Decision Memo

**Date:** June 15, 2026
**Author:** Bradley + Perplexity Computer (research)
**Status:** Draft for cross-agent review
**Context:** Certified 600-example SFT dataset is committed at https://github.com/b-mbm/tradebench-lite-tests (branch `sft/solvability-council-v4`, commit `9c236dd`). 600/600 Codex A+B PASS, 600/600 traces validating. Tier-stratified across L1-L10 + AGI. Ready for post-training. Decision required: **what open-weight model to post-train, on which platform, and where to serve it long-term.**

---

## Goal hierarchy (non-negotiables)

1. **Show investors a state-of-the-art frontier model for trading.** Pass@1 on internal eval + leaderboard credibility.
2. **Deploy publicly to 1K → 10K → 100K users via a hosted endpoint.** Not self-hosted. Not on a personal machine.
3. **Cap monthly serving floor at $3,000/mo.** No paying for idle GPUs at investor-demo phase.
4. **Training is not the constraint.** A 27B model post-trains in 8-12 hours on a single H100 for $10-20. The hard problem is serving.

## Model choice — the two viable open-weight candidates

| Model | Release | Pass@1 (300-q public leaderboard) | Open weight? | Apache 2.0 |
|---|---|---|---|---|
| **Qwen3.6-27B** (dense) | Apr 22, 2026 | 55.3% (rank #4 overall, #1 open) | ✅ | ✅ |
| **Qwen3.5-27B** (dense) | Older | 51.0% (rank #13) | ✅ | ✅ |

Gap is **4.3 Pass@1 points** on a public code benchmark. This is meaningful but not deterministic — it's measured on general code, not the AIX trading domain. A well-targeted SFT on 3.5-27B should close most of this gap on the trading benchmark specifically.

## Serving-mode taxonomy (the actual decision driver)

Four serving modes exist; only modes 1 and 2 satisfy the $3K floor:

1. **Public serverless (base model only)** — pay-per-token, platform's untouched model. Cheap but useless for our fine-tune.
2. **Serverless LoRA / serverless fine-tuned** — upload your adapter, pay per-token. **The unicorn mode.**
3. **Dedicated managed** — platform hosts your fine-tune on dedicated GPU; ~$2K-5K/mo per replica regardless of usage. Exceeds floor.
4. **Self-managed dedicated** — RunPod/Modal/Lambda + your vLLM commands. Cheapest GPU-hours; manual ops. User excludes this option.

## Exhaustive platform survey (June 15, 2026)

### Qwen3.6-27B options

| Platform | Fine-tune support | Serve fine-tuned? | Mode | Notes & sources |
|---|---|---|---|---|
| **AWS SageMaker AI** | ✅ Serverless SFT + RFT | ✅ Serverless | Mode 2 | [Announcement May 14, 2026](https://aws.amazon.com/about-aws/whats-new/2026/05/amazon-sagemaker-ft-qwen3-6/). Available in us-east-1, us-west-2, ap-northeast-1, eu-west-1. |
| **Fireworks AI** | ✅ LoRA SFT+DPO, 128K/256K ctx | ✅ Dedicated only | Mode 3 | [Docs](https://docs.fireworks.ai/fine-tuning/fine-tuning-models): "On-demand (dedicated) deployment is the only supported method for serving fine-tuned models." |
| **Baseten** | ❌ no platform FT | ✅ if BYO weights | Mode 3 | [Qwen3.6-27B recipe](https://docs.baseten.co/examples/models/llm/qwen3.6) on H100:4. Dedicated only. |
| **Predibase** | ✅ likely (needs base check) | ✅ | Mode 3 | [Pricing](https://predibase.com/pricing). L40S/A100 GPU-hour. Also does GRPO/RFT. |
| **Modal** | ❌ (you bring weights) | ✅ if BYO weights | Mode 3, per-second | $3.95/H100-hr metered/sec. Per-second billing makes bursty traffic cheap. |
| **DeepInfra** | ❌ base only | ❌ | — | [Lists Qwen3.6-27B base](https://deepinfra.com/Qwen/Qwen3.6-27B) at $0.32/$3.20 per 1M tokens. No FT serving. |
| **Novita AI** | ❌ base only | ❌ | — | $0.60/$3.60 per 1M base only. |
| **Together AI** | ❌ Qwen3.6-27B NOT on FT list | ❌ | — | [FT list](https://docs.together.ai/docs/fine-tuning-models) has Qwen3.5-27B and Qwen3.6-35B-A3B MoE, NOT Qwen3.6-27B dense. |
| **Nebius Token Factory** | ⚠️ Qwen3.6-27B not confirmed | ⚠️ on-request hosting | — | Auto-hosts a limited subset; Qwen3.6-27B not on confirmed list. |
| **Hyperbolic / OpenPipe / Anyscale** | ❌ Qwen3.6-27B not on lists | ❌ | — | None list Qwen3.6-27B on FT or hosted-FT serving. |
| **OpenRouter** | ❌ (router, not host) | Beta: private models route to your own backend | — | Doesn't host. Routes to whatever you deploy elsewhere. |

### Qwen3.5-27B options

| Platform | Fine-tune support | Serve fine-tuned? | Mode | Notes & sources |
|---|---|---|---|---|
| **Together AI** | ✅ LoRA + Full FT | ✅ Serverless LoRA | **Mode 2** | [Confirmed on FT list](https://docs.together.ai/docs/fine-tuning-models). [Serverless multi-LoRA](https://www.together.ai/blog/serverless-multi-lora-fine-tune-and-deploy-hundreds-of-adapters-for-model-customization-at-scale): upload adapter, pay base-model per-token rate. |
| **Fireworks AI** | ✅ LoRA | ✅ Dedicated only | Mode 3 | Same constraint as 3.6-27B. |
| **AWS SageMaker** | Likely (Qwen3.5 family) | ✅ Serverless | Mode 2 | Less explicitly announced than 3.6-27B but consistent with Bedrock/SageMaker support model. |
| **Baseten** | ❌ no platform FT | ✅ if BYO weights | Mode 3 | H100 $0.10833/min = $6.50/hr. |
| **Predibase** | ✅ | ✅ | Mode 3 | Per-GPU-hr. |

---

## Cost matrix (per month USD)

Assumptions: average request = 1000 input + 500 output tokens. SFT training cost is ~one-time ($5-20). All serving numbers are **steady-state monthly**.

| Path | Mode | Demo phase (1.5M in / 750K out) | 1K users (5M / 2.5M) | 10K users (50M / 25M) | 100K users (500M / 250M) |
|---|---|---|---|---|---|
| **Qwen3.6-27B → SageMaker serverless** (est. $3.50 in / $10 out) | Mode 2 ✅ | **~$13** | **~$43** | **~$425** | **~$4,250** |
| Qwen3.6-27B → Fireworks dedicated (1× H100 @ $5.80/hr) | Mode 3 | $4,234 | $4,234 | $4,234 | $4,234+ |
| Qwen3.6-27B → Baseten dedicated (1× H100 @ $6.50/hr) | Mode 3 | $4,745 | $4,745 | $4,745 | $4,745+ |
| Qwen3.6-27B → Predibase L40S (Qwen3.6-27B FP8 fits tight) | Mode 3 | $2,336 | $2,336 | $2,336 | $2,336+ |
| Qwen3.6-27B → Modal per-second H100 | Mode 3, metered | ~$100-300 | ~$300-800 | ~$1,500-3,000 | $3,000+ |
| **Qwen3.5-27B → Together serverless LoRA** ($0.80 in / $0.80 out) | **Mode 2 ✅** | **~$2** | **~$6** | **~$60** | **~$600** |
| Qwen3.5-27B → SageMaker serverless | Mode 2 | ~$13 | ~$43 | ~$425 | ~$4,250 |
| Qwen3.5-27B → Fireworks dedicated | Mode 3 | $4,234 | $4,234 | $4,234 | $4,234+ |

Quarterly = ×3. Yearly = ×12.

**At 10K users / year:**
- Qwen3.5-27B on Together: **~$720/yr**
- Qwen3.6-27B on SageMaker: **~$5,100/yr**
- Either on Fireworks dedicated: **~$50,800/yr**
- Either on Baseten: **~$56,940/yr**

**At 100K users / year:**
- Qwen3.5-27B on Together: **~$7,200/yr**
- Qwen3.6-27B on SageMaker: **~$51,000/yr** (and may need provisioned concurrency, adding cost)
- Fireworks scaled to 4 replicas: **~$200K+/yr**

---

## Recommendation: Train and serve Qwen3.5-27B on Together AI

### Why

1. **Single-platform simplicity.** Together handles training, serverless LoRA serving, billing, monitoring, autoscaling. POST dataset → get model ID → hit endpoint. Karpathy's "Simplicity First" principle in action.
2. **Serverless LoRA serving is the only mode under $3K/mo floor that's hands-off.** SageMaker is the alternative for Qwen3.6-27B, but it carries AWS/IAM/Studio operational tax and ~7× the per-token cost.
3. **The 4.3 Pass@1 gap is closeable with targeted SFT.** Our 600-example, tier-stratified, council-certified dataset with reasoning traces is purpose-built for the trading benchmark. Generic code-benchmark deltas don't predict domain-specific outcomes after good SFT.
4. **Together exports weights.** If we later need to migrate (Modal, SageMaker, RunPod), the LoRA adapter is portable.
5. **At 100K users we're at $600/mo, not $4,250/mo.** That's a real difference for a startup.

### Training pipeline (Together)

- Upload `all.jsonl` (600 examples + reasoning traces) as training file
- Base model: `Qwen/Qwen3.5-27B`
- Method: LoRA SFT (rank 16, alpha 32, dropout 0.05) — adjustable
- Cost estimate: 600 × 2000 tokens × 3 epochs = 3.6M training tokens × $1.50/M = **~$5.40 for SFT**
- Time estimate: 4-8 hours on Together's training infra
- Output: downloadable LoRA adapter + Together-hosted serverless endpoint

### Serving pipeline (Together)

- Adapter served via Together's serverless LoRA endpoint
- Pay base-model per-token rate, no cold start
- Autoscaling handled by Together
- OpenAI-compatible API → direct OpenRouter integration possible later

### Reserved options for upgrade path

- **If eval shows 3.5-27B can't close the gap on trading:** retrain on Qwen3.6-27B via SageMaker serverless. Same dataset, different base, ~$5/mo at demo phase.
- **GRPO/reward-based post-SFT refinement:** Predibase (their specialty), running on top of either base. Predibase pricing $0.50/M tokens for ≤16B and $3.00/M for 16B-80B band, so a GRPO run on 600 prompts × 4 generations × 2K tokens ≈ 4.8M tokens × $3 = ~$15.
- **High-traffic graduation:** if usage crosses ~50M tokens/mo sustained, evaluate Fireworks dedicated economics vs. Together serverless on a price-per-million basis. The cross-over point is ~$4,000/mo of serverless usage = ~3.3B tokens/mo, very far away.

---

## Alternative for review: Qwen3.6-27B on AWS SageMaker

Choose this if:
- Investor optics demand "trained on Qwen3.6, the SOTA open weight" as a headline
- Internal eval shows 3.5-27B post-trained still loses to 3.6-27B base on trading prompts
- Willing to absorb 7× per-token serving cost vs Together at scale
- Comfortable with AWS billing/IAM/Studio surface area

Pipeline:
- Fine-tune via SageMaker Studio → serverless customization → SFT (or RFT later)
- Serve via SageMaker Serverless Inference endpoint (pay per-millisecond inference duration + memory tier)
- Estimated $13-425/mo from demo through 10K users; scales to $4-5K/mo at 100K users
- Weight portability: yes, SageMaker custom-model artifacts are S3-stored

---

## Rejected options

| Option | Why rejected |
|---|---|
| Fireworks dedicated | $4,234/mo floor — violates $3K cap. |
| Baseten dedicated | $4,745/mo floor — violates cap. Highest GPU-hour rate on market. |
| Self-host (Modal/RunPod/Lambda) | User explicitly excluded. Also requires vLLM/SGLang ops burden. |
| DeepInfra/Novita base only | They don't serve custom fine-tunes. |
| Qwen3.6-35B-A3B (MoE) on Together | 49.3% Pass@1 — *worse* than Qwen3.5-27B's 51.0%. No reason to pick. |

---

## Open questions / verification needed before commit

1. ✅ Together supports Qwen3.5-27B LoRA SFT — confirmed on docs.
2. ✅ Together serverless LoRA accepts BYO adapters — confirmed (blog post + docs).
3. ⚠️ **Confirm Qwen3.5-27B is on Together's serverless LoRA inference list specifically** — the FT list and serverless LoRA list are different and not all FT bases are serverless-LoRA-eligible. Action: check Together's LoRA inference page or contact support.
4. ⚠️ Fireworks Qwen3.6-27B weight export policy — pending support email (drafted separately).
5. ⚠️ SageMaker Qwen3.6-27B serverless inference price — only AWS console can confirm exact rate; my estimate of $3.50/$10 per 1M may shift the matrix by ±50%.

---

## Final decision (proposed)

**Primary path:** Qwen3.5-27B → fine-tune on Together AI → serve via Together serverless LoRA.
**Estimated all-in year-1 cost:** $5 training + $720 serving at 10K users = **~$725 first year**.

**Fallback path:** Qwen3.6-27B → fine-tune and serve on AWS SageMaker AI serverless.
**Estimated all-in year-1 cost:** $10-20 training + ~$5,100 serving at 10K users = **~$5,120 first year**.

**Decision criterion between them:** Run head-to-head eval. Fine-tune 3.5-27B on Together first (it's the cheaper experiment). If trading-benchmark Pass@1 meets target (e.g., ≥85% of off-the-shelf Qwen3.6-27B's score on internal eval), commit to Together. If not, fall back to SageMaker + Qwen3.6-27B.

---

## Sources

- [Together fine-tuning models docs](https://docs.together.ai/docs/fine-tuning-models)
- [Together pricing](https://www.together.ai/pricing)
- [Together serverless multi-LoRA blog](https://www.together.ai/blog/serverless-multi-lora-fine-tune-and-deploy-hundreds-of-adapters-for-model-customization-at-scale)
- [Fireworks fine-tuning docs](https://docs.fireworks.ai/fine-tuning/fine-tuning-models)
- [Fireworks Qwen3.6-27B model page](https://fireworks.ai/models/fireworks/qwen3p6-27b)
- [AWS SageMaker Qwen3.6 announcement](https://aws.amazon.com/about-aws/whats-new/2026/05/amazon-sagemaker-ft-qwen3-6/)
- [Baseten pricing](https://www.baseten.co/pricing/)
- [Baseten Qwen3.6 recipe](https://docs.baseten.co/examples/models/llm/qwen3.6)
- [Predibase pricing](https://predibase.com/pricing)
- [DeepInfra Qwen3.6-27B](https://deepinfra.com/Qwen/Qwen3.6-27B)
- [SageMaker serverless pricing context](https://checkthat.ai/brands/amazon-sagemaker/pricing)
