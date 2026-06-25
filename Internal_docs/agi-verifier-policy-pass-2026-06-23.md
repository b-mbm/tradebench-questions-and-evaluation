# AGI Verifier Policy Pass

Date: 2026-06-23

Source artifacts:

- `results/community/300/nojson29-gate-graded-2026-06-23.json`
- `results/community/300/nojson-agi6-graded-2026-06-23-from29.json`
- `Internal_docs/agi-nojson-diagnostic-codex-review.md`

## What "Verifier / Truncation Issue" Means

There are two separate score suppressors:

1. **Verifier issue:** the AGI grader exact-matches fields like `intent` and `chosen_strategy` against hidden canonical strings. The prompt asks for those fields, but does not disclose exact strings such as `private_first_hidden_completion` or `hedge_adversarial_beta`. So correct-looking strategy descriptions can fail as wrong labels.
2. **Truncation issue:** no-json generation produced long reasoning. At `max_tokens=6000`, some rows ended with `finish_reason=length`, meaning the model was cut off before completing the final answer. The grader then saw missing or partial fields.

These are not the same as "the model cannot solve the trade." They are measurement problems layered on top of real model errors.

## Policy Recommendation

Keep two tracks:

1. **Strict official score:** preserve the current grader for historical comparability unless intentionally versioning the benchmark.
2. **Audit/proximity score:** add a secondary analysis score for hard AGI rows that separately rates:
   - economic values,
   - strategy selection,
   - schema/nesting,
   - exact labels.

Do not loosen the official benchmark casually. If exact-label fields are changed, historical scores must be recomputed or labeled as a new benchmark version.

## Six-Row Proximity Read

| ID | Model | Strict Result | Economic Values | Strategy | Schema/Nesting | Exact Labels | Codex Read |
|---|---|---:|---|---|---|---|---|
| `AGI-001` | Base | Fail | Partial | Partial | Fail/truncated | Fail | Not pass-ready; rerun with more tokens before final judgment. |
| `AGI-001` | Tuned | Fail | Partial+ | Partial+ | Fail/truncated | Fail | Tuned is closer, but still not clean. Rerun with more tokens. |
| `AGI-002` | Base | Fail | Fail | Fail | Fail/truncated | Fail | Genuine route miss. |
| `AGI-002` | Tuned | Fail | Unknown/truncated | Weak | Fail/truncated | Fail | Needs rerun, but current reasoning does not look clearly correct. |
| `AGI-003` | Base | Fail | Fail | Partial | Pass-ish | Fail | Genuine numeric/sign failure. |
| `AGI-003` | Tuned | Fail | Fail | Partial | Pass-ish | Fail | Genuine numeric/sign failure. |
| `AGI-004` | Base | Fail | Fail | Fail | Fail/truncated | Partial | Genuine miss. |
| `AGI-004` | Tuned | Fail | Pass | Pass | Fail/nesting | Partial | Fine-tune likely solved the trade economics; strict failure is mostly schema/label. |
| `AGI-014` | Base | Fail | Fail | Partial | Pass | Fail | Genuine APR/PnL formula miss. |
| `AGI-014` | Tuned | Fail | Fail | Partial | Pass | Fail | Genuine APR/PnL formula miss. |
| `AGI-024` | Base | Fail | Pass | Pass | Fail/nesting | Fail | Economically correct; strict failure is mostly verifier/schema. |
| `AGI-024` | Tuned | Fail | Pass | Pass | Fail/nesting | Fail | Economically correct; strict failure is mostly verifier/schema. |

## What This Changes

The strict result remains `0/6` AGI for both base and tuned on the 29-row gate.

The capability read is softer:

- Tuned showed real improvement on `AGI-004`.
- Both models appear economically correct on `AGI-024`.
- `AGI-003` and `AGI-014` are real numeric failures.
- `AGI-002` is not rescued by verifier policy from the existing output.
- `AGI-001`, `AGI-002`, and `AGI-004` should be rerun at `max_tokens >= 9000` if we need clean strict evidence.

## Next Paid Step

Do **not** run full 300 yet.

If spending pod money, rerun only:

- `AGI-001`
- `AGI-002`
- `AGI-004`

Settings:

- no `json_object`
- `temperature=0.1`
- `max_tokens >= 9000`
- same base and tuned models
- detached on-pod orchestrator, not Mac heartbeat

Stop condition: if any row still returns `finish_reason=length`, do not score it as wrong; mark it token-cap dirty.
