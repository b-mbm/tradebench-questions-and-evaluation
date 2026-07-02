# Council Consensus: SFT Plateau — The Single Path Forward

**Date:** 2026-07-02 · **Unanimous on:** SFT is done · **Consensus on:** One experiment before any method escalation

---

## UNANIMOUS FINDING: SFT has plateaued

All three seats independently confirm:
- Four SFT blends (v2/v3/v4) all land within ±3 noise of each other and of base
- No data composition change — from failure-only to council-approved reinforcement-heavy — moved the net delta
- The residual failures are wrong VALUES (Ethena=0, APR=22.9), not wrong FORMAT
- SFT teaches behavior (format, style, structure). It cannot teach facts the model doesn't have.

**No seat recommends another SFT blend. The SFT lever is exhausted.**

---

## THE CONSENSUS: One diagnostic, then decide

All three seats converge on a single insight: **before spending money on any new method (GRPO, DPO, or anything else), you must answer one question — can the model even produce the right answer?**

- **Schulman:** "Your remaining errors are outcome errors. SFT has no gradient on whether the number is right." He wants GRPO — but his own simplicity principle says verify the foundation first.
- **Lambert:** "If the 300Q moves on random training, contamination owns the number and everything downstream is confounded." He wants the null control — but it's a diagnostic, not a method.
- **Finn:** "If the correct answer never appears across 16 samples, no method fixes it. It's a knowledge deficit." She wants the capability probe — and it's the cheapest, most decisive experiment.

**The three "different" recommendations are actually the same experiment viewed from three lenses.** Finn's capability probe IS the diagnostic that resolves Schulman's "is RL worth it?" AND Lambert's "is the eval real?" If the model can produce the right answer at temperature (Finn's condition for GRPO), AND the null-reward control shows the baseline is clean (Lambert's condition), THEN Schulman's GRPO is the clear escalation.

---

## THE SINGLE PLAN (council consensus)

### Step 1: Finn's Capability Probe (~$2, 1 hour)

For each of the 29Q failures, sample K=16 at temperature 0.7-1.0. Record whether the correct answer EVER appears in any sample.

**This one experiment answers the fundamental question that all three seats need answered:**

| Probe result | Finn says | Lambert says | Schulman says | Council consensus |
|---|---|---|---|---|
| Right answer appears inconsistently | "Latent capability — GRPO is the right tool" | "Still need null-reward control" | "RL can reinforce it" | **Proceed to Step 2** |
| Right answer NEVER appears | "Knowledge deficit — no post-training method fixes this" | "Contamination or capability ceiling" | "SFT can't clone what isn't there" | **Stop post-training. Productize the 161/300 base.** |

### Step 2: Lambert's Null-Reward Control (~$10, parallel with Step 1)

Train identical QLoRA recipe on shuffled/random targets. Score on 300Q.

- If 300Q moves on random targets → contamination owns the baseline. Rebuild the eval before any RL.
- If 300Q does NOT move → baseline is clean. The plateau is real capability, not contamination.

**Run in parallel with Step 1.** Both are diagnostics. Neither blocks the other.

### Step 3: Decision Point (based on Steps 1 + 2)

| Probe (Step 1) | Null control (Step 2) | Action |
|---|---|---|
| Right answer appears | Baseline clean | **Schulman's GRPO** — small validation run with per-field reward, KL penalty, length penalty, on medium-difficulty subset only |
| Right answer appears | Baseline contaminated | **Stop.** Rebuild the eval first. |
| Right answer never appears | Either | **Stop post-training.** The model lacks the knowledge. Productize 161/300 or change the model. |

---

## WHY THIS IS CONSENSUS, NOT COMPROMISE

Each seat's recommendation is contained in this plan:
- **Finn's probe** is Step 1 (her idea, her diagnostic, her gate)
- **Lambert's control** is Step 2 (his idea, his standing gate)
- **Schulman's GRPO** is Step 3 (his escalation, gated by Steps 1+2)

No seat is asked to abandon its position. No seat's diagnostic is skipped. The only sequencing decision is "cheapest diagnostic first" — which all three would agree with on principle.

**The plan costs $12 and takes ~4 hours.** It definitively answers "should we spend $50+ on GRPO?" before the money is spent.

---

## WHAT THE COUNCIL DOES NOT AGREE ON (the honest residual)

One genuine disagreement remains, and the probe resolves it:

**Schulman** believes the model HAS latent capability that RL can surface. He'd run GRPO even without the probe.

**Finn and Lambert** are not sure the model can produce the right answers at all. They want evidence before spending RL money.

**The capability probe settles this disagreement empirically.** If the right answer appears in even 1 of 16 samples, Schulman is vindicated and GRPO is the clear move. If it never appears across 16 samples, Finn and Lambert are vindicated and post-training on this model is done.

---

## COUNCIL APPROVAL

> **Schulman:** "APPROVED. The probe is cheap and decisive. If the answer is there, GRPO is the move. If it's not, stop."
> **Lambert:** "APPROVED. The null control discharges my standing gate. Until it's run, no number is trustworthy."
> **Finn:** "APPROVED. The probe IS my diagnostic. It's the sharpest question you can ask."

**Consensus: APPROVED ✅ (unanimous)**
