# Chunk 3 — V2 training set BUILT (sft-1500q-v2)

Location: `tradebench-lite-tests/training/sft-1500q-v2/` — all 1494 / train 1346 / val 148
(original holdout forced to val: 25). Built on the V1-clean reservoir (219 survivors) + 1275 new
failure-map-targeted candidates.

## The fix that mattered
V1 churned because its generator families taught GENERIC skills (`beta_hedge`, simple `gov_ev`), not
the recoverable eval skills. V2 adds 6 skill-aligned sibling families that mirror each recoverable
eval's canonical DERIVATION (item-disjoint inputs → label-correct by construction). First L9/L10
attempt PARAPHRASED the eval prompts (cos 0.62–0.81) and was 100% rejected by the contamination gate
(the gate working correctly). Rebuilt with genuinely distinct scenario archetypes → max-cos 0.25/0.27.

## New families (gates/fam_v2_*.py), sized to the failure map
| family | mirrors | n | archetypes |
|---|---|---|---|
| l9_fusion (numeric+constraint) | L9 recoverable (EV+constraint, L9-043 skill) | 220 | validator slashing-insurance, MEV bribe, liquidation-defense, cross-chain farm, OTC underwrite |
| l10_composition (numeric) | L10 recoverable (multi-step composition) | 260 | restake stack, wrap-lend loop, options collar, T-bill ladder, cross-margin rebalance |
| darkpool_exec (synthesis) | AGI-086/025/026/087 (skill-recoverable, cs-weight ~0.09) | 180 | hidden/lit venue routing, fills, slippage, self_check |
| venue_route (synthesis) | AGI-015 — ⚠ EXACT-LABEL-GATED (cs-weight 0.69, Tranche-2) | 70 | cross-venue allocation, effective price (skill valid; AGI-015 not a T1 point — see v2-audit-benchmark-design.md) |
| hedge_struct (synthesis) | AGI-108 | 70 | multi-leg hedge notional, crowding cap, VaR reduction |
| tax_loss (synthesis) | AGI-059 | 70 | loss-lot harvest, sequence, wash-safe replacements |
| maintenance (existing tier families) | anti-forgetting L1–L8 + generic AGI/L9/L10 | 405 | — |

## Gates — all PASS (each proven able to go RED)
- **Contamination (item-disjointness):** detector RED-proven on planted reskins (`test_maskedsim` ALL GREEN);
  V2 train independent sweep vs all 340 eval prompts: **max cosine 0.597, max jaccard 0.527, 0 reskins**.
  Generation rejected 100% of the eval-paraphrasing first attempt → gate demonstrably bites.
- **Label correctness:** label-correct-by-construction (gold computed by the generator); each family's
  self-test independently re-derives every numeric field; `underivable.py` over V2 train = **0 unverifiable**;
  assembler independently re-asserts the label invariant on every train row.
- **Solvability-from-prompt:** every numeric field derivable from prompt values (self-test re-parses prompt → re-derives).
- **Schema diversity:** **158 distinct assistant-schema signatures** in train.
- **No eval items / magic-string labels:** families use meaningful derivable labels; the 4 bug questions are not seeds.

## Reproduce
`cd tradebench-lite-tests/gates && python3 gen_run_v2.py --seed 7 && python3 assemble_v2.py`
(deterministic; contamination-gated at generation). Family self-tests: `python3 fam_v2_*.py`.

## Next: Chunk 4 — SageMaker provision-and-stop (AWS profile benchmark-design). Upload train/val
META-STRIPPED (messages only). Do NOT launch training (Chunk 5 = owner-present).
