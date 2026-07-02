#!/usr/bin/env python3
"""Finn's Capability Probe — does the base model EVER produce the right answer?

For each failed question, sample K=16 times at temperature 0.7.
Grade each sample. If ANY passes, the capability is latent → GRPO can reinforce it.
If NONE pass across 16 tries, it's a knowledge deficit → no post-training fixes it.

Uses the real grader (gradeSchemaResponse) via the same codepath as the eval.
"""
import json, subprocess, re, time, os, sys
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

BASE_URL = os.environ.get("PROBE_ENDPOINT", "http://localhost:8000")
ENDPOINT = BASE_URL + "/v1/chat/completions"
PROMPTS = "prompts-300q.json"
MODEL = "local-qwen36-27b-base"  # probe the BASE model, not SFT
K_SAMPLES = int(os.environ.get("K_SAMPLES", "16"))
TEMPERATURE = float(os.environ.get("PROBE_TEMP", "0.7"))
CONCURRENCY = int(os.environ.get("CONCURRENCY", "4"))
MAX_TOKENS = int(os.environ.get("MAX_TOKENS", "16000"))
OUT_DIR = os.environ.get("OUT_DIR", "results/community/300/capability-probe-2026-07-02")

os.makedirs(OUT_DIR, exist_ok=True)
RESULTS_FILE = os.path.join(OUT_DIR, "probe-results.jsonl")
LOCK = threading.Lock()

# Load prompts
data = json.load(open(PROMPTS))
rows = data if isinstance(data, list) else (data.get("rows") or data.get("questions") or data.get("prompts") or [])
prompts = {}
for r in rows:
    qid = str(r.get("id") or r.get("questionId"))
    prompts[qid] = (r["system"], r["user"])

# Load the rubric grader (TypeScript) — we'll call it via subprocess per sample
# Actually, we need to call the TS grader. Let's use a simpler approach:
# Send each sample, save the raw output, then batch-grade all at the end.

# Load target IDs
PROBE_IDS = os.environ.get("PROBE_IDS", "").split(",")
if not PROBE_IDS or not PROBE_IDS[0]:
    # Default: all disputed + non-AGI universal failures
    PROBE_IDS = """L3-001,L3-003,L4-001,L6-003,L8-001,L9-006,L9-007,L9-024,L9-027,L9-040,L9-059,L9-064,L10-047,L10-055,L10-050,L10-056,AGI-024,AGI-026,AGI-085,AGI-108,L2-004,L3-002,L4-003,L4-005,L5-001,L5-002,L5-003,L6-001,L7-001,L7-002,L7-003,L9-005,L9-013,L9-019,L9-029,L9-031,L9-035,L9-037,L9-045,L9-051,L9-053,L9-055,L10-004,L10-006,L10-014,L10-011,L10-017,L10-015,L10-025,L10-022,L10-024,L10-043,L10-046""".split(",")
PROBE_IDS = [q.strip() for q in PROBE_IDS if q.strip()]

print(f"CAPABILITY PROBE: {len(PROBE_IDS)} questions × {K_SAMPLES} samples at temp {TEMPERATURE}")
print(f"Model: {MODEL} (BASE)")
print(f"Concurrency: {CONCURRENCY}")
print(f"Output: {OUT_DIR}")
print(flush=True)


def call_once(system, user):
    """Single streaming request at probe temperature."""
    body = json.dumps({
        "model": MODEL,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        "temperature": TEMPERATURE,
        "max_tokens": MAX_TOKENS,
        "response_format": {"type": "json_object"},
        "stream": True,
    })
    t0 = time.time()
    try:
        result = subprocess.run(
            ["curl", "-s", "-m", "900", "-N", ENDPOINT,
             "-H", "Content-Type: application/json", "-d", body],
            capture_output=True, text=True
        )
        dt = time.time() - t0
        if result.returncode != 0:
            return "", "ERROR", dt
        c = []; r = []; f = None
        for line in result.stdout.split("\n"):
            line = line.strip()
            if not line.startswith("data: "): continue
            d = line[6:]
            if d == "[DONE]": break
            try:
                ch = json.loads(d)["choices"][0]
                delta = ch.get("delta", {})
                if delta.get("content"): c.append(delta["content"])
                if delta.get("reasoning_content"): r.append(delta["reasoning_content"])
                if ch.get("finish_reason"): f = ch["finish_reason"]
            except: pass
        return "".join(c), f, dt
    except Exception as e:
        dt = time.time() - t0
        return "", "ERROR", dt


def probe_question(qid):
    """Sample K times, return all raw outputs for later grading."""
    system, user = prompts[qid]
    samples = []
    for k in range(K_SAMPLES):
        content, finish, dt = call_once(system, user)
        samples.append({
            "k": k,
            "raw": content,
            "finish": finish,
            "dt": round(dt, 1),
            "raw_len": len(content),
        })
    return qid, samples


# Run probes with concurrency
completed = 0
total = len(PROBE_IDS)

print(f"Starting probe of {total} questions...", flush=True)

with ThreadPoolExecutor(max_workers=CONCURRENCY) as pool:
    futures = {}
    for qid in PROBE_IDS:
        f = pool.submit(probe_question, qid)
        futures[f] = qid

    for future in as_completed(futures):
        qid = futures[future]
        try:
            qid, samples = future.result()
            with LOCK:
                with open(RESULTS_FILE, "a") as f:
                    for s in samples:
                        row = {
                            "questionId": qid,
                            "k": s["k"],
                            "raw": s["raw"],
                            "finish_reason": s["finish"],
                            "duration_s": s["dt"],
                            "model": MODEL,
                            "temperature": TEMPERATURE,
                        }
                        f.write(json.dumps(row) + "\n")
                completed += 1
                print(f"[{completed}/{total}] {qid}: {K_SAMPLES} samples collected", flush=True)
        except Exception as e:
            with LOCK:
                completed += 1
                print(f"[{completed}/{total}] {qid}: ERROR - {e}", flush=True)

print(f"\nPROBE COMPLETE: {completed}/{total} questions × {K_SAMPLES} samples")
print(f"Results: {RESULTS_FILE}")
print(f"\nNext: Grade with grade-runpod-run.ts to see how many pass at temp {TEMPERATURE}")
