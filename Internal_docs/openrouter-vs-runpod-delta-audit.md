# OpenRouter vs RunPod Qwen3.6-27B 300Q Delta Audit

Date: 2026-06-26
Scope: Why hosted `qwen/qwen3.6-27b` on OpenRouter scores ~164/300 while our RunPod
fine-tune (`local-qwen36-27b-sft`, vLLM, bf16, `--enforce-eager`) scored 38/300 on the
same 300-question schema benchmark. Read-only data audit; no paid calls, no pods run.

All numbers below are recomputed directly from the result JSON, not taken on faith.

---

## 1. Honest OpenRouter pass count

**Canonical per-question source:**
`results/community/300/openrouter-qwen-open-weight-n1-final-from-checkpoint-2026-06-14T23-28-55-760Z.json`
(300 questionIds, 4 models, `qwen/qwen3.6-27b` = 300 unique evaluations).

Recomputed: **164 / 300 pass** (54.7%), with **6 dirty (blank-raw) rows**:
`L8-003, L10-008, L10-051, AGI-073, AGI-078, AGI-081`.

This exactly matches the dirty-rows ledger
(`results/official/300/tradebench-all-current-n1-dirty-rows-2026-06-15.json` →
`qwen/qwen3.6-27b`: `{dirty:6, pass:164, clean:294, answered_fail:130}`, same 6 IDs)
and the `current-n1-summary` CSV row (`164,300,54.7,294 clean,6 dirty`).

**The 166 figure** in `results/official/300/June 15th final/June 15th final numbers.csv`
(`166,300,55.3,300 clean,0 dirty`) is the *post-repair* aggregate. Tracing the repair
checkpoint `results/repair-checkpoints/top20-no-openai-pro-dirty-repair.jsonl`:

| Dirty ID | Repair outcome | Net |
|---|---|---|
| L10-008 | came back non-blank, graded **pass** | +1 |
| L8-003 | retried, came back non-blank, graded **pass** | +1 |
| L10-051 | blank/transport-error on every retry (6 attempts) | still dirty |
| AGI-073 | blank/transport-error/truncated on every retry | still dirty |
| AGI-078 | blank/explicit-error/truncated on every retry | still dirty |
| AGI-081 | blank on retry | still dirty |

So 164 → **166** after repair. The residual 4 are **OpenRouter provider-side transport /
truncation failures** (`dirtyTypes: empty_raw, truncated_response, transport_error`), not
model-capability misses. Honest read: **164 raw, 166 after dirty-row repair; the gap to a
clean 300 is provider flakiness on 4 rows, not the model.**

Rows ever blank/dirty/repaired for this model: **6 distinct** (all 6 went through the
repair pipeline; 2 recovered to pass, 4 remained unrecoverable transport failures).

Note on other "qwen" dirs that are NOT this model:
- `results/qwen-open-weight-n1-2026-06-14/` and `...smoke...` = `qwen/qwen3.6-35b-a3b` and others (not 27B).
- `results/top20-no-openai-pro-n3/run1/` = `qwen/qwen3.7-plus` + `qwen/qwen3.6-max-preview`.
- `results/parallel-level*-working/` contain only a handful of `qwen/qwen3.6-27b` rows each (multi-model sweep reps), not a clean 300; superseded by the checkpoint file above.

---

## 2. Exact OpenRouter run settings (from code)

Runner: `scripts/parallel-runner.ts`. Orchestrator: `scripts/run-top20-no-openai-pro-n3.sh`.

