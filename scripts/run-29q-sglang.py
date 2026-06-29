#!/usr/bin/env python3
"""29Q hard-tier runner for SGLang. Runs base + SFT with json_object + streaming.
Writes results to /workspace/run29/results.jsonl and a summary file.
Runs detached on the pod — survives SSH disconnect."""
import json, subprocess, re, time, os, sys

BASE_URL = os.environ.get("PROBE_ENDPOINT", "http://localhost:8000")
ENDPOINT = BASE_URL + "/v1/chat/completions"
PROMPTS = os.environ.get("PROMPTS_FILE", "/workspace/prompts-300q.json")
OUT_DIR = os.environ.get("OUT_DIR", "/workspace/run29")
MODELS = ["local-qwen36-27b-base", "local-qwen36-27b-sft"]
IDS = ["L1-001","L1-002","L2-001","L2-002","L4-001","L6-002","L6-003",
       "L9-001","L9-002","L9-003","L9-004","L9-006","L9-007","L9-008","L9-009",
       "L10-001","L10-002","L10-003","L10-005","L10-007","L10-009","L10-010","L10-012",
       "AGI-001","AGI-002","AGI-003","AGI-004","AGI-014","AGI-024"]

os.makedirs(OUT_DIR, exist_ok=True)
RESULTS_FILE = os.path.join(OUT_DIR, "results.jsonl")
SUMMARY_FILE = os.path.join(OUT_DIR, "summary.txt")
DONE_FLAG = os.path.join(OUT_DIR, "DONE")

# Load prompts
data = json.load(open(PROMPTS))
rows = data if isinstance(data, list) else (data.get("rows") or data.get("questions") or data.get("prompts") or [])
prompts = {}
for r in rows:
    qid = str(r.get("id") or r.get("questionId"))
    prompts[qid] = (r["system"], r["user"])

# Resume: skip already-completed rows
done = set()
if os.path.exists(RESULTS_FILE):
    for line in open(RESULTS_FILE):
        try:
            r = json.loads(line)
            if r.get("status") == "ok":
                done.add((r["model"], r["questionId"]))
        except: pass

total = len(MODELS) * len(IDS)
pending = [(m, q) for m in MODELS for q in IDS if (m, q) not in done]
print(f"RUNNER: {len(pending)} pending of {total} total ({len(done)} already done)", flush=True)

def call_streaming(system, user, model):
    body = json.dumps({
        "model": model,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        "temperature": 0.1, "max_tokens": 16000,
        "response_format": {"type": "json_object"},
        "stream": True
    })
    t0 = time.time()
    result = subprocess.run(
        ["curl", "-s", "-m", "900", "-N", ENDPOINT,
         "-H", "Content-Type: application/json", "-d", body],
        capture_output=True, text=True
    )
    dt = time.time() - t0
    content_parts = []; reasoning_parts = []; finish = None
    for line in result.stdout.split("\n"):
        line = line.strip()
        if not line.startswith("data: "): continue
        d = line[6:]
        if d == "[DONE]": break
        try:
            chunk = json.loads(d)
            ch = chunk.get("choices", [{}])[0]
            delta = ch.get("delta", {})
            if delta.get("content"): content_parts.append(delta["content"])
            if delta.get("reasoning_content"): reasoning_parts.append(delta["reasoning_content"])
            if ch.get("finish_reason"): finish = ch["finish_reason"]
        except: pass
    content = "".join(content_parts)
    reasoning = "".join(reasoning_parts)
    # Try to parse JSON
    obj = None
    try: obj = json.loads(content.strip())
    except: pass
    if obj is None:
        m = re.search(r"\{.*\}", content, re.DOTALL)
        if m:
            try: obj = json.loads(m.group(0))
            except: pass
    status = "ok" if obj is not None and finish == "stop" else ("truncated" if finish == "length" else "error")
    return {
        "model": model, "content": content, "reasoning": reasoning,
        "finish": finish, "obj": obj, "status": status, "dt": dt
    }

completed = len(done)
for model, qid in pending:
    short = "sft" if "sft" in model else "base"
    system, user = prompts[qid]
    print(f"[{completed+1}/{total}] {short} {qid}...", end=" ", flush=True)
    try:
        res = call_streaming(system, user, model)
        row = {
            "model": model, "questionId": qid,
            "status": res["status"], "finish_reason": res["finish"],
            "raw": res["content"], "reasoning": res["reasoning"][:500],
            "reasoning_len": len(res["reasoning"]),
            "duration_s": round(res["dt"], 1),
            "obj_keys": list(res["obj"].keys()) if res["obj"] else None,
        }
        with open(RESULTS_FILE, "a") as f:
            f.write(json.dumps(row) + "\n")
        completed += 1
        print(f"{res['status']} fin={res['finish']} {res['dt']:.0f}s", flush=True)
    except Exception as e:
        row = {"model": model, "questionId": qid, "status": "error", "error": str(e)[:200]}
        with open(RESULTS_FILE, "a") as f:
            f.write(json.dumps(row) + "\n")
        completed += 1
        print(f"ERROR: {e}", flush=True)

# Write summary
with open(SUMMARY_FILE, "w") as f:
    f.write(f"RUN COMPLETE: {completed}/{total} rows\n")
    f.write(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}\n")

with open(DONE_FLAG, "w") as f:
    f.write(f"done at {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}\n")
print(f"\nRUN COMPLETE: {completed}/{total}", flush=True)
print(f"Results: {RESULTS_FILE}", flush=True)
