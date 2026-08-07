# StockBench v3 Council terminus — second pass (post evaluator-drift repair)

**Verdict:** `GREEN` for the **scoped static release**. The four council seats PASS for the scoped
static claim; Fable returned a substantive GREEN re-verdict after the F2 ground-truth attestation;
the founder signed off on the attestation on 2026-08-06. See `fable-audit-2026-08-06.md` and
`f2-ground-truth-attestation-2026-08-06.md`.

This second pass supersedes `council-candidate-terminus-2026-08-06.md` for the new bundle. The
prior terminus was written against pre-drift evaluator hashes; this one is bound to the current
source and the freshly rebuilt content-addressed bundle.

## Frozen evidence packet

- **Bundle:** `reports/stockbench/frozen/v3.0.0` (rebuilt 2026-08-06 from current source).
- **Checksum verification:** 919/919 entries PASS.
- **Manifest status:** `content-addressed_release_candidate_pending_fable_and_council_terminus`.
- **Stale candidate preserved** (not deleted): `reports/stockbench/frozen/v3.0.0-stale-candidate-pre-drift-2026-08-06`.
- **Provenance ledger:** `reports/stockbench/v3/v3-provenance-ledger-2026-08-06.md` (second-pass
  section appended: evaluator-drift correction + current-hash receipts).

### Current source hash pins (bundle manifest)

| Artifact | sha256 |
| --- | --- |
| questions (`stockbench-questions-300q.ts`) | `586eb28266e72aee0aeb82e9c22203f8f54fa119ee6c2c11229deca96bb3b3ed` |
| rubrics (300 `stockbench-*`, concat sorted-id) | `4eee426c7a58edcdd7f3bb444ad8bd4c304a500b7dda7e01b07831c6145da2ec` |
| grader (`schema-grader-300q.ts`) | `ae519187b7afc38d81503016dec53a1de265d056689ce6e833e1e45d8d9e3727` |
| prompt builder (`schema-prompts-300q.ts`) | `13843d0fc8d53472d19362e7a93c2b4e3904132373f5007686de3efd9c7ba06a` |
| runner (`run-300q.ts`, bundle canonical) | `47a06d54e5414f53a1b151c48925f26b8cbd7cdfb49fa34ad1e076f13fa64c6f` |

Panel execution runner (`parallel-runner.ts` `fa21577f…`) is pinned in the panel run-manifest at
`results/stockbench/calibration/v3.0.0-qwen-panel-2026-08-06/checkpointed-full/run-manifest.json`,
not in the bundle manifest. See Yao seat note.

### Corpus identity (re-derived on current grader, not inherited)

- `prove-stockbench-solvability.ts`: `ALL_300_VERIFIED`, 300/300, 0 errors.
- `aggregateProblemHash` `6688f45c…e071cf1` and `aggregateFullReviewHash` `984e1f86…8756cf69` —
  both identical to the v2 tag, reproduced on the current grader. Byte-identical corpus confirmed.
- The unrelated `src/rubrics/l9-L9-043.json` edit in `git status` is a **CoinBench** rubric
  (question `L9-043` in `schema-questions-300q.ts`), not a StockBench rubric; it is provably
  excluded from the StockBench rubric set and hash. No StockBench answer key was repaired.

## Four seats

### Percy Liang — Benchmark Validity & Comparison: PASS

- **Construct:** scoped static 300-question equities-reasoning benchmark. Admitted omissions
  (live execution, PnL, psychometric calibration, agent reliability, post-training lift) are
  stated explicitly in the freeze plan. No untested capability is claimed.
- **Item proof:** all 300 canonicals reverse-derived and graded on the current grader
  (`ALL_300_VERIFIED`). Two independent 300-file derivation sets are in the bundle
  (`docs/reverse-derivation/results`, `docs/reverse-derivation/codex-results`). Corpus identity
  to v2 reproduced by hash on the current grader.
- **Grader/coverage:** quality gate PASS (0 leaks/dup keys/hidden-schema/family mismatches);
  mutation harness PASS 300/300 robust with 0 wrong-answer leaks; categorical canary PASS
  (`trade`↔`no_trade` both directions reject).
- **Reproducibility:** bundle is content-addressed, 919/919 checksums verified, source hashes
  pinned. Version change (grader/prompt-builder drift) is now disclosed and hashed in the ledger.
- **Limit:** no psychometric difficulty or item-discrimination claim. Difficulty labels are a
  frozen distribution claim only.
- **Defect class cleared:** the evaluator drift that previously invalidated inherited receipts is
  resolved — receipts now exist against the current grader hash.

### Marcos López de Prado — Financial Validation & Leakage: PASS (scoped)

- **Scope guardrail:** this is a static evaluator with no live-market lookup, no PnL/alpha
  signal, and no time-series return stream. PBO/DSR/minimum-track-record methods do not apply
  (no compatible return object); applying them here would be ritual, not evidence.
- **Leakage:** no future-data path exists in a frozen-packet static evaluator. Information
  availability is bounded by each item's frozen snapshot.
