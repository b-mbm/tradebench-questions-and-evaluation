# StockBench v3 provenance and change ledger

**Purpose:** bind the current static StockBench release candidate to its unchanged v2 question/rubric corpus and changed executable evaluator. This ledger supports only a static equities-reasoning claim.

## Corpus identity

| Artifact | Current evidence | Historical v2 evidence | Disposition |
| --- | --- | --- | --- |
| Problem/rubric corpus | `6688f45ca0dbfe6c2f5f65cb01a796e5ec004bea6d86d659c1757f1ffe071cf1` | Same hash in annotated tag `stockbench-300q-freeze-v2` | Exact identity; v2's dual independent all-300 derivation/uniqueness review carries forward for this corpus. |
| Full review packet | `984e1f8616f695b6835b123148c681b0d10704f2dd519e1b1c7c08528756cf69` | Same hash in annotated tag `stockbench-300q-freeze-v2` | Exact identity. |
| Question count | 300 | 300 | Unchanged. |

The historical v2 tag records two independent all-row prompt-and-rubric reverse-derivation/non-uniqueness audits with 300 verified, 300 unique, and zero disagreements. The current solvability script reproduced the two identity hashes on 2026-08-06.

## Current executable evidence

| Gate | Result on 2026-08-06 | Scope |
| --- | --- | --- |
| Quality guardrail | PASS | zero model-visible canonical metadata, answer leaks, duplicate keys, hidden-schema rows, and scenario-family content mismatches |
| Mutation harness | PASS | 300/300 canonical and mutation-robust rows; zero wrong-answer leaks |
| Categorical decision canaries | PASS | both `trade` → `no_trade` and `no_trade` → `trade` mutations fail |
| Runner dry run | PASS | `scripts/run-300q.ts --suite stockbench --dry-run` selected exactly 300 StockBench rows and made no API calls |

Current runner provenance emitted by that dry run:

```text
questions       586eb28266e72aee0aeb82e9c22203f8f54fa119ee6c2c11229deca96bb3b3ed
rubrics         4eee426c7a58edcdd7f3bb444ad8bd4c304a500b7dda7e01b07831c6145da2ec
grader          b8f9052df3dcd11fad6db47e6e2b2d7e51425bbf3adba6c9b1d4f08b96d98dc3
runner          47a06d54e5414f53a1b151c48925f26b8cbd7cdfb49fa34ad1e076f13fa64c6f
prompt builder  6a41813b5ccc437652e8b2840af795e15420ab759bec6237db90a90276810e9d
```

## Information and market-convention policy

- Every static item is graded only from its supplied frozen packet and rubric; no live market-data, universe, or external price lookup is part of the evaluator.
- A question whose answer depends on a market convention must state the relevant instrument, timestamp/snapshot, execution or valuation assumption, and applicable calendar, corporate-action, borrow, margin, settlement, or venue rule in its packet. The carried-forward v2 independent review is the all-row evidence for the unchanged corpus.
- This is not a claim that a static answer constitutes an executable fill, live PnL, alpha, or venue competence.

## Training and evaluation separation

- StockBench rows, canonical answers, paraphrases, and template siblings are evaluation-only.
- Future training examples must be item-disjoint siblings and must be recorded in a separate training manifest before post-training begins.
- The current static release does not claim an untouched model-confirmation set or generalization beyond its defined items.

## Change and test ledger

| Date | Change or test | Evidence visible before action | Classification |
| --- | --- | --- | --- |
| 2026-06-16 | v2 tag created after dual independent all-row derivation/uniqueness audit | v2 evidence packet | Historical corpus freeze |
| 2026-08-06 | Current structural hash reproduction | current question/rubric source | Identity check |
| 2026-08-06 | Current quality, mutation, and categorical gates | current grader, prompt builder, and StockBench source | Current evaluator audit |
| 2026-08-06 | StockBench runner source/provenance support added and dry-run verified | Council Yao runner finding | Current runner repair |

## 2026-08-06 evaluator-drift correction and re-verification (second pass)

