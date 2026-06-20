# Phase A — universal-fail classification + bug repairs (in progress)

Source: authoritative 69-model matrix + Codex proximity audit. 79 universal-fails classified.

## The split (79)
| bucket | count | source statuses | disposition |
|---|---|---|---|
| **bug** | 4 | canonical_error_likely, prompt_rubric_mismatch, verifier_artifact_likely×2 | FIX minimally (below) |
| **genuine-hard** | 43 | genuinely_hard_partial 32 + genuinely_hard_far 11 | keep as Prong-A skill targets |
| **to-split (valid-strict vs hidden-schema)** | 32 | close_but_strict 24 + near_miss_review 5 + way_off_or_too_strict 3 | per-row review (next wake) |

## Bug repairs (minimal change, difficulty preserved)
| id | tier | bug | repair | status |
|---|---|---|---|---|
| **L9-043** | L9 | prompt said bribes "$0 per ARB vote" but canonical computes $52,250 bribe cost | prompt `$0` → **`$0.055` per ARB vote** (950,000 × $0.055 = $52,250 → EV $450,476 = canonical) | ✅ FIXED — difficulty audit: still L9 (multi-venue governance+lending+bridge, EV calc, missing-votes≤lendable constraint, action choice) |
| **L5-001** | L5 | concentrated-LP answer rejected on synonym/IL-threshold; best 0.718 | grader/rubric synonym fix (accept order_type≈concentrated/range_lp; IL threshold) — needs rubric+grader read | ⏳ pending |
| **L5-002** | L5 | Aave leverage-loop rejected by narrow order_type/intent validator | rubric/grader synonym fix | ⏳ pending |
| **L7-001** | L7 | under-specified prompt ("Analyze flash loan arbitrage between DEXes") vs generic-label rubric | clarify prompt to request the classification OR loosen rubric — needs rubric read + judgment | ⏳ pending |

Note (per Codex): repairing these may shift competitor pass totals slightly (they were universal-fails) —
re-account after all 4 are fixed; do NOT anchor to stale 154/157.

## 32-split — DONE (heuristic: label derivable-from-prompt? + spot-verify pending)
- **valid-strict (keep as skill target): 25** — AGI-005,011,012,033,034,035,048,051,052,053,055,056,060,061,062,071,073,093,095,096,097,103,104,110,111
- **hidden-schema (defer to Tranche 2; NEVER train-to-label): 7** — AGI-007,066,067,068,069,105,114
- **AGI/universal skill-target pool (Prong A) = 43 genuine-hard + 25 valid-strict = 68.**

## Remaining Phase A work (next wake)
1. Repair L5-001, L5-002, L7-001 (grader/rubric strictness — read rubric + schema-grader, minimal fix, difficulty audit).
2. Spot-verify the 7 hidden-schema + a sample of the 25 valid-strict (heuristic confirmation).

Then Chunk 2 (formalize Phase B recoverable-by-failure-mode) → Chunk 3 (build V2 set).
