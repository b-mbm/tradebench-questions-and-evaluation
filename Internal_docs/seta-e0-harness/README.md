# seta-e0-harness — the E0 paper-judge harness (research scratch, NOT production)

**What this is:** the offline, $0, synthetic-data harness built to test whether
Fitness Function v0 (see `Internal_docs/SELF-EVOLVING-TRADING-AGENTS-FITNESS-RESEARCH-PLAN.md`)
actually catches known cheaters and admits known-good traders. This is the
artifact behind the RED 17/17 + GREEN construct-validity results recorded in
`RESEARCH-RUN.md` Amendment A2.

**What this is NOT:** production code. It is not wired into any trading system.
It does not call any real market data, any broker, any model. It does not
implement the canonical-spec regret oracle. It is a *research scratch* that
exists to be falsified. Treat it as evidence, not as infrastructure.

## How to run it

```bash
cd Internal_docs/seta-e0-harness

# Self-consistency tournament (reference oracle, GLM-authored)
python3 tournament/run.py

# Construct-validity tournament (codex oracle, independently authored)
python3 tournament/run_codex.py
```

Both print a RED/GREEN proof table and a verdict. Expected (as of the
Amendment A2 commit):

| Oracle | RED | GREEN |
|---|---|---|
| reference-glm | 17/17 | 1/2 (edge_aware_trader) |
| codex_regime_gaussian_v1 | 17/17 | 0/3 (codex's market is too noisy for λ=0.25; see F8/A3) |

## Layout

```
oracle/
  contract.py           # The PUBLIC CONTRACT — types + Oracle interface.
                        # Shared between the gates author (GLM) and the
                        # independent oracle author (codex). Both implement
                        # against this; nothing else is shared.
  reference_oracle.py   # GLM's reference ground truth (simple-return random walk).
  codex_oracle.py       # codex's INDEPENDENT ground truth (3 regimes, log-returns,
                        # vol-sensitive slippage, seasonal signal). Built without
                        # seeing the reference oracle or the gates.
gates/
  eligibility.py        # The 7 eligibility gates E1-E7 + multi-objective
                        # selection rule. Scores on INDEPENDENTLY-COMPUTED
                        # signals (oracle outcomes), never the candidate's
                        # self-reported forecast (except E4, which IS the
                        # forecast gate, scored by a strictly proper rule).
fixtures/
  policies.py           # The 15 RED fixtures (F1-F15) + 2 GLM-authored GREEN policies.
  codex_green_policy.py # codex's honest policy, designed for codex's own market.
tournament/
  run.py                # Runs all fixtures through the reference oracle + gates.
  run_codex.py          # Same, but against codex's oracle (construct validity).
```

## The findings this harness produced (read these before changing anything)

1. **E3 (information integrity) requires process isolation, not just hashes.**
   A policy can produce a valid observation_hash and still cheat via a side
   channel. E3 catches this via z-score concentration AND a stated-std floor.
   The harness bug that taught us this: an early version preview-sampled the
   leak instead of leaking the actual resolved value. A real side-channel
   leaks the actual future, not a hint about it.

2. **E5's λ=0.25 bar is load-bearing.** Loosening to λ=0.1 admitted F3b/F5/F8
   on the reference oracle (3 RED proofs broken). Keep it strict. (Amendment A3.)

3. **GREEN fixtures are easy to over-fit to your own world.** GLM's two GREEN
   policies pass on the reference oracle but fail on codex's; codex's GREEN
   passes 6/7 on codex's oracle but fails E5 because codex's market lacks
   reward-to-risk. The honest interpretation: the gates correctly characterize
   markets, not just traders.

4. **Construct validity is a SPLIT verdict.** Rejection-side (catching
   cheaters) is PROVEN on two independent worlds. Acceptance-side (admitting
   honest traders) is PROVEN on one world and honestly failed on the other.
   That split is the most important finding of E0.

## Lineage

- **Contract author:** GLM (lead).
- **Gates author:** GLM (lead).
- **Reference oracle author:** GLM (lead).
- **Codex oracle author:** codex / gpt-5.6-sol, in exec mode, scoped brief,
  instructed not to read reference_oracle.py or eligibility.py.
- **Codex GREEN policy author:** codex / gpt-5.6-sol, designed for codex's
  own market.

Cross-vendor independence verified at dispatch time and by inspecting the
divergent design choices (different return model, different regimes, different
cost structure).

## Hard rails (still in force)

This harness is $0, offline, synthetic. It is NOT authorization to:
- run on real market data
- wire into any production trading system
- promote any candidate
- spend any GPU
- bypass the founder-decision queue

It is research evidence. The founder decides what (if anything) graduates
from here into the real system.
