# AIX trading model, post-training and deployment decision (final)

**Date:** June 15, 2026
**Status:** Supersedes all prior drafts including the Perplexity memo. This is the source of truth.
**Scope:** Where to post-train a custom Qwen3.5-27B / Qwen3.6-27B / Qwen3.5-9B, and where to deploy the post-trained variants cheaply and always-on. Post-training is the easy, cheap part. Deployment was the real bottleneck, and it is now resolved.

---

## TL;DR decision

1. **Post-train on Together AI** (LoRA or full SFT, ~$4 to $30 one-time, hours not days). Optionally refine with GRPO / RFT afterward (see post-training section). Confirm adapter and weight export, since the 27B must be exported to self-host.
2. **Deploy the 27B always-on on RunPod, quantized to 4-bit, on a single RTX 4090, ~$300/month.** This is the quality model and the recommended primary host. Document the RTX 5090 (~$400/month) as the upgrade path.
3. **Deploy the 9B fine-tune on Together serverless** for cheap, usage-scaled inference (pending one eligibility check). Start here for the high-volume cheap path, then stand up the 27B on the 4090.
4. **Do not host on AWS SageMaker.** It works, but it costs 3 to 6x the RunPod price for the same architecture. It is fine for training and RFT, not for serving.
5. **There is no token-metered serverless home for the 27B.** That capability does not exist for this model on any platform. Stop looking for it. Self-hosting on a quantized 4090 is cheaper than the managed quotes anyway.

---

## Where to post-train

**Primary: Together AI SFT.** Qwen3.5-27B, Qwen3.5-9B, and the Qwen3.5 MoE family are all on Together's fine-tuning list (LoRA and full). A 600-example SFT run is roughly **$4 to $30** depending on tier and epochs. Fast and cheap, exactly as you said.

**Note on Qwen3.6-27B:** the 3.6-27B dense model is not on Together's fine-tuning list (only the 3.6-35B-A3B MoE is). So if you want to post-train 3.6-27B specifically, you train it elsewhere (SageMaker serverless customization supports 3.6-27B SFT and RFT, ~$10 to $20) and then self-host the result on RunPod. Qwen3.5-27B can be trained and exported from Together directly.

**Optional reinforcement refinement: GRPO / RFT.** Post-training is not only SFT. For verifiable-reward tasks (which trading judgment partly is), a reinforcement pass on top of SFT can help where SFT alone plateaus. Two real options:
- **Predibase** for GRPO. This is their specialty. A small run (600 prompts, a few generations each) is roughly $15.
- **SageMaker serverless RFT** (RLVR and RLAIF, including multi-turn RL for agentic tasks), pay-per-token, no infrastructure to manage. Qwen3.6-27B is supported.

Sequence: SFT first, evaluate on TradeBench, add GRPO / RFT only if the SFT model misses target. Do not pay for RL you do not need.

**Critical dependency: weight and adapter export.** Together lets you download your fine-tuned adapter (and weights for full FT). This matters because the 27B cannot be served on Together serverless, so the path is: train on Together, download the adapter, merge, quantize, host on RunPod. Confirm the export works for your specific base before committing the run. You believe it does. It needs a one-click confirmation.

---

## Where to deploy

### The 27B (your quality model, ~55% on TradeBench): RunPod, always-on, 4-bit

**Recommended: RTX 4090, 4-bit INT4, always-on, ~$300/month.**

This is the pick. The reasons, in order:

- A dense 27B at 4-bit is ~15 to 17GB of weights, which fits a 24GB consumer 4090. That single fact is why this is ~$300/month instead of the $1,500 to $5,000 every managed quote gave you. They quote BF16 or FP8 on an 80GB H100. You do not need an H100 if you 4-bit it.
- **Quality holds.** On this exact model, a good 4-bit checkpoint (for example Intel AutoRound INT4) tracks the BF16 and FP8 curves within benchmark noise. The quality variable is the quantization recipe, not the GPU. A bad quant is the compromise, not the 4090. You must validate your chosen checkpoint on TradeBench against your FP8 baseline (you tested at FP8 on OpenRouter, which is near-lossless, so your ~55% reflects full quality).
- **Duration is free in memory terms.** Autonomous agents that run for days, weeks, or months do not hold months of context. They make many small, bounded-context calls over time, with history living in your memory layer. That is a high-frequency, short-context workload, which a 4090 handles comfortably. Long runtime does not strain VRAM.
- Qwen3.5 / 3.6 use a hybrid linear-attention architecture that is more memory-efficient per token of context than a standard transformer, which is a tailwind for the smaller card.

**Upgrade path, for the record: RTX 5090, 4-bit NVFP4, always-on, ~$400/month.**

Other agents missed this card. It is worth knowing. The 5090 (32GB, Blackwell) buys two things the 4090 does not:
- **NVFP4 quantization**, which is near-lossless (KL divergence vs BF16 at or below 0.001, below sampling noise). NVFP4 needs Blackwell silicon, which the 4090 is not.
- **Roughly double the KV-cache headroom** (~16GB free after weights vs ~8GB on the 4090). That headroom is spent two ways: longer single-call context, and more agents calling at the same instant.

Move to the 5090 (or add a second 4090) when either of these actually happens: a single call needs very long context (tens of thousands of tokens at once), or many agents are active and calling simultaneously (concurrency pressure). Neither bites at private-beta scale. You will see it coming in your usage graphs.

### The 9B (cheaper, weaker, ~37% on TradeBench): Together serverless

Deploy the Qwen3.5-9B fine-tune on **Together serverless** for the cheap, usage-scaled path: pay per token, zero idle cost, no cold start, no GPU to manage. At $0.17 input and $0.25 output per 1M tokens, demo-scale traffic costs cents.

**One verification first:** Qwen3.5-9B is on Together's serverless catalog as a base (served at FP8), and Together advertises bring-your-own-LoRA on compatible serverless bases. But the catalog lists the base without marking adapter eligibility, so confirm in-console that a Qwen3.5-9B LoRA actually serves serverless before relying on it.

### Staged rollout

Start with **Together serverless for the 9B** (fastest to stand up, near-zero cost, validates the serverless path), then stand up the **27B on a RunPod 4090** as the quality model. Run both in the decide phase. Keep their eval results separate: the 9B and 27B are different quality tiers (37% vs 55%), so do not let a 9B result stand in for the 27B.

---

## Cost matrix

**Assumptions (the load-bearing guess):** ~1,500 input + ~1,500 output = ~3,000 tokens per request, ~15 requests per user per month = ~45K tokens per user per month. Monthly totals: 0.45M (demo / 10 users), 4.5M (100), 45M (1K), 450M (10K), 4.5B (100K). One 4090 serves ~420M tokens/month at realistic utilization, one 5090 ~750M. These last two are estimates and could move card counts by ~2x.

| Option (quality) | Demo (10) | 100 | 1K | 10K | 100K |
|---|---|---|---|---|---|
| 4-bit INT4 Qwen3.6-27B, RTX 4090, RunPod, always-on (~55%, your model) | ~$300 | ~$300 | ~$300 | ~$300-600 (1-2 cards) | ~$3,000 (~10 cards) |
| NVFP4 Qwen3.6-27B, RTX 5090, RunPod, always-on (~55%, near-lossless) | ~$400 | ~$400 | ~$400 | ~$400 (1 card) | ~$2,400 (~6 cards) |
| Qwen3.5-9B fine-tune, Together serverless (~37%, weaker, eligibility pending) | ~$0.10 | ~$1 | ~$10 | ~$95 | ~$945 |

**Confidence:** High on one always-on 4090 at ~$300 (this is what you are acting on now). Medium-high on the 5090 at ~$400 (real range $290 to $510). High on the serverless arithmetic, medium on its availability and the token assumption. Medium on the 10K and 100K card counts, which ride on usage and throughput estimates.