A second-pass audit found that the grader, prompt builder, and `parallel-runner.ts` changed
**after** the first ledger rows above were written. The dry-run hashes recorded in "Current
executable evidence" (`grader b8f9052d…`, `runner 47a06d54…` (run-300q.ts), `prompt builder
6a41813b…`) describe a *pre-drift* evaluator, not the source that produced the 600-cell Qwen
calibration panel or the bundle candidate. This section re-binds the release evidence to the
current source and corrects the inheritance claims.

### Nature of the evaluator changes (all StockBench-enablement, not silent grading rewrites)

- **Grader** (`src/grading/schema-grader-300q.ts`, now `ae519187…`): one line added —
  `normalizeCategorical` now treats `_` and space as equivalent (e.g. `no_trade` ≡ `no trade`).
  Strictly more permissive on categorical *equivalence*; cannot turn a passing canonical into a
  fail. The `trade`↔`no_trade` categorical canary still rejects decision flips on the current
  grader (categorical gate re-run below).
- **Prompt builder** (`src/prompts/schema-prompts-300q.ts`, now `13843d0f…`): added a guard that
  throws if private `context.canonical_answer` metadata would leak through the generic builder,
  plus a new `buildStockBenchPrompts` that strips private context and appends public response
  conventions. No grading-logic change; the StockBench question/rubric corpus is unchanged.
- **Runner** (`scripts/parallel-runner.ts`, now `fa21577f…`): added `--suite stockbench`, the
  StockBench prompt dispatch, and two new manifest pins (`prompt_builder_sha256`,
  `runner_sha256`). `scripts/run-300q.ts` (`47a06d54…`) is **unchanged** and remains the bundle's
  canonical runner hash.

### Corpus identity re-verified against current source (not inherited)

The StockBench question/rubric corpus is unchanged from v2. Re-derived on 2026-08-06 against the
**current** grader + rubrics:

- `prove-stockbench-solvability.ts`: `ALL_300_VERIFIED`, 300/300, 0 errors.
- `aggregateProblemHash`: `6688f45ca0dbfe6c2f5f65cb01a796e5ec004bea6d86d659c1757f1ffe071cf1`
  (identical to v2 tag — byte-identical corpus confirmed).
- `aggregateFullReviewHash`: `984e1f8616f695b6835b123148c681b0d10704f2dd519e1b1c7c08528756cf69`
  (identical to v2 tag).
- StockBench rubrics content hash: `4eee426c7a58edcdd7f3bb444ad8bd4c304a500b7dda7e01b07831c6145da2ec`
  (identical to the 600-cell panel run-manifest pin; all 300 StockBench rubrics are `stockbench-*`
  prefixed, none modified).

Note on the unrelated `src/rubrics/l9-L9-043.json` edit visible in `git status`: that file is a
**CoinBench** rubric (question `L9-043` in `schema-questions-300q.ts`), not a StockBench rubric.
It is not in the StockBench rubric-id set and is provably excluded from the StockBench rubrics
hash above. It does not affect StockBench corpus identity.

### Current-hash static gate receipts (re-run 2026-08-06 against current source)

| Gate | Result | Source hash basis |
| --- | --- | --- |
| Quality guardrail (`stockbench-quality-gate.ts`) | PASS (exit 0) | current grader `ae519187…` |
| Mutation harness (`mutation-test-stockbench.ts`) | PASS, 300/300 robust | current grader `ae519187…` |
| Categorical canary (`verify-stockbench-decision-categorical.ts`) | PASS, both directions reject | current grader `ae519187…` |
| Solvability + reverse-derivation (`prove-stockbench-solvability.ts`) | ALL_300_VERIFIED, 0 errors | current grader `ae519187…` + current rubrics `4eee426c…` |
| 600-cell Qwen panel score-suppressor scan | clean — 0 parse failures, 0 all-field-zero collapses | panel run-manifest pins below |

### Current source + panel run-manifest hash pins (authoritative for this release)

| Artifact | sha256 |
| --- | --- |
| questions (`stockbench-questions-300q.ts`) | `586eb28266e72aee0aeb82e9c22203f8f54fa119ee6c2c11229deca96bb3b3ed` |
| rubrics (300 `stockbench-*` files, concat sorted-id) | `4eee426c7a58edcdd7f3bb444ad8bd4c304a500b7dda7e01b07831c6145da2ec` |
| grader (`schema-grader-300q.ts`) | `ae519187b7afc38d81503016dec53a1de265d056689ce6e833e1e45d8d9e3727` |
| prompt builder (`schema-prompts-300q.ts`) | `13843d0fc8d53472d19362e7a93c2b4e3904132373f5007686de3efd9c7ba06a` |
| runner (`parallel-runner.ts`, panel path) | `fa21577f48f93ac96ec93a15c83e485066dc1ccb2f1098354e44dc80cd8a9aea` |
| runner (`run-300q.ts`, bundle canonical path) | `47a06d54e5414f53a1b151c48925f26b8cbd7cdfb49fa34ad1e076f13fa64c6f` |

Panel run config: temperature 0, max_tokens 9000, concurrency 4, max_retries 2. Panel artifacts:
`results/stockbench/calibration/v3.0.0-qwen-panel-2026-08-06/checkpointed-full/`
(generations.jsonl 600 rows, scores.jsonl 600 rows; 1 provider-blank on `SB-AGI-001`
Qwen-3.5-Plus, retried once, blank again — documented as excluded provider-blank, not a model miss).

### Corrected change/test ledger rows

| Date | Change or test | Evidence visible before action | Classification |
| --- | --- | --- | --- |
| 2026-08-06 | Evaluator drift detected: grader/prompt-builder/`parallel-runner.ts` differ from first ledger-row hashes | current source vs. ledger dry-run hashes | Current-evaluator audit (second pass) |
| 2026-08-06 | Re-ran quality, mutation, categorical, solvability against current grader — all PASS | gate receipts above | Current-evaluator re-verification |
| 2026-08-06 | Reproduced v2 corpus identity hashes on current grader (`6688f45c…` / `984e1f86…`) | solvability output | Corpus-identity re-confirmation (not inherited) |

## Remaining release conditions

1. Repeat Fable 5 plan audit and obtain an actual substantive verdict.
2. Build a v3 content-addressed release bundle from this exact source/evaluator/proof set.
3. Run the final independent Fable and Trading Benchmark Council audits against the tagged bundle.
4. Create and verify the immutable `stockbench-v3.0.0` release tag.
