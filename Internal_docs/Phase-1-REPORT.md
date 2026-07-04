# Phase 1 Pre-Flight — Final Report
**Branch:** `phase0-grpo-preconditions` · **Date:** 2026-07-04
**Budget:** Started $43.19, spent ~$18.50, remaining $24.65

---

## Executive summary

3 of 4 pre-flight steps completed. Step 3 (null-reward control) is **blocked** by an infrastructure issue: SSH to RunPod US-MO-1 Secure has been unreachable all session (port exposed but connection timeout on every pod deployed). The null-reward control requires running a real GRPO loop inside the pod (Lambert's design — shuffled-reward weight updates, not just sampling), which needs SSH or a self-contained dockerArgs GRPO script that hasn't been built yet.

**What we confirmed:** SGLang generates valid GRPO rollouts (thinking + JSON, no collapse, at temp 0.7). The generation-server half of GRPO works. The variance noise floor is tight (spread of 2 on the 35-subset). The grader is sound on verifiable fields (99% numeric detection).

**What's blocked:** The TRL weight-sync half of GRPO, and therefore the null-reward control. Both need commands running inside the pod, which needs SSH.

---

## Step 1 — Fix L4-002/L8-009 ✅
**Root cause:** Harness bug (mutation-test overwrote `reasoning` field), NOT a grader bug. Fixed. Canonical failures: 2→0. Robust rows: 10→130. Audited by council (Liang seat): confirmed no baseline impact, no false-green. **161 baseline unaffected.**

## Step 2 — Variance measurement ✅
**3 runs on 35-subset** (council directed subset over full-202: ceiling questions have near-zero variance): **12/35, 10/35, 11/35**. Spread: 2. Mean: 11/35 (31.4%). 10/35 questions flip (28.6%). Noise band: ±1.

**Lambert caveat:** n=3 is underpowered (CI on SD is 12× wide). Need ≥5 runs for a real bound. Treat ±1 as a lower draw, ±3 (from prior 29Q) as conservative upper bound. The trust threshold for GRPO gains should be SEM-based (k=2·SEM_diff on paired per-question flips), not a fixed "2× spread" rule.

## Step 4 — GRPO pre-flight ✅ (partial)
**Generation-server half CONFIRMED:** SGLang produces valid rollouts at temp 0.7 via HTTP proxy — thinking (6780c reasoning) + valid question-specific JSON (8 fields, no collapse) in 113s. This is exactly what GRPO's generation server needs.

**Weight-sync half BLOCKED:** TRL GRPOTrainer server-mode (pushing updated LoRA to SGLang after each gradient step) could not be tested because SSH to RunPod US-MO-1 was unreachable all session. The HTTP proxy works fine (we ran 105+ questions through it), but running TRL inside the pod requires interactive access.

## Step 3 — Null-reward control ❌ BLOCKED
**Lambert's design (approved):** Real shuffled-reward GRPO loop (NOT K=16 sampling proxy — that's rejected as testing nondeterminism, not contamination). 30+ steps, G=8, reward vector permuted within each group. Scored on held-out subset at multiple checkpoints. Clean gate: every checkpoint ≤ base_mean + 2·SEM.

**Why blocked:** This requires a working GRPO loop inside the pod. The GRPO loop requires TRL running on GPU 1 talking to SGLang on GPU 0. That requires SSH to install and run TRL. SSH is down.

---

## The SSH issue (failure mode #9)

SSH to RunPod US-MO-1 Secure pods is unreachable. Tested on 5+ pods across two days (2026-07-03/04). Port is exposed in the API, `ping` reaches the host, but `ssh` and `nc` both timeout. The HTTP proxy (port 8000) works fine. This appears to be a network/firewall issue on RunPod's side, not a configuration issue.

**Workarounds considered:**
1. dockerArgs with git clone → failed (no ports exposed = command crashed)
2. dockerArgs with base64-encoded script → API returned 403 (payload too large?)
3. HTTP-only approach → works for serving/generation but can't run TRL training inside the pod

**What would unblock this:**
- SSH coming back online (try again — may be transient)
- A different RunPod data center with working SSH
- A self-contained dockerArgs GRPO script (SGLang + TRL in one container command) — this is ~2 hours of development work and is the most robust long-term solution

---

## What's ready for the real GRPO run

✅ Verifiable reward set: 202 questions
✅ Held-out split: 27 train / 8 holdout + 98 AGI probe
✅ Monitoring module: 4 instruments, self-tested
✅ Variance data: spread=2 (needs ≥5 for full confidence)
✅ Generation server: SGLang produces valid rollouts
❌ GRPO training loop: untested (TRL weight-sync blocked)
❌ Null-reward control: blocked (needs GRPO loop)

---

## Recommendation for the operator

**Option A: Wait for SSH.** Try again tomorrow — if RunPod US-MO-1 SSH is back, Steps 3-4-complete take ~2 hours of GPU time (~$10). This is the fastest path.

**Option B: Build a self-contained dockerArgs GRPO script.** Write a single bash script that installs SGLang + TRL, starts SGLang on GPU 0, runs TRL on GPU 1, writes results to the volume — all as the container start command. ~2 hours of development, then it runs unattended. This is the most robust path and doesn't depend on SSH at all.

**Option C: Try a different data center.** Deploy in a non-US-MO-1 region where SSH might work. Risk: the model volume (qqz94ksxmn) is in US-MO-1, so a different region means either no volume (re-download the 54GB model) or cross-region volume access (slow).
