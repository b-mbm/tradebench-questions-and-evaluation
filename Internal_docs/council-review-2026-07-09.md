# Post-Training Council Review — 2026-07-09

## Context

The council was convened to review a revised GRPO plan after the first 30-step run produced no improvement. Root cause had been re-diagnosed as three issues: (1) binary reward bug [fixed in code], (2) temperature 0.3 too high (1.9% pass rate vs 40-60% at temp 0.1), (3) initial belief that L9/L10 failures are output format errors.

The plan being evaluated: GRPO on 13 L9/L10 "flipping" questions (proven 20-80% pass rate at temp 0.1), temp 0.1, 30 steps, ~$12-15. Fractional 3-step run first. SFT rejected (plateaued 4 times).

---

## Seat 1: Schulman (Frontier RL / Reward Design)

**Read:** Conditional agree — the diagnosis (temp + format, not capability) is correct and the high-variance-question selection is textbook GRPO, but you have not yet tried the two simpler interventions that could make this run unnecessary, so the complexity isn't fully earned yet.

**Diagnostic questions:**

1. **Is the output schema actually pinned in the prompt, or is this a prompt bug dressed up as a model bug?** The L10-017 example — identical reasoning, one rollout emits `15`, another emits `0.15` — smells like an *underspecified answer schema* (percentage vs. decimal) that the model is resolving by sampling. If the grader wants "percentage" and the prompt never says so, the simplest thing that could work is one line in the output specification, tested at temp 0.1 with zero training. You must rule this out before you spend $12 to teach the weights what a one-line schema constraint would fix for free.

2. **What does inference look like in production — single greedy pass, or can you sample N and verify?** This is the make-or-break question for whether RL is even the right tool. At temp 0.1 you report 40–60% per-question pass. That means **best-of-8 sampling is ≈99.6% to surface at least one passing rollout per question** (1 − 0.5⁸), and you already own the verifier — it's your grader. If production can afford N samples + a grader select, best-of-N on the 175-gate will likely beat anything 30 steps of QLoRA produces, at zero training cost. RL is justified *only* if you need single-shot reliability baked into the weights. Which is it?

3. **What is the reward actually measuring, and what is the KL story?** Be honest: with an exact-match grader on a format-dominated failure mode, this reward measures **format consistency, not reasoning quality**. That is a legitimate thing to optimize — it's the same logic as abstention: the model knows the format but doesn't reliably apply it, which is exactly the gap RL closes and SFT can't (you behavior-clone the bad-format tail along with the good). But that only holds if the schema is unambiguous (see Q1). On KL: the plan doesn't mention a β / reference-penalty term. With QLoRA you're leaning on low-rank as *implicit* regularization, and on a 13-question set × 30 steps the policy can overfit those 13 questions' format quirks and drift off-reference exactly there. What's β, and is the 175-gate split L9/L10-heavy (which would *hide* non-generalization to L1–L8 / L11-AGI where your actual edge lives)?

**Known limits of this seat:**
- Model-free and on-policy by disposition. I've pushed the best-of-N offline alternative hard, but I should flag I may be under-weighting a *curated correct-format SFT set* — though the 4× SFT plateau prior does set that bar, so I'm comfortable dismissing it here.
- The temp-0.1-vs-0.3 finding is fundamentally an **exploration / signal-density** finding (at 0.3 every group is all-zeros → zero advantage → no gradient), and I'm the seat that usually downweights exploration as a current-LLM problem. In this specific case it's the whole ballgame, so I've had to engage with it rather than dismiss it.
- Data composition and eval contamination are not my tell. Whether the 175-gate actually correlates with trading PnL is half my question, but Seats 2 and 3 should vet the gate's composition and whether the 13 training questions leaked into it.

**Recommended next step:**
Before spending the $12, run **one cheap gating experiment**: take the 175-gate at temp 0.1, (a) add an explicit schema constraint to the prompt ("emit ROI as a percentage integer, e.g. `15`"), and (b) do best-of-8 with the grader as selector. If prompt-pinning + best-of-8 already moves the gate pass rate substantially, you've found the simplest thing that works and the 30-step GRPO run collapses to an optional deployment-cost optimization (bake single-shot reliability in). Only if a *real* gap remains on the 175-gate after that do you spend the run — and at that point it's earned, cheap, and well-instrumented by your 10/20/30 checkpoints.

---

## Seat 2: Lambert (Open Recipe / Verifiable Reward)

**Read:** Conditional — the format-not-capability diagnosis is the best thing in this plan and the reward is now genuinely verifiable, but you're about to train against a gate that has no error bars, on a holdout you can't measure, while skipping the one control that would tell you if your reward is doing any work at all.

**Diagnostic questions:**

