#!/usr/bin/env python3
import concurrent.futures
import json
import os
import sys
import threading
import time
import urllib.error
import urllib.request


URL = os.environ.get("VLLM_URL", "http://localhost:8000/v1/chat/completions")
TEMP = float(os.environ.get("TEMP", "0.1"))
MAX_TOKENS = int(os.environ.get("MAX_TOKENS", "9000"))
CONCURRENCY = int(os.environ.get("CONCURRENCY", "2"))
ATTEMPTS = int(os.environ.get("ATTEMPTS", "2"))
NO_THINKING = os.environ.get("NO_THINKING", "").lower() in {"1", "true", "yes"}
IDS = {x.strip() for x in os.environ.get("IDS", "").split(",") if x.strip()}

MODELS = [
    ("base", "local-qwen36-27b-base"),
    ("tuned", "local-qwen36-27b-sft"),
]


def post_json(payload):
    body = json.dumps(payload).encode()
    req = urllib.request.Request(URL, body, {"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=1800) as resp:
        return json.loads(resp.read().decode())


def call_model(model_id, prompt):
    payload = {
        "model": model_id,
        "messages": [
            {"role": "system", "content": prompt["system"]},
            {"role": "user", "content": prompt["user"]},
        ],
        "temperature": TEMP,
        "max_tokens": MAX_TOKENS,
    }
    if NO_THINKING:
        payload["chat_template_kwargs"] = {"enable_thinking": False}
    last = None
    for attempt in range(1, ATTEMPTS + 1):
        try:
            data = post_json(payload)
            choice = data["choices"][0]
            return {
                "raw": choice["message"].get("content") or "",
                "finish_reason": choice.get("finish_reason"),
                "usage": data.get("usage"),
                "attempt": attempt,
                "error": None,
            }
        except Exception as exc:
            last = repr(exc)
            time.sleep(5 * attempt)
    return {"raw": "", "finish_reason": "ERROR", "usage": None, "attempt": ATTEMPTS, "error": last}


def main():
    if len(sys.argv) < 3:
        raise SystemExit("usage: runpod-gen-300q-nojson.py PROMPTS_JSON OUT_DIR")

    prompts = json.load(open(sys.argv[1]))
    if IDS:
        prompts = [prompt for prompt in prompts if prompt["id"] in IDS]
    out_dir = sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)

    outputs = {}
    for label, _ in MODELS:
        path = os.path.join(out_dir, f"outputs-{label}.json")
        outputs[label] = json.load(open(path)) if os.path.exists(path) else {}

    rows_path = os.path.join(out_dir, "rows.jsonl")
    progress_path = os.path.join(out_dir, "progress.json")
    lock = threading.Lock()

    jobs = []
    for prompt in prompts:
        for label, model_id in MODELS:
            if prompt["id"] not in outputs[label]:
                jobs.append((label, model_id, prompt))

    started = time.time()

    def save_progress():
        done = {label: len(outputs[label]) for label, _ in MODELS}
        with open(progress_path, "w") as f:
            json.dump(
                {
                    "started_at": started,
                    "updated_at": time.time(),
                    "models": done,
                    "remaining_jobs": len(jobs) - sum(done.values()),
                    "max_tokens": MAX_TOKENS,
                    "temperature": TEMP,
                    "concurrency": CONCURRENCY,
                },
                f,
                indent=2,
            )

    def run(job):
        label, model_id, prompt = job
        t0 = time.time()
        result = call_model(model_id, prompt)
        row = {
            "model": label,
            "model_id": model_id,
            "questionId": prompt["id"],
            "level": prompt.get("level"),
            "raw": result["raw"],
            "finish_reason": result["finish_reason"],
            "usage": result["usage"],
            "attempt": result["attempt"],
            "error": result["error"],
            "duration_s": round(time.time() - t0, 3),
            "raw_len": len(result["raw"]),
        }
        with lock:
            outputs[label][prompt["id"]] = result["raw"]
            with open(os.path.join(out_dir, f"outputs-{label}.json"), "w") as f:
                json.dump(outputs[label], f)
            with open(rows_path, "a") as f:
                f.write(json.dumps(row) + "\n")
            save_progress()
            print(
                f"{label} {prompt['id']} finish={row['finish_reason']} len={row['raw_len']} "
                f"dur={row['duration_s']} err={bool(row['error'])}",
                flush=True,
            )

    save_progress()
    with concurrent.futures.ThreadPoolExecutor(max_workers=CONCURRENCY) as pool:
        list(pool.map(run, jobs))
    save_progress()
    with open(os.path.join(out_dir, "DONE"), "w") as f:
        f.write(time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()) + "\n")


if __name__ == "__main__":
    main()
