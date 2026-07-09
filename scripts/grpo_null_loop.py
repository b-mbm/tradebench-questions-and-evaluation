#!/usr/bin/env python3
"""
grpo_null_loop.py — Hand-rolled GRPO null-reward control loop.

WHY THIS EXISTS (council decision 2026-07-07):
  TRL's vllm_mode="server" CANNOT connect to SGLang (constructor crash on
  /init_communicator, rollouts to /generate/ not /v1/chat/completions, weight
  sync to /start_weight_update which SGLang doesn't implement). See
  Internal_docs/council-decision-kill-trl-2026-07-07.md.

  This hand-rolled loop replaces TRL entirely. Per Schulman's stripped spec:
    - REINFORCE + group-relative advantage (PPO clip is a no-op at ratio=1)
    - No KL penalty (random zero-mean advantages don't cause runaway drift)
    - Log KL-from-reference as a monitor
    - Off-policy rollouts: SGLang serves all rollouts from BASE weights.
      For the null control this is valid — reward is noise, so it doesn't
      matter which policy generated the rollouts. Merge LoRA only at
      checkpoint evals (steps 10/20/30), not every step.

THE NULL-REWARD CONTROL (Lambert's gate):
  Reward = shuffled within each group (uncorrelated with quality).
  If eval score moves → Qwen-base contaminated (memorized answers).
  If it doesn't move → CLEAN.

FINITE, BUDGETED, SAFE:
  - Hard step cap. Auto-exit on NaN/Inf.
  - All results to /workspace/ (persistent volume).
  - Writes DONE flag on completion.
"""
import os
import sys
import json
import time
import argparse
import requests
import numpy as np
import torch
import torch.nn.functional as F
from pathlib import Path


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--mode", choices=["smoke", "null", "real"], default="null",
                   help="smoke=2-3 steps; null=shuffled reward; real=real reward")
    p.add_argument("--sglang-url", default=os.environ.get("SGLANG_URL", "http://127.0.0.1:8000"))
    p.add_argument("--repo-root", default=os.environ.get("REPO_ROOT", "/workspace/repo"))
    p.add_argument("--model-path", default=os.environ.get("MODEL_PATH", "/workspace/models/qwen3.6-27b"))
    p.add_argument("--output-dir", default=os.environ.get("OUTPUT_DIR", "/workspace/null-reward"))
    p.add_argument("--train-ids", default=os.environ.get("TRAIN_IDS", ""))
    p.add_argument("--gate-ids-file", default=os.environ.get(
        "GATE_IDS_FILE", "/workspace/repo/results/grpo-preconditions/gate-eval-ids.txt"))
    p.add_argument("--steps", type=int, default=None)
    p.add_argument("--group-size", type=int, default=8)
    p.add_argument("--seed", type=int, default=42)
    p.add_argument("--lr", type=float, default=1e-5)
    p.add_argument("--lora-r", type=int, default=32)
    p.add_argument("--lora-alpha", type=int, default=64)
    p.add_argument("--max-prompt-len", type=int, default=8192)
    p.add_argument("--max-completion-len", type=int, default=2048)
    p.add_argument("--eval-at", default="10,20,30")
    p.add_argument("--temperature", type=float, default=0.7)
    return p.parse_args()


