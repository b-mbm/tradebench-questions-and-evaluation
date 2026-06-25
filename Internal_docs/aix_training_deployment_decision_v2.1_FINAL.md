# AIX trading model, post-training and deployment decision (v2.1, final)

**Date:** June 15, 2026
**Status:** Final strategy. Directionally locked. Execution proceeds through the gates in the last section, which are now operational, not strategic.
**Supersedes:** all prior drafts, including the Perplexity memo, FINAL v1, and v2. Changes from v2 are precision and operational discipline only. The strategy is unchanged: train cheap on Together, export, quantize, self-host the fine-tunes on a RunPod Pod; use stock Qwen3.5-9B serverless as the optional cheap lane.

---

## TL;DR decision

1. **Post-train Qwen3.5-27B on Together first** (LoRA or full SFT, ~$4 to $30, hours). Clean train-and-export path because 3.5-27B is on Together's fine-tuning list. Treat Qwen3.6-27B as an upgrade path, proven in parallel, adopted only if the ~4-point benchmark gain survives the operational cost.
2. **Self-host the fine-tunes on a RunPod Pod (not Serverless), on one 48GB card (A40 or A6000):** the 27B at Q8/W8 (near-lossless), and later the 9B at Q4, co-hosted. Budget ~$350/month public baseline, ~$450/month conservative for the reliable link, ~$250/month opportunistic on Community for dev and beta.
3. **The cheap serverless lane is the stock `Qwen/Qwen3.5-9B` base on Together, not a fine-tune of it.** A fine-tuned 9B is dedicated-only on Together, which is an always-on GPU bill, so self-host it instead.
4. **Do not host any fine-tune on a Together dedicated endpoint or AWS SageMaker.** Both are always-on GPU bills at multiples of a RunPod Pod.
5. **There is no token-metered serverless home for a 27B fine-tune** anywhere. Self-hosting a quantized 27B on one rented Pod is cheaper than every managed quote.

Investor framing: a two-tier system. Avalon Fast (9B) and Avalon Trade / Heavy (27B), both fine-tuned, target co-hosted on one GPU.

---

## Execution sequence (do this in order)

Prove the linchpin before committing the full run. The 27B export, merge, quantize, serve path is the only thing that can quietly break.

