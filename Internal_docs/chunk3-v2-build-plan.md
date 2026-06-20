# Chunk 3 — V2 build (skill-aligned sibling families)

## The finding (why V2 ≠ a re-weighted V1)
V1's 1500 was already L9/L10/AGI-weighted (quantity right) but its generator families teach GENERIC
skills (`beta_hedge`, `vwap_exec`, simple `gov_ev = benefit*prob - cost`), NOT the recoverable eval
skills (dark-pool execution sequencing, multi-leg hedge structures, multi-intent EV with constraints).
Item-disjoint ✓ but skill-MISaligned ✗ → that is why V1 SFT churned the 9B.

## V2 design
Keep the clean V1 reservoir (contamination-RED-proven, label-correct). ADD skill-specific sibling
families that **mirror each recoverable eval's canonical derivation** (from src/rubrics/*.json +
advanced.jsonl expected_values), with item-disjoint inputs (different numbers/assets/venues) so the
gold answer is computed by the same code that fills the scenario → label-correct by construction.
Use MEANINGFUL derivable labels, never the eval's exact magic strings.

## Family build queue (sized to the failure map; strong-28 first)
| family | mirrors (recoverable rows) | strong | output schema to teach |
|---|---|---|---|
| **A. dark-pool execution** | AGI-086,025,026,087 | 4 | execution_sequence, venue_fills{}, hidden_public_qty, expected_avg_price, slippage_pct, self_check |
| **B. cross-venue routing** | AGI-015 | 1 | venue_allocation_usd{}, expected_eth_received, effective_price |
| **C. multi-leg hedge** | AGI-108 | 1 | hedge_legs{}.notional_usd, crowding_score, crisis_var_reduction_usd, residual_1d_var_usd, self_check |
| **D. tax-loss harvest** | AGI-059 | 1 | assets_to_sell, sale_sequence, net_tax_benefit, remaining_unoffset_gains, replacement_assets{}, self_check |
| **E. L9 multi-intent fusion** | L9-072,015,005,037,021,053 (+L9-043 skill) | 6 | EV w/ bribe+borrow+delay + missing-votes≤lendable constraint + decision |
| **F. L10 composition-optimization** | L10-047,068,051,043,017,044,024,006,025 | 9 | numeric expected_value from multi-step protocol composition |

## Gates (every gate proven able to go RED)
- contamination: maskedsim/audit (COPY≥0.95, near-dup 0.80–0.95, verb-synonym, provenance) — already RED-proven on planted reskins.
- label correctness: label-correct-by-construction + label_coverage.py + underivable.py.
- solvability-from-prompt: every numeric field derivable from prompt values.
- schema diversity: families span distinct output shapes (matches eval diversity).
- EXCLUDE the 4 bug questions (L9-043, L5-001/002, L7-001) from seeds.

## Build method
Each family = a standalone generator module (gates/fam_v2_*.py) exposing fam(rng)->(prompt, ans,
archetype_id, family), importing shared helpers from generate.py, with a __main__ self-test that
(1) generates N samples, (2) re-derives the gold answer independently and asserts equality,
(3) checks no eval-prompt substring. Integrate into FAMILIES, re-target, regenerate (contamination-
gated), audit, assemble sft-1500q-v2. Owner-present Chunk 5 finalizes before any training spend.