# ─── SGLang rollout generation (CONCURRENT) ──────────────────────────────
def _sglang_generate_one(url, prompt_text, model_name, temperature, max_tokens, enable_thinking):
    """Generate ONE completion via SGLang. Worker function for ThreadPoolExecutor."""
    payload = {
        "model": model_name,
        "messages": [{"role": "user", "content": prompt_text}],
        "temperature": temperature,
        "max_tokens": max_tokens,
        "response_format": {"type": "json_object"},
        "stream": True,
    }
    if not enable_thinking:
        payload["chat_template_kwargs"] = {"enable_thinking": False}
    body = json.dumps(payload)
    t0 = time.time()
    try:
        import subprocess
        result = subprocess.run(
            ["curl", "-s", "-m", "600", "-N", url,
             "-H", "Content-Type: application/json", "-d", body],
            capture_output=True, text=True, timeout=620,
        )
        dt = time.time() - t0
        content_parts, reasoning_parts, finish = [], [], None
        for line in result.stdout.split("\n"):
            line = line.strip()
            if not line.startswith("data: "):
                continue
            d = line[6:]
            if d == "[DONE]":
                break
            try:
                ch = json.loads(d)["choices"][0]
                delta = ch.get("delta", {})
                if delta.get("content"):
                    content_parts.append(delta["content"])
                if delta.get("reasoning_content"):
                    reasoning_parts.append(delta["reasoning_content"])
                if ch.get("finish_reason"):
                    finish = ch["finish_reason"]
            except (json.JSONDecodeError, KeyError, IndexError):
                pass
        return {
            "content": "".join(content_parts),
            "reasoning": "".join(reasoning_parts),
            "finish_reason": finish or "unknown",
            "dt": round(dt, 2),
        }
    except Exception as e:
        return {"content": "", "reasoning": "", "finish_reason": "ERROR", "dt": 0, "error": str(e)[:200]}


def sglang_generate(sglang_url, prompts, model_name, temperature, max_tokens, enable_thinking=True, concurrency=8):
    """Generate completions CONCURRENTLY via ThreadPoolExecutor.

    Returns list of {content, reasoning, finish_reason, dt} in the SAME ORDER as prompts.
    """
    from concurrent.futures import ThreadPoolExecutor, as_completed
    url = sglang_url.rstrip("/") + "/v1/chat/completions"
    results = [None] * len(prompts)

    with ThreadPoolExecutor(max_workers=min(concurrency, len(prompts))) as pool:
        futures = {}
        for i, prompt_text in enumerate(prompts):
            f = pool.submit(_sglang_generate_one, url, prompt_text, model_name,
                           temperature, max_tokens, enable_thinking)
            futures[f] = i
        for f in as_completed(futures):
            results[futures[f]] = f.result()

    # Replace any None (shouldn't happen, but be safe)
    for i, r in enumerate(results):
        if r is None:
            results[i] = {"content": "", "reasoning": "", "finish_reason": "ERROR", "dt": 0}
    return results


# ─── Reward via TS grader (proven, validated against real model output) ──
def grade_rollouts(repo_root, batch):
    """Grade a batch of {id, response} via the TS grader subprocess.

    Returns list of {id, score, pass, detail}.
    Uses the proven TypeScript grader (schema-grader-300q.ts) via npx tsx.
    """
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from grpo_reward import GraderSubprocess
    if not hasattr(grade_rollouts, "_grader"):
        grade_rollouts._grader = GraderSubprocess(repo_root)
    return grade_rollouts._grader.grade_batch(batch)


def close_grader():
    if hasattr(grade_rollouts, "_grader"):
        grade_rollouts._grader.close()
        del grade_rollouts._grader


# ─── GRPO loss (Schulman's stripped spec) ─────────────────────────────────
def compute_group_advantages(scores, group_size):
    """Group-relative advantage: A_i = (r_i - mean(group)) / (std(group) + eps).

    For shuffled (null) reward, this has E[A] ≈ 0 by construction.
    """
    scores = np.array(scores, dtype=np.float32)
    advantages = np.zeros_like(scores)
    for i in range(0, len(scores), group_size):
        group = scores[i:i + group_size]
        mean = group.mean()
        std = group.std() + 1e-8
        advantages[i:i + group_size] = (group - mean) / std
    return advantages


