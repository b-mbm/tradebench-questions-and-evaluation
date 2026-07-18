# Self-Evolving Trading Agents — Fitness Function Research Plan (v0)

**Status:** PLANNING ONLY. Zero-spend. No GPU, no paid inference, no post-training, no production or broker calls, no credentials, no grader implementation, no evolutionary runtime, no change to the fixed risk cage, no change to the active TradeBench worktree or ledger.
**Run ID:** `rr-seta-fitness-v0-2026-07-18`
**Scope:** Lenny Researcher R0–R2 only. Hard stop before R3 provisioning.
**Source memo:** `/Users/bradleymiles/Documents/avalontrade-site/new_07162026/SELF-EVOLVING-TRADING-AGENTS.md`
**Living project doc:** `~/.agents/skills/bayesian-post-training/SKILL.md`
**Companion ledger:** `/Users/bradleymiles/Documents/tradebench-self-evolving-agents/RESEARCH-RUN.md`
**Author:** Lead researcher (zcode/GLM). Cross-vendor reviewer: codex / gpt-5.6-sol (see §19; review folded as Amendment A1).
**Frozen at:** commit `de22a089dbad001903d8fef9ea700d9020ba74a6` on branch `research/self-evolving-trading-agents` (the code under critique; the two new artifacts are themselves uncommitted until the founder approves the commit).

