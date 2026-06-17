# StockBench 300Q — Full Reverse-Derivation + Non-Uniqueness Audit (all 300)

Method: every question got a self-contained packet (problem + rubric contract + canonical answer +
stated derivation); a subagent reverse-derived each — seeing the answer, confirming it is *uniquely*
derivable from problem+rubric alone — and recomputed all arithmetic. Per-row verdicts in `results/`,
ledger in `LEDGER.csv`. No paid model calls.

## Result (on freeze-v1 commit 4d6aae2)

- VERIFIED 241 · PARTIAL 51 · ERROR 8 · NON_UNIQUE 6.
- **This invalidates the v1 freeze.** Fix → re-gate → re-audit affected → re-freeze v2.

## ERRORS (8) — canonical wrong or not derivable

1. **Early-assignment ATM/OTM rule gap (7): SB-AGI-030, 042, 054, 066, 078, 090, SB-L9-055.**
   The options assignment prompt states the rule "early assignment rational when dividend > remaining
   time value" but OMITS the in-the-money condition. For ATM/OTM calls (intrinsic 0) with div>TV, a
   solver applying the stated rule concludes "assign/avoid" while the canonical (correctly, real-world)
   says "hold". The generated derivation text also prints a false inequality ("1.3 <= 0.8").
   FIX (generator, options assignment branch): state the full rule — "rational only when the call is
   in-the-money (spot > strike) AND dividend exceeds remaining time value" — and fix the derivation
   text to name moneyness. Makes all 7 derivable.
2. **SB-L9-005 (anchor) — canonical not cost-minimal + NON_UNIQUE.** Claims 1 ES + 4 MES (cost 45) as
   the lowest-cost hedge, but 1 ES + 2 MES reaches 30% (meets target), margin 15,600 ≤ 20,000, cost 35.
   FIX (hand): set canonical to the true min-cost hedge, or tighten the target so 4 MES is required.

## NON_UNIQUE (6) — a second valid answer also passes

- SB-AGI-030, SB-AGI-042 (also ERRORs above).
- **SB-L9-005** (also ERROR).
- **SB-L10-005 (anchor):** XLK sell quantity never stated; multiple sell sizes fund the fixed buy with
  net ≥ 0. FIX (hand): pin the XLK sell quantity in the prompt.
- **SB-L10-042:** trade_value priced at spot vs limit (see systemic E).
- **SB-L10-052:** sell vs roll both satisfy "do not exercise"; roll economics unquantified, yet rubric
  forces route_b. FIX (generator, L10 exercise/roll branch): quantify the roll or drop the roll route.

## PARTIAL (51) — derivable but a hostile reviewer could call unfair

- **Un-derivable critical string token (~37):** `decision` (e.g. manage_assignment, convert_fx,
  calculate_notional) and anchor `chosen_strategy`/`chosen_route` composed labels are graded as
  critical but their exact token is never stated; a correct solver guessing a different label fails.
  FIX: remove `decision`/`chosen_strategy`/`chosen_route` from critical_fields (keep graded,
  non-critical) — correctness is already carried by `selected_route`/`selected_instrument`/numerics/
  feasibility — and adjust the mutation harness to test the derivable critical choice field. Also fix
  anchor rubrics' critical_fields. (Some anchors: also state the decision token where cheap.)
- **trade_value spot-vs-limit basis (~8): e.g. SB-L10-033/042/069, SB-L8-002/010, SB-L9-036/063/072.**
  trade_value is computed at the snapshot/spot price while the order is a limit; basis unstated.
  FIX (generator): state "trade value is marked at the snapshot price" in the prompt.
- **CFD-ban / convention (~7):** some FX rows lean on "US retail can't use CFDs" not always stated.
  FIX: state the CFD-unavailable line in the affected FX prompts.

## Anchor-specific minor fixes

- SB-L1-001: prompt says "SPY ETF" but critical field expects exactly "SPY".
- SB-L8-001: critical instrument "AAPL_175_call" (underscores) vs prompt "AAPL 175 call".
- SB-L3-001: gross_pnl_usd canonical stored as float artifact 899.9999… with tolerance 0.
- SB-AGI-006: exposure_reduction uses fill 499.50 vs mark 500 (zero tolerance).
- SB-L6-002: execution_sequence graded exact_set, so the "locate first" ordering isn't enforced.

## Plan to clear and re-freeze (v2)

1. Generator fixes: A (assignment rule + derivation), D (L10 roll), E (trade_value basis), F
   (drop un-derivable labels from critical_fields), CFD lines.
2. Hand fixes: SB-L9-005, SB-L10-005, and the anchor-minor list.
3. Mutation-harness tweak so "wrong strategy" targets the derivable critical choice field.
4. Regenerate; run mutation + quality gates + audit; **stage rubrics with questions**.
5. Re-run the full reverse-derivation audit (this script) until ERROR 0 / NON_UNIQUE 0 and PARTIAL
   only where documented-acceptable.
6. Re-tag freeze-v2 with new hashes; update FREEZE record + amendments.