def grpo_loss_step(model, input_ids, attention_mask, labels, advantages, completion_mask):
    """One GRPO loss computation: REINFORCE with group-relative advantage.

    For each completion, loss = -A * mean(logprob of completion tokens).
    No PPO clip (no-op at ratio=1 on single-update on-policy).
    No KL penalty (random zero-mean advantages don't drift). KL logged separately.

    Args:
        input_ids:    [N, seq_len] — prompt + completion token ids
        attention_mask: [N, seq_len]
        labels:       [N, seq_len] — -100 for prompt tokens, actual ids for completion
        advantages:   [N] — group-relative advantage per sequence
        completion_mask: [N, seq_len] — 1 for completion tokens, 0 for prompt/pad

    Returns: scalar loss tensor (ready for backward)
    """
    outputs = model(input_ids=input_ids, attention_mask=attention_mask)
    logits = outputs.logits  # [N, seq_len, vocab]

    # Shift for next-token prediction: logits[:, :-1], labels[:, 1:]
    shift_logits = logits[:, :-1, :].contiguous()
    shift_labels = labels[:, 1:].contiguous()
    shift_mask = completion_mask[:, 1:].contiguous().float()  # [N, seq_len-1]

    # Per-token logprobs of the actual tokens
    logprobs = F.log_softmax(shift_logits, dim=-1)
    token_logprobs = logprobs.gather(2, shift_labels.unsqueeze(-1).clamp(min=0)).squeeze(-1)  # [N, seq_len-1]
    # Mask out non-completion tokens and padding
    token_logprobs = token_logprobs * shift_mask

    # Sum logprobs per sequence (joint probability of the completion)
    seq_logprobs = token_logprobs.sum(dim=1) / (shift_mask.sum(dim=1).clamp(min=1))  # [N] mean per-token logprob

    # REINFORCE: loss = -mean(A * seq_logprob)
    # Advantages detached — they're computed from the (shuffled) reward, not learned
    adv = torch.tensor(advantages, device=logits.device, dtype=torch.float32)
    loss = -(adv * seq_logprobs).mean()

    return loss, seq_logprobs.detach().cpu().numpy()


def compute_kl_from_reference(model_logprobs, ref_logprobs):
    """Per-token KL estimate: mean(logp_model - logp_ref).

    TRL/DeepSeek estimator. Values >10 nats = divergence warning.
    """
    return float(np.mean(model_logprobs - ref_logprobs))


