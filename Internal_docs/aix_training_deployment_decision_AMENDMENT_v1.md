# AIX training + deployment decision — Amendment v1

**Date:** July 10, 2026
**Applies to:** `aix_training_deployment_decision_FINAL.md` (June 15, 2026)
**Status:** Two price corrections and one finalized card selection. Does not supersede the FINAL doc — appends to it.

---

## What changed since June 15

Three items. Two are price drift, one is an explicit head-to-head that the FINAL doc left implicit.

### 1. RTX 4090 monthly is $248, not $300

The FINAL doc used ~$300/month as a rounded working number. Actual RunPod Community price today (verified July 10, 2026) is **$0.34/hr × 730 hrs = $248/month**. Secure Cloud is $0.69/hr = $504/month.

Sources: [RunPod RTX 4090 official page](https://www.runpod.io/gpu-models/rtx-4090), [computeprices.com July 2026](https://computeprices.com/providers/runpod), [SynpixCloud May 2026 recheck](https://www.synpixcloud.com/blog/rtx-4090-cloud-rental-worth-it).

### 2. RTX 5090 monthly is ~$723, not ~$400

The FINAL doc estimated the 5090 upgrade path at ~$400/month. Current RunPod Community price is **$0.99/hr = $723/month**; Secure ~$1.10/hr = $803/month. Blackwell demand pushed pricing up since June.

Source: [aiproductivity.ai RunPod pricing May 2026](https://aiproductivity.ai/pricing/runpod/), verified against RunPod's console.

Impact: the 5090 upgrade is still valid, but 80% more expensive than the doc assumed. Plan for ~$720/month when the trigger conditions hit (single-call context ~32K+, or real multi-agent concurrency).

### 3. RTX 4090 vs RTX A6000 head-to-head

The FINAL doc picked the 4090 without explicitly comparing to the A6000. Given the A6000's 48 GB VRAM at essentially the same $/hr, it deserved an explicit comparison. Result below: **4090 wins, keep the FINAL doc's pick.**

---

## Amended cost matrix (replaces the "Cost matrix" table in the FINAL doc)

Prices are RunPod Community Cloud, 730 hrs/month (24/7). Verified July 10, 2026.

| GPU | VRAM | $/hr | $/mo (24/7) | Fit for 27B Int4 | Verdict |
|---|---:|---:|---:|---|---|
| **RTX 4090** | 24 GB | **$0.34** | **$248** | ✅ Comfortable, ~7-9 GB KV headroom | **PRIMARY** |
| RTX A6000 | 48 GB | $0.33 | $241 | ✅ Huge headroom (~30 GB KV) | Rejected — see head-to-head |
| A40 | 48 GB | $0.35 | $256 | ✅ Huge headroom | Rejected — same silicon gen as A6000 |
| RTX 3090 | 24 GB | $0.22-$0.46 | $161-$336 | ✅ Fits | Skip — older, slower, spot-only cheap tier is unreliable |
| RTX A5000 | 24 GB | $0.27 | $197 | ✅ Fits | Skip — Ampere-slow |
| L40 | 48 GB | $0.69 | $504 | ✅ | Skip for MVP — 2× the cost of the 4090 |
| L40S | 48 GB | $0.79 | $577 | ✅ | Skip for MVP |
| **RTX 5090** | 32 GB | **$0.99** | **$723** | ✅ Unlocks NVFP4 near-lossless quant | **UPGRADE PATH** (repriced from ~$400) |
| A100 PCIe 40GB | 40 GB | $1.19 | $869 | ✅ Overkill for Int4 | Skip |
| A100 SXM 80GB | 80 GB | $1.39 | $1,015 | ✅ Enormous | Skip for MVP |
| H100 PCIe | 80 GB | $1.99 | $1,453 | ✅ | Skip for MVP |

---

## 4090 vs A6000 head-to-head (why the FINAL doc's pick holds)

| Spec | RTX 4090 | RTX A6000 |
|---|---|---|
| VRAM | 24 GB | 48 GB |
| **Memory bandwidth** | **1,008 GB/s** | 768 GB/s |
| **FP16 compute** | **82.6 TFLOPS** | 38.7 TFLOPS |
| Architecture | Ada Lovelace (2022) | Ampere (2020) |
| FP8 hardware support | ✅ | ❌ |
| NVFP4 | ❌ (requires Blackwell) | ❌ |
| RunPod Community $/hr | $0.34 | $0.33 |
| Monthly 24/7 | $248 | $241 |
| KV headroom after 27B Int4 (~16 GB weights) | ~7-9 GB | ~30 GB |

**Why 4090 wins for this specific workload:**

1. **Memory bandwidth is the inference bottleneck** for a quantized dense model. Rough tok/s ceiling ≈ bandwidth ÷ quantized-weight-size. 4090: 1008 ÷ 16 = ~63 tok/s. A6000: 768 ÷ 16 = ~48 tok/s. **~30% output-latency advantage to the 4090** on every agent step.
2. **2× the FP16 compute** shortens time-to-first-token on prefill and any non-quantized activations.
3. **Ada generation** — actively optimized in vLLM upstream, unlocks FP8 later if you want a quality bump above Int4 (A6000 is Ampere, no FP8 hardware).
4. **24 GB is enough for the actual workload.** 27B Int4 weights ~16 GB, leaves 7-9 GB for KV cache. Sufficient for context ≤16K at single-request serving, which is the MVP shape.
5. **Cost delta is $7/month** — noise.
6. **A6000's 48 GB only pays off** under real concurrency (3-4+ simultaneous requests) or long context (32K+). Neither is the MVP profile.
7. **Upgrade path is the 5090** (Blackwell, 32 GB, NVFP4) — a real generation jump. A6000 would be a lateral move to older silicon.

**When to revisit and switch to A6000 or A40:**
- Regularly serving contexts > 16K tokens
- 3+ concurrent agents hitting the same pod
- Running 27B + a smaller companion model on the same GPU

None of these are true at private-beta scale. Track them in the usage graph.

---

## Finalized decision (July 10, 2026)

1. **Primary serving GPU: RTX 4090, RunPod Community Cloud, ~$248/month.** Unchanged from the FINAL doc, cost corrected from ~$300.
2. **Quantization: Intel AutoRound INT4** (first choice) or **AWQ 4-bit** (fallback). Serve with vLLM.
3. **Fine-tune Qwen3.6-27B on SageMaker serverless customization** (~$10-$20/run) — Together does not list 3.6-27B dense on its fine-tune catalog, only 3.6-35B-A3B MoE. Confirm before locking. If SageMaker is a blocker, consider dropping to Qwen3.5-27B, which is on Together's list.
4. **Upgrade path: RTX 5090 at ~$723/month** when either (a) single-call context regularly exceeds ~32K tokens, or (b) concurrent-request pressure breaks the 4090's KV headroom. Repriced from ~$400.
5. **Validate the INT4 checkpoint on TradeBench** against your FP8 baseline before pointing beta traffic at it. Unchanged from FINAL doc. This is the load-bearing quality risk.
6. **Use Secure Cloud** (RTX 4090 = $0.69/hr = $504/month) if you point a live user link at it. Community Cloud is fine while iterating.

---

## Open items still not resolved

Carried forward from FINAL doc §"Open verification items":

1. Confirm SageMaker serverless customization exports fine-tuned Qwen3.6-27B weights in a form vLLM can consume after quantization.
2. Confirm your Intel AutoRound INT4 checkpoint (or the AWQ equivalent) holds TradeBench score vs the FP8 baseline you measured on OpenRouter.
3. Pin real tokens-per-user once beta traffic exists — agentic loops can be 10-100× heavier than the chat-style assumption in the cost matrix.