**What the shape shows:** the two GPU rows are flat because you rent capacity, not usage, so at beta scale you pay ~$300 to $400 for a mostly-idle card. The serverless row is linear and near-free at low volume, which is why it looks 100x cheaper at demo scale. The catch is the quality column: serverless only exists for the weaker 9B. The 9B serverless stays cheaper than one warm 27B card until roughly 30K to 40K users, after which the GPU wins per token, but the 18-point quality gap never closes.

---

## What we rejected, and why

| Option | Verdict | Reason |
|---|---|---|
| AWS SageMaker real-time endpoint for the 27B | Rejected for hosting | Works, but ~$820 to $1,750/month for one endpoint, 3 to 6x RunPod, because it uses datacenter GPUs (no consumer 4090s) plus a managed premium. Fine for training / RFT, not serving. |
| SageMaker Serverless Inference | Impossible for a 27B | SageMaker serverless inference does not support GPUs. The Perplexity memo's "$13 to $425/mo serverless inference" line could never have run a 27B. |
| Token-metered serverless for the 27B (Together, Fireworks, etc.) | Does not exist | No platform keeps a 27B fine-tune in a hot multi-tenant pool. The 27B is not on any serverless-LoRA base list. Structural, not a temporary gap. |
| Managed dedicated (Together / Baseten / Fireworks H100) | Rejected on cost | ~$4,200 to $4,745/month always-warm. The whole point of 4-bit on a consumer card is to avoid this. |
| Self-host BF16 on an H100 | Unnecessary | Only needed if you reject any quantization. 4-bit on a 4090 matches your tested quality for ~6 to 16x less. |

---

## Corrections to the prior (Perplexity) memo

1. **Together cannot serve a Qwen3.5-27B or 3.6-27B LoRA on serverless.** The memo's primary recommendation rested on this. Together serverless-LoRA exists only for a curated base set (Llama 3.x, Mixtral, Qwen 2.5 era, and select newer small bases like Qwen3.5-9B). The 27B is not on it.
2. **"Serverless" in the SageMaker Qwen3.6 announcements means serverless fine-tuning, not serverless hosting.** Hosting a fine-tuned 27B on SageMaker is a per-hour GPU endpoint.
3. **The cheapest always-on path is a quantized 27B on a consumer GPU (~$300/month), not a managed platform (~$1,500 to $5,000).** The memo never modeled quantization onto a cheaper GPU class, which is the single biggest cost lever.
4. **Quality is set by the quantization recipe, not the precision label or the GPU.** A good INT4 matches FP8 on this model; a badly-made 4-bit build is the only real quality risk.

---

## Open verification items (do these before locking)

1. Confirm Together exports your fine-tuned adapter / weights for your base (linchpin for self-hosting the 27B).
2. Confirm Qwen3.5-9B is bring-your-own-LoRA eligible on Together serverless (catalog lists the base, not adapter support).
3. Validate your chosen 4-bit 27B checkpoint (for example Intel AutoRound INT4) on TradeBench against your FP8 baseline. Confirm the score holds before pointing the beta link at it.
4. Use a reliable RunPod tier (or a failover host) for the always-on link. The rock-bottom marketplace prices come from hosts that can drop, fine for batch eval, bad for a live beta link. Budget the upper end if uptime matters.
5. Pin your real tokens-per-user once you have beta traffic. It is the load-bearing assumption in the cost matrix, and an agentic monitoring loop can be 10 to 100x heavier than the chat-style assumption used here.

---

## One-line summary

Post-train on Together for ~$4, export the adapter, quantize to a good 4-bit build, and serve the 27B always-on on a single RunPod 4090 for ~$300/month for the beta, with the 5090 (~$400) as the near-lossless, more-headroom upgrade when context or concurrency climbs. Run the 9B on Together serverless for the cheap usage-scaled path. SageMaker and managed dedicated are real but cost multiples more for the same result.
