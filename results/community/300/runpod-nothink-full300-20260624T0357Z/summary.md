# RunPod Qwen3.6-27B No-Thinking 300Q A/B

Run completed on 2026-06-24 using local RunPod/vLLM serving.

## Config

- Endpoint stack: RunPod H100, vLLM OpenAI-compatible server.
- Base model id: `local-qwen36-27b-base`
- Tuned model id: `local-qwen36-27b-sft`
- Serving mode: no `response_format`, no `json_object`.
- Qwen thinking: disabled with `chat_template_kwargs: {"enable_thinking": false}`.
- Temperature: `0.1`
- Max tokens: `4000`
- Concurrency: `8`
- Grader: `scripts/grade-300q.ts` / `gradeSchemaResponse`
- Metric: strict `grade.pass` count.

## Final Strict First-Pass Score

| Model | Parsed | Pass | Score sum |
|---|---:|---:|---:|
| Base local Qwen3.6-27B | 300/300 | 73/300 | 110.2 |
| Tuned local Qwen3.6-27B SFT | 300/300 | 67/300 | 107.2 |

## Per-Level Pass Counts

| Level | Base | Tuned |
|---|---:|---:|
| L1 | 3/3 | 3/3 |
| L2 | 3/4 | 3/4 |
| L3 | 0/3 | 0/3 |
| L4 | 1/5 | 1/5 |
| L5 | 3/5 | 3/5 |
| L6 | 2/5 | 2/5 |
| L7 | 1/5 | 1/5 |
| L8 | 4/10 | 5/10 |
| L9 | 28/81 | 27/81 |
| L10 | 23/69 | 19/69 |
| L11 / AGI | 5/110 | 3/110 |

## Dirty Rows

The run produced 600 outputs and all parsed. Five rows ended with `finish_reason=length`; treat those as dirty/truncated rather than clean failures.

| Model | Question | Finish | Raw length | Duration seconds |
|---|---|---|---:|---:|
| base | L9-035 | length | 11897 | 412.319 |
| tuned | L9-079 | length | 8914 | 405.787 |
| tuned | AGI-040 | length | 13632 | 401.845 |
| tuned | AGI-070 | length | 9246 | 408.713 |
| base | AGI-071 | length | 10492 | 409.118 |

A targeted dirty retry was attempted after the main run, but the restarted vLLM serve hung in encoder cache profiling. The pod was stopped to avoid wasting spend. These five rows cannot reverse the main conclusion: the local SFT did not show a strict-pass lift over local base in this run.

Current strict grades on dirty rows:

- `base L9-035`: fail
- `base AGI-071`: fail
- `tuned L9-079`: pass
- `tuned AGI-040`: fail
- `tuned AGI-070`: fail

If all dirty rows were retried cleanly, the plausible final count could move by a few points, but not enough to convert the observed base lead into a tuned win.

## Interpretation

This is a valid local base-vs-tuned causal comparison for this RunPod/vLLM no-thinking stack. It is not leaderboard-comparable to the OpenRouter official baseline because local base did not reproduce the official OpenRouter score profile.

Main read: the SFT did not improve strict pass@1 on TradeBench 300 under the clean local runner. Base beat tuned by 6 strict passes before dirty retries.
