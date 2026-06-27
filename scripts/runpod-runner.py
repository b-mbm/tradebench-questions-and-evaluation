#!/usr/bin/env python3
"""
RunPod reasoning-aware generator for the 300Q benchmark (no-json, vLLM/localhost).

Implements the lessons from qwen36-reasoning-runner-design.md:
  - NO response_format (vLLM xgrammar collapses json_object -> never send it)
  - Reasoning-sized token budget with ESCALATION on finish_reason==length / blank
  - Per-question instrumentation: finish_reason + token usage (prompt/completion/total)
  - Full status taxonomy at the transport layer: ok | truncated | blank | error
  - Checkpointed JSONL (resumable): re-running skips rows already 'ok'
  - Durable: writes its own PID; safe under setsid; polls nothing external

Grading + the failure-reason taxonomy (parser/validator/wrong-value) is a SEPARATE
local step: scripts/grade-runpod-run.ts (reads this script's generations.jsonl).

Config via env:
  PROMPTS_FILE   default /workspace/prompts-300q.json   (list of {id,level,rubric_id,system,user})
  OUT_DIR        default /workspace/runpod-run
  MODELS         default "local-qwen36-27b-base,local-qwen36-27b-sft" (comma list)
  IDS            optional comma list of question ids to restrict to
  LEVELS         optional comma list of integer levels to restrict to
  BUDGET_LADDER  default "16000,24000,32000" (max_tokens tried in order; escalates on length/blank)
  MAX_MODEL_LEN  default 32768 (used to cap budget so prompt+budget fits the context window)
  CONCURRENCY    default 8
  BASE_URL       default http://localhost:8000/v1
  TEMPERATURE    default 0.1
  TRANSPORT_RETRIES default 4 (network/5xx retries per budget step, exponential backoff)
"""
import json, os, sys, time, threading, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

PROMPTS_FILE = os.environ.get("PROMPTS_FILE", "/workspace/prompts-300q.json")
OUT_DIR      = os.environ.get("OUT_DIR", "/workspace/runpod-run")
MODELS       = [m.strip() for m in os.environ.get("MODELS", "local-qwen36-27b-base,local-qwen36-27b-sft").split(",") if m.strip()]
IDS          = set(x.strip() for x in os.environ.get("IDS", "").split(",") if x.strip())
LEVELS       = set(int(x) for x in os.environ.get("LEVELS", "").replace(" ", "").split(",") if x.strip())
# Go LARGE by default: max_tokens is a CEILING, not a spend — short answers stop early and
# cost nothing extra, so a big cap only prevents truncation re-runs (the real money waste).
BUDGETS      = [int(x) for x in os.environ.get("BUDGET_LADDER", "26000,31000").split(",")]
MAX_MODEL_LEN= int(os.environ.get("MAX_MODEL_LEN", "32768"))
CONCURRENCY  = int(os.environ.get("CONCURRENCY", "8"))
BASE_URL     = os.environ.get("BASE_URL", "http://localhost:8000/v1").rstrip("/")
TEMPERATURE  = float(os.environ.get("TEMPERATURE", "0.1"))
TRANSPORT_RETRIES = int(os.environ.get("TRANSPORT_RETRIES", "4"))

os.makedirs(OUT_DIR, exist_ok=True)
GEN_PATH  = os.path.join(OUT_DIR, "generations.jsonl")
PROG_PATH = os.path.join(OUT_DIR, "progress.jsonl")
PID_PATH  = os.path.join(OUT_DIR, "runner.pid")
DONE_PATH = os.path.join(OUT_DIR, "RUN_DONE")
open(PID_PATH, "w").write(str(os.getpid()) + "\n")

prompts = {p["id"]: p for p in json.load(open(PROMPTS_FILE))}

def select(p):
    if IDS and p["id"] not in IDS: return False
    if LEVELS and int(p.get("level", -1)) not in LEVELS: return False
    return True
question_ids = [pid for pid, p in prompts.items() if select(p)]

# resume: skip (model, id) pairs already recorded 'ok'
done_ok = set()
if os.path.exists(GEN_PATH):
    for line in open(GEN_PATH):
        try:
            r = json.loads(line)
            if r.get("status") == "ok":
                done_ok.add((r["model"], r["questionId"]))
        except Exception:
            pass

tasks = [(m, qid) for m in MODELS for qid in question_ids if (m, qid) not in done_ok]
total = len(MODELS) * len(question_ids)
lock = threading.Lock()
done_count = [len(done_ok)]
APPROX_CHARS_PER_TOKEN = 3.3

def est_prompt_tokens(p):
    return int((len(p["system"]) + len(p["user"])) / APPROX_CHARS_PER_TOKEN) + 16

def cap_budget(budget, p):
    # keep prompt + completion within the served context window, with margin
    return max(1024, min(budget, MAX_MODEL_LEN - est_prompt_tokens(p) - 256))