1. **Your gate has no error bars and you know it.** The 175-baseline is *one run* at 134/175. Your own 5-run data on the 35-Q subset is 9–16, SD 2.70 — which is pure Bernoulli noise (35 × 0.33 × 0.67 ≈ 7.7, SD ≈ 2.8; matches exactly). Scaling that to 175Q at 76.6% pass gives a per-run SD of ≈5.6, so the honest baseline is "134 ± 5.6," and a GRPO result of 138–140 is literally invisible. How many times will you run the gate before *and* after training, and what delta do you pre-register as the bar before I'll discuss the method?

2. **You skipped the null-reward control on the exact setup where it matters most.** If the mechanism is "model knows the answer, emits wrong format," then reinforcing *any* consistent output envelope — even under random reward — could produce the same lift, because the model isn't learning to reason, it's learning to template. This is the textbook case for the control you designed and then dropped. Why is the skip acceptable here? Run random-reward GRPO on the same 13 questions; if it matches the real run, your reward signal is decorative.

3. **Your holdout is 8 questions. That is not a measurement, it's a coin flip.** Eight Bernoulli trials at ~77% pass give SD ≈ 1.3 questions, i.e. ±16 percentage points of noise. You cannot see generalization on n=8 — the entire "does it transfer" question is unanswerable by construction. And separately: is the 175-gate decontaminated against Qwen3.6-27B base data? If any meaningful fraction leaked into base training, 76.6% is inflated and the delta you're chasing is partly a contamination artifact. What does the grader actually key on — the numeric answer, or the format envelope? Because if it rewards the envelope, GRPO will hack the envelope and correctness becomes incidental.

**Known limits of this seat:**
- I'm biased toward verifiable rewards, and this *is* a verifiable-reward setup, so I'm relatively bullish — I may be under-weighting how brittle "format RL" is to distribution shift off the 13 training questions.
- My 90%-SFT prior says format is exactly the thing SFT should eat. I'm told SFT plateaued 4×, but I haven't seen whether SFT ever targeted *correctly-formatted exemplars specifically* vs. broader capability — my "try format-SFT first" instinct may be more right here than the operator's SFT fatigue suggests.
- I'm one seat answering the method question, which is the shared Berkeley blind spot the council warns about.

**Recommended next step:**
Run the 175-gate **5× at temp 0.1 before any training** to get the real baseline distribution, and run the null-reward control (random-reward GRPO, same 13 questions, same G=8/LR/temp) in parallel with the real 3-step fractional run. Ship the full 30-step run only if the real run beats *both* the baseline 5-run noise floor *and* the null control on the holdout — pre-registered delta, not vibes. Until those 5 baseline runs exist, there is no eval to improve on, and the method discussion is premature.

---

## Seat 3: Finn (Data Bias / Preference Optimization)

**Read:** Disagree — and strongly. The team's own diagnosis ("format errors, not capability gaps") is an argument *against* GRPO, not for it. The model already computes the correct answer; you are about to run a policy-gradient loop to teach a string transform. That is exactly the "RL is complexity you don't need" case.

**Diagnostic questions:**

1. **Have you exhausted the non-training fixes first?** The pass/fail delta is often a single token (`0.15` → `15`). That is a deterministic scaling convention — a one-line post-processing rule (`round(x*100)`) likely fixes half your failures, and a few-shot format example in the prompt fixes the schema-contamination half. If a regex closes the gap, you are spending GRPO compute to rediscover a unit conversion. Which failures survive a post-processing rule + few-shot prompt? Audit that residue before training.

2. **What does your binary reward *actually* reward, besides correctness?** You already told me failing L9-040 was *longer* — extra `ExecuteOneResponse` fields. So with G=8 and binary reward, your gradient is implicitly "shorter / fewer fields = positive advantage." The model will learn *that* spurious correlate, not "emit clean schemas." Do you have questions in the deployment set that legitimately need more fields? Your reward will have taught the model to drop them. Run the length and field-count distributions of preferred vs. rejected rollouts — and check whether the correlate is *causal* or coincidental on n=13.

3. **Where is the held-out test, and is n=13 memorization?** 13 questions × 30 steps means each question is seen ~30×. At G=8 that's ~240 gradient signals per question. This is rote-conditioning territory, not generalization. The only meaningful evidence is: do you have L9/L10 format-error questions *held out* of the 13, and does the fix transfer to them? If you're evaluating on the training set, a gain is a memorization artifact until proven otherwise — my default, and exactly the trap here.

**Known limits of this seat:**
- Exact-match *is* genuinely verifiable reward — the one regime where RL has a cleaner story than my preference-data instincts usually grant. Seat 2's RLVR framing is more directly applicable than mine; my data-bias critique transfers but doesn't dominate here.
- If these 13 questions literally *are* the deployment distribution (a narrow, fixed vertical where train and deploy match), my generalization concern partially over-fires. But that is a claim you must state explicitly, not assume.
- My scalable-RL intuitions are robotics-scale analogies; I have no direct evidence on GRPO at n=13, Q=104/step.