1. Tiny smoke SFT on Qwen3.5-27B (20 to 50 examples).
2. Export the adapter (Together's download API exposes merged and adapter checkpoints).
3. Merge and quantize: Q8/W8 first, Q5_K_M and Q4 as candidates.
4. Run a TradeBench smoke eval against the FP8 baseline.
5. Deploy on one RunPod A40 or A6000 Pod. Measure latency and throughput.
6. Only then run the full 600 to 1,500 example post-training run.
7. Only after the 27B is serving cleanly, train and co-host the 9B fine-tune.

---

## How Together pricing works (so the terminology does not mislead)

- **Serverless:** call an API, pay per token in and out, nothing when idle, no GPU to rent. Together runs it on shared hardware and autoscales. Available only for catalog models. Stock Qwen3.5-9B is on it ($0.17/M in, $0.25/M out). Your fine-tune of it is not.
- **Dedicated endpoint:** Together provisions a single-tenant GPU, kept warm 24/7, billed per GPU-hour regardless of tokens. A reserved seat, not the rides. A completed Together fine-tune deploys here, not to serverless. Together's current LoRA docs state this; serverless multi-LoRA is a curated base set (Llama 3.1 and Qwen 2.5 era) that excludes Qwen3.5-9B. Confidence a fine-tuned 9B is dedicated-only: 95%+, with the console as the definitive check.

Consequence: a fine-tuned 9B on Together dedicated runs ~$1,100 to $2,000/month always-on, more than self-hosting. So train on Together, export, self-host.

---

## Where to post-train

**Primary: Together AI SFT on Qwen3.5-27B and Qwen3.5-9B.** Both are on Together's fine-tuning list. ~$4 to $30 per model. Optional reinforcement refinement (GRPO on Predibase, ~$15; or SageMaker serverless RFT) after SFT, only if SFT misses target on TradeBench.

**Qwen3.6-27B caveat.** The 3.6-27B dense model is not on Together's fine-tuning list (only the 3.6-35B-A3B MoE is). To post-train it you train elsewhere (SageMaker serverless customization supports it, ~$10 to $20) and export. The 3.6-27B base scores ~4 points higher on TradeBench (55.3 vs 51.0). Validate its export pipeline in parallel, upgrade if the gain holds after your own fine-tune.

**Linchpin: confirm adapter / merged export from Together** before the full run. Both fine-tunes must be exported to self-host.

---

## Where to deploy

### Target: both fine-tunes co-hosted on one RunPod Pod, 48GB card (pending smoke test)

A single A40 or A6000 (48GB) is the target host: the 27B at Q8/W8 (~27GB, near-lossless) plus, later, the 9B at Q4 (~6GB), with room for a bounded KV cache, run as two servers on one GPU.

**Use RunPod Pods, not RunPod Serverless.** Pods are dedicated always-on GPU instances. RunPod Serverless bills the same A6000/A40 at roughly $1.22/hr, far above the Pod rate, and would blow the budget if selected by mistake.

Pricing, tier-aware (confirm in console, prices move):
- Public Pod baseline: A40 ~$0.44/hr (~$321/month), A6000 ~$0.49/hr (~$358/month). Headline budget ~$350/month plus storage. Note these 48GB cards are actually cheaper than a 4090 ($0.69/hr) on the public page, which reinforces choosing them.
- Conservative reliable-link budget: ~$450/month (Secure tier plus storage).
- Opportunistic Community: ~$250/month, variable, hosts can drop. Fine for dev, eval, and private beta. Keep merged weights on a network volume (~$0.07/GB/month) so a dropped host means a few-minute respin.

**Co-hosting is a gate, not an assumption.** The VRAM math is plausible, but runtime overhead, KV reservation, engine choice, and context length can change it. Validate with a startup and latency smoke test under load. Fallback if co-hosting is unstable: keep Avalon Fast on stock Qwen3.5-9B serverless, or run the 9B fine-tune on a separate cheap GPU. Do not compromise the 27B.

**Cap the context window.** The model advertises 262K context, but the co-hosted beta deployment must not expose it. Set a practical max_model_len, roughly 8K to 32K at beta. Long-horizon agent state lives in memory and RAG, not in one huge prompt. Duration is not context: a long-running agent makes many small bounded-context calls over time, which is exactly what this host handles.

**Quantization note.** Start the 27B at Q8/W8 if it fits, which is near-lossless. Drop to Q5_K_M only if co-hosting or context pressure requires it. Q5 reduces weight memory, which frees VRAM for KV cache; it does not shrink the KV cache itself. A40 and A6000 are Ampere, which handles INT8/Q8 efficiently but lacks native FP8 tensor cores, so the near-lossless target on these cards is 8-bit integer, not FP8.

### Optional cheap lane: stock 9B base on Together serverless

If you want a near-zero-cost fast lane and do not need the 9B fine-tune live, call stock `Qwen/Qwen3.5-9B` on Together serverless: $0.17/M in, $0.25/M out, zero idle. This is the stock model, not your fine-tune.

---

## Cost matrix

Assumptions: ~1,500 in + ~1,500 out = ~3,000 tokens/request, ~15 requests/user/month. Monthly totals: 0.45M (demo / 10 users), 4.5M (100), 45M (1K), 450M (10K), 4.5B (100K). GPU rows are flat until one card saturates, then step up.

| Option | Demo (10) | 100 | 1K | 10K (load-test required) | 100K |
|---|---|---|---|---|---|
| Stock 9B base, Together serverless (cheap lane, NOT your fine-tune) | ~$0.10 | ~$1 | ~$10 | ~$95 | ~$945 |
| Both fine-tunes on one RunPod Pod 48GB, public baseline | ~$350 | ~$350 | ~$350 | ~$350-700 (1-2 cards) | ~$3,500 (~10 cards) |
| Same, conservative reliable (Secure + storage) | ~$450 | ~$450 | ~$450 | ~$450-900 | ~$4,500 |
| Same, opportunistic Community (dev/beta, can drop) | ~$250 | ~$250 | ~$250 | ~$250-500 | ~$2,500 |
| Fine-tuned 9B on Together dedicated + 27B Pod (AVOID) | ~$1,450+ | ~$1,450+ | ~$1,450+ | ~$2,000+ | much higher |

**The 10K-user column is a capacity hypothesis, not a measured number.** It depends on concurrency, latency target, batching, context length, and what fraction routes to the 27B. Trading traffic clusters around market hours, so a card fine on a 730-hour monthly average can fall over during the ~100 active hours. Validate with an active-hours load test using the real request distribution before relying on it.

---

## What we rejected, and why

| Option | Verdict | Reason |
|---|---|---|
| Fine-tuned 9B on Together serverless | Not available | Together routes fine-tunes to dedicated endpoints; serverless multi-LoRA excludes Qwen3.5-9B. |
| Fine-tuned 9B on Together dedicated | Rejected on cost | ~$1,100 to $2,000/month always-on for the 9B alone. |
| RunPod Serverless for the always-on host | Wrong product | Bills A6000/A40 at ~$1.22/hr. Use Pods. |
| SageMaker single-GPU real-time endpoint | Rejected for hosting | ~$820 to $1,750/month, 3 to 6x a RunPod Pod. Fine for training / RFT, not serving. |
| "SageMaker is ~$27k to $46k/month" | Miscompare | Those are 8-GPU full-node instances. A 27B uses one GPU. |
| SageMaker Serverless Inference | Impossible for a 27B | Does not support GPUs. |
| Token-metered serverless for the 27B | Does not exist | Not on any serverless-LoRA base list. |
| Managed dedicated (Together / Baseten / Fireworks H100) | Rejected on cost | ~$4,200 to $4,745/month per replica. |
| RTX 4090 24GB as primary | Demoted | More per hour than the 48GB cards on the public page, half the VRAM, cannot co-host two models. |

---

## Gates (hard, before locking)

1. **Export gate:** adapter and merged export works for Qwen3.5-27B and Qwen3.5-9B.
2. **Runtime gate:** the merged, quantized 27B loads and serves on an A40/A6000 with the chosen serving stack.
3. **Quant gate:** Q8, Q5, Q4 candidates run TradeBench 300 within acceptable loss vs the FP8 baseline.
4. **Context gate:** set max_model_len from real VRAM behavior, not the advertised 262K.
5. **Co-hosting gate:** 27B + 9B both start and serve under load on one 48GB card.
6. **Load gate:** test active-hours traffic with the real request distribution, not only monthly token averages.
7. **Provider gate:** RunPod Pod tier and storage pricing confirmed in console; confirm a fine-tuned 9B is dedicated-only on Together.

---

## One-line summary

Train Qwen3.5-27B on Together for a few dollars, export the adapter, merge and quantize to Q8 (Q5/Q4 as fallback), and serve on one RunPod A40 or A6000 Pod (~$350/month public, ~$450 reliable) as Avalon Heavy, then train and co-host the 9B as Avalon Fast once the 27B path is proven. Keep stock Qwen3.5-9B serverless as the cheap lane. Do not put fine-tunes on Together dedicated, RunPod Serverless, or SageMaker. Locked on strategy, gated on execution.
