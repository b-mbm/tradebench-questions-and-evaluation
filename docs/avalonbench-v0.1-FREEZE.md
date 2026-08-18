# AvalonBench v0.1.0 freeze

## Status

AvalonBench v0.1.0 is a content-addressed frozen release of 100 synthetic Avalon product-contract tasks. Its prompts, expected outcomes, deterministic grader, verification script, hosted-model runner, reference run, provenance hashes, and release manifest are pinned in `reports/avalonbench/frozen/v0.1.0`.

The release is intentionally below 1.0. It does not simulate complete live product journeys. AvalonBench v1.0 remains reserved for Concierge, widget creation, agent creation, autonomous agent ticks and tool use, execution, recovery, and authoritative terminal outcomes.

## What this release measures

The suite measures whether a model can infer the correct action and state from a frozen Avalon episode while preserving intent, evidence, strategy, tool, risk, execution, and recovery constraints. Every task is graded strict binary pass or fail. Diagnostic field results explain failures but do not create partial credit.

## Two valid uses

1. **Avalon regression:** compare an Avalon champion endpoint with a candidate endpoint on the same 100 tasks.
2. **Cross-model comparison:** compare Avalon with GPT, Fable, Claude, Qwen, Llama, or another model using byte-identical prompts, system scaffold, inference settings, runner, and grader.

Cross-model reports must name the exact model ID, endpoint or provider, inference settings, prompt hash, grader hash, runner hash, cost, latency, and transport completeness. A model is rankable only after all 100 tasks receive scoreable responses. Provider or transport failures are reported separately and rerun; they are not silently converted into capability failures. All headline scores use strict pass@1 over the same 100 items.

The phrase **under the Avalon scaffold** must accompany comparisons because the task framing reflects Avalon product contracts. A strong result supports product-contract competence under that scaffold. It does not establish profitable trading, full-app reliability, or general trading intelligence.

## Reference result

The retained reference run used `qwen/qwen3.6-27b` through OpenRouter and scored 82/100 after all 100 tasks received scoreable responses. This is a hosted base-model reference, not proof of the complete deployed Avalon product.

## Development-only limitation

The v0.1 items were inspected to create a failure map and item-disjoint practice siblings. The suite therefore remains useful for regression and cross-model comparison, but post-training gains on it are development acceptance evidence rather than untouched generalization evidence. Any promotion or external capability claim requires a separately frozen confirmation set that did not influence training, prompting, grader tuning, or data authoring.

## Freeze boundary

Changing any prompt, expected outcome, accepted alternate, tolerance, grader behavior, runner behavior, or system scaffold creates a new version. Existing files in the v0.1.0 bundle must never be edited in place.

The retained Claude review in the architecture specification accepted the specification, not this executable implementation. The executable release is mechanically frozen and deterministically verified; a separately retained independent implementation audit is still required before calling it independently qualified green.
