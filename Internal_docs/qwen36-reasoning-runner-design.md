# Qwen3.6-27B is a reasoning model — root cause + the runner we should build

**Date:** 2026-06-24 · Analysis only (no full runs). Evidence from small OpenRouter probes + the committed original run data.

## TL;DR
`qwen/qwen3.6-27b` is a **reasoning model**: it spends most of its token budget on *hidden* reasoning, then emits a *compact* final JSON. This single fact explains every score mystery we've chased — the RunPod low score, the truncation, the OpenRouter blanks, **and the original 164/166 itself** (which was suppressed, not a true ceiling). The fix is a reasoning-aware runner with an adequate, escalating token budget and proper instrumentation.

## The decisive evidence
Same model, same prompts, OpenRouter, `json_object`, temp 0.1, only `max_tokens` changed:

| Row | max_tokens 2200 | max_tokens 8000 |
|---|---|---|
| AGI-003 | **blank** (0 chars, 4 retries) | ok, 934 chars, score 0.29 |
| AGI-014 | **blank** | ok, 709 chars, score 0.64 |
| L9-001  | **blank** | ok, 225 chars, **score 1.00 pass** |
| L1-001 / L10-001 / AGI-001 | ok (277 / 302 / 896 chars) | — |

Visible output is tiny (**225–934 chars**) in *both* cases. So the 8000 budget wasn't spent on visible text — it was spent on **hidden reasoning**. At 2200 the reasoning never finishes → zero visible content → "blank response." At 8000 reasoning fits → compact answer appears. That is textbook reasoning-model behavior (reasoning-first, then answer). A pure truncation bug would yield ~6k chars of *cut-off* text at 2200, not 0.

## One root cause unifies every symptom
- **OpenRouter blanks (now):** reasoning exhausts the 2200 budget on hard rows → empty visible JSON.
- **The original 164/166 was suppressed:** in the committed original runs at `SMOKE_MAX_TOKENS=2200`, the *same* rows were blank — AGI-003, AGI-014, L9-001 — plus ~23/56 sampled easy rows. Those blanks counted as fails. **164 is a floor, not the model's true score.**
- **RunPod no-json truncation:** identical reasoning, but in no-json mode it's *visible* (13k–17k chars) and truncates at 6k–9k.
- **RunPod `json_object` 38/300:** a *separate* bug — vLLM xgrammar over-constrains and collapses the schema (OpenRouter's `json_object` is loose; vLLM's is not). Do not conflate.
- **AGI `intent`/`chosen_strategy` 0/6:** a *fourth, independent* issue — an over-strict validator (see `nojson29-agi-validator-diagnosis`). Fix in the rubric, not the runner.

**Model identity:** both stacks run the official `Qwen/Qwen3.6-27B` weights (RunPod via `snapshot_download("Qwen/Qwen3.6-27B")`; OpenRouter routes to the same model). Remaining unknowns: exact repo revision and **OpenRouter provider precision** (likely fp8/quantized). These don't cause the blanks but DO matter for exact cross-stack comparison — so pin/record them.

## Why "replicate 164/166" is the wrong goal
That number was produced by a runner whose **default `max_tokens=2200` is too small for a reasoning model**, so it silently dropped hard rows as blanks. Replicating it would replicate the bug. The right goal: a correct runner that (a) gives enough budget to finish reasoning, (b) records *why* any row fails, (c) is deterministic across runs — then re-measure. Expect the true score to be **higher and cleaner** than 164.

## The runner we should build (spec)

Keep what's already good (TS + OpenAI SDK, checkpointed JSONL generate/score, repair loops, strict `grade.pass`). Change/add:

1. **Reasoning-sized token budget.** Default `max_tokens` ≥ **8000** for reasoning models (cleared every test row); make it per-model. For local/vLLM no-json, ≥ **16000** (reasoning is visible there).
2. **Escalating retry on budget exhaustion.** Today a blank is retried *identically* → fails again (reasoning still won't fit at 2200). Instead: on blank **or** `finish_reason=="length"`, **escalate** the budget on retry (e.g. 2200→8000→16000) rather than repeating. This alone would have salvaged the original blanks.
3. **Capture `finish_reason` + token usage per row** (`prompt`, `completion`, and `reasoning_tokens` if present). The current runner records none of this — which is *why* every failure looked like a mystery. With it, blank-from-budget vs refusal vs parse-fail vs truncation are instantly distinguishable.
4. **Separate reasoning from answer.** Read provider reasoning fields (`reasoning` / `reasoning_details`) when present and log them apart from the graded answer; never let reasoning silently consume the visible budget unobserved.
5. **Deterministic OpenRouter routing.** Pass `provider: { require_parameters: true }` (only route to backends that honor `response_format`) and record the serving provider + precision per row. This fixes "same model?" reproducibility and prevents silent backend swaps between runs.
6. **Format is stack-specific.** OpenRouter: keep `json_object` (loose, compact, no truncation). vLLM/local: **no `json_object`** (xgrammar collapses it) — use no-json + robust fenced/final-JSON extraction + the larger budget.
7. **Full failure taxonomy in output.** Never collapse to "fail." Tag each row: `blank/budget`, `truncation(length)`, `parse/nesting`, `validator(label)`, `wrong-value`, `transport`. (We already built the classifier in `scripts/grade-agi6.ts`.)
8. **Repair pass that escalates budget** specifically for `blank`/`length` rows before declaring them failed.

### Recommended config
- **OpenRouter:** temp 0.1, **max_tokens 8000** (escalate→16000 on blank/length), `json_object` + `provider.require_parameters`, timeout 300s, concurrency 6, capture finish_reason+usage+provider, checkpointed JSONL, repair loops.
- **Local/vLLM:** no-json, **max_tokens 16000**, `--enforce-eager`, robust extraction, capture finish_reason; serve recipe per `benchmark-runner-design` / `runpod-operating-playbook`.
- **Both:** strict `grade.pass`; emit the failure taxonomy; for base-vs-tuned, hold everything else identical (control discipline).

## Sequencing (when we run)
1. Re-baseline **stock** qwen3.6-27b on OpenRouter with max_tokens 8000 + escalation → the *true* reference (likely > 164).
2. Re-run our **fine-tune** on RunPod no-json @ 16000 (kills truncation) → true base-vs-tuned delta on identical serving.
3. Fix the AGI validator (separate) before trusting AGI-tier numbers.
4. Only then consider the full 300 at scale.