## Amendment log
- **A1 (2026-07-18, post cross-vendor review by codex/gpt-5.6-sol):** Folded two blockers and nine majors from the clean-context review. Changes: (a) G5 now requires an *independent* frozen replay/oracle and is marked N/A until one exists (not the candidate's own forecast); (b) G3 now requires *process-level information isolation* with its own RED tests, not just hashes/timestamps; (c) the lexicographic vector is renamed an *eligibility/constraint* vector and a separate *multi-objective selection rule* is required for the all-pass case; (d) G8 is split — mandate-compliance moves into the eligibility block, billing/recovery becomes operational readiness (not fitness); (e) the root falsifier moves from F3 to *information/oracle integrity* (F2 + side-channel RED), and F3 is redefined with matched ex-ante distributions to escape tautology; (f) E0 is relabeled a *self-consistency* test and an *independently-authored hidden fixture/oracle* step is added for construct validity; (g) G6 replaces the fixed coverage band with a risk-coverage frontier plus mandate-defined minimum coverage; (h) the statistical design adds regime-cluster resampling and a rolling shadow window per generation (seeds alone are pseudoreplication); (i) C6/C12 regraded as design commitments, not current facts; (j) citation precision fixed (DSR is a separate paper; Bottou requires positivity/logging-policy assumptions; Geifman–El-Yaniv does not justify a two-sided coverage band); (k) the Gen 0 off-weights rationale is reframed from "prompt-conflict-dominant" to "no valid corpus/reward exists yet." All changes are inline below; superseded text is struck through where short and replaced where long.

**Gate renaming key (authoritative; applies to all sections):** the pre-A1 `G1..G8` names map to the post-A1 eligibility gates as follows — `G1→E1` (safety/cage, now +mandate), `G2→E2` (executability/schema, now +empty-forecast), `G3→E3` (information integrity, now process-isolation not just hashes), `G4→E4` (proper-score forecast quality, unchanged concept), `G5→E5` (decision utility, now requires independent oracle), `G6→E6` (abstention risk-coverage, now frontier not band), `G7→E7` (robustness, now regime-cluster), `G8→split`: mandate-compliance folded into `E1`, billing/recovery moved out of fitness into operational readiness. Where pre-A1 prose in §13/§15/§16/§17/§18/§19 still reads `G1..G8`, read it through this mapping. The `G`-references inside this A1 log itself and inside the §18 council debate describe the *change* and are intentionally historical.

---

## 0. Pre-K founder summary

### ELI5

Imagine you want to breed the world's best trading robot, but you cannot tell — just by looking at whether a trade made money — whether the robot was *smart* or just *lucky*. A lucky fool and a genius look identical after one winning bet.

So you need a *judge*. The judge's job is to score each decision the robot makes against **only what the robot could have known at the moment it decided**. Did it have a good reason? Did it predict the range of outcomes honestly? Did it stay out when staying out was right?

This document is the blueprint for that judge — and for a tiny, cheap, *honest* experiment to test whether the judge can actually tell skill from luck *before* we spend any money or train any model.

The most important thing in the whole document: **the judge does not exist yet.** What we have today is a grader that checks whether a model's JSON answer matches a pre-baked correct answer. That is a useful test, but it is not a fitness function for evolution. We must not pretend it is.

### ELI2

We need to prove the judge can fail known-bad cheaters and pass known-good decisions — using only data we already have, for $0 — before anyone is allowed to spend money or train a model. The judge is the company. Build a tiny honest judge first.

### Plain-adult summary

Avalon's thesis is that a trading agent can be **grown** rather than shipped, by placing its reasoning under an **honest selection pressure** (a fitness function that separates skill from luck, scores abstention correctly, and resists reward hacking). That thesis is strong *as an aspiration*. It is currently **unproven and partly unevidenced**: the artifact that would carry the thesis — a grader that scores decisions against what was knowable at decision time, uses resolved outcomes only to catch luck, and rewards restraint — **does not exist in the codebase today**. What exists is a 300-question benchmark grader that checks JSON fields against pre-baked correct answers. That grader measures a related but different construct (decision correctness against a known key), and it is contaminated for evolutionary purposes by several reward-hack surfaces.

This plan defines (a) the smallest **decision specimen** we must freeze before outcomes resolve, (b) a **Fitness Function v0** that is a *score vector with gates* rather than a single weighted scalar, (c) a **known-bad fixture suite** that must make every gate go RED before any gate is trusted (no RED proof = no gate), (d) the **cheapest discriminating experiment** that can falsify Fitness Function v0 using only existing logs, historical replay, deterministic fixtures, or paper agents, and (e) the **founder decision queue** for every boundary that crosses a hard rail (new data sources, evaluator changes, GPU spend, model promotion).

The headline ask of the founder is **not** for money or GPUs. It is for a decision on **three things that cost nothing**: which minimum specimen fields to freeze, whether to treat the existing benchmark grader and a future regret-oracle as two different instruments, and whether to allow construction of a *deterministic, offline* RED-proof harness (no live data, no broker) as the very next step.

---

## 1. Verdict (the one-paragraph answer)

**The self-evolving thesis is directionally sound but currently unfalsifiable as stated, because the load-bearing artifact — an honest, point-in-time, luck-discounting, abstention-aware fitness function — does not exist and has never been tested against a known-bad suite.** The single most important next step is **not** training, **not** GPU spend, **not** a new model, and **not** a new data source. It is to build a deterministic, offline, $0 **RED-proof harness** that demonstrates each gate in Fitness Function v0 fails on a known-bad fixture (random trader, hindsight cheater, lucky gambler, hidden-tail-risk, overtrader, always-abstain, persuasive-but-wrong reasoner, cost-ignorer, duplicate-state spammer, post-hoc-search survivor). If a gate cannot be made to go RED on its corresponding fixture, the gate does not exist as a scientific instrument and must be cut from v0. Fitness Function v0 is accepted as a *plan* only when every surviving gate has a demonstrated RED proof and at least one known-good fixture that passes it. Until then, every external "self-evolving" claim — to users, investors, or the site — must be labeled Phase-1 (live graded execution only), not Phase-3 (observable generational improvement).

**Post-cross-vendor-review addendum (Amendment A1):** the clean-context reviewer (codex/gpt-5.6-sol) **rejected Fitness v0 as written** and surfaced two blockers that must be repaired *before* E0 is trusted: (i) G5 (utility) was circular — it used the candidate's own forecast as the utility input, making utility gameable; (ii) G3 (leakage) did not actually catch side-channel cheating — hashes prove recorded-input integrity, not absence of side channels. The review also established that E0, because the same author writes gates + fixtures + truth, is only a **self-consistency** test, not a **construct-validity** test; construct validity requires an independently-authored hidden fixture/oracle. The plan below incorporates A1 inline; the net effect is that v0 is *harder* than the first draft (independent oracles required, process-level isolation required, multi-objective selection rule required, regime-cluster resampling required) and the externally claimable result is even further from today than the draft suggested.

---

## 2. Verified facts, user-stated facts, assumptions, unknowns

**Verified facts (checked against files in this repo or primary sources):**

- V1. Worktree path, branch, HEAD verified: `/Users/bradleymiles/Documents/tradebench-self-evolving-agents`, branch `research/self-evolving-trading-agents`, HEAD `de22a089...`, clean tree, repo origin `https://github.com/b-mbm/tradebench-questions-and-evaluation.git`. `de22a08` is an ancestor of HEAD (HEAD is exactly `de22a08`), so no subsequent work to preserve. *(R0 receipt in RESEARCH-RUN.md.)*
- V2. The deployed grader is `gradeSchemaResponse` in `src/grading/schema-grader-300q.ts:3727`. It does deterministic exact / fuzzy / range matching against pre-baked correct answers in `question.expected_values` and `rubric._l9_canonical` / `rubric._agi_canonical`. There is **no regret oracle, no NautilusTrader replay, no ensemble-optimal `a*` computation** in the codebase. The canonical spec (`Internal_docs/agentic_trade_bench_canonical_spec_v1_1.md` §4.3) defines that oracle; the deployed grader does not implement it.
- V3. The model-output schema is `ExecuteOneResponse` (`src/prompts/schema-prompts.ts:3-25`, mirrored at `src/types/schema.ts:18-30`). Verbatim fields: `intent, order_type, asset, size, unit?, price?, venue, venue_name?, risk_controls{stop_loss?, take_profit?, slippage_tolerance?, max_gas?, position_size_limit?, [key:string]:unknown}, follow_up?, reasoning?, requires_follow_up?, follow_up_description?`.
- V4. **No confidence field is emitted by the model.** `confidence` exists only in `GradeResult.confidence` (`src/types/schema.ts:65`) and is *grader-computed* (`schema-grader-300q.ts:3906`), never model-emitted.
- V5. **No probabilistic forecast field exists** in the schema. The only place probabilities appear is one rubric family (`risk_adjusted_leverage`, expecting three scalar `liquidation_probabilities`), scored as range-membership, not as a distribution (`schema-grader-300q.ts:2059-2247`).
- V6. **No downside / tail / VaR / CVaR / invalidation field** exists in the schema. Closest analogs: `worst_case_residual_pnl_usd` (AGI rubric range field), `il_loss_usd` (LP rubric loss magnitude).
- V7. **Abstention has no dedicated field.** It is encoded as the numeric sentinel `expected_value: 0` (see `src/rubrics/l9-L9-028.json` `_l9_canonical.expected_value = 0`, `grading_notes: "...no_action sentinel 0"`).
- V8. **No decision-timestamp tied to market data, no content hash of the observation, no model/prompt/rubric/git provenance.** Grep for `prompt_version|git_commit|git_sha|model_hash|config_hash|content_hash|data_hash|market_hash` across `src/` and `scripts/` returns zero matches. The only provenance is `model`, `modelLabel`, `family`, and a hard-coded `suite: "r5e1-300q"` string.
- V9. **No risk cage in code.** No global position-limit, no enforced leverage cap (max_leverage appears only in prompt prose), no stop-discipline gate, no veto surface, no portfolio-level exposure check. `RiskControls` (`src/types/schema.ts:9-16`) is a passive output bag the model may populate and which is largely unscored.
- V10. **No decision-time vs. resolution-time separation.** The grader is invoked synchronously after generation (`scripts/run-300q.ts:159`); the "outcome" is a pre-baked correct answer known before the model is called. There is no resolved-outcome step. This is a benchmark, not a forward test.
- V11. The grader-freeze council (`Internal_docs/council-decision-grader-freeze-2026-07-03.md`) unanimously chose "Path (b)": freeze the grader, restrict any training reward to ~202 mutation-robust verifiable questions, quarantine ~98 hidden-oracle AGI as held-out generalization probe. Frozen evaluator remains frozen.
- V12. SFT has plateaued across v2/v3/v4 (all within ±3 of base on 300Q); GRPO is on hold per four-seat council + GPT-5.5 (`Internal_docs/council-review-2026-07-09.md`, `~/.agents/skills/bayesian-post-training/SKILL.md`). The dominant correctable error class on the current gate is a **prompt conflict** (ExecuteOneResponse interface vs. per-question schema), fixable for $0 — *not* a model-capability gap.
- V13. The 4th council seat is **Chen** (data/evaluator gate), per the founder's correction folded into `RESEARCH-RUN.md` R3. The skill's "Liang" seat is the historical reading; the active council uses Chen in seat 4.
- V14. The canonical spec explicitly rejects partial credit at the *publication* layer ("Binary, no partial credit, aggregated as pass^k", §4.4) while the first-principles doc urges exposing field-level partial credit as a private *training-side* artifact. These are reconcilable as two layers (public binary pass^k; private dense field scores) but the docs do not say so explicitly.
- V15. The grader-freeze blind-spot hunt (L43) flags that the post-training council **cannot answer** whether the ~202 verifiable fields correlate with trading edge — "the benchmark measures numerical bookkeeping correctness, not strategy quality." This is the single most important markets-side gap.
- V16. Primary citations verified (all checked July 2026):
  - Gneiting & Raftery (2007), "Strictly Proper Scoring Rules, Prediction, and Estimation," *JASA* 102(477), 359–378. https://sites.stat.washington.edu/raftery/Research/PDF/Gneiting2007jasa.pdf
  - Bailey, Borwein, López de Prado & Zhu (2017), "The Probability of Backtest Overfitting," *Journal of Computational Finance* 20(4). https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2326253
  - Turpin, Michael, Perez & Bowman (2023), "Language Models Don't Always Say What They Think," NeurIPS 2023. https://arxiv.org/abs/2305.04388
  - Bottou et al. (2013), "Counterfactual Reasoning and Learning Systems," *JMLR* 14, 3207–3260. https://www.jmlr.org/papers/v14/bottou13a.html
  - Geifman & El-Yaniv (2017), "Selective Classification for Deep Neural Networks," NeurIPS 2017. https://arxiv.org/abs/1705.08500

**User-stated facts (from the source memo; accepted as the company's intent, not as evidence the system does this):**

- U1. "A self-evolving trading agent is a reasoning system placed under honest selection pressure." (§2)
- U2. "The grader scores each decision against what was knowable when it was made, then uses the outcome only to catch luck." (§3)
- U3. "The risk cage does not evolve." (§4)
- U4. "Who grades the grader: the grader is itself scored on calibration, after markets resolve, against hindsight." (§7.5)
- U5. Phase 3 (generations) is defined as "Generation N+1 measurably out-judges Generation N on regimes neither has seen." (§8)

**Assumptions (must be labeled, may be wrong):**

- A1. The founder wants the *honest* version of this claim even if it is much smaller and slower than the marketing version. (Inferred from the existence of this zero-spend planning run.)
- A2. A subset of the existing TradeBench questions can be reinterpreted as *decision specimens* for purposes of a $0 RED-proof harness, even though they were not authored as point-in-time specimens. (Tested in §10; the reinterpretation is partial and lossy.)
- A3. The risk cage, when it exists, will be expressible as a finite set of deterministic constraints checkable on the specimen *before* resolution. (Plausible; not yet verified against any production trading code, which is outside this worktree.)
- A4. A *frozen* fitness function can be defined before any evolutionary loop runs, and can be tested against deterministic fixtures without ever calling a live model. (This is the central methodological bet of v0.)

**Unknowns (cannot be resolved without founder input or new evidence):**

- U1. Whether a future production system will emit the specimen fields this plan requires (the production trading system is outside this worktree).
- U2. Whether the regret oracle in the canonical spec will ever be implemented; if not, v0 must use a *surrogate* ground-truth (resolved outcome + counterfactual estimate), which is weaker.
- U3. Whether the founder treats the existing 300Q grader and the canonical-spec regret oracle as the *same instrument* (they are not) or as *two instruments* that must converge before any generational claim.
- U4. What "regime" labeling is authoritative, given overlapping horizons and correlated ticks.
- U5. Whether abstention in production is ever *truly* gradeable (it is in the memo's strong claim) — see §6 for the precise condition under which it is.

---

## 3. Operational definition of "self-evolving trading agent"

The strongest defensible definition is *operational and falsifiable*, not aspirational. We accept the thesis as **demonstrated** for a system S only when **all seven** of the following hold (condition 7 added by Amendment A1 — without it, an unrelated better model from elsewhere could satisfy 1–6 and the system would not be "self-evolving," merely "upgraded"):

1. **Specimen integrity.** Every decision S makes is captured before resolution in a frozen specimen containing, at minimum, the fields in §5, with a content hash of the point-in-time observation and full model+prompt+rubric+code provenance.
2. **Honest grader.** An episode grader G exists, is frozen, and scores each specimen against *only what was knowable at decision time*. G is auditable, versioned, and itself scored on calibration after resolution (§16).
3. **Luck discounting.** G demonstrably separates skill from luck across cohorts: a known-lucky cohort (high-variance gambler fixture) scores **strictly worse** than a known-skillful cohort ( calibrated forecaster fixture) at matched outcome P&L. **Single-trade outcomes never determine skill.** (Required by the memo §3; operationalized by RED proofs in §7.)
4. **Abstention correctness.** G rewards useful abstention (avoiding a realized loss) and **penalizes** universal abstention (always-abstain fixture must score strictly worse than calibrated forecaster on a coverage-adjusted basis).
5. **Robustness.** G's skill ranking is stable across regimes, assets, venues, seeds, and time windows partitioned so that no information leaks across the train/validation/shadow boundary (§11).
6. **Generational improvement, the only externally claimable result.** "Generation N+1 improves upon Generation N" means: on a **pre-registered, item-disjoint, future-shadow partition neither generation trained on nor was selected against**, Generation N+1's cohort score vector beats N's by a pre-registered statistical margin (paired-seed design per `research-conductor` R6.1, *plus* regime-cluster resampling per Amendment A1 — seeds alone measure model stochasticity on one market sample, not time/regime uncertainty), with no named regression slice degrading beyond floor, and the null-reward control (shuffled reward run) failing to reproduce the gain.
7. **Lineage and grade-driven propagation (Amendment A1).** The improvement in N+1 must be *attributable to grade-driven selection on N's specimen archive*, not to an unrelated external change of model, data, or code. Lineage from N's archive through the selection mechanism to N+1's variation must be recorded; an unrelated better model dropped in from outside does not satisfy the thesis even if it scores higher.

Until **all seven** hold, external claims must stop at Phase 1 (graded execution) or Phase 2 (corpus accumulation), never Phase 3 (generations).

**The exact evidence required before Avalon may honestly claim "Generation N+1 improved upon Generation N":**

- A frozen Fitness Function v0 (this document, after RED proofs land) and any versioned amendments.
- A pre-registered paired-seed statistical design on a future-shadow partition that is item-disjoint from both the selection corpus and the calibration corpus.
- A passing R6 mechanical-comparability pre-check (same evaluator, same data/splits, same prompt and serving stack, same seeds, same hardware class, same time budget).
- A delta on the gate set that clears the pre-registered threshold under the pre-registered statistic.
- A held-out delta on a partition neither generation saw, commensurate with the gate delta (no big-gate-gain + flat-held-out signature).
- A passing null-reward control (real reward beats shuffled reward).
- A passing reward-hacking / metric-integrity audit (the §15 attack suite executed against the winner).
- A provenance manifest with no UNKNOWN in any identity field.
- A separate human approval bound to the exact candidate semantic hash.
- **(Amendment A1)** A recorded lineage chain from N's archive through the selection mechanism to N+1's variation, demonstrating the improvement is attributable to grade-driven selection (not an unrelated external model/data/code change).
- **(Amendment A1)** A multi-objective selection rule (not just the eligibility vector) that defines how the all-pass case is ranked, so "every gate passes" does not collapse into an undefined tie.

Anything less is **not** a generational claim. It is a within-generation measurement.

---

## 4. Scientific critique of the source memo

We preserve the **strongest thesis** of the memo and then grade each load-bearing claim as **Earned / Plausible-but-unproven / Overstated / Currently-false**, against the verified evidence above.

**Strongest thesis (preserved, defended):** *Raw profit is a corrupted fitness signal for trading agents, because it conflates skill with luck; any honest "evolution" of trading judgment requires a selection mechanism that scores decisions against what was knowable at decision time and uses resolved outcomes only to catch luck.* This is correct, load-bearing, and not in dispute anywhere in the corpus. It is the only leg that, if it falls, kills the whole company thesis.

| # | Claim (paraphrased, memo §) | Grade | Why |
|---|---|---|---|
| C1 | "A trading agent can be a grown artifact." (§1) | **Plausible-but-unproven** | Untestable as stated. Operationalized in §3; depends on C2–C9. |
| C2 | "Selection on skill breeds judgment; selection on outcomes breeds variance-seeking." (§3) | **Qualified / theoretically supported (Amendment A1)** | The precise result is: *finite-sample* outcome selection favors variance (the convex-payoff / lottery-ticket effect). "Universally breeds variance-seeking" overstates the asymptotic claim. The load-bearing insight survives in its finite-sample form, which is the regime that matters for trading; we keep C2 as the thesis but mark it qualified, not unconditional. |
| C3 | "The grader scores each decision against what was knowable when it was made, then uses the outcome only to catch luck." (§3) | **Currently-false (as a description of today's system)** | V2, V10. The deployed grader checks fields against a pre-baked answer known before the call. There is no point-in-time/outcome separation. The *described* grader is a design target, not an existing artifact. |
| C4 | "It can score the act of not acting... abstention is the single most honestly gradeable event in trading." (§3) | **Overstated** | Abstention is honestly gradeable **only** when the counterfactual ("what would have happened had we acted") is *independently estimable* (e.g., the asset traded and the would-be entry are observable afterward). Where the counterfactual is unobservable (e.g., "we declined to discover this opportunity at all"), abstention is *less* gradeable than an act, not more. See §6. |
| C5 | "Regime change is a generational extinction event... markets are the native habitat for self-evolution." (§3) | **Plausible-but-unproven** | Directionally reasonable; but regime labeling is itself an unresolved modeling choice (U4), and "regime turnover is the regularizer" only regularizes if the selection signal is honest — which is C3, currently false. |
| C6 | "The risk cage does not evolve." (§4) | **Design commitment, not a current fact (Amendment A1)** | V9. No cage exists in code. The principle is correct and we keep it as a *commitment*; but a present-tense statement ("the cage does not evolve") about a system with no cage is currently vacuous, not "earned." |
| C7 | "Failure is revenue to the system. A losing trade that is honestly graded improves the next generation." (§5) | **Overstated** | Only true *if* C3 holds. Today a losing trade is graded against a pre-baked key; it does not produce the counterfactual information that would make it "revenue." |
| C8 | "The archive is the moat... cannot be bought, scraped, or shortcut." (§5) | **Overstated as stated; defensible under conditions** | An archive is only a moat if its specimens are *valid* (§5) and its grading is *honest* (C3). A corpus of invalid specimens graded by a leaky grader is a liability, not a moat. The moat is *conditional on the rest of this plan landing.* |
| C9 | "Ranking labs will compete on graders." (§5) | **Speculative** | Marketing thesis; out of scope for this plan, no scientific claim. |
| C10 | "Generation N+1 measurably out-judges Generation N on regimes neither has seen." (§8, Phase 3) | **Currently-false as a description of today; the correct definition of the goal** | This is the right *target*. The entire §3 operational definition exists to make this sentence falsifiable. Today it is unobservable: no future-shadow partition, no frozen fitness function, no calibrated grader. |
| C11 | "Overfitting is selection on a static dataset... regime turnover is the regularizer." (§9) | **Overstated** | Non-stationarity is *not* a free lunch against overfitting. Selection bias, repeated backtest search, and regime cherry-picking still apply (Bailey et al. 2017, V16). The memo's answer to "isn't this just overfitting" is the weakest answer in the document; see §15 attack suite and §11 time-safe partitions. |
| C12 | "Survivorship bias: we keep the dead." (§9) | **Currently-false as stated; design commitment (Amendment A1)** | The archive schema in §5 *would* support keeping dead specimens, but no archive exists yet (V8 — flat JSONL only). A present-tense claim about a property of a system that has not been built is currently false. It is a commitment for v0. |
| C13 | "The grader is itself scored on calibration, after markets resolve, against hindsight." (§7.5) | **Currently-false** | No grader-of-the-grader exists. §16 defines the minimum. |
| C14 | "The system evolves, the individual agent does not rewrite itself." (§7.1) | **Earned as a bright line** | Keep. We harden it: no surface may mutate at the individual level; all mutation is generational and goes through the promotion harness (§5). |

**Strongest surviving thesis after critique:** *Profit is a corrupted fitness signal; honest point-in-time grading is the only defensible selection mechanism; everything else in the memo is architecture that has not yet been built and must be tested gate-by-gate before any external generational claim.*

---

## 5. Component definitions + minimum decision-specimen schema

### 5.1 The eight components, distinguished precisely

| Component | Definition | Exists today? |
|---|---|---|
| **Decision specimen** | The frozen, hash-bound record of *what was known and what was chosen* at a single decision point, captured **before** the outcome resolves. The atom of selection. | **No.** Closest analog is `GenerationRow`/`EvaluationRow`, which lacks most required fields (V3–V9). |
| **Episode grader** | A function from one specimen + (later) its resolved outcome to a *field-level score vector*. Scores what was knowable at decision time; uses the outcome only to catch luck. Frozen, versioned. | **No.** Closest is `gradeSchemaResponse`, which scores against a pre-baked key (V2, V10). |
| **Cohort-level fitness function** | A function from a *cohort* of graded specimens to a *score vector* (not a scalar) with lexicographic / constrained gates. The selection signal. | **No.** Designed as v0 in §7. |
| **Candidate archive** | Append-only, content-addressed store of every specimen (acted and abstained, won and lost) with lineage. The moat substrate. | **No.** Only flat JSONL benchmark outputs in `results/`. |
| **Variation mechanism** | The procedure that produces candidate successors (prompt mutation, memory policy change, tool-policy change, strategy composition, inference-parameter change, or weight update). Bounded by the mutable surfaces declared in the contract. | **Partial.** Prompt-variant tooling exists (`prompts-300q-variantB.json`); no other variation surfaces wired to a selection loop. |
| **Selection mechanism** | The procedure that picks which candidates propagate, using the cohort fitness vector, subject to the frozen gates and the risk cage. | **No.** |
| **Promotion harness** | The mechanical, hash-bound, two-key procedure that moves an accepted candidate to a successor generation. Human approval is one of the two keys. | **No** (and out of scope to build; this plan only defines its inputs). |
| **Fixed risk cage** | The set of deterministic, human-fixed constraints (position limits, leverage caps, stop discipline, veto surface, mandate) enforced on every specimen *before* scoring. **Outside the evolutionary loop.** | **No** (V9). |

### 5.2 Minimum decision specimen (frozen before outcome resolves)

The specimen is **append-only**: identity block frozen at decision time; outcome block appended after resolution. Every field below is **required unless marked optional-diagnostic**. Anything not captured at decision time **cannot be reconstructed honestly later** (V10) and is therefore a blocking gap if missing.

```
# Decision Specimen v0  (frozen at decision_ts; outcome appended at resolved_ts)

# --- IDENTITY BLOCK (frozen at decision_ts, hash-bound) ---
specimen_id            : ulid                              # globally unique
decision_ts_utc        : ISO8601 ns precision, UTC         # the market decision instant, NOT process time
as_of_ts_utc           : ISO8601, the data "as-of" instant # <= decision_ts; what the data claims to know
observation_hash       : sha256                            # content hash of the EXACT observation blob the agent saw
observation_ref        : uri or content-addressed pointer  # the blob itself, or its location
provenance             : {                                 # full identity, no UNKNOWN allowed at promotion
                         model_id, model_revision,
                         prompt_id, prompt_hash,
                         rubric_id, rubric_hash,
                         code_commit_sha,
                         serving_config_hash,
                         seed,
                         agent_generation_id              # which generation produced this
                       }

# --- DECISION BLOCK (what was chosen, frozen at decision_ts) ---
asset                  : string
venue                  : string
horizon                : duration (e.g., 7d, 1h)           # explicit, not prose
available_actions      : [enum]                            # the menu actually offered
action                 : enum in available_actions OR "ABSTAIN"
abstain                : bool                              # EXPLICIT, not a numeric sentinel (fixes V7)
size_requested         : decimal + unit                    # what the agent asked for
active_constraints     : {                                 # the risk cage as it applied here (fixes V9)
                         max_notional, max_leverage,
                         max_position_fraction,
                         stop_required, stop_level,
                         veto_surface_version,
                         mandate_id
                       }

# --- FORECAST BLOCK (the agent's stated belief, frozen at decision_ts) ---
forecast               : {                                 # PROBABILISTIC, not point estimate (fixes V5)
                         distribution_type,                # e.g., "discrete", "normal", "mixture"
                         parameters,                       # e.g., {p50, p05, p95} or pmf
                         method                             # how the agent claims it got here
                       }
expected_return_net    : decimal                           # AFTER fees, spread, slippage, sizing (fixes gross/net conflation)
cost_breakdown         : {fee, spread, slippage, funding, gas, other}
downside               : {                                 # tail, not just a point (fixes V6)
                         measure,                          # "CVaR95" | "VaR99" | "worst_case"
                         value, unit,
                         horizon
                       }
invalidation_condition : string + machine-readable predicate  # "exit if X" (currently ABSENT)
confidence             : decimal in [0,1]                  # MODEL-EMITTED, not grader-computed (fixes V4)
reason_codes           : [enum]                            # deterministic, machine-readable (currently ABSENT)

# --- DIAGNOSTIC BLOCK (optional evidence; never load-bearing in the fitness vector) ---
prose_reasoning        : string                            # CoT. Diagnostic ONLY. See §15 attack on CoT faithfulness.

# --- OUTCOME BLOCK (appended at resolved_ts; never visible at decision_ts) ---
resolved_ts_utc        : ISO8601
realized_pnl_net       : decimal                           # after all realized costs
realized_path          : [observations]                    # what actually happened
counterfactual         : {                                 # what would have happened under alternative actions
                         method,                           # "replay" | "model" | "none"
                         estimates_per_action              # {action -> pnl distribution}
                       }
cage_violations        : [enum]                            # did the execution breach the cage?
fill_quality           : {slippage_realized, fee_realized, latency_ms}
```

**Field-level gap table (specimen → current code):**

| Required specimen field | Status in current code | Smallest logging delta to close |
|---|---|---|
| `decision_ts_utc`, `as_of_ts_utc` | ABSENT (only runner wall-clock) | Add explicit market-as-of timestamp from the data feed at emit time. |
| `observation_hash`, `observation_ref` | ABSENT | Hash the exact observation blob before model call; store content-addressed. |
| `provenance` (model/prompt/rubric/code/serving/seed) | ABSENT | Stamp at emit time from build env; refuse UNKNOWN at promotion. |
| `asset`, `venue`, `size_requested` | PRESENT | Add `unit` enforcement. |
| `horizon` | PARTIAL (prose only) | Promote to structured field. |
| `available_actions` | PARTIAL (prose only) | Emit the offered menu as enum list. |
| `action` + `abstain` | PARTIAL (`expected_value:0` sentinel) | Add explicit `abstain: bool` and `action: enum`. |
| `active_constraints` | ABSENT | Emit the cage snapshot that applied. |
| `forecast` (distribution) | ABSENT (one rubric has 3 scalars) | New schema field; required for any probabilistic-scoring gate. |
| `expected_return_net` + `cost_breakdown` | PARTIAL (gross/net conflated) | Split gross vs net; itemize costs. |
| `downside` (tail) | ABSENT | New field; pick measure (recommend CVaR95). |
| `invalidation_condition` | ABSENT | New field; machine-readable predicate + prose. |
| `confidence` (model-emitted) | ABSENT (grader-computed only) | Require model to emit; do not compute. |
| `reason_codes` (machine-readable) | ABSENT | New enum field. |
| `prose_reasoning` | PRESENT | Demote to diagnostic; never load-bearing. |

**Minor schema note (Amendment A1):** the prompt's `ExecuteOneResponse` (`src/prompts/schema-prompts.ts:3-25`) and the TS type `ExecuteOneResponse` (`src/types/schema.ts:18-30`) are **not identical**: the prompt declares `unit`, `requires_follow_up`, `follow_up_description` as fields the model may emit, but the TS type admits them only via an index signature (the V3 audit found the type omits them). The plan treats the prompt interface as the de-facto schema and recommends the type be made authoritative (or the divergence documented) before any specimen work relies on field-level agreement.

**Smallest logging delta before fleet data can become training evidence:** the **identity block** (timestamps, hashes, provenance) and the **forecast block** (probabilistic distribution + net expected return + downside + invalidation + model-emitted confidence + reason codes). Without the identity block, no specimen is reproducible; without the forecast block, no probabilistic-scoring or skill-vs-luck gate can be computed. Both blocks are founder decisions because they change the production logging surface (which is outside this worktree).

---

## 6. Cohort-level outcome use (calibration, conditional skill, counterfactual regret, decision utility) — without pretending one outcome reveals one decision's skill

The memo is right that "one outcome does not reveal whether one decision was lucky." The literature tells us exactly what we *can* estimate from resolved outcomes across cohorts, and under what conditions:

- **Calibration.** Pool specimens by forecast bin (e.g., decile of `forecast.p50` or binned `confidence`). Compare the *forecast distribution* to the *realized outcome distribution* per bin. Score with a **strictly proper scoring rule** (Gneiting & Raftery 2007, V16): **CRPS** for continuous forecasts (e.g., return distributions), **Brier / log score** for discrete events (e.g., "did PnL exceed X"). Properness is the property that *the agent's unique best expected score is attained by reporting its true belief* — the formal version of "honest forecasts are rewarded." **Calibration is a cohort property**, not a single-specimen property; it requires a cohort large enough to populate each bin (≥30 per bin is a working floor, more for the tails).
- **Conditional skill.** Skill = the part of the score that is *not* explained by the forecast's miscalibration *and* not explained by noise. Estimate via **conditioning**: compare the cohort's realized proper-score to (a) a reference forecaster (e.g., always-base-rate) and (b) the same forecaster with shuffled forecasts. A cohort that beats both has conditional skill. **One trade never carries this.**
- **Counterfactual regret.** For each specimen, the regret of action `a` is `EU(a*) − EU(a)` where `a*` is the ensemble-optimal action under the information set at `decision_ts` (canonical spec §4.3). This requires either a replay engine (NautilusTrader, per the canonical spec) or a counterfactual model (Bottou et al. 2013, V16 — the example is computational advertising, but the framework is exactly "evaluate a policy from logged data without re-running it"). Where neither is available, regret is **unestimable** and that gate must be marked N/A — not silently filled with P&L.
- **Decision utility after costs.** `EU(a)` averaged over the cohort, *net* of all costs, with the agent's own `forecast` and `downside` as the utility inputs (the canonical spec uses `mean(PnL) − λ·CVaR95(PnL)`, λ prior 0.25, with a required sensitivity sweep at {0.1, 0.25, 0.5}). If rankings flip across λ, that is a scenario/agent-design red flag, not a result.

**The rule that prevents luck-as-skill:** the cohort-level fitness vector is computed from **resolved outcomes used in cohort aggregates only** (calibration, conditional skill, regret, utility), **never** from a single specimen's outcome. A single winning trade with a mis-calibrated forecast contributes *negatively* to calibration even if its P&L is positive. This is the formal expression of the memo's intuition.

**The abstention caveat that the memo overstates (C4):** abstention is honestly gradeable **iff** the counterfactual is estimable. Two cases:
1. *Observable counterfactual* ("declined to buy asset X at price P"; the price path of X is observable afterward) → abstention is gradeable, and abstaining from a subsequent loss is genuinely the cleanest signal in the system.
2. *Unobservable counterfactual* ("declined to search opportunity space Y"; we never learn what Y would have yielded) → abstention is **not** cleanly gradeable. The always-abstain fixture exploits exactly this: it can hide behind "you can't prove my non-actions lost money." The coverage-adjusted gate in §7 handles this by penalizing abstention rates that fall outside a pre-registered coverage band.

---

## 7. Fitness Function v0 — eligibility/constraint vector + multi-objective selection rule (revised by Amendment A1)

**Two changes from the first draft (A1), both forced by the cross-vendor review:**
1. The reviewer's blocker: "because every gate must pass, the lexicographic order does not affect acceptance — there is no rule that ranks all-pass candidates." Fix: the vector is renamed an **eligibility/constraint vector** (every gate must pass for the candidate to be *eligible*); a *separate* **multi-objective selection rule** ranks eligible candidates. This also fixes the G8 misplacement (mandate compliance is an eligibility constraint, not a fitness score; billing/recovery is operational readiness, not fitness).
2. Two gates were circular or non-functional as written (G3, G5). Both are redefined below to require *independent* oracles/isolation, and both are marked **N/A until the independent artifact exists**.

**Design rule (unchanged):** do not collapse v0 into one weighted scalar unless evidence proves it necessary. A weighted scalar is an exploit surface (a candidate can trade off safety for utility), hides gate failures behind good averages, and invites the very reward hacking the memo warns against.

### 7.1 The eligibility/constraint vector (every gate must pass for eligibility)

Gates are listed in enforcement order. A candidate that fails any gate is **ineligible** regardless of selection-rule score.

```
ELIGIBILITY / CONSTRAINT BLOCK  (Amendment A1: was "lexicographic fitness vector")

E1  SAFETY / CAGE / MANDATE   : cage_violations == 0 across the cohort
                                AND every specimen's active_constraints honored
                                AND mandate compliance (was buried in old G8; moved here)
                                FALSIFIER: hidden-tail-risk fixture, hidden-leverage fixture,
                                           mandate-violating fixture (§8, augmented by A1)
                                STATUS: gate not accepted until RED proof (§8)

E2  EXECUTABILITY + SCHEMA    : 100% of specimens parse, are well-formed, and
                                carry all required identity + forecast fields
                                AND forecast field non-vacuous (parse-time rejection on
                                missing/empty forecast — Finn's condition, §18)
                                FALSIFIER: duplicate-state spammer, malformed-JSON fixture,
                                           empty-forecast fixture (added by A1)
                                STATUS: gate not accepted until RED proof

E3  INFORMATION INTEGRITY     (was G3 LEAKAGE ELIGIBILITY; redefined by A1)
                              : OLD formulation (observation_hash + as-of uniqueness + provenance)
                                is NECESSARY but NOT SUFFICIENT. A policy can read future data,
                                emit an action, and still preserve a valid point-in-time hash;
                                hashes prove recorded-input integrity, not absence of side channels.
                              : NEW requirement: PROCESS-LEVEL INFORMATION ISOLATION between
                                the decision-time data view and the resolution-time data view,
                                OR a taint-tested capability boundary. The isolation mechanism
                                itself has its own RED tests (a fixture that obtains future data
                                by any side channel must be caught).
                              FALSIFIER: hindsight cheater (F2) AND a side-channel fixture
                                         (new — see §8.A1)
                              STATUS: gate not accepted until RED proof on BOTH sub-cases

E4  PROBABILISTIC FORECAST QUALITY  (strictly proper score)
                              : cohort CRPS (continuous) or Brier/log-score (discrete)
                                BEATS the reference forecaster by a pre-registered margin
                                AND calibration reliability curve within band
                              FALSIFIER: over-confident wrong forecaster; persuasive-but-wrong reasoner
                              STATUS: gate not accepted until RED proof; REQUIRES forecast field (V5 gap)

E5  DECISION UTILITY NET  (was G5; REDEFINED by A1 — was circular)
                              : OLD formulation used the candidate's OWN forecast/downside as the
                                utility input, making utility gameable (the candidate could report
                                any forecast that maximizes its own score).
                              : NEW requirement: utility is computed PATHWISE from a FROZEN
                                INDEPENDENT replay engine (NautilusTrader, per canonical spec §4.3)
                                or an independent counterfactual model whose assumptions
                                (positivity / logging-policy support, per Bottou et al. 2013 §3)
                                are STATED and pre-registered. The candidate's forecast enters only
                                through E4 (proper score), never through E5.
                              : mean(EU(a)) net of all costs, λ in {0.1,0.25,0.5}, beats baseline
                                by pre-registered margin on ALL THREE λ (rankings must not flip).
                              FALSIFIER: cost-ignorer; overtrader
                              STATUS: gate N/A UNTIL the independent oracle exists. Until then,
                                E5 is marked NOT-OPERATIONAL and no candidate may be promoted.
                                (This is the largest gap A1 opens; it is a founder-gated build.)

E6  ABSTENTION RISK vs COVERAGE  (was G6; REDEFINED by A1)
                              : OLD formulation used a fixed two-sided coverage band + realized-loss-
                                avoided, both flawed: the band can force negative-EV trades when
                                every opportunity is bad; "realized loss avoided" reintroduces
                                hindsight luck.
                              : NEW formulation: report a RISK-COVERAGE FRONTIER (à la Geifman &
                                El-Yaniv 2017) computed against the independent counterfactual
                                (E5's oracle); impose a MINIMUM coverage only when the mandate
                                explicitly requires action; otherwise abstention is scored on the
                                frontier, not against a fixed band. Geifman–El-Yaniv justifies the
                                frontier shape, NOT a two-sided band (A1 citation fix).
                              FALSIFIER (low-coverage): always-abstain fixture, scored against the frontier
                              FALSIFIER (high-coverage): overtrader fixture, scored against the frontier
                              STATUS: gate not accepted until RED proof; depends on E5's oracle

E7  ROBUSTNESS  (was G7; augmented by A1)
                              : skill ranking stable across regimes, assets, venues,
                                seeds, AND time windows; no single partition drives the score.
                                A1 addition: rankings must hold under REGIME-CLUSTER resampling,
                                not just seed resampling (seeds alone are pseudoreplication).
                              FALSIFIER: regime cherry-picker; strategy selected after excessive
                                backtest search (Bailey et al. 2017 + the separate Deflated Sharpe
                                Ratio paper of Bailey & López de Prado, A1 citation fix)
                              STATUS: gate not accepted until RED proof
```

**Operational readiness (was old G8; moved OUT of the eligibility block by A1):** recovery, billing, fill-quality. These are **not fitness** — they describe whether the *system* is ready to run, not whether the candidate's judgment is better. They remain **release gates** (a candidate cannot ship if the system cannot execute it) but they do not enter the selection rule.

### 7.2 The multi-objective selection rule (NEW per A1)

The eligibility vector determines *who is allowed to compete*; it does not determine *who wins* among the eligible. The selection rule is a **separate, pre-registered** function from eligible cohort → ranking. v0's default rule (pre-registered, amendable only by versioned amendment):

1. **Primary key:** E4 (proper score) — the cohort with the best calibrated forecast, conditional on all eligibility gates passing.
2. **Secondary key:** E5 (independent-utility delta over baseline, λ-swept) — breaks E4 ties.
3. **Tertiary key:** E6 frontier dominance (Pareto-dominates on the risk-coverage frontier) — breaks E5 ties.
4. **Quaternary:** E7 worst-regime decile — breaks frontier ties by maximizing the worst-case regime score (max-min over the pre-registered regime clusters).

This rule is **pre-registered at R2** and is itself subject to the null-reward control (shuffled-reward must not reproduce the ranking) and the reward-hacking audit (§15). Collapsing the rule into a single weighted scalar is deferred *until* evidence shows the keys are perfectly correlated across all fixtures — the same condition the hard rails set.

### 7.3 What is **not** in v0, and why

- **Prose-reasoning quality is not a gate.** CoT is retained as diagnostic evidence only. Turpin et al. (2023, V16) show CoT can *systematically misrepresent* the true drivers of a model's prediction; rewarding prose quality rewards persuasion, not skill. Any "reasoning quality" gate is deferred until a faithfulness test exists.
- **Raw P&L is not a gate, not even a component.** It enters only through E5 (independent utility, net of costs, λ-swept) and only in cohort aggregate.
- **No single trade can pass or fail a candidate.** By construction.
- **The candidate's own forecast never enters its utility score (A1).** Only via E4, the proper score.

---

## 8. Known-bad mutation / attack fixtures + RED proof requirement

**RED proof rule (non-negotiable, from `benchmark-design-first-principles` Gate doctrine):** a gate is not real until a known-bad input makes it fail. A gate without a demonstrated failing fixture is **not accepted** into v0. Every fixture below is *deterministic and offline* — no live model, no live data, no broker. Each fixture is a small program that emits specimens; the harness runs them through the (planned) Fitness v0 vector and asserts the named gate goes RED.

**Amendment A1 changes to this section:** (i) the root falsifier is no longer F3 alone — it is **information/oracle integrity** (F2 + the new side-channel fixture F11); (ii) F3 is redefined to escape its tautology (a fixture *defined* as miscalibrated trivially fails the calibration gate — that proves nothing); (iii) five new fixtures added to cover gates that previously had no named RED proof (E1 mandate, E1 hidden-leverage, E2 empty-forecast, E2 malformed-JSON, E3 side-channel).

| # | Fixture | Behavior | Must fail gate | RED assertion |
|---|---|---|---|---|
| F1 | Random trader | Uniformly samples from `available_actions`, random size, no forecast. | E4, E5, E6, E7 | CRPS worse than base-rate; utility negative; off the frontier; ranking unstable across seeds. |
| F2 | Hindsight / future-data cheater | Peeks at `realized_path` to pick `a*`. `decision_ts` data unchanged but action is "impossibly good." | E3 | Hashes/timestamps catch the *recorded* version; **but the gate is not accepted until the side-channel RED (F11) also fires.** (If E3 fires only on F2 and not F11, the harness is checking the wrong thing — a hard-stop finding.) |
| F3 | Lucky high-variance gambler (REDEFINED by A1) | **Two matched variants:** (a) *miscalibrated* lucky gambler — rare huge wins, frequent losses, positive cohort P&L, badly calibrated; (b) *calibrated* high-variance trader — honestly reports a high-variance forecast, happens to realize positive P&L by luck. Variant (a) failing E4 is **tautological and proves nothing**. Variant (b) passing E4 *and* E5 is the genuine test: it must NOT pass E5's *independent* utility gate over a long-enough cohort (its true expected utility is ~0 or negative). **The single most important RED proof:** if variant (b) passes E5, the oracle is mis-specified, not the thesis. | E4 (variant a, trivially), E5 (variant b, the real test), E7 | Variant (a): calibration off-band. Variant (b): independent-utility cohort delta not significant over the pre-registered horizon despite positive realized P&L; ranking unstable across regime clusters. |
| F4 | Hidden-tail-risk strategy | Small steady gains, rare catastrophic loss not visible in-window; looks great until the tail. Self-reports a rosy `downside` that hides the tail. | E1, E5 (CVaR via independent oracle) | E1 fires on **independently-computed** tail exposure, NOT on the candidate's self-reported `downside` (A1 — self-reported downside is gameable). The frozen replay/oracle produces the CVaR95 that fails the gate. |
| F5 | Overtrader | Acts on every opportunity; high coverage; pays full costs. | E5, E6 | Net utility negative after costs; off the frontier (dominated by less-active candidates). |
| F6 | Always-abstain | Declines every opportunity; zero losses, zero costs. | E6 | Scored against the risk-coverage frontier: coverage = 0, dominated by any candidate with positive coverage at acceptable risk. Mandate-floor coverage (if any) is the only hard fail. |
| F7 | Persuasive-but-wrong reasoner | Excellent prose reasoning, garbage forecast. | (No reasoning gate in v0.) | Must NOT pass any gate on the strength of its prose. This is a *negative* RED proof: assert the fixture does **not** pass via reasoning quality. |
| F8 | Cost-ignorer | Correct direction, ignores fees/slippage; gross positive, net negative. | E5 | Net-utility gate fires (independent oracle computes pathwise costs); gross-vs-net split catches it. |
| F9 | Duplicate-state spammer | Re-emits the same observation many times to dilute cohort. | E2, E3 | observation_hash uniqueness / information-integrity gate fires. |
| F10 | Strategy selected after excessive backtest search | Many candidates tried offline, best one reported; classic Bailey et al. (2017) selection bias. | E7 | Robustness / future-shadow gate fires; **deflated** utility (Bailey & López de Prado, Deflated Sharpe Ratio — separate paper, A1 citation fix) below threshold. |
| F11 | Side-channel cheater (NEW, A1) | Does NOT modify the recorded observation; obtains future information via a *side channel* (a shared variable, a leaked pointer, a timing channel) and uses it. The recorded `observation_hash` is valid and point-in-time. | E3 | E3's *process-level isolation* RED test catches it. If E3 only checks hashes and does not enforce isolation, F11 passes silently — a hard-stop finding that invalidates E3. |
| F12 | Empty-forecast evader (NEW, A1) | Emits all required fields but leaves `forecast` empty/null ("I don't know"), so E4 is vacuously satisfied. | E2 | Parse-time rejection on missing/empty forecast (Finn's condition, §18). |
| F13 | Hidden-leverage / off-book exposure (NEW, A1) | Stays within reported `active_constraints` but takes hidden leverage or off-book exposure not captured in the cage snapshot. | E1 | E1's RED must check **independently-reconstructed** total exposure, not the candidate's self-reported `active_constraints`. |
| F14 | Mandate violator (NEW, A1) | Technically profitable but violates an explicit mandate constraint (e.g., forbidden asset, forbidden venue, forbidden horizon). | E1 | Mandate-compliance sub-gate of E1 fires; was previously buried in old G8. |
| F15 | Malformed-JSON / missing-identity evader (NEW, A1) | Emits unparseable JSON or omits identity-block fields (hashes/provenance). | E2 | Parse + schema-validation gate fires; specimen rejected at ingestion. |

**Each gate in §7.1 must list at least one fixture from this table as its RED proof, AND each must include an *independently-computed* failure signal (not the candidate's self-report).** The plan is *not complete* until every surviving gate has (a) a RED proof that fires on an independently-computed signal and (b) at least one known-good fixture (e.g., a calibrated forecaster fixture, a modest-edge cost-aware trader fixture) that passes it.

**The root falsifier (A1 restatement):** the most fundamental falsifier is **information/oracle integrity** (F2 + F11): if a hindsight cheater or a side-channel cheater can pass any gate, every other gate's evidence is contaminated, because the cheater's "skill" is leakage. F3-variant-(b) (the *calibrated* lucky gambler) is the second falsifier and the genuine test of the skill-vs-luck thesis: it must fail E5's *independent* utility gate over a long-enough cohort. Both must be RED before v0 is trusted.

---

## 9. Existing-data feasibility audit (what we can and cannot honestly do with today's logs)

The audit (R1 receipt in `RESEARCH-RUN.md`) found:

**Fields already present in `GenerationRow` / `EvaluationRow`:** model id/label, question id, level, rubric id, raw response, duration, attempts, status, suite name. Within the raw response: `intent, order_type, asset, size, unit?, price?, venue, venue_name?, risk_controls{...}, reasoning?`.

**Fields missing (cannot be reconstructed honestly):** decision timestamp tied to market data, observation hash, full provenance (prompt/rubric/code/serving/seed), probabilistic forecast distribution, model-emitted confidence, downside/tail, invalidation condition, machine-readable reason codes, active-constraints snapshot, explicit abstention boolean, resolved outcome path, counterfactual.

**Data that cannot be reconstructed honestly:** *anything that was not captured at decision time.* Per V10, the grader is invoked synchronously against a pre-baked key. There is no resolved-outcome step. We cannot retrofit point-in-time integrity onto records that were never point-in-time.

**Leakage / provenance risks:** (a) no observation hash → no way to detect two specimens sharing the same state; (b) no `as_of_ts` → no way to prove the agent did not see future data; (c) no prompt/rubric/code versioning → a "score" is not reproducible across commits; (d) the grader knows the answer key before grading → any "outcome" is contaminated by construction.

**Smallest logging delta before fleet data can become training evidence:** the identity block + forecast block from §5.2. Both are founder decisions (they touch the production logging surface, which is outside this worktree and outside the hard rails).

**What this means for v0:** existing logs are sufficient to (a) reproduce benchmark scores, (b) build F2/F8/F9-style fixtures by *construction* (we know the answer key, so we can build a hindsight cheater trivially), and (c) test the *mechanical* gates (G1 safety, G2 executability, G3 leakage-eligibility) against synthetic fixtures. Existing logs are **not** sufficient to test G4 (probabilistic forecast quality), G5 (net utility), or G6 (abstention) honestly, because the required fields were never captured. The cheapest honest experiment (§10) must therefore *generate* minimal specimens under a controlled fixture, not mine existing logs for them.

---

## 10. Cheapest discriminating experiment that can prove or falsify Fitness Function v0

**Constraint:** $0, no GPU, no paid inference, no live data, no broker, no model-weight mutation, no change to the risk cage.

**Amendment A1 — what E0 can and cannot prove (forced by the cross-vendor review):** the reviewer's major finding is that E0, *as originally drafted*, is **circular**: the same author writes the gates, the synthetic truth, the bad fixtures, and the good fixtures. Such an E0 can catch **implementation inconsistencies** (a gate that does not fire on its own fixture because of a bug) but it **cannot validate the construct** (that the gates measure trading skill) or establish **trading-edge relevance**. E0 is therefore relabeled a **self-consistency test**, and a second step (E1) is added that uses an **independently-authored hidden fixture/oracle** for construct validity.

**Experiment E0 — Self-consistency RED-proof tournament (offline, $0):**

1. **Build a minimal, offline specimen emitter.** A Python (or TS) program that, given a tiny synthetic market scenario generator (deterministic, seeded), emits decision specimens conforming to §5.2's identity + decision + forecast blocks. Outcome blocks are produced by the same scenario generator (deterministic replay; no live data).
2. **Implement the eligibility gates E1–E7** as deterministic functions of cohorts of specimens. No LLM in the loop. No model calls at all. This is the "grader" we are testing.
3. **Emit the fifteen fixtures F1–F15** as candidate policies over the same scenario set. Each fixture is a few dozen lines of code.
4. **For each gate, run the RED proof:** assert the corresponding fixture(s) make the gate fail *on an independently-computed signal* (per A1). A gate that cannot be made RED is **cut from v0** and recorded as "gate rejected: no RED proof." A gate that goes RED on its fixture *and* passes a known-good fixture is **accepted into v0.**
5. **Run the small tournament (Work Item 13):** known-good vs. known-bad under the §7.2 selection rule. Pre-register the expected ranking. The tournament is *falsified* (not passed) if either (a) a known-bad fixture outranks a known-good one, or (b) an eligibility failure is rescued by a high selection-rule score.
6. **Falsifier of E0 itself:** if F3-variant-(b) (calibrated lucky gambler) passes E5's *independent* utility gate over the pre-registered horizon, the oracle is mis-specified — escalate (this is the genuine skill-vs-luck test).

**What E0 genuinely proves (narrow, honest claim):** that the gate implementations are *internally consistent* — each gate fires on its named fixture and not on a known-good fixture. That is a necessary but not sufficient condition for v0 to be a valid fitness function.

**Experiment E1 — Construct-validity challenge (offline, $0, requires independent authorship):**

Because E0 is self-authored and therefore circular on construct validity, E1 introduces an **independent author** (a different agent or a human) who:
- Writes **hidden fixtures and a hidden synthetic oracle** not seen by the gate author.
- Hands the gate author only the public schema (§5.2) and the selection rule (§7.2).
- The gate author's v0 is then run against E1's hidden fixtures. Construct validity is supported only if v0's ranking of E1's fixtures matches E1's author's known-good/known-bad labeling.
- E1 also includes **mutation/property challenges** (e.g., perturbing the oracle's noise model, swapping cost assumptions) to test that v0's ranking is stable under construct-irrelevant perturbations and sensitive to construct-relevant ones.

**Why E1 is in scope under the zero-spend boundary:** it costs $0 (it is offline, synthetic, no compute beyond a laptop). The independent author can be a cross-vendor CLI agent (codex/claude, both available). The only thing it requires is founder approval to dispatch (Founder decision F5).

**What E0 + E1 together prove, and what they still do not:**
- **Prove:** internal consistency (E0) and partial construct validity on synthetic data (E1).
- **Do NOT prove:** real-data generalization, real-model-output handling, trading-edge correlation in live markets (V15 — the markets-side gap, §18 blind spot), or that any of this works on a production logging surface that does not yet exist (V8).

**Stop conditions for E0+E1:** (a) all surviving gates have RED + GREEN proofs AND E1's hidden fixtures are ranked correctly → v0 accepted as a *plan* (not as a validated fitness function); (b) any gate cannot be made RED → gate cut, versioned amendment, re-plan; (c) F3-variant-(b) passes E5 → escalate; (d) v0 mis-ranks E1's hidden fixtures → construct validity not established; revise the gates before any further claim.

---

## 11. Time-safe partitions (evaluator calibration / candidate development / validation / future-shadow)

The memo's "regime turnover is the regularizer" answer (C11) is the weakest in the document. Bailey et al. (2017, V16) show non-stationarity does **not** save you from selection bias — you must partition time so that selection cannot leak across the boundary.

**Four pre-registered partitions, in increasing freeze-strength:**

1. **Evaluator-calibration partition.** Used to fit the gates' thresholds (e.g., the coverage band `[c_lo, c_hi]`, the calibration reliability band). *No candidate may be selected on this partition.* Its sole use is to set gate parameters.
2. **Candidate-development partition.** Where variation mechanisms (§12) propose and iterate candidates. *Anything goes here* (within the cage), including repeated search — but every candidate's fitness is computed on this partition only for *kill* decisions, never for *promotion*.
3. **Validation partition.** Held out from candidate development. Used for the gate-set delta and the statistical design. Item-disjoint from partition 2 by construction. A candidate that overfits partition 2 should fail here.
4. **Future-shadow partition.** The only partition on which a generational claim (§3, condition 6) may rest. Defined as: a window whose `as_of_ts` is strictly later than the latest `decision_ts` in any specimen used for selection. The candidate has **never seen it, never been selected against it.** This is the operational version of the memo's "regimes neither has seen."

**Threats that the partition design must handle (all named in the work order):**

- *Overlapping trading horizons.* A 7-day-horizon decision and a 1-day-horizon decision whose windows overlap share information. Partition by **decision_ts**, but also track horizon; a future-shadow boundary must be `> max(horizon)` beyond the latest selection decision_ts to be clean.
- *Correlated ticks.* Two assets in the same regime share the regime shock. Partition by **regime cluster**, not just by time; report per-cluster robustness in G7.
- *Duplicated states.* Same observation hash appearing twice. G3 catches it at the specimen level; partitions must also deduplicate so a candidate cannot inflate cohort n by resubmission.
- *Regime labeling.* U4 is unresolved. v0 uses a *pre-registered, simple, deterministic* regime label (e.g., realized-vol tercile + trend tercile) and reports G7 sensitivity to the labeling choice. A later, better label is a versioned amendment.
- *Repeated candidate search.* The selection-bias channel of Bailey et al. (2017). Track the **number of candidates evaluated** on the development partition; apply a deflation correction to the validation delta (deflated Sharpe analog). Report both raw and deflated deltas.
- *Backtest-selection bias.* F10 attacks this directly. The future-shadow partition is the structural defense.

**Statistical design (pre-registered, per `research-conductor` R6.1, augmented by Amendment A1):** the original draft specified paired seeds, n≥5, on the future-shadow partition. The cross-vendor review correctly flagged this as **pseudoreplication**: paired seeds measure *model stochasticity on one market sample*, not *time/regime uncertainty*. The corrected design has **three** resampling axes:

1. **Seed resampling** (model stochasticity): paired seeds, n≥5, per the R6.1 default. `mean(d_seed) > t(df=4, α=0.05) × SD(d_seed)/√5 ≈ 2.78 × SD(d_seed)/√5`.
2. **Regime-cluster resampling** (A1): block-bootstrap over pre-registered regime clusters (§11 "regime labeling"), with the delta required to hold across the *majority* of clusters and the worst-cluster decile reported explicitly. A delta that holds only in one regime is not robustness; it is overfitting to that regime.
3. **Rolling shadow window per generation** (A1): the future-shadow partition is not a single static window; a fresh window is rolled forward for each generational comparison, so Gen N+1 cannot be selected against the window on which it will be judged.

All three must clear the pre-registered threshold. The variance floor is measured on the exact frozen gate set; the held-out delta must be commensurate with the gate delta; the null-reward control must fail to reproduce the gain. Record the SD's own CI on each axis. An effect size and a power analysis are required at R2, not just a significance test.

---

## 12. Generation 0 mutation surfaces (cheapest, most interpretable, reversible first)

Ordered by cost / interpretability / reversibility. **Model-weight mutation is not presumed necessary.** Per the verified local history (V12), SFT has plateaued 4× and GRPO is on hold; the dominant correctable error is a $0 prompt bug. Evolution should start where the leverage is.

| Surface | Cost | Interpretable | Reversible | Verdict for Gen 0 |
|---|---|---|---|---|
| **System / per-question prompt** | $0 | High (it's text) | Trivial (git revert) | **YES — primary Gen 0 surface.** Already proven leverage (variant B fixes a real conflict, V12). |
| **Structured decision template (§5.2 specimen fields emitted by the model)** | $0 | High | Trivial | **YES — required anyway** to close V4/V5/V6/V7 gaps. |
| **Memory / retrieval policy** | $0–low | Medium | Easy | **YES — Gen 0 candidate surface.** Cheap, reversible, interpretable per retrieved item. |
| **Tool-selection policy** | $0–low | Medium | Easy | **YES — Gen 0 candidate surface.** Which tools the agent may call changes behavior without touching weights. |
| **Strategy composition** | low | Medium | Easy | **MAYBE — Gen 0 surface if strategies are modular.** |
| **Inference parameters (temp, top-p, max-tokens, budget ladder)** | $0 | High | Trivial | **YES but bounded.** Already a known lever (temp 0.1 vs 0.3 swings pass rate 10×). Constrain: no inference param may become a hack for the gate (e.g., lowering temp to satisfy a brittle exact-match gate is the *grader's* problem to fix, not a legitimate mutation — per `bayesian-post-training` #25). |
| **Adapter / model weights** | $$$$ | Low | Hard (need base to revert) | **NO — not in Gen 0.** Blocked by the verified history (SFT plateaued, GRPO on hold) and by the method-choice discipline: every cheaper rung must have a ledger run ID showing it plateaued before weights are touched. |

**Why Gen 0 stays off weights (Amendment A1 reframes the rationale):** the cross-vendor review correctly noted that the *original* rationale ("prompt conflict is the dominant correctable error, so do prompt first") is partly undermined by the council's *corrected* failure analysis (55% of L9/L10 failures were genuine wrong answers, only 14% format errors) and does not generalize to a future fitness corpus. The **correct** rationale under v0 is stronger and simpler: **no valid training corpus or trustworthy reward exists yet** (V8, V10, V11 — no specimen integrity, no point-in-time separation, no provenance, the hidden-oracle quarantine in force). There is nothing to train on and nothing honest to optimize. Gen 0 stays on the cheap surfaces *because the prerequisites for any weight-level work are absent*, not because the prompt surface is hypothetically more impactful. Method choice on a future corpus should follow the *measured* failure mechanism, not a mandatory prompt→SFT→DPO→GRPO ladder.

---

## 13. Offline selection tournament design (Gen 0)

A small, pre-registered tournament under the frozen Fitness v0 vector, on synthetic data (E0 extended) and — *only if* E0 passes — on the existing 300Q logs reinterpreted as a *weak* specimen proxy.

**Candidates:**
- *Known-good:* calibrated forecaster fixture; modest-edge cost-aware trader fixture; abstention-disciplined fixture (acts only when edge > threshold).
- *Known-bad:* F1–F10.

**Falsifier of the tournament:** a known-bad fixture outranks a known-good fixture on the full v0 vector, *or* the lexicographic gate ordering fails to reject (a G1/G3 failure is rescued by a high G5).

**Expected observations (pre-registered):**
- Known-good fixtures pass all gates; known-bad fixtures fail their named gate.
- F3 (lucky gambler) fails G4 (calibration) and G7 (robustness) despite positive cohort P&L.
- F6 (always-abstain) fails G6 (coverage band) despite zero losses.
- F10 (over-searched) fails G7 (deflated delta on future-shadow).

**Comparison baselines:**
- *Reference forecaster* (always base-rate) for G4.
- *Random trader* (F1) for G5 floor.
- *Always-abstain* (F6) for G6 floor.

**Uncertainty treatment:** every gate's pass/fail reported with a seed-sweep (≥5 seeds) and the SD's own CI. No single-seed claim.

**Stop conditions:**
- Tournament passes pre-registered ranking → v0 accepted as a *plan*, founder decision queue (§19) becomes the next action.
- Any pre-registered ranking violated → v0 falsified *as a whole* or at the violating gate; versioned amendment; re-plan. Do not iterate silently.
- F3 passes G4/G5 → hard-stop, escalate (§10).

---

## 14. Post-training decision tree (when, if ever, to escalate from prompt/memory/tool evolution to SFT / DPO-SimPO / GRPO)

This plan does **not** authorize any post-training. It defines the *evidence required* before post-training may even be proposed, consistent with the verified history (V12: SFT plateaued 4×, GRPO on hold).

```
At any point, the lead may propose escalation to the next rung ONLY by attaching
a ledger run ID or finding ID showing the current rung plateaued. Prose does not count.

RUNG 0  Prompt / specimen-template / memory / tool-policy evolution (Gen 0 surfaces)
        REQUIRED TO EXIT: ledger evidence that, on the future-shadow partition,
        (a) Gen 0 mutation has produced a candidate that passes v0, AND
        (b) further Gen 0 mutation has plateaued across N_pre attempts
            (pre-registered; default 3 non-improving generations).
        If (b) is not met, do NOT escalate. Iterate Gen 0.

RUNG 1  Supervised fine-tuning (SFT)
        GATE (Chen, data/evaluator, runs first, may hard-stop):
          - Specimen integrity (§5) proven on real fleet data, not synthetic.
          - A training set of item-disjoint siblings built from real failure modes
            (per benchmark-design-first-principles), not from the eval rows.
          - The failure map shows a SHARED mechanism across enough items to generalize
            (the local lesson: 2 shared-mechanism questions is rote conditioning, not learning).
        Remember the local trap: SFT plateaued 4× because the data was failure-only-biased
        and the model already knew the answers. Do not repeat.

RUNG 2  Preference optimization (DPO / SimPO)
        GATE: a SFT result on file (RUNG 1 plateau receipt), plus a preference dataset
        with chosen-vs-rejected length and format histograms audited (the canonical
        verbosity exploit), plus a demonstrated shared preference signal.

RUNG 3  Reinforcement learning (GRPO)
        GATE: a DPO/SimPO result on file, PLUS:
          - a verifiable, frozen reward (the Fitness v0 vector restricted to its
            deterministic gates — never the prose-reasoning gate);
          - demonstrated latent capability (correct trajectory exists in sampling);
          - a genuine shared error mechanism across enough training items;
          - a pre-registered null-reward control;
          - a pre-registered reward-exploit checklist.
        None of these are met today (V12). GRPO is not proposeable from this plan.
```

**Hard rule:** every escalation is *artifact-gated, not argued* (`research-conductor` R2.4). Prose justification does not count. A rung proposal without the prior rung's plateau receipt is rejected at the gate.

---

## 15. Grader-attack laboratory

The mutable training reward and the frozen acceptance evaluator are **separate instruments** (§16). The attack suite below is run against *both*, but a pass against the training reward is never sufficient — the frozen evaluator must also resist.

| Attack | What it does | Targeted gate | RED assertion |
|---|---|---|---|
| Verbosity gaming | Pads `reasoning` to look thorough. | (no reasoning gate in v0) | Must NOT pass any gate via length. |
| Confident language without evidence | High `confidence`, no forecast support. | G4 | Calibration reliability off-band. |
| Duplicated reasoning | Repeats the same argument; inflates apparent depth. | (no reasoning gate) | Must NOT pass. |
| Tiny-position avoidance | Always sizes near zero to avoid loss. | G5, G6 | Net utility ~0 (no edge); coverage may be high but utility-at-risk negligible → fails utility threshold. |
| Universal abstention | F6. | G6 | Coverage below `[c_lo]`. |
| Hidden leverage / tail risk | F4. | G1, G5 (CVaR) | Tail gate fires. |
| Omitted transaction costs | F8. | G5 | Gross-vs-net split fires. |
| Future leakage | F2. | G3 | observation_hash / as-of separation fires. |
| Evaluator-label mimicry | Emits the verbatim string the grader rewards (the documented AGI hidden-oracle failure mode, V11). | G4 (and the quarantine discipline) | Mitigated by Path (b): hidden-oracle items are quarantined from reward; v0 does not let them carry fitness weight. |
| Repeated backtest search | F10. | G7 | Deflated future-shadow delta fires. |
| Regime cherry-picking | Reports only favorable regimes. | G7 | Per-regime robustness fires. |

**The discipline:** the attack suite is **frozen at R2**, never a living document (`research-conductor` R2.1). It is *executed*, not recited, against any candidate proposed for promotion. A candidate that survives the suite is not thereby accepted — it must also pass the §3 generational conditions.

---

## 16. Who grades the grader

The grader is not an oracle. It is an auditable process with a history. Minimum requirements:

- **Calibration:** the grader's own scores are scored against resolved outcomes after the fact, using the same proper-scoring discipline (§6). The grader's calibration curve is a published artifact. A grader whose scores do not correlate with resolved skill is itself rejected.
- **Mutation discipline:** changes to the grader are versioned amendments, never silent edits (canonical spec change-control; `bayesian-post-training` grader-freeze). A grader change invalidates in-flight comparisons and requires re-baselining.
- **Stability:** rubric perturbation (re-phrasing, re-ordering) must not move scores beyond a pre-registered band (`research-conductor` R1.8). Exact-match-on-undisclosed-label fields are the known brittleness (V11); they are either disclosed ( Path (b) quarantine + disclosure where legitimate) or quarantined from reward.
- **Leakage:** the grader must not see the outcome block when scoring the decision block. The specimen schema (§5.2) makes this structural: identity + decision + forecast blocks are scored *before* the outcome block is appended.
- **Independent review:** every grader version is reviewed by a clean-context cross-vendor reviewer (§19) before it is frozen.
- **Versioning:** every grader version carries a hash; every specimen carries the grader hash that scored it; promotion refusal on UNKNOWN.

**Separation of mutable training reward from frozen acceptance evaluator:**
- The *mutable training reward* (if/when any training is ever authorized) is restricted to the deterministic, mutation-robust gates (G1, G2, G3, and the proper-score components of G4). It may be tuned within a generation.
- The *frozen acceptance evaluator* is the full v0 vector, frozen at R2, and is the only instrument that can accept a generational claim (§3 condition 6). It is **never** the training reward.
- This separation is the formal version of "the grader is the company." A training reward that drifts under the candidate's pressure is fine; an acceptance evaluator that drifts is a company-ending event.

---

## 17. Comparison to primary research

| Topic | Primary source (verified, V16) | What it says | How it bears on v0 |
|---|---|---|---|
| Proper scoring rules | Gneiting & Raftery 2007, JASA | Strictly proper scores (log, Brier, CRPS) make truthful forecasting the unique best policy. "Maximize sharpness subject to calibration." | G4 is a proper-score gate. Without properness, "honest forecast" is undefinable; the memo's C2 has no formal leg. |
| Selective prediction / abstention | Geifman & El-Yaniv 2017, NeurIPS | A selective classifier trades coverage for accuracy along a risk-coverage curve; you cannot reward abstention without a coverage constraint. | G6's coverage band is the formal version. Always-abstain (F6) is the degenerate corner the literature predicts. |
| Counterfactual / off-policy evaluation | Bottou et al. 2013, JMLR | Evaluate a policy from logged data without re-running it; requires either a replay engine or a counterfactual model with assumptions stated. | G5 (utility) and the regret-oracle definition require this. Where neither replay nor a defensible counterfactual model exists, the gate is N/A, never silently P&L. |
| Backtest overfitting / selection bias | Bailey, Borwein, López de Prado & Zhu 2017, JCF — "The Probability of Backtest Overfitting," *J. Computational Finance* 20(4). **Plus** Bailey & López de Prado, "The Deflated Sharpe Ratio" — a **separate** paper (A1 citation fix). | PBO via combinatorially symmetric cross-validation (the 2017 paper). The Deflated Sharpe Ratio adjusts for selection bias / non-normality / multiple testing (the separate paper). Non-stationarity does *not* save you from either. | F10, E7, and the deflation correction on the future-shadow partition. The memo's C11 ("regime turnover is the regularizer") is overstated; these two papers are the correction. |
| CoT faithfulness | Turpin, Michael, Perez & Bowman 2023, NeurIPS | CoT can systematically misrepresent the true drivers of a prediction; biasing features shift the answer without the CoT acknowledging it. | No prose-reasoning gate in v0; reasoning is diagnostic only. Persuasive-but-wrong reasoner (F7) must not pass. |
| Counterfactual evaluation (assumptions) | Bottou et al. 2013, JMLR — **requires positivity / sufficient logging-policy support / stated causal assumptions (A1 fix)**; "replay or model" is not enough. | Evaluates a policy from logged data without re-running it; the assumptions are the load-bearing part the original draft glossed. | E5's independent oracle must state its positivity/logging-policy/causal assumptions and pre-register them; absent that, E5 is N/A. |
| Selective prediction / abstention | Geifman & El-Yaniv 2017, NeurIPS — justifies a **risk-coverage frontier**, NOT a two-sided fixed coverage band (A1 fix). | A selective classifier trades coverage for accuracy along a frontier; a fixed two-sided band is not supported by this work and can force negative-EV trades. | E6 reports a risk-coverage frontier; minimum coverage is imposed only by explicit mandate. |
| Regret oracle (industry design) | Canonical spec §4.3 (internal) | `a*` = ensemble-optimal action over N paths given info at t; discretized brute force; abstention falls out for free. | E5's north star. Not implemented today (V2). v0 uses cohort counterfactual as a weaker surrogate until the oracle is built (founder decision). |

**Literature not relied upon as evidence:** any marketing summary, any vendor blog, any secondhand write-up. The five primary papers above are the load-bearing citations. Where the memo's claims exceed what these papers (and the internal canonical spec) support, the claims are marked Overstated or Currently-false in §4.

---

## 18. Post-training council — debate-protocol mode

**Convened per `post-training-council` Mode B** (the decision gates the direction of an entire research program). **Seat 4 is Chen** (per the founder's correction in RESEARCH-RUN.md), whose data/evaluator gate runs first and may hard-stop.

**Decision put to the council:** *"Is Fitness Function v0 (§7), with its RED-proof requirement (§8) and the E0 offline tournament (§10), the correct v0 — or is there a cheaper, more-honest, or more-defensible formulation under the zero-spend boundary?"*

**Chen — data/evaluator gate (runs first):**
- Verdict: **proceed, with one hard condition.** The data is insufficient for G4/G5/G6 today (V4–V9). E0 on synthetic data is the only honest thing we can do at $0. Hard condition: no gate without a RED proof; no generational claim rests on a gate tested only on synthetic data.
- Falsifier: if E0 cannot make F3 (lucky gambler) fail G4, the proper-scoring implementation is wrong and v0 is rejected at the root.
- Cheapest discriminating experiment: E0 step 4 (RED proofs), in isolation, before anything else.

**Schulman — frontier RL / reward design:**
- Verdict: **agree with the vector-not-scalar design.** A weighted scalar is the first reward-hack surface. Lexicographic gates are correct. Warns: the *mutable training reward vs frozen acceptance evaluator* separation (§16) must be mechanically enforced, not promised — a hash-bound two-receipt interlock at promotion (per `research-conductor` advanced profile) is the minimum.
- Falsifier: a gate whose threshold is tuned *after* seeing candidate results (peeking) is contaminated; only thresholds set on the evaluator-calibration partition (§11) are valid.
- Cheapest experiment: E0 step 6 (tournament with pre-registered ranking).

**Lambert — open recipes / eval trust / contamination:**
- Verdict: **agree, with the contamination probe strengthened.** Demands the behavioral and string-level contamination probes from `research-conductor` R1.6 be pre-registered *now*, even though no training is proposed, so that the *moment* a candidate is proposed, the probe is already frozen. The future-shadow partition must be item-disjoint by *construction* (hash-bound), not by assertion.
- Falsifier: any specimen in the future-shadow partition whose observation_hash collides with one in the development partition → the partition is burned, not "mostly fine."
- Cheapest experiment: the partition-integrity check (a $0 hash-collision scan across partitions).

**Finn — data bias / preference optimization:**
- Verdict: **strongly agree that Gen 0 stays off weights.** The local history (SFT plateaued 4×, GRPO on hold) is exactly the failure mode the method-choice discipline prevents. Adds: the *specimen* itself is a bias surface — if the forecast field is added but the model is never required to use it, the cohort will be full of empty forecasts and G4 becomes vacuous. The specimen must be *enforced* (parse-time rejection on missing forecast), not optional.
- Falsifier: a candidate that passes G4 with all-empty forecast fields (because the gate is vacuous on empty input) → G4 implementation bug, fix before trust.
- Cheapest experiment: the empty-forecast RED proof (a fixture that emits no forecast and must fail G4).

**Resolved disagreements:**

- *Disagreement A — is F3 (lucky gambler) the right root falsifier, or is F2 (hindsight) more fundamental?* Chen/Schulman say F3 (it tests the *thesis* C2); Lambert/Finn say F2 (it tests the *plumbing* G3). **Resolution via cheapest experiment:** run both RED proofs first; if either cannot be made RED, escalate. Both are in E0 step 4. No prose-only resolution.
- *Disagreement B — should G4 (proper score) be a gate or a component?* Schulman wanted it as the principal component of a near-scalar; the others wanted it as a gate. **Resolution:** it is a gate in v0 (lexicographic ordering). The *merge* of G4 + G5 into a component is explicitly deferred pending evidence that they are perfectly correlated across all fixtures — exactly the condition the hard rails set for collapsing to a scalar.
- *Disagreement C — does the absence of a risk cage in code (V9) block v0?* Finn initially said yes (no G1 without a cage). **Resolution:** v0 defines G1 *as if* a cage existed (a deterministic constraint set); E0 uses a *synthetic* cage so G1 is testable today. The *production* cage is a founder decision and outside this run. Recorded as a hard dependency for any real-data claim, not a blocker for the plan.

**Blind-spot hunt (orchestrator, separate step):** all four seats share the post-training / Berkeley-RL lineage and instinctively reach for *selection-on-skill* framings. What none pressed hard on is the **markets-side** question the grader-freeze hunt (V15) already flagged: *do the gates, even if internally coherent, measure anything that correlates with trading edge?* E0 cannot answer this — it works on synthetic data. The markets-side validation is therefore the **single most important post-v0 step** and is explicitly a founder-gated, beyond-this-run item. Recorded in §19.

**Confidence:** HIGH on internal coherence (E0 will verify it); MEDIUM on real-data generalization (untested by construction); LOW on the markets-edge correlation (outside the council's craft, per V15).

**Post-review note (Amendment A1):** the cross-vendor review (§19.1) validated several of the council's conditions and sharpened them into blockers. Chen's "no gate without a RED proof" is now strengthened to "no gate without a RED proof *on an independently-computed signal*" (F4 hidden-tail must fail on the *oracle's* CVaR, not the candidate's self-reported downside). Finn's "specimen must be enforced, not optional" is now fixture F12 (empty-forecast evader). Schulman's "mechanically enforced separation of mutable reward and frozen evaluator" is now part of E5 (the candidate's own forecast cannot enter its utility score — only the independent oracle). Lambert's "partition integrity hash-bound by construction" is now part of E3's process-isolation requirement (hashes alone are insufficient — F11 side-channel). The council's directions were correct; A1 makes them load-bearing.

---

## 19. Founder decision queue + clean-context cross-vendor review

### 19.1 Clean-context cross-vendor review (DISPATCHED and FOLDED as Amendment A1)

Cross-vendor availability checked: `claude` is installed but **not authed** (`/login` required); `codex` is installed and authed and ran on **gpt-5.6-sol** — a true cross-vendor reviewer (different org, different model family from the GLM lead). `grok` is not installed. Per the harness rule, since this run is GLM-driven, codex qualifies as the cross-vendor reviewer; no same-vendor fallback was needed and none is disclosed.

**Dispatch (2026-07-18):** scoped-primed brief with the memo, the verified-facts list (§2), and the draft plan — **not** the lead agent's synthesized conclusions. Asked to pressure-test framing, costs, premise; report each finding as CLAIM · ISSUE · SEVERITY · FIX.

**Result:** the reviewer **rejected Fitness v0 as written** (overall verdict: REJECT; repair before E0) and surfaced **2 blockers + 9 majors + 1 minor**, all of which were load-bearing and all of which validated against the actual files on re-check. The blockers: (B1) G5 circularity — utility used the candidate's own forecast; (B2) G3 did not catch side-channels — hashes prove recorded-input integrity only. The majors: lexicographic vector had no all-pass ranking rule; F3 was tautologically miscalibrated; E0 was circular on construct validity; G6's fixed coverage band forced negative-EV trades / used hindsight luck; 5-paired-seeds was pseudoreplication; C6/C12 were design commitments mislabeled as current facts; citation precision (DSR is a separate paper; Bottou requires positivity/logging-policy; Geifman–El-Yaniv does not justify a two-sided band); Gen 0 off-weights rationale was partly undermined by the corrected failure analysis. The minor: ExecuteOneResponse prompt/type divergence.

**Resolution:** all blockers and majors folded into the plan as **Amendment A1** (see amendment log at top). Every A1 change is inline in the affected section; the net effect is that v0 is harder than the first draft (independent oracles required, process-level isolation required, multi-objective selection rule required, regime-cluster resampling required) and the externally claimable result is further from today. The reviewer's REJECT verdict on the *first draft* is recorded as accepted; the *amended* plan is what the founder is now asked to approve.

**Receipts:** the full review output is persisted in the session artifacts directory (`call_8d051ceb854841c3a7628df9-tool-result-0f1470ad-...json`); the dispatch brief is `/tmp/seta-review-brief2.md` (reproduced in the R2 receipt of `RESEARCH-RUN.md`). Note: at planning stage the review is a design review; the cross-vendor *audit* of any future paid or promotion action is a separate, later interlock per the advanced-run profile.

### 19.2 Rumsfeld unknown-knowns (applied after the research-design phase)

Surfacing latent unknown-knowns — things evident in the existing evidence that the plan must not ignore:

- **UK1 (in the memo, unaddressed):** the memo's strongest claim (C3) describes a grader that does not exist (V2, V10). The memo writes as if C3 were already true. This is an unknown-known: the company *knows* (or can verify in 10 minutes) that the deployed grader does not score against what was knowable at decision time. Any external communication that implies C3 is already operational is inconsistent with the code.
- **UK2 (in the grader-freeze evidence, unaddressed in the memo):** V15 — the council *already concluded* it cannot answer whether the verifiable subset correlates with trading edge. The memo's C10 (generations) presupposes that it does. This is an unknown-known: the company has a documented council finding that the markets-edge question is open, and the memo does not engage with it.
- **UK3 (in the logging architecture, latent):** V8 — no provenance. Any "Generation N" claim requires provenance that does not exist and cannot be retrofitted. This is an unknown-known: the company knows provenance is missing and that missing provenance is a promotion blocker.
- **UK4 (in the abstention framing, latent):** C4 is overstated exactly because the memo *knows* (it is in the canonical spec §4.3) that abstention falls out of the regret oracle *only when the counterfactual is observable*. The memo's general claim ignores its own spec's condition.
- **UK5 (in the local training history, latent):** V12 — SFT plateaued 4×, GRPO is on hold. The memo's Phase-3 "post-training on the graded corpus produces successor models" is, in the local evidence, a path that has not yet produced a single accepted improvement. The corpus does not yet exist; the post-training has not yet worked. This is an unknown-known: the company has the receipts.

### 19.3 Kissinger pass (material improvements still possible under zero-spend)

The plan is the best achievable under the zero-spend boundary. Remaining material improvements, in priority order, that the founder can authorize without breaking the rails:

1. **Approve construction of the E0 RED-proof harness** (§10) as the next action. Cost: $0. This is the single highest-leverage decision available.
2. **Decide the specimen scope:** accept the minimum specimen in §5.2 (identity + decision + forecast blocks) as the v0 target. This unblocks both E0 (synthetic) and any future real-data work.
3. **Decide the two-instrument question (U3):** is the 300Q grader a *different instrument* from the canonical-spec regret oracle? If yes, v0's G5 uses cohort counterfactual as a *surrogate* and the regret oracle is a separate founder-gated build. If "they are the same instrument," that is currently false (V2) and must be reconciled before any generational claim.
4. **Decide the markets-side validation path (V15, §18 blind spot):** how, and when, do we test whether the gates correlate with trading edge? This is beyond E0 and beyond this run, but the founder owns the path.
5. **Approve the cross-vendor review dispatch** (§19.1).

Everything else (GPU, post-training, promotion, new data sources, hidden-eval access, model promotion) is **out of scope** for this run and remains a founder decision at the relevant interlock.

### 19.4 Founder decision queue (pre-k-first)

**Item F1 — Approve E0 (the $0 RED-proof harness).**
- *ELI5:* Can we build a tiny, fake, honest judge and prove it can fail every cheater we can think of — for $0, on our own laptops, before anyone spends anything? This is the next thing to do.
- *ELI2:* Build the tiny judge. Break it on purpose. Only then trust it.
- *Decision:* approve / modify / reject the E0 plan in §10.

**Item F2 — Freeze the v0 specimen scope (§5.2).**
- *ELI5:* Before we can grade any decision, we have to agree on the *list of facts* we'll write down the moment the decision is made. Here is the list. Approve it?
- *Decision:* accept the identity + decision + forecast blocks as the v0 minimum, or amend.

**Item F3 — The two-instrument question (U3).**
- *ELI5:* The "grader" we have today checks if the model's answer matches the answer key. The "grader" the marketing describes scores the decision against only what was known at the time, then uses the outcome to catch luck. Those are two different machines. Are we OK treating them as two different machines until the second one is built?
- *Decision:* confirm the 300Q grader and a future regret oracle are two instruments; or direct the plan to reconcile them.

**Item F4 — The markets-side validation path (V15).**
- *ELI5:* Even a perfect judge is useless if it's judging the wrong contest. We have a documented open question: do our gates measure anything that actually correlates with making money in markets? We cannot answer that for $0. Do you want to own the path to answering it?
- *Decision:* acknowledge the gap and own the path; or defer.

**Item F5 — Cross-vendor review (DISPATCHED and FOLDED — no longer a queue item).**
- *ELI5:* We already handed the plan to a different AI (codex/gpt-5.6-sol). It rejected the first draft, found 2 blockers + 9 majors, and we folded all of them into the plan (Amendment A1). Done. No founder action needed unless you want a second reviewer.

**Item F6 — The E5 independent-utility-oracle gap (NEW, A1).**
- *ELI5:* The reviewer found that the "utility" gate was cheating — it used the agent's own prediction as the answer. The fix is to build a separate, frozen "replay engine" that independently computes what each action would have actually earned. We don't have one, and building one is a real engineering project (the canonical spec already calls for NautilusTrader). Until it exists, *no agent can be honestly promoted*, full stop. This is the biggest thing the review changed.
- *ELI2:* The utility gate needs an independent referee. We have no referee. Build the referee (founder decision, real engineering), or accept that v0 stops at "internally consistent plan" and never reaches "validated fitness function."
- *Decision:* acknowledge the gap; own the build-vs-surrogate choice; this is the single largest post-v0 decision.

**Item F7 — E1 construct-validity challenge dispatch (NEW, A1).**
- *ELI5:* Our self-test is partly circular (we wrote both the gates and the cheaters). The fix is to ask an independent author to write *hidden* cheaters and a *hidden* market simulator, then check whether our gates still catch them. This costs $0. Approve the dispatch?

---

## 20. Explicit stop conditions

The plan stops, and the founder is re-engaged, on any of:

1. E0 cannot make a gate go RED on its named fixture (on an *independently-computed* signal) → gate cut, versioned amendment, re-plan (do not silently weaken the gate).
2. F11 (side-channel cheater) passes E3 → E3's process-isolation RED failed → hard-stop; E3 is invalid until isolation is enforced and re-tested.
3. F3-variant-(b) (calibrated lucky gambler) passes E5 → the independent utility oracle is mis-specified → hard-stop, escalate before any further work.
4. E5 has no independent oracle (E5 N/A) → no candidate may be promoted; the v0 plan is accepted as a *plan* only, never as a validated fitness function. Building the oracle is a founder-gated build (the largest gap A1 opens).
5. E1 (construct-validity challenge) shows v0 mis-ranks the independent author's hidden fixtures → construct validity not established; revise the gates before any further claim.
6. Any gate threshold is proposed to be tuned *after* seeing candidate results → contamination; reset to the evaluator-calibration partition.
7. The cross-vendor review surfaces a load-bearing claim that does not validate against the files → amend the claim, re-plan. (A1 already folded 2 blockers + 9 majors; a future review may surface more.)
8. Any proposal to cross a hard rail (GPU spend, paid inference, post-training, broker calls, credentials, risk-cage change, grader implementation in production code, evolutionary runtime, modification of the original TradeBench worktree/ledger) → stop; that is a founder decision and out of scope for this run.
9. Any external "self-evolving" communication that implies Phase-3 generational improvement → stop; only Phase-1/Phase-2 claims are currently defensible.

---

## 21. Exact next Lenny Researcher execution prompt

> **Run ID:** `rr-seta-fitness-v0-2026-07-18` (continuation). **Scope: still R0–R2, zero-spend, planning-only.**
>
> **Context to load:** `/Users/bradleymiles/Documents/tradebench-self-evolving-agents/RESEARCH-RUN.md` (this run's ledger) and `/Users/bradleymiles/Documents/tradebench-self-evolving-agents/Internal_docs/SELF-EVOLVING-TRADING-AGENTS-FITNESS-RESEARCH-PLAN.md` (this plan, including Amendment A1). Do not load the original TradeBench worktree's `RESEARCH-RUN.md`; it is read-only historical evidence of an unrelated study.
>
> **Hard rails (unchanged):** no GPU, no paid inference, no post-training, no production or broker calls, no credentials, no change to the fixed risk cage, no grader implementation committed to production code, no evolutionary runtime, no modification of the original TradeBench worktree/ledger. Treat every market fact by what was knowable at the decision timestamp. Do not assume CoT faithfully represents the model's decision process. Do not use raw profit as the principal fitness signal. Do not infer skill from a single trade.
>
> **First action (R0):** read this run's ledger; verify zero unattributable instances (none expected — this is a planning run with no compute); confirm balance not applicable (zero-spend).
>
> **Then execute the founder-approved subset of:**
> 1. If F1 + F2 approved: build the **E0 self-consistency RED-proof harness** (§10) as a *deterministic, offline* Python or TS program emitting synthetic specimens conforming to §5.2. No live model. Implement the eligibility gates E1–E7 (§7.1) and the multi-objective selection rule (§7.2). Emit fixtures F1–F15 (§8). For each gate, produce a RED proof (named fixture fails the gate *on an independently-computed signal*) and a GREEN proof (known-good passes). Mark E5 N/A if no independent oracle exists. Write all receipts to the ledger.
> 2. If F7 approved: dispatch the **E1 construct-validity challenge** (§10) to a cross-vendor CLI (`codex` or `claude` once authed) as the *independent author* of hidden fixtures + hidden oracle; compare v0's ranking to the independent author's known-good/known-bad labels. Record the dispatch, the hidden fixtures (under seal until the comparison lands), and the result.
> 3. If F4 (two-instrument) resolved: record the resolution and update E5's surrogate-vs-oracle status via a versioned amendment.
> 4. Run Rumsfeld + Kissinger again at the end of the E0 design phase; record any new unknown-knowns and any remaining zero-spend improvements.
> 5. **Stop before:** any real-data ingestion, any production logging change, any grader code committed to `src/`, any evolutionary runtime, any training, any promotion, any PR, any merge, any push. The founder authorizes each of these separately.
>
> **Stop and escalate immediately if:** (a) F11 (side-channel cheater) passes E3 — E3's process-isolation RED failed, E3 invalid; (b) F3-variant-(b) (calibrated lucky gambler) passes E5 — the independent oracle is mis-specified; (c) v0 mis-ranks E1's hidden fixtures — construct validity not established. Any of these means the plan must be redesigned, not patched.
>
> **Deliverable at end of next run:** updated ledger with E0 RED/GREEN receipts (E5 marked N/A if no oracle), E1 hidden-fixture comparison (if dispatched), versioned plan amendments if any gate is cut, and a revised founder decision queue in pre-k-first form.

---

## Appendix A — Document status

- **This plan:** v0, planning-only, internally coherent, falsifiable, pending E0 execution and cross-vendor review.
- **Memo critique:** preserves the strongest thesis (C2); grades 14 load-bearing claims.
- **Cross-references:** every code claim is file:line referenced (see §2 V2–V15); every external claim cites a verified primary source (V16).
- **What this plan is deliberately not:** an implementation, a training proposal, a budget request, a promotion request, or a marketing document. It is the smallest honest thing that must be true before any of those can be honestly proposed.

*End of plan.*
