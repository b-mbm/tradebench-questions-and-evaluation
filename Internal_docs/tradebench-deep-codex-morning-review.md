# TradeBench-Deep — Morning Codex Review (queued)

**Created:** 2026-06-17 (night), for the morning after the overnight `/loop`.
**What ran overnight:** a Claude Code `/loop` in `/Users/bradleymiles/Documents/tradebench-deep`
building + validating the **scoring core** (seam → oracle → scorer → tbd-001), model-free, on a
feature branch. It does NOT build the live agent driver and makes zero paid/LLM calls.

## First, glance at the build state (2 min)

In the `tradebench-deep` repo, read:
- `BUILD-LOG.md` — per-step PASS/FAIL with commands + exit codes.
- `docs/AUDIT-tbd-001.md` — the look-ahead-leakage + oracle-validity writeup.
- `git log` on the feature branch — commits after each green step.

**Expect one of three outcomes (all fine):**
1. **Full green** — scoring core + battery + audit all passed → run the Codex review below.
2. **Honest blocker logged** (most likely: real SOL/USDC data sourcing, or the oracle was genuinely
   hard) — the core was validated on the labeled synthetic fixture, and the real-data swap waits.
   Still run the Codex review on what exists; then unblock the *one* thing in the morning.
3. **Stopped at Step 1** (engine link couldn't go green) — that's the only thing to fix first.

A correctly-logged genuine blocker is a GOOD outcome (honest stop > fabricated pass).

## The Codex `/goal` independent review — paste this

> Note: Codex's "green" is what makes this defensible. Don't trust the build's own logs — Codex
> must reproduce/refute everything itself. This gives the two-independent-models standard that made
> StockBench hold up, applied to the scoring core before any scenario authoring scales.

```
/goal
You are the INDEPENDENT reviewer of an overnight build. A Claude Code /loop was tasked with building
and validating the SCORING CORE of TradeBench-Deep — a long-horizon agentic trading benchmark that
scores whole-path Expected-Utility regret vs. a private mechanical oracle (NOT P&L). Your job is to
independently confirm the core is correct, or find where it isn't. Treat the build's own logs as
CLAIMS to verify, never as truth. A single agent self-auditing its own work has already been proven
insufficient on a sister project — you are the second independent set of eyes, and the build's
"green" counts for nothing until you reproduce it yourself.

Terminate ONLY when you have, with your own hands: reproduced (or refuted) every validation-battery
item, independently re-proven (or broken) the look-ahead-leakage AND oracle-optimality audits,
adversarially tried to make a wrong answer pass, and written your findings. Then give a verdict.

═══════════════════════════════════════════════════════════════════════
CONTEXT
═══════════════════════════════════════════════════════════════════════
Repo: /Users/bradleymiles/Documents/tradebench-deep  (on a feature branch — do NOT merge)
Engine: ../aix-nautilus-backtesting-exploration/services/backtester/src/aix_backtester/
Read first: docs/HANDOFF.md, docs/TBD-001-SPEC.md, docs/TBD-WIRING-FACTS.md,
docs/agentic_trade_bench_canonical_spec_v1_1.md (§4 scoring, §5 frozen ensembles, §10 battery),
docs/TBD-REGIMES.md, and the build's own BUILD-LOG.md + docs/AUDIT-tbd-001.md (these are CLAIMS).

HARD RULES:
- ZERO paid/LLM/OpenRouter calls. Everything is verifiable on hand-built schedules + the frozen
  ensemble. (Confirm the build also made none and did NOT build agent/driver.py.)
- Review only — do NOT modify the build's source. Write your findings to a NEW file
  docs/CODEX-REVIEW-tbd-001.md and your own scratch tests under a separate path
  (e.g. codex-review/) so you don't touch the author's tree.
- Check exit codes, not log strings. A claim is confirmed only when YOUR command exits 0 AND YOUR
  assertion holds.

═══════════════════════════════════════════════════════════════════════
HANDLE PARTIAL STATE GRACEFULLY
═══════════════════════════════════════════════════════════════════════
The build may have STOPPED on a logged blocker (most likely: real SOL/USDC data sourcing, or the
oracle). If so: independently confirm the blocker is genuine (try the thing it said failed), review
everything that IS built, and scope your verdict to what exists. Do not penalize a correctly-logged,
genuine blocker — but DO call out any "blocker" that was actually solvable, and any step marked green
that you cannot reproduce.

═══════════════════════════════════════════════════════════════════════
WHAT TO INDEPENDENTLY DO (reproduce, don't trust)
═══════════════════════════════════════════════════════════════════════
1. ENVIRONMENT + WIRING: from scratch, get the engine link working and run the build's single
   reproduction command (e.g. `pytest -q`). Record YOUR exit code. If the battery doesn't reproduce
   green on a clean run, that's a REJECT-level finding.
2. ARCHITECTURE INVARIANT: independently confirm ONLY seam/ imports aix_backtester (grep + an import
   test); oracle/scorer/scenarios must be engine-free.
3. EVERY BATTERY ITEM, re-run AND probed for able-to-fail (this is the key discipline — a gate that
   can't go red is worthless):
   - Determinism (same schedule → same run_hash).
   - Known-good PASS / known-bad FAIL — and check the expected verdicts were PRE-REGISTERED with
     human rationale, not back-filled from scorer output.
   - Mutation monotonicity: re-inject each §10 mutation (2× oversize, dropped stop, delayed reaction,
     no-trade violation, flip-optimal-HOLD-to-trade) and confirm regret rises for EACH.
   - Oracle self-consistency (oracle path ≈ 0 regret).
   - Dispersion floor: confirm a deliberately-flat input is CUT, and tbd-001/fixture clears the floor.
   - Tier-1 gate: over-cash and >20%-drawdown schedules each instant-FAIL.
   - For at least 3 gates, MUTATE the input yourself to confirm the gate actually goes RED. If any
     gate stays green on a clearly-wrong input, it's a fabricated pass — flag it.
4. ADVERSARIAL — try to break it:
   - WRONG-ANSWER-MUST-FAIL: construct a clearly-bad action path and confirm the scorer fails it.
   - ORACLE OPTIMALITY (the answer-key-correctness check — a sister project shipped a "claimed
     optimal but wasn't" canonical): independently brute-force the discretized action grid and try to
     find ANY action with higher EU than the oracle's chosen action at each step. If you find one, the
     oracle is wrong — hard fail.
   - LOOK-AHEAD LEAKAGE (the headline): re-prove (a) information parity — the oracle's input at t is a
     strict subset of a blinded agent's state at t, no feature uses any bar > t; (b) no-hindsight —
     mutate bars AFTER t and confirm the oracle's action AT t does not change. Try to construct a
     leak; if the oracle's decision shifts when only future bars change, it leaks — benchmark invalid.
   - NON-UNIQUENESS: check there's no materially-different second path with near-identical utility
     (would kill discrimination).
5. FROZEN-DATA HONESTY: confirm tbd-001's bars are REAL SOL/USDC hourly data with a pinned
   data_snapshot_id/spec_hash, NOT a relabeled synthetic fixture. Confirm the ensemble is frozen +
   hashed and the scorer never resamples at eval time. Confirm artifacts pin engine COMMIT hashes,
   not version strings.
6. REGIME-GENERALITY: check the scoring core (oracle/scorer) is not hardcoded to crypto-spot-only
   (single currency pair, no funding, no multiplier) such that multi-regime scale-up would need an
   engine rewrite — per docs/TBD-REGIMES.md the suite is meant to span all sealed-window-backtestable
   asset classes × behavioral regimes. Flag any baked-in spot-only assumption.

═══════════════════════════════════════════════════════════════════════
RETURN (in docs/CODEX-REVIEW-tbd-001.md and your summary)
═══════════════════════════════════════════════════════════════════════
- One-line verdict: APPROVE / APPROVE-WITH-FIXES / REJECT for "scoring core validated, ready to
  begin the 10-scenario pilot." (This is NOT a 150-question freeze — only: is the MVP core correct,
  the oracle non-leaky AND optimal, the battery real and able-to-fail.)
- Which battery items + audit points you reproduced yourself (with your commands/exit codes), and any
  you could NOT reproduce.
- Any DISAGREEMENT with the build's BUILD-LOG/AUDIT claims (the diff is the value).
- Any wrong-answer-that-passes, any grid action beating the oracle, any future-dependence you found.
- Any gate that could not be made to fail (fabricated-pass risk).
- Confirmation of: no paid calls, no agent/driver, real frozen data (or genuine logged blocker),
  architecture invariant, regime-generality.
Be blunt. If the overnight self-audit missed something, this is where it surfaces. If it's clean,
say exactly which independent checks you ran to earn that.
```

## Morning decision tree (after Codex returns)

- **Codex APPROVE + build full-green** → scoring core stands on two independent models. Next:
  begin the 10-scenario multi-regime pilot (resolves ε / N / λ / sequential-scoring arm per spec
  §6/§11/§15). The 150 comes after the pilot.
- **Codex APPROVE-WITH-FIXES** → fold the fixes, re-run the battery to green, re-show only the delta
  to Codex.
- **Genuine blocker (data/oracle)** → unblock that one thing (e.g. source real SOL/USDC hourly,
  finish the oracle), then re-run the loop from the first non-green step.
- **Codex finds a leak or a non-optimal oracle** → hard stop, fix before anything else; the whole
  benchmark's validity rests on the oracle being non-leaky and truly optimal.

## Still open (ask Claude when ready)
- Multi-regime **stratification matrix** for the eventual 150 (asset-class × behavioral cells with
  target counts) — so scale-up past the pilot is deliberate, like StockBench's domain×difficulty
  matrix, not accidentally all-crypto.
