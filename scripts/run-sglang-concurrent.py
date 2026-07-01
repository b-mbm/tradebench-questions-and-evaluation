#!/usr/bin/env python3
"""SGLang runner with REAL concurrency (ThreadPoolExecutor) + full parity to OpenRouter.
- Transport retries (6, exponential backoff)
- Budget escalation (8000→16000→24000 on truncation/blank)
- Streaming (required for RunPod proxy)
- Concurrent requests (4 simultaneous, matching OR)
- Resume logic (skips already-completed rows)
"""
import json, subprocess, re, time, os, sys
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

BASE_URL = os.environ.get("PROBE_ENDPOINT", "http://localhost:8000")
ENDPOINT = BASE_URL + "/v1/chat/completions"
PROMPTS = os.environ.get("PROMPTS_FILE", "prompts-300q.json")
OUT_DIR = os.environ.get("OUT_DIR", "results/community/300/sglang-run")
MODELS = [m.strip() for m in os.environ.get("MODELS", "local-qwen36-27b-base,local-qwen36-27b-sft").split(",")]
IDS = [x.strip() for x in os.environ.get("IDS", "").split(",") if x.strip()]
BUDGETS = [int(x) for x in os.environ.get("BUDGET_LADDER", "8000,16000,24000").split(",")]
TEMPERATURE = float(os.environ.get("TEMPERATURE", "0.1"))
TRANSPORT_RETRIES = int(os.environ.get("TRANSPORT_RETRIES", "6"))
ENABLE_THINKING = os.environ.get("ENABLE_THINKING", "1") == "1"
CONCURRENCY = int(os.environ.get("CONCURRENCY", "4"))
TIMEOUT_S = int(os.environ.get("CURL_TIMEOUT", "900"))

os.makedirs(OUT_DIR, exist_ok=True)
RESULTS_FILE = os.path.join(OUT_DIR, "results.jsonl")
LOCK = threading.Lock()

# Load prompts
data = json.load(open(PROMPTS))
rows = data if isinstance(data, list) else (data.get("rows") or data.get("questions") or data.get("prompts") or [])
prompts = {}
for r in rows:
    qid = str(r.get("id") or r.get("questionId"))
    prompts[qid] = (r["system"], r["user"])
if IDS:
    question_ids = [q for q in IDS if q in prompts]
else:
    question_ids = list(prompts.keys())

# Resume: skip completed
done = set()
if os.path.exists(RESULTS_FILE):
    for line in open(RESULTS_FILE):
        try:
            r = json.loads(line)
            if r.get("status") == "ok":
                done.add((r["model"], r["questionId"]))
        except: pass

total = len(MODELS) * len(question_ids)
pending = [(m, q) for m in MODELS for q in question_ids if (m, q) not in done]
print(f"RUNNER: {len(pending)} pending of {total} ({len(done)} done). concurrency={CONCURRENCY} budgets={BUDGETS} thinking={ENABLE_THINKING}", flush=True)


def call_once(system, user, model, max_tokens):
    payload = {
        "model": model,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        "temperature": TEMPERATURE,
        "max_tokens": max_tokens,
        "response_format": {"type": "json_object"},
        "stream": True,
    }
    if not ENABLE_THINKING:
        payload["chat_template_kwargs"] = {"enable_thinking": False}
    body = json.dumps(payload)
    t0 = time.time()
    try:
        result = subprocess.run(
            ["curl", "-s", "-m", str(TIMEOUT_S), "-N", ENDPOINT,
             "-H", "Content-Type: application/json", "-d", body],
            capture_output=True, text=True
        )
        dt = time.time() - t0
        if result.returncode != 0:
            raise OSError(f"curl exit {result.returncode}")
        c = []; r = []; f = None
        for line in result.stdout.split("\n"):
            line = line.strip()
            if not line.startswith("data: "): continue
            d = line[6:]
            if d == "[DONE]": break
            try:
                ch = json.loads(d)["choices"][0]
                dl = ch.get("delta", {})
                if dl.get("content"): c.append(dl["content"])
                if dl.get("reasoning_content"): r.append(dl["reasoning_content"])
                if ch.get("finish_reason"): f = ch["finish_reason"]
            except: pass
        return "".join(c), "".join(r), f, dt, None
    except Exception as e:
        dt = time.time() - t0
        return "", "", "ERROR", dt, str(e)[:200]


def generate_with_parity(system, user, model):
    last = None
    attempts = 0
    for budget in BUDGETS:
        for tr in range(TRANSPORT_RETRIES + 1):
            attempts += 1
            content, reasoning, finish, dt, error = call_once(system, user, model, budget)
            last = {"content": content, "reasoning": reasoning, "finish": finish,
                    "dt": dt, "budget": budget, "attempts": attempts, "error": error}
            if finish == "ERROR":
                if tr < TRANSPORT_RETRIES:
                    wait = min(2 * (2 ** tr), 30)
                    time.sleep(wait)
                    continue
                else:
                    break
            raw = (content or "").strip()
            if finish == "length" or not raw:
                break  # escalate budget
            break  # clean
        else:
            continue
        if last["finish"] not in ("ERROR", "length") and (last["content"] or "").strip():
            break
    return last


def extract_json(text):
    text = (text or "").strip()
    try: return json.loads(text), "direct"
    except: pass
    m = re.search(r"\{.*\}", text, re.DOTALL)
    if m:
        try: return json.loads(m.group(0)), "extracted"
        except: pass
    return None, "failed"


def process_one(task):
    model, qid = task
    short = "sft" if "sft" in model else "base"
    system, user = prompts[qid]
    res = generate_with_parity(system, user, model)
    obj, method = extract_json(res["content"])
    status = "ok" if obj is not None and res["finish"] == "stop" else \
             ("truncated" if res["finish"] == "length" else "error")
    row = {
        "model": model, "questionId": qid,
        "status": status, "finish_reason": res["finish"],
        "raw": res["content"], "reasoning": res["reasoning"][:500],
        "reasoning_len": len(res["reasoning"]),
        "duration_s": round(res["dt"], 1),
        "budget_used": res["budget"], "attempts": res["attempts"],
        "obj_keys": list(obj.keys()) if obj else None,
    }
    return row, short


# Process with concurrency
completed = len(done)
print(f"Starting {len(pending)} questions with concurrency={CONCURRENCY}...", flush=True)

with ThreadPoolExecutor(max_workers=CONCURRENCY) as pool:
    futures = {}
    # Submit all pending tasks
    for task in pending:
        f = pool.submit(process_one, task)
        futures[f] = task

    for future in as_completed(futures):
        task = futures[future]
        try:
            row, short = future.result()
            with LOCK:
                with open(RESULTS_FILE, "a") as f:
                    f.write(json.dumps(row) + "\n")
                completed += 1
                model_short = "sft" if "sft" in row["model"] else "base"
                print(f"[{completed}/{total}] {model_short} {row['questionId']}: {row['status']} "
                      f"fin={row['finish_reason']} {row['duration_s']:.0f}s "
                      f"think={row['reasoning_len']}c budget={row['budget_used']}", flush=True)
        except Exception as e:
            with LOCK:
                completed += 1
                print(f"[{completed}/{total}] ERROR {task}: {e}", flush=True)

print(f"\nRUN COMPLETE: {completed}/{total}", flush=True)
