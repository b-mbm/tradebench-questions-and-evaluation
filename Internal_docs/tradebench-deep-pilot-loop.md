# TradeBench-Deep — next loop after the scoring core: the 10-SCENARIO PILOT (not 150 yet)

**Created 2026-06-17.** The scoring core is COMPLETE + dual-reviewed (seam, causal frozen oracle,
scorer, tbd-001 on real SOL data, battery A–J + audit i–v, 43 tests). The machinery to score & audit
scenarios now exists — so scaling is finally *possible*. But the correct next step is the **pilot**,
not 150.

## Why pilot, not 150 (hold this line)

- **ε is uncalibrated.** Pass = NormalizedRegret ≤ ε. Without a calibrated ε, 150 scenarios = 150
  meaningless verdicts. Spec mandates the pilot lock ε/N/λ/arm *before* scaling to 100+200.
- **The core review surfaced design risks the pilot exists to settle:** bang-bang sizing (mean−λ·CVaR
  may make the oracle pick max-or-zero size → "sizing judgment" degenerate); per-step arm-A vs §4.3
  whole-path conflict; causal oracle can't express anticipatory exit (tbd-001 "partial reversal"
  judgment may not be captured). Do NOT stamp these into 150 scenarios — expose them in the pilot.
- Scaling before the dials are locked = the StockBench-v1 mistake (done before the gate is real).

---

## THE PILOT LOOP (paste this)

```
/loop
You are running the TradeBench-Deep PILOT: ~10 stratified scenarios that USE the already-validated
scoring core to lock the open dials (ε, N, λ, sequential-scoring arm) and stress-test the design.
You are NOT authoring 150 scenarios. The scoring core (seam/oracle/scorer/battery/audit) is DONE and
dual-reviewed on feat/scoring-core — reuse it, do not rebuild it.

READ FIRST (spec wins on conflict; log conflicts): docs/agentic_trade_bench_canonical_spec_v1_1.md
(§4 scoring, §5 ensembles, §6 three-arm pre-registered rule + conflict clause, §8 NO event/news in
pilot, §10 battery, §11 N-sweep, §15 pilot plan, §17.1 null-result exit), docs/TBD-001-SPEC.md,
docs/TBD-REGIMES.md, docs/AUDIT-tbd-001.md + BUILD-LOG.md (the open items), and the core's tests.

DISCIPLINE (StockBench-hardened):
- Reuse the validated core. Only seam/ imports aix_backtester. NO live model / paid API calls (oracle
  is mechanical; scoring is CPU replay; agent/driver stays OUT of scope).
- Gates-first / prove-each-can-fail (RED before GREEN). Verify before claim; check exit codes.
- REAL frozen+hashed data per scenario or STOP+log — never fabricate bars. (Use the free Hyperliquid
  candle path that powered tbd-001; for regimes it can't source honestly, STOP+log, don't fake.)
- Pre-registered rules are EXECUTED, not reinvented. Honor §6's conflict clause (stability wins) and
  §17.1's null-result exit (if no arm clears the stability floor → it's a scenario/ε-design failure,
  revise scenario or ε and re-run; NEVER reopen the locked Tier-2 core).
- Resumable (per-scenario artifacts, commit after green). Feature branch. Author-green ≠ final;
  leave re-runnable evidence for independent Codex + Perplexity review.

BUILD ORDER (each step verifiable; log to PILOT-LOG.md):
1. SCENARIO SET: author ~10 scenarios stratified across (asset-class × behavioral) regimes per
   docs/TBD-REGIMES.md — NO event/news (spec §8). Each: real frozen+hashed data, pinned snapshot +
   commit hashes, clears the dispersion floor, deterministic run_hash. Include the known-good and
   known-bad agent schedules and the §10 degradation-probe mutation list per scenario.
2. PER-SCENARIO VALIDATION (reuse the core): battery A–J + audit i–v (info-parity, no-hindsight,
   solvability, non-uniqueness, optimality) green, each with a RED able-to-fail demo. Any leakage or
   non-optimal oracle = hard blocker.
3. THREE-ARM SEQUENTIAL SCORING (§6): run arms A (inherited) / B (normalized) / A′ (segmented).
   Measure (i) seed-robustness across 3 master seeds (pass-rate drift), (ii) discrimination
   (known-good vs known-bad effect size), (iii) degradation-probe monotonicity. Apply the
   pre-registered rule: pick discrimination-best subject to the stability floor; conflict clause =
   stability wins; §17.1 = if none clears the floor, STOP+log (scenario/ε redesign, not core reopen).
4. N-SWEEP (§11): N ∈ {25,50,100,200,400}. Pick smallest N where consecutive-doubling flip rate <1%
   AND regret SE < ε/4; 3-seed robustness at chosen N. Publish the convergence table.
5. λ SENSITIVITY (§4.2): table across λ ∈ {0.1,0.25,0.5}. If pass/fail rankings flip with λ, that's a
   scenario-design red flag — log it (don't silently retune).
6. CALIBRATE ε + the dispersion floor from pilot data (named procedure). Until calibrated they stay
   named constants; the pilot's job is to fix them.
7. DESIGN-RISK PROBES (the reason to pilot): does sizing actually discriminate or is the oracle
   bang-bang (max/zero only)? Can the causal oracle express the intended "partial reversal" judgment?
   If sizing is degenerate or the judgment can't be expressed, STOP+log as a DESIGN finding for the
   morning — that is a successful pilot outcome, not a failure.

TERMINATE when the pilot EXIT CRITERIA (§15) hold: arm selected by the pre-registered rule, N fixed,
λ fixed + sensitivity table, ε + dispersion floor calibrated, battery passing on all pilot scenarios —
OR honest blockers logged (most likely: real data for some regimes, or a surfaced design risk). Do
NOT scale beyond the pilot. Leave everything on a feature branch for independent Codex + Perplexity
review; author self-review counts for zero. Minimum valuable outcome: the validated pilot set + the
calibration tables + any design findings.
```

---

## AFTER the pilot exits clean → the 150-scaling loop (separate, later)

Only once ε/N/λ/arm are locked and the design risks are resolved. Sketch (full StockBench treatment):
- Scale to ~100 benchmark + ~200 training scenarios, **stratified to a published (asset-class ×
  behavioral) matrix** (deliberate coverage, like StockBench's domain×difficulty matrix — not
  accidentally all-crypto). Event/news as its own labeled, separately-validated class.
- Per-scenario: battery A–J + audit i–v (leakage / no-hindsight / solvability / **non-uniqueness** /
  optimality), real frozen data, dispersion-floor cut, determinism — all gated at authoring time.
- For the EVAL set the headline gates are **leakage + uniqueness + dispersion** (a regret-benchmark's
  analog of the StockBench audit). If a paired *training* set is built, the **train↔eval contamination
  gate** from the SFT loop applies (skill-aligned, item-disjoint).
- Gates-first/prove-can-fail; resumable; immutable; then dual independent verification (Codex +
  Perplexity) before any freeze. Author-green ≠ final.
- A full independent reverse-derivation pass over all scaled scenarios (oracle uniquely optimal +
  leakage-free per row), the way StockBench was taken to its v2 freeze.
```
