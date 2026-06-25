# Agentic Trade Bench — Canonical Design Specification

**Version:** 1.1 (proposed) — §1–§16 are the verbatim v1.0 LOCKED text, unchanged. §17 is a new governance addendum from Perplexity, pending Mythos ratification.
**Date:** June 9, 2026 (v1.0 LOCKED); June 9, 2026 (v1.1 addendum proposed)
**Design partners:** Mythos, Perplexity (final v1.0 scorecards: 96 / 96)
**Status:** Design phase terminated at v1.0. Pilot phase begins. This document is the build reference. v1.1 adds change-control governance only — no scoring, regime, or data change.
**Change control:** Post-lock amendments require a delta memo ratified by both design partners and a version bump. No silent edits. v1.1 is itself such an amendment (§17), proposed by Perplexity and awaiting Mythos's ratification; until ratified, §17 is a proposal, not yet binding.

---

## 1. Thesis and positioning

Existing AI trading "benchmarks" (Nof1, Alpha Arena) are tournaments: fake money, live trading, rank by return. Single-run, non-reproducible, luck-dominated. No individual decision can be called right or wrong.

Agentic Trade Bench is the rigorous opposite: the first long-horizon autonomous agentic trading benchmark with definitive, peer-reviewable pass/fail on **decision quality**, not P&L. The headline metric is **Trading Decision Pass Rate**, reported as pass^k, one glanceable number.

The mental model: **Stockfish for trading.** Chess engines do not care whether you won the game. They score every move against the best available move from that exact position. Trading Decision Pass Rate is centipawn loss with a threshold.

Scale target: ~100 benchmark scenarios + ~200 training scenarios, multi-regime, private exam posture (consistent with the existing TradeBench evaluation policy: private questions, private scoring internals, published methodology, third-party auditor verification).

---

## 2. Architecture overview

**Backend:** NautilusTrader as a deterministic replay engine. Fixed seeds, bit-for-bit reruns. Native multi-asset support (equities, futures, FX, crypto spot, crypto perps, options, prediction markets, betting, tokenized RWA): this is a trading benchmark, not a crypto benchmark. Fills, slippage, latency and fees (MakerTakerFeeModel) are first-class.

**Mechanism:** Frozen market snapshots across regimes. At each decision point the agent sees only information available up to that moment (prices, news, holdings, policy/rulebook), then operates autonomously over a long horizon. The future is sealed. Look-ahead is structurally impossible.

**Harness rule:** Minimal scaffolding ("just go," no strategy hints), maximal interface completeness, identical across all models. The benchmark measures weights, not wrappers.

**First principles:** Three base primitives — execution quality, time/tokens saved, judgment augmentation. Sub-primitives: constraint adherence, abstention/HOLD as first-class, calibration/sizing, risk-adjusted survival over raw return.

---

## 3. Tier-1: hard binary assertions

The most verifiable primitive in trading. Per decision and per trajectory:

- Valid order construction
- Position limits and leverage caps
- No-trade lists
- Drawdown and mandate compliance

Tier-1 gates Tier-2: a constraint violation is a fail regardless of decision quality. Refusals and non-responses fail (a trading system that cannot execute has failed regardless of reasoning).

---

## 4. Tier-2: counterfactual regret core

### 4.1 Action space

At decision point t the agent observes state s (prices, news, holdings, policy) and emits an action from a defined space A: direction × size × order type × venue, plus HOLD as a full citizen of the space.

### 4.2 Utility

Utility of an action on a path = mandate-compliant P&L net of all costs over the evaluation horizon. Aggregated across the ensemble:

```
EU(a) = mean(PnL across N paths) − λ · CVaR₅(PnL across N paths)
```

- λ prior: **0.25**, single global value, published, never per-scenario tuned.
- λ ratification: published sensitivity table across {0.1, 0.25, 0.5}. If pass/fail rankings flip with λ, that is a scenario-design red flag, not a λ problem. Published artifact = value + table.
- Risk-adjusted survival lives here, in the math, not in a judge.

### 4.3 Oracle

**Ensemble-optimal oracle:** a* = the single action maximizing EU across all N paths given only information available at t. This is the definition of best decision under uncertainty.

Explicitly rejected: the per-path hindsight oracle (omniscient, measures luck from the other direction).

