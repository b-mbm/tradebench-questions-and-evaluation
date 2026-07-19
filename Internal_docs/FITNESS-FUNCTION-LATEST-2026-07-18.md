# Fitness Function — Latest (2026-07-18)

> **Purpose of this file:** a single-page handoff so any agent (codex, a future GLM, claude, a human reviewer) can understand where the Avalon self-evolving-agents fitness-function work stands, what's been decided, and what's next. Read this first; drill into `RESEARCH-RUN.md` and the plan only if you need detail.
> **Maintained by:** GLM (lead, fitness-function track).
> **Last updated:** 2026-07-18. **State:** PAUSED — priority shifted to CoinBench SOTA.

---

## 1. Why the fitness function on live market data matters

### ELI5
We built a paper judge and proved it catches cheaters — in a fake world. But "catches cheaters in a fake world" doesn't prove it catches cheaters in the real world. **Live-data validation is the lie-detector test for the judge.** Without it, every "generation N+1 improved" claim is built on a judge that might be measuring the wrong thing.

### Plain-English
The fitness function v0 was tested on synthetic data (two made-up market simulators — one mine, one codex's). It caught all 15 known-bad cheaters in both worlds. **That proves the gates are internally coherent and rejection-side construct-valid.** It does NOT prove the gates correlate with anything real. A gate could catch every synthetic cheater and still be useless on real crypto markets — for example, by rewarding a behavior that wins in simulation but loses to real fees, real slippage, or real adverse selection.

Live-data validation (F4) closes that gap by running the gates on actual historical market decisions where we know the realized outcome, then asking: **"when my judge says 'this trader is skilled,' is the trader actually profitable in real markets?"** If yes, the breeder project is worth building. If no, the breeder would just produce miscalibrated gamblers.

### Why it's not the current priority
The founder's near-immediate goal is SOTA on CoinBench (a benchmark). F4 doesn't help with that — CoinBench doesn't use live market data. F4 only matters when the breeder thesis becomes priority. F4 is therefore DROPPED from the active queue (not deferred) but the recipe is preserved in §5 below so it's ready if priorities shift.

---

## 2. What the fitness function IS

### ELI5
A judge that scores trading decisions so we know which versions of the agent get to parent the next batch.

### Plain-English
A scoring rule that takes a cohort of trading decisions (each captured *before* the outcome resolves, with the agent's stated forecast and reasoning) and produces a vector of gate verdicts: safe, executable, honest forecast, net profitable after costs, abstinent-when-should, robust across regimes. **It is NOT a single number** — that would let a candidate trade safety for profit. It's a vector with lexicographic gates: fail any gate, you're out.

### What's breeding
**Versions of the trading-agent model** — each version is a slightly mutated copy (changed prompt, changed memory rules, changed tool list, eventually changed weights). Each version makes ~1,000 decisions; the judge scores each version; the winning version parents the next generation. Strategies are *part* of what a version knows; the whole agent (prompt + memory + tools + reasoning style) is what breeds.

---

## 3. What the fitness function solves for

The Avalon thesis is that trading agents can be *grown* rather than *shipped* — placed under honest selection pressure. That thesis is only as strong as the selection signal. Solve-for list:

1. **Separate skill from luck.** A winning trade might be a good decision or a lucky one. The fitness function must use the *forecast* (captured before the outcome) and the *cohort* (many decisions) to tell them apart. Single-trade outcomes never decide skill.
2. **Reward useful abstention without rewarding universal abstention.** Declining to trade when there's no edge is a skill. Declining to ever trade is a degenerate hack. The fitness function scores abstention against a risk-coverage frontier, not a flat band.
3. **Resist reward hacking.** Every cheater pattern (hindsight peeking, side-channels, overtrading, hidden leverage, persuasive-but-wrong reasoning, cost-ignoring, duplicate-state spamming, post-hoc strategy search) must fail a specific gate. No gate is accepted without a demonstrated RED proof.
4. **Stay valid across regimes, assets, venues, seeds, time windows.** Skill that only works in low-vol is a bug, not a feature.
5. **Improve trading judgment while leaving the risk cage outside the loop.** Position limits, leverage caps, stop discipline, the veto surface — these do NOT evolve. Evolution happens in the judgment, never in the constraints.

---

## 4. How the data gets interpreted

### The pipeline
1. Agent (one version of the model) emits a decision specimen at decision time. Specimen = identity + decision + forecast blocks (frozen schema — see `RESEARCH-RUN.md` A4).
2. Outcome resolves later (price moved, costs realized). Outcome block appended to specimen.
3. Cohort of specimens (= one version's track record over N decisions) scored against the 7 gates.
4. **Each gate produces a signal**, computed on the *independent* oracle's data — never on the agent's self-reported forecast (except E4, the proper-score forecast gate, which IS the forecast gate).
5. Selection rule ranks the eligible versions (those that passed all gates).

### Reading the signals

| Gate | Signal | What "good" looks like | What "bad" looks like |
|---|---|---|---|
| **E1** Safety/Cage | cage_violations count | 0 violations | any violation → reject |
| **E2** Executability | schema completeness | all mandatory fields present | missing fields, duplicate hashes |
| **E3** Information Integrity | z-score concentration, stated-std floor | z-scores ~N(0,1), mean \|z\|~0.80 | too many near-zero \|z\| → side-channel |
| **E4** Forecast Quality | CRPS delta vs base-rate reference | candidate beats reference by margin | worse than base-rate → no skill |
| **E5** Utility | EU(λ=0.25) = mean_PnL − 0.25·\|CVaR95\| | positive | negative → not useful at this risk aversion |
| **E6** Abstention | risk-coverage frontier | selective_edge > uniform_edge | abstain-always or trade-always |
| **E7** Robustness | regime-cluster PnL stability | positive in majority of clusters, worst cluster not catastrophic | edge concentrated in one regime |

### The hardest signal to read: E5
E5 fails honest traders in hard markets. That's a feature, not a bug. Codex's framing (now load-bearing in the plan): *"λ is the declared risk preference, not a market-tuning knob."* If a market doesn't reward any risk-averse trader, the judge says so — it doesn't loosen the bar to be nice (loosening was tested in A3; it admitted cheaters).

### The reporting label
`SKILLED_BUT_NOT_UTILITY_ELIGIBLE` — for honest traders that pass E1–E4, E6, E7 but fail E5. Records that the candidate is skilled but the market doesn't reward them. NOT an acceptance bypass.

---

## 5. What data the fitness function wants

### Minimum mandatory specimen fields (FROZEN — A4)
```
specimen_id, decision_ts_utc, as_of_ts_utc,
observation_hash, provenance{model_revision, prompt_hash, rubric_hash,
                            code_commit_sha, serving_config_hash, seed, generation_id},
asset, venue, horizon,
available_actions, action, abstain
```

### Optional-but-load-bearing-for-fitness fields (MUTABLE)
```
observation_ref, size_requested, active_constraints{max_size, max_leverage, mandate_id, ...},
forecast{distribution_type, parameters, method}, expected_return_net, cost_breakdown,
downside{measure, value, horizon}, invalidation_condition,
confidence (model-emitted, NOT grader-computed), reason_codes,
prose_reasoning (diagnostic only, never load-bearing)
```

### Outcome block (appended at resolved_ts, never visible at decision_ts)
```
resolved_ts_utc, realized_pnl_net, realized_path,
counterfactual{method, estimates_per_action},  # independent oracle, not agent self-report
cage_violations, fill_quality{slippage, fee, latency}
```

### For F4 (live-data validation, currently DROPPED but recipe preserved)
- **Free:** historical crypto OHLCV + perp funding rates from public APIs (Binance, Bybit, Hyperliquid history). Already-accessible.
- **~$50-80:** inference to run one model on ~1,000 historical decision points × 3 seeds (~3,000 generations on RunPod at ~$6.58/hr × ~3 hrs). Needs ~$50 balance top-up (current balance ~$9).
- **$0 local:** the v0 gates + correlation analysis (gate score vs realized PnL).

---

## 6. Current state (snapshot)

| Item | Status | Reference |
|---|---|---|
| Source memo critique (14 claims graded) | ✅ Done | `SELF-EVOLVING-TRADING-AGENTS-FITNESS-RESEARCH-PLAN.md` §4 |
| Operational definition of "self-evolving" (7 conditions) | ✅ Done | plan §3 |
| Decision-specimen schema | ✅ Frozen (A4) | plan §5.2, A4 |
| 7 eligibility gates + selection rule | ✅ Designed | plan §7 |
| 15 known-bad fixtures + RED proofs | ✅ Done | plan §8 |
| Paper-judge harness (code) | ✅ Built + committed | `Internal_docs/seta-e0-harness/` |
| RED 17/17 (self-authored oracle) | ✅ Proven | A2 |
| RED 17/17 (codex independent oracle) | ✅ Proven (construct validity) | A2 |
| GREEN proofs | ⚠️ 1/2 reference, 0/3 codex (codex market too noisy — honest) | A2 |
| Cross-vendor review folded | ✅ A1 (2 blockers + 9 majors) | A1 |
| E5 λ=0.25 bar locked | ✅ A3 + reporting label | A3 |
| Specimen schema FROZEN | ✅ A4 | A4 |
| Two-instrument question (F3) | ✅ YES, two instruments | A4 |
| F4 (live-data validation) | ❌ DROPPED (doesn't serve CoinBench SOTA) | A4, §5 above |
| Regret oracle (canonical-spec NautilusTrader) | ⛔ Not built — future, founder-gated | plan §6 |
| Production logging of specimen fields | ⛔ Not built — future, founder-gated | plan §9 |
| Any actual breeding | ⛔ Not started — paused pending priority shift | — |

**Track state:** PAUSED. Priority is CoinBench SOTA (codex's track). Fitness track resumes when founder shifts priority.

---

## 7. What's next (if/when priority shifts back)

In order of leverage:

1. **F4 cheapest version (~$50-80).** The lie-detector test. Run gates on 1,000 real historical decisions, correlate verdicts with realized P&L. Output: "judge is real" or "judge is toy." This is the single most important next step IF the breeder becomes priority.
2. **Spec the regret oracle (Option B from earlier).** A $0 design doc for the canonical-spec NautilusTrader oracle so future E5 has a real independent ground truth, not a surrogate.
3. **Production logging design.** Spec how the mandatory specimen fields get emitted by the actual trading system (outside this worktree). F2 froze the schema; this is the engineering plan to deploy it.
4. **First real breeding tournament.** Run Gen 0 (prompt/specimen/memory surfaces — NOT weights) through the gates on real data. Population: ~10 candidate variants. ~$100-200 inference cost.

Steps 1-3 are $0. Step 4 needs F4 to have passed first.

---

## 8. Where everything lives

```
/Users/bradleymiles/Documents/tradebench-self-evolving-agents/
├── Internal_docs/
│   ├── SELF-EVOLVING-TRADING-AGENTS-FITNESS-RESEARCH-PLAN.md   ← the full plan
│   ├── seta-e0-harness/                                         ← the paper-judge code (RED 17/17)
│   ├── FITNESS-FUNCTION-LATEST-2026-07-18.md                    ← THIS FILE (start here)
│   └── SELF-EVOLVING-*-VISUAL-EXPLAINER.html                    ← pre-k visual explainers
└── RESEARCH-RUN.md                                               ← conductor ledger (R0-R2 + amendments A1-A4)
```

**Branch:** `research/self-evolving-trading-agents`. **HEAD:** `c70f597`. **Not pushed.**

**Companion tracks:**
- Codex's CoinBench Lock Sprint runs in parallel. See codex's own docs. Cross-review rule applies: codex challenges fitness work; GLM challenges CoinBench work; founder adjudicates.

---

## 9. The four guards GLM asked the founder to enforce on codex's CoinBench track

Recorded here so any future agent sees them. Founder enforces; not vetoes.

1. **Prompt-fix-first** before any training step. Verified history: SFT plateaued 4×; GRPO on hold; dominant fixable error is $0 prompt conflict (7/13 flippers).
2. **25-q audit must include prompt-conflict items.**
3. **Null-reward control + contamination probe** before scaling to training.
4. **"Not the present critical path" is the founder's call.**

---

*Questions about anything in this file? Ping GLM via the human channel. Want to resume the breeder track? Start with F4 in §7.*
