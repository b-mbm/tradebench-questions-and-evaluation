# Delta Memo for Codex — AGI diagnostic + RunPod eval handoff

**Date:** 2026-06-23 · **From:** Claude Code session · **State:** pod `vfp294dpl2hbud` EXITED (not billing); model+adapter+venv intact on network volume `qqz94ksxmn` (`/workspace`).

## 1. The actual finding — AGI tier 0/6 is diagnosed (for free)

From the existing 29-row no-json run (no rerun needed). Graded file: `results/community/300/nojson-agi6-graded-2026-06-23-from29.json` (raw + normalized for all 12 rows). Splits cleanly, **identical for base and tuned**:

- **TRUNCATION (3): AGI-001, AGI-002, AGI-004** — `finish=length` at max_tokens 6000; raw output 15k–17k chars, cut mid-JSON → missing fields. *Only these benefit from a higher-token rerun.*
- **COMPLETED BUT WRONG (3): AGI-003, AGI-014, AGI-024** — `finish=stop`, parsed cleanly, partial credit (0.27 / 0.64 / 0.27). Fail on **numeric** mismatches: `apr_pct`, `pnl_30d_usd`, `worst_case_margin_drawdown_pct`, `funding_window_pnl_usd`, `self_check`.
- **UNIVERSAL (all 6, both models):** every AGI row fails `agi_validation_failed:intent` **and** `:chosen_strategy` — even the 0.64 row. This is the signature of an **over-strict validator** on those two fields (exact-match on free text / enum-vocab mismatch). Concrete example: base AGI-003 emitted `intent:"defensive_hedge"` + a sensible `chosen_strategy` sentence and both were rejected.

**Conclusion:** AGI 0/6 is **not** model incapacity (L10 was 8/8). It's a layered artifact: an over-strict `intent`/`chosen_strategy` validator dragging down *every* AGI row, + 3 truncations + 3 genuine numeric misses.

## 2. What Codex should do next (cheap → expensive)

1. **(No pod, $0) Inspect the validator.** In `src/grading/schema-grader-300q.*` + `src/rubrics/stockbench-agi-*.json`, check how `intent` and `chosen_strategy` are validated. If exact-match/enum on free text → it's over-strict; loosen to semantic/contains/enum-with-synonyms. This likely lifts AGI across the board and may be a real benchmark bug.
2. **(No pod, $0) Adjudicate the 3 numeric misses** (003/014/024): the graded JSON has both the model's normalized values and the rubric expectations — compare vs ground truth to decide genuine-wrong-math vs too-tight tolerance.
3. **(Pod, ~25-min cold start) Only then** rerun AGI-001/002/004 at `max_tokens 9000` to confirm they complete (and whether they then pass). Low marginal value until #1/#2 are done. On-pod assets are ready: `/workspace/gen-agi6.py`, `launch-agi6.sh`, `serve-agi.sh`, `probe-prompts-agi6.json`.

## 3. Broader benchmark state

29-row no-json gate (`results/community/300/nojson29-gate-graded-2026-06-23.json`): **base 18/29, tuned 20/29, FT delta +2** (within noise on n=29). Tier: nonAGI 4/5–7, L9 6–7/8, **L10 8/8 both**, AGI 0/6 both. 0 errors. Truncation suppressed ~8 rows at 6000 tokens. Verdict was AMBIGUOUS — but mostly because of the AGI-validator + truncation artifacts above, not model weakness. **Do not run the full 300 until the AGI validator and max_tokens are fixed** — you'd bake in both artifacts.

## 4. RunPod / vLLM infra lessons (the expensive ones)

- **Network-volume venv = ~15–20 min cold start EVERY time.** vLLM imports alone took ~7 min reading the venv off FUSE-mounted `/workspace/vllm`. **Recommend baking deps into the container image** instead of the network volume to kill this.
- **Working serve recipe (H100 80GB, this model):** ninja symlink (`ln -sf /workspace/vllm/bin/ninja /usr/local/bin/ninja`); `--enforce-eager` (REQUIRED — CUDA-graph capture hangs this hybrid arch); `--max-lora-rank 32`; `--max-num-seqs 16`; `--max-model-len 16384` fits.
- **Judge loading-vs-stalled by FORWARD PROGRESS (log-byte/RSS growth), not elapsed time.** FUSE write-back delays make the log show 0 bytes for minutes while it's actually fine — I nearly terminated a healthy serve over this.
- **`pkill -f <pat>` self-match:** never inline a pkill whose pattern appears in the ssh command line (it kills the ssh shell). Put kill+launch in an on-pod script.
- **Verify-before-trust:** an scp cut mid-transfer left the gen script absent → "launched" but 0 rows. Always confirm file landed + rows>0 + gpu>0 before walking away.
- **DURABILITY — the killer:** a Mac-side `/loop` + `ScheduleWakeup` heartbeat is **unreliable for unattended multi-tick runs.** It fired once then stopped; the serve came up and sat idle; the 60-min backstop killed the pod → **2 hours, $ spent, zero output.** Fix: put the ENTIRE `wait-for-serve → launch-gen → run-to-completion` in ONE detached on-pod script (`setsid`), so completion never depends on the chat. The chat only pulls + grades at the end. Always arm a time-based pod backstop for cost.
- **max_tokens:** hard AGI/L10 rows reason 13k–17k chars; use **≥9000** (6000 truncated ~8/29).

## 5. Artifacts

- Scripts: `scripts/grade-agi6.ts` (classifier: truncation/parser/exact-label/wrong-value), `scripts/grade-nojson29.ts`.
- Results: `results/community/300/nojson29-gate-graded-2026-06-23.json`, `…/nojson-agi6-graded-2026-06-23-from29.json`; raws `nojson29-outputs.json`, `nojson-agi6-outputs.json`.
- Pod: `vfp294dpl2hbud` (EXITED), image `runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404`, H100 80GB, container 60GB, mount `/workspace`, networkVolume `qqz94ksxmn`. On `/workspace`: `models/qwen3.6-27b`, `out/sft` (LoRA adapter), `vllm` venv, all gen/serve scripts.
- Skill updated this session: `benchmark-runner-design` (Bayesian diagnosis, score suppressors, durability, execution gotchas) — synced to the Codex skills dir.

## 6. Security
Rotate the RunPod API key — it was pasted in chat earlier this engagement. Keep the 300 eval questions held out; train only item-disjoint siblings.