**Recommended next step:**
Kill GRPO for this. Take the 104 rollouts you already generate at temp 0.1, keep the ~50–60 *passing* ones — those are correctly-formatted correct answers, i.e. free SFT data — and run cheap SFT on them for format compliance. Pair it with a post-processing rule for the `0.15→15` scaling. Then test on **held-out** L9/L10 questions you never trained on. If the format fix transfers, you never needed the policy gradient; if it doesn't, *that* failure is the diagnostic that tells you what GRPO would actually have to learn — and whether 13 questions can teach it.

---

## Seat 4: Liang (Evaluation)

**Read:** Conditional — the format-error diagnosis is the single most important thing in this brief, and it has not been followed to its conclusion; it means the current benchmark is *not measuring what you think it is measuring*, so the 74.9% vs 76.6% delta is uninterpretable until you decompose it.

**Diagnostic questions:**

1. **What does the gate number actually measure, and what does it hide?** You've already discovered that L9/L10 "failures" were output-format errors, not reasoning failures. That means your exact-match grader is conflating two distinct capabilities — *can it reason to 0.15* and *can it emit `15` not `0.15`*. Right now any GRPO gain is an inseparable mixture of "better reasoning" and "better format compliance." A principled taxonomy would score these as **two axes**, not collapse them into one number. Are you optimizing reasoning, or are you optimizing your grader's string matcher? You cannot answer this with the current single-number gate, which is exactly the collapse I warn against.

2. **What is the variance of the number you are optimizing — measured on the set you are optimizing on?** The baseline is 134/175 from a *single run*. Your only variance estimate (SD 2.70) is from a *35-question subset*, a different set. A 131/175 step-10 result was called "within noise" using noise from a set that is not the 175-gate. This is a category error in the statistics: you are borrowing a noise model from a different distribution. Until you have 5+ runs of the *actual 175-gate* baseline, you have no ground for calling any delta signal or noise. The 35-subset SD tells you nothing defensible about the 175-gate SD.

3. **Is the same lens applied to base and tuned, and is the held-out set actually held out?** You have a 27-train / 8-holdout split, but the GRPO is being run on 13 L9/L10 questions — are those 13 inside the 27-train pool? If the 13 leak into the eval, the gate is contaminated by construction. Separately: the step-10 eval used a 267 denominator, not 175 — two different denominators is two different benchmarks; a number is only comparable to a number measured under identical conditions. And the eval *crashed* at steps 20 and 30 (0 passes, then disk quota) — a crashed eval is not a data point, it is missing data. Which version of the pipeline produced 131/175, and can it be reproduced end-to-end?

**Known limits of this seat:**
- I am focused almost entirely on the eval here; if the GRPO reward design itself (KL coefficient, advantage normalization, group size) is the real bottleneck, I will under-weight it.
- I may be over-indexing on measurement validity at the expense of just running the cheap $12-15 experiment to get a data point. That is a fair criticism — but a data point from a broken ruler is not cheaper, it is misleading.
- I have no strong read on whether 13 questions is enough signal for GRPO to move policy in 30 steps; that is a training-dynamics question outside my core competency.

**Recommended next step:**
**Do not run the next GRPO iteration on the current gate until you (a) establish the 5-run variance on the actual 175-question gate for both base and the step-10 checkpoint, and (b) add a second, format-tolerant rescoring pass on the *same* base and tuned outputs that separates "reasoning correct" from "format correct."** Only then can you read any delta as reasoning vs. format vs. noise. The $12-15 run is cheap in dollars; running it against an uncalibrated, single-axis, single-run baseline is expensive in interpretability — it will produce a number you cannot trust and will be tempted to act on.

---

## Orchestrator Blind-Spot Hunt

### Where all seats agree
All four seats independently converged on: **try the simple fixes first.** Schulman (prompt schema pinning, best-of-N), Finn (post-processing rules, free SFT from passing rollouts), Lambert (null-reward control), and Liang (format-tolerant rescoring) all pointed at non-training interventions before GRPO. The shared Berkeley RL lineage blind spot is defaulting to the training method before checking simpler alternatives.

### What all seats missed
The council was working from the initial "format error" diagnosis which overstated the format problem. Deeper data analysis (350 responses re-graded) showed only 14% of L9/L10 failures are format errors — 55% are genuine wrong answers. This partially undermines Finn's "kill GRPO" position (there ARE real capability gaps to close) and partially validates it (GRPO on format alone won't help much). None of the seats had the corrected failure distribution when they answered.