def call_once(model, p, max_tokens):
    body = json.dumps({
        "model": model,
        "messages": [{"role": "system", "content": p["system"]},
                     {"role": "user", "content": p["user"]}],
        "temperature": TEMPERATURE,
        "max_tokens": max_tokens,
        # DELIBERATELY no response_format: vLLM xgrammar json_object collapses the schema.
    }).encode()
    req = urllib.request.Request(BASE_URL + "/chat/completions", body, {"Content-Type": "application/json"})
    t0 = time.time()
    with urllib.request.urlopen(req, timeout=1800) as resp:
        data = json.load(resp)
    ch = data["choices"][0]
    msg = ch.get("message", {}) or {}
    usage = data.get("usage", {}) or {}
    details = usage.get("completion_tokens_details", {}) or {}
    return {
        # with --reasoning-parser, content is the clean JSON answer and reasoning_content is the thinking
        "raw": msg.get("content", "") or "",
        "reasoning": msg.get("reasoning_content") or msg.get("reasoning") or None,
        "finish_reason": ch.get("finish_reason"),
        "prompt_tokens": usage.get("prompt_tokens"),
        "completion_tokens": usage.get("completion_tokens"),
        "reasoning_tokens": details.get("reasoning_tokens"),
        "total_tokens": usage.get("total_tokens"),
        "provider": data.get("provider") or "local-vllm",
        "durationMs": int((time.time() - t0) * 1000),
    }

def generate(model, p):
    """Escalate the token budget on truncation/blank; retry transport errors per step."""
    last = None
    attempts = 0
    for budget in BUDGETS:
        b = cap_budget(budget, p)
        for tr in range(TRANSPORT_RETRIES + 1):
            attempts += 1
            try:
                res = call_once(model, p, b)
                res["budget_used"] = b
                res["attempts"] = attempts
                last = res
                break  # transport ok
            except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ConnectionError, OSError) as e:
                last = {"error": repr(e)[:200], "budget_used": b, "attempts": attempts,
                        "raw": "", "finish_reason": "ERROR", "durationMs": 0}
                if tr < TRANSPORT_RETRIES:
                    time.sleep(min(2 * (2 ** tr), 30))
                    continue
        # decide whether to escalate the budget
        if last.get("finish_reason") == "ERROR":
            # transport never recovered at this budget; try next budget once more, else give up
            if b >= cap_budget(BUDGETS[-1], p):
                break
            continue
        raw = (last.get("raw") or "").strip()
        if last.get("finish_reason") == "length" or not raw:
            # truncated or blank -> escalate budget (unless we're already at the cap)
            if b >= cap_budget(BUDGETS[-1], p):
                break
            continue
        break  # clean completion
    return classify(last)

def classify(res):
    if res is None:
        return {"status": "error", "raw": "", "finish_reason": "ERROR", "error": "no result"}
    fr = res.get("finish_reason")
    if fr == "ERROR":
        res["status"] = "error"
    elif fr == "length":           # truncation takes precedence (empty content + length == truncated, not blank)
        res["status"] = "truncated"
    elif not (res.get("raw") or "").strip():
        res["status"] = "blank"
    else:
        res["status"] = "ok"
    return res

def run_task(t):
    model, qid = t
    p = prompts[qid]
    res = generate(model, p)
    row = {
        "phase": "generation", "model": model, "questionId": qid,
        "level": p.get("level"), "rubric_id": p.get("rubric_id"),
        "status": res.get("status"), "raw": res.get("raw", ""),
        "reasoning": res.get("reasoning"),
        "finish_reason": res.get("finish_reason"),
        "prompt_tokens": res.get("prompt_tokens"),
        "completion_tokens": res.get("completion_tokens"),
        "reasoning_tokens": res.get("reasoning_tokens"),
        "total_tokens": res.get("total_tokens"),
        "provider": res.get("provider"),
        "budget_used": res.get("budget_used"), "attempts": res.get("attempts"),
        "durationMs": res.get("durationMs"), "error": res.get("error"),
    }
    with lock:
        with open(GEN_PATH, "a") as f:
            f.write(json.dumps(row) + "\n")
        done_count[0] += 1
        prog = {"done": done_count[0], "total": total, "model": model, "questionId": qid,
                "status": row["status"], "finish_reason": row["finish_reason"],
                "completion_tokens": row["completion_tokens"], "budget_used": row["budget_used"]}
        with open(PROG_PATH, "a") as f:
            f.write(json.dumps(prog) + "\n")
        print(f"{done_count[0]}/{total} {model[-4:]} {qid} {row['status']} "
              f"fin={row['finish_reason']} ctok={row['completion_tokens']} budget={row['budget_used']}", flush=True)

def main():
    print(f"RUNNER start: {len(tasks)} tasks pending of {total} total "
          f"({len(done_ok)} already ok). models={MODELS} budgets={BUDGETS} conc={CONCURRENCY}", flush=True)
    with ThreadPoolExecutor(max_workers=CONCURRENCY) as ex:
        list(ex.map(run_task, tasks))
    open(DONE_PATH, "w").write(json.dumps({"total": total, "completed": done_count[0]}) + "\n")
    print(f"RUN_DONE total={total} completed={done_count[0]}", flush=True)

if __name__ == "__main__":
    main()
