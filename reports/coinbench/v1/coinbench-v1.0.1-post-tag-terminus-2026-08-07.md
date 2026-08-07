# CoinBench v1.0.1 post-tag terminus

**Decision:** `FROZEN + QUALIFIED_GREEN` for the narrow static claim below.

## Exact release

- Annotated tag: `coinbench-v1.0.1`
- Commit: `bff6f014b23ffd469640a3647938c5a297549bb2`
- Frozen bundle: `reports/coinbench/frozen/v1.0.1`
- Bundle verification: `320/320` SHA-256 entries passed after extracting the exact tag.

## Resolved prior blocker

The prior final audit quarantined the candidate only because no immutable,
release-containing Git reference existed. The annotated tag above now contains
the exact bundle and its pinned question, rubric, and grader hashes. No
benchmark row, rubric, grader, runner, or model result changed to resolve this
blocker.

## Current evidence

- 300/300 independent derivations and canonical regrades pass.
- 1,896 mutations found zero true weighted-field grader leaks.
- No exact duplicate executable rows or retired-split training contamination
  were found.
- Difficulty is deliberately unclaimed as psychometric calibration.

## Independent Fable 5 check

On 2026-08-07, Claude Fable 5 was called through OpenRouter/Amazon Bedrock on
the exact tag and evidence above. It returned `GREEN` for the same static,
content-addressed claim and identified the new annotated tag as resolving the
sole prior blocker.

## Permitted claim

> CoinBench v1.0.1 is a frozen, content-addressed static 300-question
> crypto-reasoning benchmark.

## Prohibited claims

This release does not establish execution correctness, live or PnL
performance, agent reliability, model generalization, psychometric difficulty
or calibration, crypto-market representativeness, or applicability to any
other version, tag, or bundle.
