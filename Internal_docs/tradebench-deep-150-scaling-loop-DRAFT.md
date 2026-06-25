# TradeBench-Deep — 150-scaling loop — DRAFT (NOT fireable until the pilot locks the dials)

**Created 2026-06-17.** This is the *next* loop after the pilot. **Do NOT run it until the pilot
(`tradebench-deep-pilot-loop.md`) has exited clean.** A fresh (low-context) Claude session should
finalize this file by reading the pilot outputs and filling the placeholders below, then it becomes
fireable.

## HARD PRECONDITION — fill from the pilot before firing

The 150 loop must inherit the pilot's locked values. Until these are real numbers, this loop is a
draft, not a runnable artifact:

- `ε` (pass threshold) = __PILOT-LOCKED__
- `N` (ensemble size) = __PILOT-LOCKED__ (with the published convergence table)
- `λ` = 0.25 — confirm the {0.1,0.25,0.5} sensitivity table did NOT flip rankings
- sequential-scoring arm = __PILOT-LOCKED__ (A inherited / B normalized / A′ segmented)
- dispersion floor = __PILOT-LOCKED__
- DESIGN-RISK resolutions (must be settled, not open):
  - bang-bang sizing — does sizing actually discriminate, or did the pilot show the oracle goes
    max/zero only? If unresolved, the "sizing judgment" claim is not safe to scale.
  - anticipatory-exit / "partial reversal" — can the causal oracle express the intended judgment, or
    was the scenario class narrowed? Resolve before authoring scenarios that depend on it.
- The published (asset-class × behavioral) **stratification matrix** with target counts per cell
  (the StockBench domain×difficulty-matrix analog) = __AUTHOR FROM TBD-REGIMES__.

## Scope

Scale to ~100 benchmark + ~200 training scenarios (the "150" sits in here — confirm the exact target
split with the user). Event/news is its own labeled, separately-validated class (spec §8) — keep it
out of the first scaled batch unless its validation track is built.

## DRAFT /loop (finalize after pilot; replace every __PILOT-LOCKED__)

```
/loop
You are scaling TradeBench-Deep to the full scenario suite using the PILOT-LOCKED dials. The scoring
core and pilot are DONE; reuse them. Inherit ε=__, N=__, λ=0.25, arm=__, dispersion floor=__ exactly —
do NOT recalibrate (that was the pilot's job; recalibrating mid-scale invalidates comparability).

READ FIRST: the spec, TBD-REGIMES.md, the pilot outputs (PILOT-LOG + calibration tables + design
findings), and the validated core's battery/audit.

DISCIPLINE (StockBench-hardened): reuse the core (only seam/ imports the engine); gates-first /
prove-each-can-fail (RED before GREEN); REAL frozen+hashed data per scenario or STOP+log (never
fabricate); resumable (per-scenario artifacts, commit after green); feature branch; no live-model
calls; author-green ≠ final.

BUILD ORDER:
1. Publish the stratification matrix (asset-class × behavioral cells with target counts); author
   scenarios to fill it deliberately. No event/news in this batch.
2. Per scenario, gated AT AUTHORING: real frozen data + pinned hashes; clears the dispersion floor;
   deterministic run_hash; battery A–J + audit i–v green (leakage / no-hindsight / solvability /
   NON-UNIQUENESS / oracle-optimality), each with a RED able-to-fail demo. Any leakage or non-optimal
   oracle = hard blocker.
3. Score every scenario with the locked ε/N/λ/arm; record per-scenario pass^k diagnostics.
4. Full INDEPENDENT REVERSE-DERIVATION pass over the whole suite: confirm each oracle path is uniquely
   optimal and leakage-free from ≤t info (the way StockBench was taken to its v2 freeze).
5. Coverage report: the filled matrix + any cells under target (log, don't silently truncate).

TERMINATE when: the matrix is filled to target, every scenario passes battery+audit, the
reverse-derivation pass is clean, and a single command reproduces it all green — OR honest blockers
logged. Then hand to independent Codex + Perplexity verification before any freeze/version-tag.
Do NOT recalibrate the dials; do NOT merge to a shared branch.
```

## When ready
Have a FRESH Claude session (full context) read the pilot outputs, fill every __PILOT-LOCKED__ /
matrix placeholder, confirm the design risks are resolved, then promote this from DRAFT to fireable.
That session can also run the post-suite reverse-derivation audit (subagent fan-out, like StockBench).
```
