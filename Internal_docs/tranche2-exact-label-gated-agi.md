# Tranche-2 exact-label-gated AGI rows (authoritative; reconciles the 11/18/27 confusion)

**Rule:** an AGI row is *exact-label-gated* iff `chosen_strategy` field weight >= 0.30 AND (all passers emit ONE verbatim chosen_strategy [top_frac>=0.8] OR nobody passed). These reward label-trivia, not skill -> defer to Tranche 2 (loosen chosen_strategy to semantic match); do NOT train siblings toward their exact label.

| id | cs_weight | #passed_any | #passers_with_label | top_label_frac | bucket |
|---|---|---|---|---|---|
| AGI-002 | 0.47 | 1 | 1 | 1.00 | recoverable |
| AGI-004 | 0.69 | 7 | 7 | 1.00 | recoverable |
| AGI-006 | 0.71 | 3 | 3 | 1.00 | recoverable |
| AGI-007 | 0.31 | 0 | 0 | n/a | universal-fail |
| AGI-009 | 0.43 | 0 | 0 | n/a | universal-fail |
| AGI-010 | 0.42 | 0 | 0 | n/a | universal-fail |
| AGI-011 | 0.31 | 0 | 0 | n/a | universal-fail |
| AGI-012 | 0.71 | 0 | 0 | n/a | universal-fail |
| AGI-013 | 0.32 | 1 | 1 | 1.00 | recoverable |
| AGI-015 | 0.69 | 21 | 21 | 1.00 | recoverable |
| AGI-021 | 0.30 | 0 | 0 | n/a | universal-fail |
| AGI-022 | 0.30 | 0 | 0 | n/a | universal-fail |
| AGI-023 | 0.30 | 0 | 0 | n/a | universal-fail |
| AGI-036 | 0.38 | 0 | 0 | n/a | universal-fail |
| AGI-037 | 0.38 | 0 | 0 | n/a | universal-fail |
| AGI-055 | 0.38 | 0 | 0 | n/a | universal-fail |
| AGI-056 | 0.38 | 0 | 0 | n/a | universal-fail |
| AGI-098 | 0.38 | 0 | 0 | n/a | universal-fail |

**Total exact-label-gated AGI = 18** (13 universal-fail + 5 recoverable). All -> Tranche 2.