- **Trial/change ledger:** the evaluator drift and its nature are recorded as new ledger rows
  (grader `_`/space categorical normalization; prompt-builder private-context guard +
  `buildStockBenchPrompts`; runner `--suite` plumbing). The 600-cell Qwen panel is calibration
  data, not a model-selection or performance claim; it is explicitly excluded from any
  selection-adjusted inference.
- **Family separation:** StockBench rows/paraphrases/template siblings are evaluation-only;
  future training must use item-disjoint siblings recorded in a separate manifest.
- **Limit:** no claim of untouched model-confirmation set or generalization beyond the defined
  items is supported by this static release.

### Maureen O'Hara — Market & Venue Reality: PASS (scoped, tier 0)

- **Execution tier:** this benchmark operates at tier 0 (decision/derivation quality only). No
  executable fill, venue access, liquidity, impact, or settlement is claimed. The freeze plan
  states this exclusion explicitly.
- **Convention validity:** convention-dependent items (corporate actions, settlement, borrow,
  margin, calendar) carry their stated instrument, snapshot, and venue rule inside the frozen
  packet. The carried-forward v2 all-row convention review covers the unchanged rows; the current
  grader reproduces all 300 canonicals.
- **Limit:** a correct static answer is not evidence of executable fill, live PnL, or venue
  competence. The claim does not promote to a higher execution tier.

### Shunyu Yao — Agentic Environments & Reliability: PASS (static, no autonomy claim)

- **Evaluated system:** StockBench is a static single-turn schema benchmark, not an agent
  trajectory environment. No tools, memory, state transitions, or repeated episodes are claimed.
  The degenerate-policy/exploit surface relevant to long-horizon agents does not apply to this
  construct; the static mutation + categorical canaries are the appropriate exploit gates and pass.
- **Runner provenance:** `parallel-runner.ts` correctly selects the 300 StockBench rows, uses
  `buildStockBenchPrompts`, strips private `canonical_answer` context (the new prompt-builder
  guard enforces this and throws otherwise), records source hashes, and retains raw outputs. The
  600-cell panel retained full raw outputs and is replayable.
- **Residual note (REPAIR for completeness, not a blocker):** the bundle manifest pins
  `run-300q.ts` (`47a06d54…`) as the canonical runner, but the 600-cell panel was executed by
  `parallel-runner.ts` (`fa21577f…`), which is pinned only in the panel run-manifest, not the
  bundle. Recommend the release slice either (a) record both runner hashes in the bundle manifest
  with their roles, or (b) document that `parallel-runner.ts` is the panel-execution runner and
  `run-300q.ts` is the bundle-canonical single-model runner. This is a provenance-completeness
  fix, not a correctness defect.
- **Limit:** no repeated-run (`pass^k`) reliability claim. The panel is a single-rep,
  temperature-0 calibration run.

## Council verdict

`PASS` for the scoped static release candidate on current source. Every defect class raised in
the first-pass terminus's remaining conditions is addressed for the static claim:

- evaluator drift → detected, documented, current-hash receipts recorded;
- corpus identity → re-derived on current grader, v2 hashes reproduced;
- bundle → rebuilt from current source, 919/919 checksums verified.

## Remaining release-to-public-GREEN conditions — RESOLVED 2026-08-06

1. **Fable substantive verdict** — RESOLVED. Fable returned a substantive GREEN re-verdict
   (`fable-audit-2026-08-06.md`) after the F2 ground-truth attestation
   (`f2-ground-truth-attestation-2026-08-06.md`). The earlier blank/filtered attempts are
   documented in `fable-pre-audit-2026-08-06.md`; the retained GREEN is substantive (reached via
   OpenRouter because the direct Anthropic API was 429-saturated on premium tiers at audit time).
2. **Commit + annotated tag + tag-tree re-verification** — RESOLVED. Commit `8a89c41`, annotated
   tag `stockbench-v3.0.0`, tag-tree re-verification 919/919 blobs match the bundle SHA256SUMS.
3. **Four-seat decision against the immutable tag** — this terminus plus the Fable GREEN stand
   against the tagged release.
4. **Yao REPAIR (both runner hashes)** — RESOLVED. Bundle manifest now records both
   `runner_sha256` (`run-300q.ts`, bundle-canonical) and `parallel_runner_sha256`
   (`parallel-runner.ts`, panel-execution) with roles, plus `rubrics_sha256`.
5. **Founder sign-off** — RESOLVED. The F2 attestation carries the founder's 2026-08-06 sign-off,
   closing Fable's "GREEN-pending-signature" condition.

The scoped static release is GREEN. The prohibited-claims list below remains binding.

## Prohibited claims (union of seat limitations)

This release does **not** claim: live execution, executable fills, venue competence, PnL/alpha,
psychometric difficulty calibration, item discrimination, agent reliability, `pass^k` consistency,
post-training lift, generalization beyond the 300 defined items, or comparability to any prior
un-pinned version.
