#!/usr/bin/env python3
"""
OpenRouter reasoning-aware generator for the 300Q benchmark (hosted models).

Symmetric to runpod-runner.py — emits the SAME generations.jsonl schema, graded by
the same scripts/grade-runpod-run.ts. Differences (hosted vs local):
  - response_format = json_object  (LOOSE on OpenRouter -> compact, no truncation)
  - provider.require_parameters     (deterministic routing; only backends honoring json_object)
  - reasoning-sized budget with ESCALATION on finish_reason==length / blank
    (the fix for the reasoning-model blanks that suppressed the old 164)
  - captures finish_reason + token usage (incl. reasoning_tokens when present)
  - checkpointed JSONL (resumable); skips rows already 'ok'

Config via env:
  PROMPTS_FILE   default prompts-300q.json
  OUT_DIR        default results/community/300/openrouter-run
  MODELS         default "qwen/qwen3.6-27b" (comma list of OpenRouter ids)
  IDS / LEVELS   optional filters
  BUDGET_LADDER  default "8000,16000,24000" (max_tokens tried in order; escalates on length/blank)
  CONCURRENCY    default 6
  TEMPERATURE    default 0.1
  TRANSPORT_RETRIES default 4
  OPENROUTER_API_KEY   required (or set OPENROUTER_ENV_FILE to a .env containing it)
  OPENROUTER_ENV_FILE  default /Users/bradleymiles/Documents/tradebench-lite-tests/.env
  OPENROUTER_TIMEOUT_S default 300
"""
import json, os, time, threading, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

def load_key():
    k = os.environ.get("OPENROUTER_API_KEY", "").strip()
    if k:
        return k
    envf = os.environ.get("OPENROUTER_ENV_FILE", "/Users/bradleymiles/Documents/tradebench-lite-tests/.env")
    if os.path.exists(envf):
        for line in open(envf):
            line = line.strip()
            if line.startswith("OPENROUTER_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("OPENROUTER_API_KEY not in env and not found in OPENROUTER_ENV_FILE")

API_KEY      = load_key()
PROMPTS_FILE = os.environ.get("PROMPTS_FILE", "prompts-300q.json")
OUT_DIR      = os.environ.get("OUT_DIR", "results/community/300/openrouter-run")
MODELS       = [m.strip() for m in os.environ.get("MODELS", "qwen/qwen3.6-27b").split(",") if m.strip()]
IDS          = set(x.strip() for x in os.environ.get("IDS", "").split(",") if x.strip())
LEVELS       = set(int(x) for x in os.environ.get("LEVELS", "").replace(" ", "").split(",") if x.strip())
BUDGETS      = [int(x) for x in os.environ.get("BUDGET_LADDER", "8000,16000,24000").split(",")]
CONCURRENCY  = int(os.environ.get("CONCURRENCY", "6"))
TEMPERATURE  = float(os.environ.get("TEMPERATURE", "0.1"))
TRANSPORT_RETRIES = int(os.environ.get("TRANSPORT_RETRIES", "4"))
TIMEOUT_S    = int(os.environ.get("OPENROUTER_TIMEOUT_S", "300"))
URL          = "https://openrouter.ai/api/v1/chat/completions"

os.makedirs(OUT_DIR, exist_ok=True)
GEN_PATH  = os.path.join(OUT_DIR, "generations.jsonl")
PROG_PATH = os.path.join(OUT_DIR, "progress.jsonl")
DONE_PATH = os.path.join(OUT_DIR, "RUN_DONE")

prompts = {p["id"]: p for p in json.load(open(PROMPTS_FILE))}
def select(p):
    if IDS and p["id"] not in IDS: return False
    if LEVELS and int(p.get("level", -1)) not in LEVELS: return False
    return True
question_ids = [pid for pid, p in prompts.items() if select(p)]

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

REQUIRE_PARAMS = os.environ.get("REQUIRE_PARAMETERS", "1") == "1"

def call_once(model, p, max_tokens):
    payload = {
        "model": model,
        "messages": [{"role": "system", "content": p["system"]},
                     {"role": "user", "content": p["user"]}],
        "temperature": TEMPERATURE,
        "max_tokens": max_tokens,
        "response_format": {"type": "json_object"},          # loose on OpenRouter -> compact JSON
    }
    if REQUIRE_PARAMS:
        payload["provider"] = {"require_parameters": True}   # deterministic: only backends honoring the above
    body = json.dumps(payload).encode()
    req = urllib.request.Request(URL, body, {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}",
        "HTTP-Referer": "tradebench-lite",
        "X-Title": "TradeBench 300Q reasoning-aware",
    })
    t0 = time.time()
    with urllib.request.urlopen(req, timeout=TIMEOUT_S) as resp:
        data = json.load(resp)
    if "choices" not in data:
        raise RuntimeError("no choices: " + json.dumps(data)[:200])
    ch = data["choices"][0]
    usage = data.get("usage", {}) or {}
    details = usage.get("completion_tokens_details", {}) or {}
    return {
        "raw": (ch.get("message", {}) or {}).get("content", "") or "",
        "finish_reason": ch.get("finish_reason"),
        "prompt_tokens": usage.get("prompt_tokens"),
        "completion_tokens": usage.get("completion_tokens"),
        "reasoning_tokens": details.get("reasoning_tokens"),
        "total_tokens": usage.get("total_tokens"),
        "provider": data.get("provider"),
        "durationMs": int((time.time() - t0) * 1000),
    }