# ─── Checkpoint eval ──────────────────────────────────────────────────────
def eval_checkpoint(args, gate_ids, step, merged_model_path=None):
    """Eval current model on gate set via the PROVEN run-sglang-concurrent.py runner.

    Uses the runner for generation (matching baseline parity exactly: separate
    system+user messages, streaming, json_object, budget ladder, retries).
    Then grades via the TSX grader subprocess.

    If merged_model_path given, SGLang has been weight-synced (post-training).
    Otherwise SGLang serves base (for step-0 baseline).
    """
    import subprocess
    out_subdir = os.path.join(args.output_dir, f"eval-step-{step}")
    os.makedirs(out_subdir, exist_ok=True)

    runner = os.path.join(args.repo_root, "scripts", "run-sglang-concurrent.py")
    env = os.environ.copy()
    env["IDS"] = ",".join(gate_ids)
    env["OUT_DIR"] = out_subdir
    env["PROBE_ENDPOINT"] = args.sglang_url
    env["MODELS"] = "local-qwen36-27b-base"
    env["ENABLE_THINKING"] = "1"
    env["CONCURRENCY"] = os.environ.get("EVAL_CONCURRENCY", "8")
    env["BUDGET_LADDER"] = "8000,16000,24000"
    env["TRANSPORT_RETRIES"] = "3"
    env["TEMPERATURE"] = "0.1"
    env["PROMPTS_FILE"] = os.path.join(args.repo_root, "prompts-300q.json")
    env["CONCURRENCY"] = "4"  # Lower concurrency for eval to avoid OOM

    print(f"  [eval] step {step}: running gate eval ({len(gate_ids)} q) via proven runner")
    results_file = os.path.join(out_subdir, "results.jsonl")
    try:
        proc = subprocess.run(
            [sys.executable, runner],
            env=env, cwd=args.repo_root,
            capture_output=True, text=True, timeout=14400,  # 4h max
        )
        if proc.returncode != 0:
            print(f"  [eval] runner exited with code {proc.returncode}: {proc.stderr[-500:]}")
    except Exception as e:
        print(f"  [eval] runner CRASHED: {e} — continuing with partial results")

    # Parse results.jsonl from the runner output (may be partial)
    results = []
    if os.path.exists(results_file):
        with open(results_file) as f:
            for line in f:
                try:
                    results.append(json.loads(line))
                except json.JSONDecodeError:
                    pass

    # Grade: use the TS grader (proven, handles all 300 questions)
    grade_batch = [{"id": r["questionId"], "response": r.get("raw", "")} for r in results]
    graded = grade_rollouts(args.repo_root, grade_batch) if grade_batch else []

    # Compute pass rate
    passes = sum(1 for g in graded if g.get("pass"))
    total = len(graded)

    # Stratify (Liang's 2×3 panel): holdout vs rest
    split_path = os.path.join(args.repo_root, "results/grpo-preconditions/grpo-holdout-split.json")
    holdout_ids = []
    if os.path.exists(split_path):
        with open(split_path) as f:
            holdout_ids = json.load(f).get("holdout", {}).get("ids", [])
    holdout_set = set(holdout_ids)
    holdout_passes = sum(1 for g in graded if g["id"] in holdout_set and g.get("pass"))
    holdout_total = sum(1 for g in graded if g["id"] in holdout_set)

    summary = {
        "step": step,
        "total_passes": passes,
        "total_questions": total,
        "pass_rate": passes / total if total else 0,
        "holdout_passes": holdout_passes,
        "holdout_total": holdout_total,
        "rest_passes": passes - holdout_passes,
        "rest_total": total - holdout_total,
        "model": merged_model_path or "base",
    }
    with open(os.path.join(out_subdir, "summary.json"), "w") as f:
        json.dump(summary, f, indent=2)
    print(f"  [eval] step {step}: {passes}/{total} = {summary['pass_rate']:.1%} "
          f"(holdout {holdout_passes}/{holdout_total})")
    return summary


# ─── Tokenization for training ────────────────────────────────────────────
def prepare_training_tensors(prompt_text, completion_text, tokenizer, max_len):
    """Build input_ids, labels, completion_mask for one (prompt, completion) pair.

    labels = -100 for prompt tokens, actual ids for completion tokens.
    completion_mask = 1 for completion tokens, 0 for prompt.
    """
    prompt_ids = tokenizer(prompt_text, add_special_tokens=False).input_ids
    completion_ids = tokenizer(completion_text, add_special_tokens=False).input_ids

    # Truncate prompt if too long (leave room for completion)
    max_prompt = max_len - len(completion_ids) - 1
    if len(prompt_ids) > max_prompt:
        prompt_ids = prompt_ids[-max_prompt:]  # keep the end (most relevant)

    input_ids = prompt_ids + completion_ids
    labels = [-100] * len(prompt_ids) + completion_ids[:]
    completion_mask = [0] * len(prompt_ids) + [1] * len(completion_ids)

    # Truncate to max_len
    input_ids = input_ids[:max_len]
    labels = labels[:max_len]
    completion_mask = completion_mask[:max_len]

    return input_ids, labels, completion_mask


def collate_batch(samples, pad_token_id):
    """Pad to longest in batch, build attention_mask."""
    max_len = max(len(s[0]) for s in samples)
    input_ids, labels, completion_masks, advs = [], [], [], []
    for inp, lbl, cmask, adv in samples:
        pad_len = max_len - len(inp)
        input_ids.append(inp + [pad_token_id] * pad_len)
        labels.append(lbl + [-100] * pad_len)
        completion_masks.append(cmask + [0] * pad_len)
        advs.append(adv)
    return {
        "input_ids": torch.tensor(input_ids, dtype=torch.long),
        "labels": torch.tensor(labels, dtype=torch.long),
        "completion_mask": torch.tensor(completion_masks, dtype=torch.long),
        "advantages": torch.tensor(advs, dtype=torch.float32),
    }


