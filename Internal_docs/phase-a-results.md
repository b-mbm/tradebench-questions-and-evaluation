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

## Remaining Phase A work (next wake)
1. Repair L5-001, L5-002, L7-001 (grader/rubric strictness — read rubric + grader, minimal fix, difficulty audit).
2. Split the 32 into valid-strict-semantic (keep as skill target) vs hidden-schema-artifact (defer to Tranche 2; do NOT train-to-label) — per-row inspection.
3. Output the final AGI skill-target list (genuine-hard 43 + valid-strict subset of the 32).

Then Chunk 2 (formalize Phase B recoverable-by-failure-mode) → Chunk 3 (build V2 set).