| Setting | Value | Source |
|---|---|---|
| Endpoint | `https://openrouter.ai/api/v1` (OpenAI SDK) | `scripts/parallel-runner.ts:673` |
| `response_format` | `{ type: "json_object" }` | `scripts/parallel-runner.ts:501` |
| `temperature` | `0.1` (`DEFAULT_TEMPERATURE`) | `scripts/parallel-runner.ts:86,499` |
| `max_tokens` | `2200` (`DEFAULT_MAX_TOKENS`, override via `SMOKE_MAX_TOKENS`) | `scripts/parallel-runner.ts:87,109,500` |
| Default concurrency | `50` | `scripts/parallel-runner.ts:102` |
| Concurrency used (top20 orch) | `6` (`CONCURRENCY:-6`) | `scripts/run-top20-no-openai-pro-n3.sh` |
| Default max-retries | `6` | `scripts/parallel-runner.ts:110,188` |
| Max-retries used (top20 orch) | `2` (`MAX_RETRIES:-2`), plus 3 repair rounds | `scripts/run-top20-no-openai-pro-n3.sh` |
| Per-request timeout | `180000 ms` default; **600000 ms** in top20 orch (`OPENROUTER_TIMEOUT_MS`) | `scripts/parallel-runner.ts:88`; shell |
| Retry backoff | exp 2s→60s + jitter, retryable = 429/5xx/timeout/blank/empty/parse | `scripts/parallel-runner.ts:455,479-483` |

`scripts/run-300q.ts` mirrors the same defaults (temp `0.1`, maxTokens `2200`,
`scripts/run-300q.ts:253-254`).

**Key point for the delta:** OpenRouter ran `json_object` at only **2200 max_tokens** and
the model fit comfortably — confirming the hosted endpoint returns *compact* JSON
(no visible reasoning) for this model. RunPod did not have that luxury (see §3b).

---

## 3. Per-tier comparison and gap attribution

Tier buckets: L1-8 (the 40 basic/intermediate Qs present), L9 (81), L10 (69), AGI (110).

### Per-tier pass table

| Tier | n | OpenRouter (json, 2200tok) | RunPod json_object 300 (38/300) | RunPod no-json (best available) |
|---|---|---|---|---|
| L1-8 | 40 | **25** (1 blank) | 20 | base/tuned recovered (see gate) |
| L9 | 81 | **66** | 13 | strong recovery |
| L10 | 69 | **55** (2 blank) | 5 | strong recovery (8/8 on gate subset) |
| AGI | 110 | **18** (3 blank) | 0 (18 blank) | **0/6 on gate, still 0** |
| **Total** | 300 | **164** | **38** | n/a (subset runs only) |

Sources: OpenRouter = consolidated checkpoint; RunPod json_object =
`results/community/300/runpod-qwen36-27b-sft-300-2026-06-23T01-35-07-238Z.json`
(model `local-qwen36-27b-sft`); no-json = `nojson29-gate-graded-2026-06-23.json`.

**Direct hard-subset control (29 questions present in both pipelines):**
- RunPod **json_object**: **9/29**
- RunPod **no-json tuned**: **20/29** (base 18/29)
- (gate tier split, tuned: nonAGI 5/7, L9 7/8, L10 8/8, **AGI 0/6**)

That +11 on the same 29 questions, purely from dropping `json_object`, is the cleanest
single measurement of the json-collapse + truncation tax.

### Factor attribution (rough magnitudes)

The RunPod 38/300 vs OpenRouter 164/300 gap (~126 questions) decomposes as:

**(a) json_object xgrammar schema collapse — the dominant factor (~80-100 questions).**
Confirmed in data, not just `Internal_docs/eval-postmortem-vllm-json-collapse.md`. In the
RunPod `json_object` run, AGI rows are emitted in the *generic execute-one* shape
(`intent/order_type/asset/size/venue/...`) instead of the AGI-canonical schema — e.g.
AGI-001 returns `{"intent":"hedge","order_type":"perp_short","asset":"SOL",...}` rather
than the nested hedge/shorts structure the rubric scores. xgrammar collapsed every AGI
rubric to one constrained grammar. Result: AGI 0/110 and depressed L9/L10 (13/81, 5/69).
The 29-Q control (9 → 20 on no-json) shows roughly +0.4 pass/question recovery on hard
tiers once the collapse is removed; extrapolated across L9+L10+AGI this is the bulk of the
gap. Magnitude: **largest single factor.**