# ─── Main loop ────────────────────────────────────────────────────────────
def main():
    args = parse_args()
    os.makedirs(args.output_dir, exist_ok=True)
    torch.manual_seed(args.seed)
    np.random.seed(args.seed)

    steps = args.steps or (3 if args.mode == "smoke" else 30)
    eval_at = set(int(x) for x in args.eval_at.split(",")) if args.mode != "smoke" else set()
    reward_mode = "real" if args.mode in ("smoke", "real") else "shuffled"

    print(f"═══════════════════════════════════════════════════════════════")
    print(f"  GRPO NULL-REWARD LOOP ({args.mode})")
    print(f"  steps={steps}  G={args.group_size}  reward={reward_mode}  lr={args.lr}")
    print(f"  sglang={args.sglang_url}  output={args.output_dir}")
    print(f"═══════════════════════════════════════════════════════════════")

    # ─── Load training IDs ───
    train_ids = [x.strip() for x in args.train_ids.split(",") if x.strip()] if args.train_ids else []
    if not train_ids:
        split_path = os.path.join(args.repo_root, "results/grpo-preconditions/grpo-holdout-split.json")
        with open(split_path) as f:
            train_ids = json.load(f)["train"]["ids"]

    # Use all 27 training questions — the TS grader handles all of them.
    print(f"training questions: {len(train_ids)}")

    # ─── Load gate IDs ───
    gate_ids = []
    if os.path.exists(args.gate_ids_file):
        with open(args.gate_ids_file) as f:
            gate_ids = [l.strip() for l in f if l.strip()]
    print(f"gate eval set: {len(gate_ids)} questions")

    # ─── Load prompts ───
    prompts_path = os.path.join(args.repo_root, "prompts-300q.json")
    with open(prompts_path) as f:
        data = json.load(f)
    rows = data if isinstance(data, list) else data.get("rows", data.get("questions", []))
    prompts_map = {}
    for r in rows:
        qid = str(r.get("id") or r.get("questionId"))
        system = r.get("system", "")
        user = r.get("user", r.get("prompt", ""))
        prompts_map[qid] = (system + "\n\n" + user) if system else user

    # ─── Load tokenizer + model (QLoRA) ───
    from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
    from peft import LoraConfig, get_peft_model, TaskType

    print("loading tokenizer + model (QLoRA 4-bit)...")
    tokenizer = AutoTokenizer.from_pretrained(args.model_path, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.bfloat16,
        bnb_4bit_use_double_quant=True,
    )
    # Auto-detect training GPU: if CUDA_VISIBLE_DEVICES is set, use cuda:0
    # (the visible device). Otherwise use cuda:1 (second GPU, SGLang on GPU 0).
    cuda_vis = os.environ.get("CUDA_VISIBLE_DEVICES", "")
    train_device = "cuda:0" if cuda_vis else "cuda:1"
    print(f"CUDA_VISIBLE_DEVICES={cuda_vis!r}, training on {train_device}")
    model = AutoModelForCausalLM.from_pretrained(
        args.model_path,
        quantization_config=bnb_config,
        device_map={"": train_device},
        trust_remote_code=True,
    )
    model.gradient_checkpointing_enable()

    lora_cfg = LoraConfig(
        r=args.lora_r, lora_alpha=args.lora_alpha, lora_dropout=0.05,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                        "gate_proj", "up_proj", "down_proj"],
        task_type=TaskType.CAUSAL_LM,
    )
    model = get_peft_model(model, lora_cfg)
    model.print_trainable_parameters()
    optimizer = torch.optim.AdamW(filter(lambda p: p.requires_grad, model.parameters()), lr=args.lr)

    # ─── Shuffle RNG for null-reward (Finn: track the seed) ───
    shuffle_rng = np.random.default_rng(args.seed)

    # ─── Step 0 baseline eval ───
    print("\n── step 0 baseline eval (base model via SGLang) ──")
    baseline = eval_checkpoint(args, gate_ids, 0)

    # ─── Training loop ───
    print(f"\n── training loop ({steps} steps) ──")
    step_log = []
    kl_ref_logprobs = None  # will capture step-0 logprobs as reference

    for step in range(1, steps + 1):
        t_step = time.time()
        print(f"\n── step {step}/{steps} ──")

        # 1. Pick training questions for this step (cycle through, one per group)
        step_questions = [train_ids[(step - 1 + i) % len(train_ids)] for i in range(min(4, len(train_ids)))]
        # For smoke test, just use first 1-2 questions
        if args.mode == "smoke" and step == 1:
            step_questions = step_questions[:1]

        all_rollouts = []  # [{id, prompt, response, ...}]
        for qid in step_questions:
            prompt = prompts_map.get(qid, "")
            if not prompt:
                continue
            # Generate G rollouts for this question
            prompts_batch = [prompt] * args.group_size
            gens = sglang_generate(
                args.sglang_url, prompts_batch, "local-qwen36-27b-base",
                temperature=args.temperature, max_tokens=args.max_completion_len,
            )
            for g in gens:
                all_rollouts.append({"id": qid, "prompt": prompt, "response": g["content"], "finish": g["finish_reason"]})

        if not all_rollouts:
            print(f"  no rollouts generated, skipping step")
            continue

        print(f"  generated {len(all_rollouts)} rollouts ({len(step_questions)} questions × G={args.group_size})")

        # 2. Grade
        grade_batch_input = [{"id": r["id"], "response": r["response"]} for r in all_rollouts]
        graded = grade_rollouts(args.repo_root, grade_batch_input)
        scores = [float(g.get("score", 0.0)) for g in graded]
        print(f"  graded: mean score = {np.mean(scores):.3f}, passes = {sum(s > 0.5 for s in scores)}")

        # 3. Shuffle rewards within each group (null-reward mode)
        if reward_mode == "shuffled":
            for i in range(0, len(scores), args.group_size):
                group = scores[i:i + args.group_size]
                perm = shuffle_rng.permutation(len(group))
                scores[i:i + args.group_size] = [group[j] for j in perm]

        # 4. Group-relative advantages
        advantages = compute_group_advantages(scores, args.group_size)

        # 5. Build training tensors
        samples = []
        for i, r in enumerate(all_rollouts):
            if not r["response"].strip():
                continue
            inp, lbl, cmask = prepare_training_tensors(
                r["prompt"], r["response"], tokenizer, args.max_prompt_len + args.max_completion_len,
            )
            samples.append((inp, lbl, cmask, advantages[i]))

        if not samples:
            print(f"  no valid training samples, skipping step")
            continue

        # 6. Forward + loss + backward (batch in sub-batches to fit memory)
        model.train()
        total_loss = 0.0
        seq_logprobs_all = []
        sub_batch_size = min(4, len(samples))
        optimizer.zero_grad()
        num_sub_batches = 0

        for si in range(0, len(samples), sub_batch_size):
            sub = samples[si:si + sub_batch_size]
            batch = collate_batch(sub, tokenizer.pad_token_id)
            # Use the same device as the model
            _dev = next(model.parameters()).device
            input_ids = batch["input_ids"].to(_dev)
            labels = batch["labels"].to(_dev)
            completion_mask = batch["completion_mask"].to(_dev)
            advs = batch["advantages"]

            loss, seq_logprobs = grpo_loss_step(
                model, input_ids,
                torch.ones_like(input_ids),  # attention mask
                labels, advs.cpu().numpy(), completion_mask,
            )
            (loss / len(range(0, len(samples), sub_batch_size))).backward()
            total_loss += loss.item()
            seq_logprobs_all.extend(seq_logprobs.tolist())
            num_sub_batches += 1

            if not np.isfinite(total_loss):
                print(f"  FATAL: loss is NaN/Inf at sub-batch {si}")
                Path(os.path.join(args.output_dir, "FAILED")).touch()
                close_grader()
                return 1

        # 7. Gradient clip + step
        torch.nn.utils.clip_grad_norm_(filter(lambda p: p.requires_grad, model.parameters()), 1.0)
        optimizer.step()

        # 8. KL from reference (capture step-1 as reference per Finn's monitoring)
        seq_lp = np.array(seq_logprobs_all)
        if step == 1:
            kl_ref_logprobs = seq_lp.copy()
            kl = 0.0
        else:
            min_len = min(len(kl_ref_logprobs), len(seq_lp))
            kl = compute_kl_from_reference(seq_lp[:min_len], kl_ref_logprobs[:min_len])

        # 9. Finn's length tracker
        avg_completion_len = np.mean([len(tokenizer(r["response"]).input_ids) for r in all_rollouts if r["response"].strip()])

        step_entry = {
            "step": step,
            "loss": round(total_loss / max(num_sub_batches, 1), 6),
            "mean_score": round(float(np.mean(scores)), 4),
            "mean_advantage": round(float(np.mean(advantages)), 6),
            "kl_from_ref": round(kl, 4),
            "avg_completion_len": round(float(avg_completion_len), 1),
            "n_rollouts": len(all_rollouts),
            "reward_mode": reward_mode,
            "step_time_s": round(time.time() - t_step, 1),
        }
        step_log.append(step_entry)
        print(f"  loss={step_entry['loss']}  KL_ref={step_entry['kl_from_ref']}  "
              f"avg_len={step_entry['avg_completion_len']}  time={step_entry['step_time_s']}s")

        # Write step log incrementally (survives disconnect)
        with open(os.path.join(args.output_dir, "step_log.jsonl"), "a") as f:
            f.write(json.dumps(step_entry) + "\n")

        # 10. Checkpoint eval
        if step in eval_at:
            print(f"\n  ── checkpoint eval at step {step} ──")
            # Save LoRA, merge, sync to SGLang for eval
            lora_save_path = os.path.join(args.output_dir, f"lora-step-{step}")
            model.save_pretrained(lora_save_path)
            tokenizer.save_pretrained(lora_save_path)

            # Weight sync to SGLang (pause → update → continue)
            sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
            from grpo_sglang_glue import SGLangWeightSyncCallback
            sync = SGLangWeightSyncCallback(
                sglang_url=args.sglang_url,
                base_model_path=args.model_path,
                merged_output_path=os.path.join(args.output_dir, f"merged-step-{step}"),
                lora_adapter_path=lora_save_path,
            )
            sync._save_lora_adapter(model, tokenizer)
            sync_ok = sync.sync_weights()
            if sync_ok:
                eval_result = eval_checkpoint(args, gate_ids, step, merged_model_path=f"step-{step}")
                step_entry["eval"] = eval_result
            else:
                print(f"  WARNING: weight sync failed at step {step}, eval skipped")

    # ─── Final ───
    close_grader()

    final = {
        "mode": args.mode,
        "reward_mode": reward_mode,
        "steps_run": steps,
        "baseline_eval": baseline,
        "step_log": step_log,
        "completed_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    with open(os.path.join(args.output_dir, "run-summary.json"), "w") as f:
        json.dump(final, f, indent=2)

    Path(os.path.join(args.output_dir, "DONE")).touch()
    print(f"\n══════ DONE — results in {args.output_dir} ════════")
    print(f"baseline: {baseline['total_passes']}/{baseline['total_questions']}")
    for e in [s for s in step_log if "eval" in s]:
        print(f"  step {e['step']}: {e['eval']['total_passes']}/{e['eval']['total_questions']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