def generate(model, p):
    last = None; attempts = 0
    for budget in BUDGETS:
        for tr in range(TRANSPORT_RETRIES + 1):
            attempts += 1
            try:
                res = call_once(model, p, budget)
                res["budget_used"] = budget; res["attempts"] = attempts
                last = res; break
            except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ConnectionError, OSError, RuntimeError) as e:
                last = {"error": repr(e)[:200], "budget_used": budget, "attempts": attempts,
                        "raw": "", "finish_reason": "ERROR", "durationMs": 0}
                if tr < TRANSPORT_RETRIES:
                    time.sleep(min(2 * (2 ** tr), 30)); continue
        if last.get("finish_reason") == "ERROR":
            if budget >= BUDGETS[-1]: break
            continue
        raw = (last.get("raw") or "").strip()
        if last.get("finish_reason") == "length" or not raw:   # truncated/blank -> escalate
            if budget >= BUDGETS[-1]: break
            continue
        break
    return classify(last)

def classify(res):
    if res is None:
        return {"status": "error", "raw": "", "finish_reason": "ERROR", "error": "no result"}
    if res.get("finish_reason") == "ERROR":
        res["status"] = "error"
    elif not (res.get("raw") or "").strip():
        res["status"] = "blank"
    elif res.get("finish_reason") == "length":
        res["status"] = "truncated"
    else:
        res["status"] = "ok"
    return res

def run_task(t):
    model, qid = t; p = prompts[qid]
    res = generate(model, p)
    row = {"phase": "generation", "model": model, "questionId": qid,
           "level": p.get("level"), "rubric_id": p.get("rubric_id"),
           "status": res.get("status"), "raw": res.get("raw", ""),
           "finish_reason": res.get("finish_reason"),
           "prompt_tokens": res.get("prompt_tokens"), "completion_tokens": res.get("completion_tokens"),
           "reasoning_tokens": res.get("reasoning_tokens"), "total_tokens": res.get("total_tokens"),
           "provider": res.get("provider"), "budget_used": res.get("budget_used"),
           "attempts": res.get("attempts"), "durationMs": res.get("durationMs"), "error": res.get("error")}
    with lock:
        with open(GEN_PATH, "a") as f: f.write(json.dumps(row) + "\n")
        done_count[0] += 1
        with open(PROG_PATH, "a") as f:
            f.write(json.dumps({"done": done_count[0], "total": total, "model": model,
                                "questionId": qid, "status": row["status"], "finish_reason": row["finish_reason"],
                                "completion_tokens": row["completion_tokens"], "budget_used": row["budget_used"]}) + "\n")
        print(f"{done_count[0]}/{total} {model} {qid} {row['status']} fin={row['finish_reason']} "
              f"ctok={row['completion_tokens']} rtok={row['reasoning_tokens']} budget={row['budget_used']} prov={row['provider']}", flush=True)

def main():
    print(f"OPENROUTER RUNNER: {len(tasks)} pending of {total} ({len(done_ok)} ok) models={MODELS} budgets={BUDGETS} conc={CONCURRENCY}", flush=True)
    with ThreadPoolExecutor(max_workers=CONCURRENCY) as ex:
        list(ex.map(run_task, tasks))
    open(DONE_PATH, "w").write(json.dumps({"total": total, "completed": done_count[0]}) + "\n")
    print(f"RUN_DONE total={total} completed={done_count[0]}", flush=True)

if __name__ == "__main__":
    main()