**(b) Token-budget / truncation in the no-json path (~moderate, tier-dependent).**
Qwen3.6-27B is a reasoning model (`Internal_docs/qwen36-reasoning-runner-design.md`); in
no-json mode it emits 12k-17k chars of visible reasoning. With caps at 6000/9000 tokens it
hits `finish_reason=length`. In `nojson-agi6-outputs.json`, **3 of 6** AGI rows truncate
(AGI-001/002/004, all `finish=length`, rawLen 14.5k-17k). On OpenRouter the hosted endpoint
returns compact JSON with *no* visible reasoning, so 2200 tokens sufficed — the truncation
problem is RunPod-specific and an artifact of how we elicit output, not the weights.
Magnitude: **secondary; primarily an L9/L10 + a-few-AGI suppressor, largely fixable with
bigger budgets.**

**(c) AGI validator strictness (small in count, but it caps the AGI ceiling).**
The AGI verifier exact-matches hidden canonical labels. `scoreAgiValidation`
(`src/grading/schema-grader-300q.ts:528-535`) requires `normalizeCategorical(value) ===
normalizeCategorical(expected)` for string fields, and `intent`/`chosen_strategy` have
hidden expecteds the prompts never disclose (e.g. AGI-024 expects
`intent=adversarial_event_execution`, `chosen_strategy=private_first_hidden_completion`;
AGI-001 expects `hedge_adversarial_beta` / `alt_beta_pair_matic_first`). More importantly,
`agiStructuralSatisfied` (line 3870-3877) hard-fails any AGI row with a `missing_field` or
`mismatch_fieldname`, and the no-json parse path also takes a confidence multiplier of
**0.6** for `parse:none` vs **0.8** fenced / **1.0** clean JSON (line 3865), right at the
`confidence >= 0.6` pass gate (line 3925). The no-json AGI rows all carried `missing_field`
(missing nested shapes) → structural auto-fail even when economics were correct. Magnitude:
**affects the AGI tier ceiling; ~2-3 of the 6 hard AGI rows are pure validator/parse
artifacts, not capability.**

**(d) Quantization / precision — UNKNOWN, likely small.**
RunPod is bf16 (full precision, `--enforce-eager`). OpenRouter provider precision for
`qwen/qwen3.6-27b` is **not recorded anywhere in this repo** — flagged as unknown. bf16 is
if anything *higher* precision than a typical hosted fp8/int8 serve, so precision does not
plausibly explain RunPod scoring *lower*. Magnitude: **assumed negligible / cannot be the
cause of the gap.**

**(e) Genuine model differences (small but real).**
RunPod runs our **fine-tune** (`local-qwen36-27b-sft`); OpenRouter runs **stock**
`qwen/qwen3.6-27b`. On the no-json gate the tuned model genuinely solved AGI-004 economics
where base did not, but base and tuned both genuinely miss AGI-002, AGI-003, AGI-014
(wrong economics/sign/formula, not labels — see §4). So a handful of AGI rows are real
capability misses. Magnitude: **small; a few AGI rows.**

**Summary:** the 126-question gap is overwhelmingly **infrastructure/harness, not weights**:
json_object collapse (a) >> no-json truncation (b) > validator/parse strictness (c) >
genuine model misses (e) >> precision (d, ~0).

---

## 4. Claim under test: "RunPod AGI failures are primarily a token-budget problem;
with 16k-32k tokens / no-json the model would solve most of them."

**Verdict: REFUTED as stated. Token budget is *one* factor (half the rows), not the
primary cause. AGI stays 0/6 even with full no-json output.**

Evidence — the 6 hard AGI rows (`nojson-agi6-outputs.json` + `nojson29-gate-graded`):

