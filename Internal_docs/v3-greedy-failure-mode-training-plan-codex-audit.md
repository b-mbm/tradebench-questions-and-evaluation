# Codex Audit — V3 Greedy Failure-Mode Training Plan

Verdict: **approve the direction, but fix three claim-integrity risks before execution.**

The plan is strategically right: fix objectively broken eval rows, preserve valid hard AGI rows, train on item-disjoint sibling tasks, and map training data to observed failure modes instead of generic tier labels. That is the right path if the goal is a real specialist 27B trading model rather than a cosmetic benchmark bump.

## What Is Strong

1. **Benchmark vs training distinction is correct.** The plan does not propose training on eval rows. It uses benchmark failures to define sibling tasks.
2. **The two-prong structure is right.** Prong A targets universal/frontier failure modes. Prong B targets 27B-specific recoverable gaps where at least one other model succeeded.
3. **Fixing the four broken non-AGI rows is mandatory.** `L9-043`, `L7-001`, `L5-002`, and `L5-001` should not become training signal until repaired.
4. **Clean 27B baseline before training is non-negotiable.** The plan correctly says to re-eval 27B with a fair token budget before claiming lift.
5. **Anti-forgetting is included.** This is important after the 9B SFT showed churn rather than clean lift.

## Critical Fixes Before Execution

### 1. Do not exploit hidden-schema strictness

The plan says to keep the 27 AGI over-strict labels strict for competitors and train against those skills internally. That is acceptable only if the labels are semantically derivable from the prompt/rubric.

If a row requires an undisclosed exact string, exact route name, or exact `self_check` label that a solver cannot infer, that is not "strict"; it is a hidden-schema artifact. Fix those before using the row for claims or reward.

Rule:

- strict semantic constraint = okay
- undisclosed exact label = benchmark flaw
- train-to-hidden-label = contamination-adjacent and not defensible externally

### 2. The held-out generalization gate cannot wait until fundraising

For a private internal sprint, deferring the held-out slice is fine. For any external claim, it is the linchpin.

Minimum lazy fix: reserve a small untouched eval slice now, before data generation. Do not build sibling tasks toward it. Report it separately later. This avoids retrofitting trust after the model already improved.

### 3. GRPO reward must be cleaned before optimization

The plan correctly says to fix broken canonicals, but reward cleanup should include hidden-schema and over-lenient failures too.

GRPO should optimize:

- numeric correctness
- valid route rejection
- constraint satisfaction
- field-level reconciliation

It should not optimize:

- memorized exact labels
- brittle enum strings
- verifier artifacts
- eval-row surface forms

## Execution Gates

Before generating the V2 training set:

1. Freeze the repaired benchmark commit and hashes.
2. Produce the 27B-specific failure map: 27B failed, at least one other model passed.
3. Classify each failure by skill, not just tier.
4. Define sibling-task templates per skill.
5. Run a contamination scan that masks numbers, assets, venues, and action-verb synonyms.
6. Prove the contamination gate can go red on a planted eval reskin.

Before SFT:

1. Verify every label is derivable from its prompt.
2. Match eval output-shape diversity.
3. Include maintenance examples for already-passed skills.
4. Keep the dataset sized by failure-map prevalence, not by a magic number like 1,500.

Before GRPO:

1. Run mutation tests on the reward.
2. Confirm dense field scores exist for the target rows.
3. Confirm reward variance: the base must sometimes get the field partially/right.
4. Exclude repaired benchmark rows from training; use siblings only.

## Main Risk

The phrase "least generous, most greedy" is useful internally, but externally it can sound like benchmark gaming. The defensible version is:

> We keep the benchmark strict and held out, fix only objective benchmark defects, and train on item-disjoint sibling tasks derived from observed failure modes.

That is the version to use with anyone outside the build loop.

## Recommendation

Proceed with the plan after these changes:

1. Split the 27 AGI near-miss rows into:
   - valid strict semantic rows
   - hidden-schema artifacts to repair
   - genuine hard rows to preserve
2. Reserve a small zero-sibling holdout slice now.
3. Build V2 SFT from failure modes, not from the old 1500 wholesale.
4. Use GRPO only after verifier/reward mutation tests pass.

Do this and the plan is strong.