Oracle computation: discretized brute-force search over the action grid (direction × size buckets × order type) across all N paths. Small action spaces make this minutes of CPU, and discretization keeps the oracle auditable.

Abstention falls out for free: if a* = HOLD, any trade carries positive regret. No special rubric.

### 4.4 Regret and pass conversion

```
Regret(a) = EU(a*) − EU(a)
NormalizedRegret(a) = Regret(a) / D
```

where **D = oracle-EU dispersion across the discretized action grid** (the spread of expected utilities over candidate actions). D measures how much decisions matter in the scenario, not how volatile it is, so volatility enters the system exactly once (in the utility via CVaR). The λ/normalization double count is structurally impossible, not checked for.

**Dispersion floor:** scenarios with D below a published floor are cut. A scenario where all actions score similarly does not discriminate. The normalization denominator doubles as the scenario QA filter.

**Pass:** NormalizedRegret(a) ≤ ε, after Tier-1 gates. Binary, no partial credit. Aggregated as pass^k.

### 4.5 Luck rejection (derived, not asserted)

A bad decision that won on the realized path loses across the ensemble. A lucky win on a bad decision fails by construction. This property is math, not judgment.

---

## 5. Ensemble generation

**The determinism move:** ensembles are **pre-generated, frozen, seeded, versioned and hashed** as part of the benchmark artifact. Evaluation never resamples. Reruns are bit-for-bit. Reviewers and auditors audit the generation script and hashes separately from the eval.

**Method:** circular block bootstrap of sealed-window returns plus a regime-matched historical library (windows matched on realized vol, trend strength, liquidity). Block length tuned per asset class to preserve vol clustering and short-range autocorrelation. The realized path is always one ensemble member at weight 1/N.

**Hard no on generative path models** (GANs, diffusion). Unvalidatable components hand reviewers a free attack. Bootstrap is boring and boring is the brand.

---

## 6. Sequential scoring over long horizons

Decisions are scored per decision point. The open question is which state each decision is graded from. Resolved by a **three-arm pilot with a pre-registered decision rule**:

- **Arm A — inherited state:** grade each move from the position the agent actually occupies. Realistic compounding, full context coherence, but the inherited baseline carries luck from the stochastic path.
- **Arm B — normalized state:** grade from an oracle-tracked position. Kills the luck leak but breaks agent context coherence (grades a decision against a state the agent never reasoned from).
- **Arm A′ — segmented inherited state:** inherited within scenario phases, state resync at phase boundaries. Bounds luck-accumulation depth while preserving compounding and coherence within segments.

**Pre-registered decision rule (committed before the run, no relitigation after):**

1. Measure per arm: (i) seed robustness — regenerate ensembles under three master seeds, measure pass-rate drift; (ii) discrimination — known-good vs known-bad effect size; (iii) degradation-probe monotonicity.
2. Pick the arm with the best discrimination, subject to a stability floor on (i) and a clean pass on (iii).
3. Ties break to inherited state on realism.
4. **Conflict clause (Perplexity redline, adopted verbatim):** "If the discrimination-best arm and the stability-floor-passing arm differ, stability wins — an unstable benchmark is disqualifying regardless of discrimination."

Rationale for the conflict clause: stability is a hard constraint, not a competing objective. A benchmark whose verdicts drift across seeds is disqualified from being a benchmark regardless of how well it discriminates. Discrimination optimizes within the set of stable arms, never against it.

---

## 7. Market impact handling

The validity gap: bootstrap paths are action-independent, so an unconstrained oracle could size up for free in worlds where sizing up would have moved the book. Resolved in two stages:

**V1 — size-cap by construction.** Published routing threshold: any scenario whose maximum permitted order implies participation above ~1% of ADV (equivalent open-interest fraction for perps) is excluded from v1. V1 caps at half that threshold for margin. Note: size caps do not remove sizing as a primitive. Calibration, risk budgeting and sizing against mandate remain fully testable. What is deferred is impact-aware execution sizing specifically.

**V1.1 — labeled impact-sensitive class with the symmetric toll.** A simple, published impact model (square-root law) applied during replay **symmetrically to the agent's action and to every oracle candidate action**. The public claim is never "this impact model is true." The claim is "both sides pay the identical published toll," which converts a modeling debate into a fairness guarantee. The symmetry holds for any monotonic impact function, so the construction is locked independent of the constant.