| AGI row | finish | rawLen | Token-fixable? | Real cause |
|---|---|---|---|---|
| AGI-001 | length | 15.5k | partial | truncated **AND** wrong economics (risk reduction too low, residual just out of range) + missing nested `shorts.SOL` |
| AGI-002 | length | 14.9k | no | truncated but reasoning chose wrong (DEX-heavy) route; genuine route/canonical miss |
| AGI-004 | length | 16.4k–17.1k | **yes (tuned)** | tuned model economics fully correct; fails only strict `intent` label + nested `allocation_usd.*` shape → validator/parse artifact |
| AGI-003 | **stop** | 14.5k | **no** | completed fully; wrong economics (drawdown sign, funding sign) — genuine miss |
| AGI-014 | **stop** | 13.3k–13.6k | **no** | completed fully; allocations right but APR/PnL formula wrong — genuine miss |
| AGI-024 | **stop** | 12.1k–12.6k | **no** | completed fully; economics correct (avg 1.20686, slippage 0.57%, hidden 7000) but fails hidden `intent`/`chosen_strategy` labels + missing required `execution_sequence`/nested `venue_fills.*` → validator/structural artifact |

Breakdown of the 6:
- **Token-fixable (truncated, more tokens *might* help): 3** (AGI-001, AGI-002, AGI-004) —
  all `finish=length`. But of these, AGI-002 is also a genuine route miss, and AGI-001 also
  has wrong economics, so only **~1 (AGI-004 tuned) is plausibly a clean token+schema win.**
- **Validator / structural artifacts (correct-enough economics, fail labels/nesting): ~2**
  (AGI-024 both models; AGI-004 tuned) — `finish=stop`, more tokens do nothing.
- **Genuine capability misses (completed, wrong economics): ~2-3** (AGI-003, AGI-014, and
  AGI-002's route choice).

Decisive cross-check: **3 of 6 rows completed (`finish=stop`) with 12k-15k chars and still
failed.** Giving them 32k tokens changes nothing. And on OpenRouter — where the model is
*not* token-starved and emits compact JSON — stock qwen3.6-27b **passed AGI-004, AGI-014,
and AGI-024** (and only 18/110 AGI overall). That confirms (i) those rows are solvable, but
the lever is the **clean-JSON output path** (no `missing_field`, confidence 1.0), not raw
token count; and (ii) AGI as a tier is hard for this model class regardless of harness
(OpenRouter, fully un-truncated, still only 18/110).

So: adequate tokens recover the *truncated* L9/L10 rows strongly (json_object 9/29 →
no-json 20/29 on the gate), but for AGI specifically, **tokens fix at most ~1-3 of the
hard rows; the rest are validator/parse-shape artifacts or genuine economic misses.** The
"most of them would be solved with more tokens" framing overstates the token factor.

---

## 5. Recommended fixes (in impact order)

1. **Eliminate json_object/xgrammar on vLLM** for AGI (and ideally all tiers). The schema
   collapse is the single biggest score destroyer (AGI 0→recoverable, L9/L10 +11 on the
   29-Q control). Use guided-json with the *per-rubric* schema, or no-json + robust fenced
   parse, never a single collapsed grammar.
2. **Give the no-json reasoning path 16k+ tokens** to clear `finish=length` on L9/L10 and
   AGI-001/002/004. Necessary but not sufficient for AGI.
3. **Settle the AGI verifier policy** before any paid full-300: decide whether hidden
   `intent`/`chosen_strategy` exact labels are intended strict checks, and fix the no-json
   parser so correct-economics rows don't fail `agiStructuralSatisfied` on `missing_field`
   from nesting/flattening. Add an audit-only proximity score. (Per
   `results/community/300/nojson29-agi-validator-diagnosis-2026-06-23.md`.)
4. **Record OpenRouter provider precision** for `qwen/qwen3.6-27b` so factor (d) stops
   being an unknown.

---

## Artifacts written by this audit
- `Internal_docs/openrouter-vs-runpod-delta-audit.md` (this file)
- `results/community/300/qwen36-openrouter-consolidated.json` — 300 rows
  `{questionId, level, raw, pass, score}` for `qwen/qwen3.6-27b`, latest-by-question
  (164 pass, 6 blank-raw rows preserved).
