# TradeBench-Deep — CRRA/Kelly utility swap + mini re-pilot (autonomous loop)

**Created 2026-06-18.** Decision made (owner-approved): switch the scoring utility from `mean − λ·CVaR`
to **CRRA / log (Kelly)** so position sizing becomes a gradable skill. The pilot proved the old utility
is linear in size → the oracle goes bang-bang (all-or-nothing) → "calibrated sizing" is untestable.
This loop implements CRRA, re-validates the dials under it, and PROVES sizing is now discriminable.
It does NOT scale to 150 and does NOT pin ε (that needs a paid model run). Author-green ≠ final.

## Scope (do exactly this; STOP+log anything past it)
IN: CRRA utility implementation + mini re-pilot on the existing 10 frozen scenarios + a hard
sizing-discrimination acceptance gate + γ sensitivity.
OUT (STOP+log, do NOT attempt — these need the owner/paid/external): precise ε pin (needs ~15 real
model agents run on scenarios — PAID), Codex+Perplexity review, non-crypto data, authoring new
scenarios / scaling to ~100+200.

## THE LOOP (paste to the TBD author session)

```
/loop
You are implementing an owner-approved change to TradeBench-Deep: replace the scoring utility
mean − λ·CVaR with CRRA / log (Kelly) utility, so the oracle picks an INTERIOR (fractional) position
size and position sizing becomes a gradable skill. The pilot confirmed (via exact EU-linearity) that
the current utility makes the oracle bang-bang, so sizing is untestable. Your job: implement CRRA,
PROVE sizing now discriminates, and re-validate the locked dials under the new utility on the existing
10 frozen pilot scenarios. You are NOT scaling to 150 and NOT pinning ε.

READ FIRST: docs/agentic_trade_bench_canonical_spec_v1_1.md (§4 scoring/utility, §6 arm rule, §11
N-sweep, §15 pilot exit, §17.1 null-result), PILOT-LOG.md, scorer/ (the locked dual-reviewed core),
scorer/pilot_analysis.py, and the 10 frozen pilot scenarios + tbd-001.

DISCIPLINE (hard-won — do not skip):
- This REOPENS the locked, dual-reviewed scoring core. Work on a NEW branch feat/crra-utility off
  feat/pilot. Do NOT merge. Keep mean−λ·CVaR available behind a flag for side-by-side comparison.
- GATES-FIRST / PROVE-EACH-CAN-FAIL. Every acceptance test must be shown able to go RED. The headline
  gate (sizing discriminates) MUST be demonstrated failing on the OLD linear utility and passing on
  CRRA — a gate that can't distinguish the two is worthless.
- NO paid / LLM / network calls. Use hand-built agent schedules (the pilot's known-good/known-bad
  style) and the frozen ensembles. The oracle is mechanical; scoring is CPU replay.
- DO NOT over-claim (the pilot review caught real over-claims): validate N and discrimination at the
  DECISION BOUNDARY with BORDERLINE agents, never a saturated panel. Judge VERDICTS, not cosmetic
  oracle labels.
- Real frozen+hashed data only (reuse the 10 pilot scenarios). Resumable: commit after each green
  step; log to CRRA-LOG.md. Author-green ≠ final — leave re-runnable evidence for Codex+Perplexity.

BUILD ORDER (each step verifiable; commit on green):
1. Implement CRRA utility U(W)= (W^(1-γ)-1)/(1-γ), with log (γ=1) as the default/primary; parameterize
   γ. Risk aversion is now the curvature γ (replaces λ). Keep the old utility selectable for the
   RED-demo in step 2.
2. HEADLINE ACCEPTANCE GATE — sizing is now gradable:
   (a) Prove EU is strictly concave in position size under CRRA (analytically or by dense grid) →
       a UNIQUE interior optimum exists. Show the OLD utility is linear → optimum at a boundary
       (the RED demo).
   (b) Construct sizing-only agent variants: identical direction+timing, differing ONLY in fractional
       size (e.g. 0.25/0.5/0.75/1.0 of Kelly). Confirm under CRRA the oracle selects an interior size
       AND the scorer assigns monotonically worse regret as size deviates from optimal in EITHER
       direction (over- and under-sizing both penalized). Confirm the OLD utility cannot separate these
       (all-or-nothing) — RED. This contrast is the whole point; make it explicit and re-runnable.
3. MINI RE-PILOT under CRRA on the 10 frozen scenarios (re-lock the dials the utility change disturbed):
   - Arm (§6): re-confirm Arm A (inherited) still uniquely clears stability + monotonicity + clean
     separation; re-check B/A′ under CRRA.
   - N (§11): re-validate at the decision boundary with BORDERLINE agents (not saturated); pick
     smallest N with regret-SE < ε/4 and <1% flip on consecutive doubling. Report the table.
   - Dispersion floor: re-derive under CRRA.
   - Confirm all 10 scenarios remain verdict-seed-robust and the benchmark still inverts good/bad by
     regime (buy-and-hold fails down-trends/crash, passes up-trends).
4. γ SENSITIVITY (analog of the λ sweep): confirm pass/fail rankings stable across γ ∈ {0.5, 1, 2}
   (default γ=1 / Kelly). If rankings flip with γ, that's a design flag — log it, don't silently tune.
5. Update CRRA-LOG.md with the new locked dials (arm, N, γ, dispersion), the sizing-discrimination
   evidence, and the γ table.

TERMINATE when: CRRA implemented; the sizing-discrimination gate is GREEN with the OLD-utility RED demo;
arm/N/γ/dispersion re-locked under CRRA on all 10 scenarios; all scenarios verdict-seed-robust; γ table
done; full test suite green; clean tree on feat/crra-utility — OR an honest blocker is logged. Then
STOP and hand off for independent Codex + Perplexity review.

DO NOT (STOP+log instead, as anticipated successful outcomes, not failures):
- Pin ε precisely — that needs ~15 REAL model agents run on scenarios (PAID); the loop can only
  re-confirm ε's bracket under CRRA. Log that ε-pin is owner-gated.
- Run Codex/Perplexity, author new scenarios, or scale toward 100/200. All gated on this change being
  reviewed first.
```

## After this loop exits clean → the remaining gates (owner-driven, later)
1. ~15-model PAID run on the (pilot) scenarios → pin ε under CRRA.
2. Codex + Perplexity review of the updated core + re-pilot.
3. THEN scale using the stratification matrix (tier × regime × horizon × asset; crypto-perp v1):
   benchmark ~100 (L1–L4:12, L5–L8:24, L9:26, L10:22, AGI:16), training ~200
   (30/55/55/35/25). Difficulty is driven by regime complexity + EU-margin tightness; horizon
   (5→50 decisions) varies WITH tier but difficulty ≠ length. Non-crypto deferred until honest data
   paths exist.
```