**Row-9 deliverable:** the square-root coefficient calibration is published with the same convergence-study rigor as λ. The exact routing threshold value is calibrated empirically alongside the pilot.

---

## 8. Event/news scenario class

News-coupled scenarios cannot use the general bootstrap (counterfactual paths would contradict the news the agent was shown). They form a **separated, labeled class** built from an event-study analog library: post-event return distributions from comparable historical shocks.

This class has its own validation track, to be designed in pilot phase. **Constraint (locked): no event/news scenarios in the first 10-scenario pilot set.** The pilot tests the scoring core, not the hardest authoring problem simultaneously. This class carries the most residual uncertainty into pilot phase and is sequenced accordingly.

---

## 9. Data granularity

- **Decision-level regret: bar/L1 suffices, every regime.** Bootstrap ensembles are built on returns.
- **Execution-cost grading: realized path only, real L2 only, and only in regimes where execution quality is the graded primitive.** Order books cannot be honestly resampled.

This split cuts the data sourcing bill dramatically. Rubrics are partitioned by what each data layer can honestly support.

---

## 10. Validation battery (published deliverable)

1. **Monotonic degradation probes:** inject known-bad mutations into a competent agent (2x oversizing, ignored stop, delayed reaction, no-trade-asset violation). Score must fall monotonically or the scorer is broken.
2. **Known-good vs known-bad separation** with effect sizes.
3. **Mechanical-regret vs learned-scorer agreement.** The learned scorer earns a role only if it correlates with mechanical regret.

The battery is how the benchmark publishes "our binary is stable" with data instead of assertion, without exposing the private exam.

---

## 11. N selection protocol

- Pilot set: 10 scenarios stratified across regimes (no event/news scenarios, per §8).
- Sweep N ∈ {25, 50, 100, 200, 400}.
- Choose the smallest N where the pass/fail flip rate between consecutive doublings is <1% **and** regret SE < ε/4.
- Three-seed robustness check at chosen N.
- The convergence study is published. It is a peer-review asset.

Compute note: the agent acts once per decision point (LLM cost scales with decision points). Counterfactual scoring is pure CPU replay of the emitted action and the oracle across N paths, zero LLM inference. N is nearly free.

---

## 12. Reproducibility and infrastructure

- Deterministic replay: fixed seeds, bit-for-bit reruns.
- **Commit-pin posture: every artifact pins the exact NautilusTrader commit hash. Version labels never appear in artifacts.**
- Ensembles, exam versions, scoring harnesses and submission artifacts are versioned and hashed (consistent with existing TradeBench policy).
- Third-party auditor access for independent verification, per existing TradeBench policy.

**Funding accrual (verified from source, corroborated independently from official docs):** NautilusTrader's `SimulatedExchange` natively auto-settles perpetual funding in backtests. `FundingRateUpdate` → settlement at `next_funding_ns` boundaries with dedupe, settlement price = mark price with bid/ask midpoint fallback, amount = notional × rate × side (long pays positive funding), emits `FundingSettlement` + `PositionAdjusted(Funding)`, adjusts position P&L and account balance directly. Requirements: historical `FundingRateUpdate` data fed in, registered exec client, mark price or top-of-book available at settlement. Funding-carry regimes are unblocked.

---

## 13. Headline metric and reporting

- **Trading Decision Pass Rate**, reported as pass^k.
- Pass = Tier-1 clean AND NormalizedRegret ≤ ε.
- Public leaderboard: name, version, category (model vs agent lane), score, optional category breakdowns. Never exam content, never full response logs (per existing TradeBench policy).

---

## 14. IP posture

- **Public, defensible headline:** mechanical counterfactual regret. Nothing proprietary, fully auditable methodology.
- **Private:** exam questions, exact scoring code, the learned component.
- **Teacher→student framing (the most that is said publicly):** the mechanical oracle is the expensive teacher; a learned scorer is the cheap student approximating it. "We trained a fast approximator of an expensive, mechanically grounded oracle." The learned scorer is a diagnostic, never the source of truth, and its internals appear in no public artifact.

---

## 15. Pilot phase plan

**Next artifact: the 10-scenario pilot spec**, containing:

1. Ten scenarios stratified across regimes (no event/news class).
2. Known-good and known-bad agent definitions for battery test 2.
3. The degradation-probe mutation list for battery test 1.
4. The three-arm sequential-scoring pilot run plan (§6) with the pre-registered rule including the conflict clause.
5. The N convergence sweep (§11).
6. λ sensitivity table generation (§4.2).
7. Impact routing threshold calibration and square-root coefficient calibration (§7).

Pilot exit criteria: sequential-scoring arm selected by the pre-registered rule, N fixed, λ fixed with published sensitivity, thresholds calibrated, validation battery passing. Then scenario authoring scales toward 100 benchmark + 200 training scenarios.

---

## 16. Locked scorecard (final, both partners at 96)

| # | Component | Weight | State |
|---|---|---|---|
| 1 | Tier-2 primitive: counterfactual regret vs ensemble-optimal oracle | 14 | Locked |
| 2 | Frozen/hashed/versioned ensembles; bootstrap-only; eval never resamples | 12 | Locked |
| 3 | Headline metric: normalized regret ≤ ε, Tier-1 gated, pass^k | 6 | Locked |
| 4 | Utility form: mean − λ·CVaR₅, single published λ | 5 | Locked |
| 5 | λ value + sensitivity table | 3 | Procedure |
| 6 | Normalization: oracle-EU dispersion + floor-as-QA-filter | 6 | Locked |
| 7 | Sequential scoring: three-arm pilot + pre-registered rule + conflict clause | 10 | Procedure (rule complete) |
| 8 | Market impact: v1 size-cap + v1.1 symmetric toll | 7 | Locked |
| 9 | Impact threshold + coefficient calibration deliverable | 3 | Procedure |
| 10 | Data granularity split | 6 | Locked |
| 11 | Validation battery | 8 | Locked |
| 12 | N selection protocol | 5 | Locked |
| 13 | Event/news class: separated, own track, excluded from pilot | 5 | Locked |
| 14 | Funding accrual (verified + independently corroborated) | 4 | Verified |
| 15 | Learned-scorer demotion + teacher→student IP framing | 6 | Locked |

Residual procedure items (5, 7, 9) are resolvable only by pilot data. The design phase is closed by construction: the number reaches 100 through the pilot, never through memos.

---

## 17. Governance addendum (v1.1 — Perplexity, pending Mythos ratification)

Two change-control one-liners. They add nothing to the scoring core, regimes, or data layers (§1–§16 are untouched). They close the two ways the §6 pilot could stall without a pre-agreed exit — so a stall is resolved by procedure instead of by reopening the locked design. Until Mythos ratifies, this section is a proposal, consistent with the change-control header.

**17.1 Pre-registered null-result exit for the §6 pilot.**

> "If **no arm clears the stability floor**, the result is a *scenario-design / ε-design* failure, not an arm failure. The exit is to revise scenario construction or the ε threshold and re-run the three-arm pilot — never to reopen the locked Tier-2 design (§4) or relitigate which arm should win."

*Why:* §6 step 2 selects the discrimination-best arm "subject to a stability floor," and step 4's conflict clause resolves discrimination-vs-stability. Neither handles the case where *no* arm clears the floor at all. Without a pre-registered exit, that branch becomes an invitation to reopen the locked core. This routes the failure to the correct layer (scenario / ε design) and protects the lock.

**17.2 Post-lock non-convergence default.**

> "If the two design partners do **not converge** on a post-lock change request, the **more conservative option wins by default until resolved** — where 'more conservative' = the option that preserves benchmark stability and the existing lock. A pending disagreement **never blocks pilot execution**; the pilot proceeds on the conservative default while the disagreement is worked."

*Why:* the change-control header requires *both-partner* ratification, which is the right discipline but has no tie-breaker for a future change request the partners split on. Without one, a single open disagreement can freeze the pilot indefinitely. This makes "stability wins" — the same principle as §6's conflict clause — the standing default, so forward progress is never gated on consensus while the lock stays safe.

*Scope:* governance/change-control only. No new scoring mechanism, regime, or data requirement; nothing in §1–§16 changes. On Mythos's ratification, §17 becomes binding and the header drops "(proposed)."

---

*Ratified by Mythos and Perplexity, June 9, 2026 (§1–§16, v1.0). §17 (v1.1) proposed by Perplexity, awaiting Mythos ratification. This is the build reference for Agentic Trade Bench. Next: the 10-scenario pilot spec.*
