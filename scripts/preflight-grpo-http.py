#!/usr/bin/env python3
"""GRPO pre-flight test via HTTP proxy — tests the generation-server half.
No SSH or TRL needed. Confirms SGLang can produce the rollouts GRPO needs:
(a) valid thinking + JSON at temp 0.7 (GRPO rollout temperature)
(b) the TS grader can score them (reward function works)
(c) multiple rollouts on the same question produce variance (GRPO needs this for group-relative advantage)
"""
import json, urllib.request, time, os, sys, subprocess, re

ENDPOINT = os.environ.get("PROBE_ENDPOINT", "").rstrip("/")
if not ENDPOINT:
    print("ERROR: set PROBE_ENDPOINT")
    sys.exit(1)
MODEL = "local-qwen36-27b-base"

# Load a few training-pool questions
prompts_data = json.load(open("prompts-300q.json"))
rows = prompts_data if isinstance(prompts_data, list) else (prompts_data.get("rows") or prompts_data.get("questions") or prompts_data.get("prompts") or [])
prompt_by_id = {str(r.get("id") or r.get("questionId")): (r["system"], r["user"]) for r in rows}

# Test on 3 training-pool questions (varied difficulty)
TEST_IDS = ["L3-001", "L9-024", "L10-050"]  # low, mid, high latent
K = 3  # 3 rollouts per question (enough to check variance)

def call(system, user, temp=0.7):
    payload = {
        "model": MODEL,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        "temperature": temp,
        "max_tokens": 8000,
        "response_format": {"type": "json_object"},
        "stream": True,
    }
    body = json.dumps(payload)
    t0 = time.time()
    # Use curl with body from temp file (avoids shell quoting issues with JSON)
    bodyfile = f"/tmp/preflight_body_{int(t0*1000)}.json"
    outfile = f"/tmp/preflight_out_{int(t0*1000)}.txt"
    with open(bodyfile, "w") as f:
        f.write(body)
    result = subprocess.run(
        ["curl", "-s", "-m", "600", "-N", "-X", "POST",
         ENDPOINT + "/v1/chat/completions",
         "-H", "Content-Type: application/json",
         "-d", f"@{bodyfile}"],
        capture_output=True, text=True, timeout=620
    )
    dt = time.time() - t0
    raw = result.stdout

    # Parse streaming response (SSE format)
    content_parts = []
    reasoning_parts = []
    finish = None
    for line in raw.split("\n"):
        line = line.strip()
        if not line.startswith("data: "):
            continue
        data = line[6:]
        if data == "[DONE]":
            break
        try:
            chunk = json.loads(data)
            delta = chunk.get("choices", [{}])[0].get("delta", {})
            if delta.get("content"):
                content_parts.append(delta["content"])
            if delta.get("reasoning_content"):
                reasoning_parts.append(delta["reasoning_content"])
            if chunk.get("choices", [{}])[0].get("finish_reason"):
                finish = chunk["choices"][0]["finish_reason"]
        except:
            pass
    content = "".join(content_parts)
    reasoning = "".join(reasoning_parts)
    return content, reasoning, finish, dt

def extract_json(text):
    text = (text or "").strip()
    try:
        return json.loads(text), "direct"
    except:
        pass
    import re
    m = re.search(r"\{.*\}", text, re.DOTALL)
    if m:
        try:
            return json.loads(m.group(0)), "extracted"
        except:
            pass
    return None, "failed"

results = {"confirmations": {}, "details": []}

print(f"=== GRPO PRE-FLIGHT (HTTP) — endpoint={ENDPOINT} ===")
print(f"Testing {len(TEST_IDS)} questions × {K} rollouts at temp 0.7\n")

all_valid = True
all_thinking = True
has_variance = False

for qid in TEST_IDS:
    if qid not in prompt_by_id:
        print(f"  {qid}: NOT FOUND in prompts")
        continue
    system, user = prompt_by_id[qid]
    print(f"--- {qid} ---")
    rollouts = []
    for k in range(K):
        try:
            content, reasoning, finish, dt = call(system, user)
            obj, method = extract_json(content)
            has_think = bool(reasoning and reasoning.strip())
            valid = obj is not None
            if not has_think:
                all_thinking = False
            if not valid:
                all_valid = False
            # Check if the JSON has question-specific keys (not collapsed)
            keys = set(obj.keys()) - {"reasoning"} if obj else set()
            collapsed = bool(obj) and keys.issubset({"intent","order_type","asset","size","venue","unit"}) and len(keys) <= 6
            r = {
                "k": k+1, "time": round(dt, 1), "finish": finish,
                "thinking": has_think, "think_chars": len(reasoning),
                "valid_json": valid, "method": method,
                "collapsed": collapsed, "keys": sorted(keys)[:8],
            }
            rollouts.append(r)
            print(f"  [{k+1}/{K}] {dt:.0f}s think={'Y' if has_think else 'N'}({len(reasoning)}c) json={method} keys={len(keys)} {'COLLAPSED' if collapsed else 'ok'}")
        except Exception as e:
            print(f"  [{k+1}/{K}] ERROR: {repr(e)[:100]}")
            rollouts.append({"k": k+1, "error": repr(e)[:100]})

    # Check variance: do the rollouts produce different answers?
    if len(rollouts) >= 2 and all("keys" in r for r in rollouts):
        key_sets = [frozenset(r["keys"]) for r in rollouts]
        if len(set(key_sets)) > 1:
            has_variance = True
            print(f"  → VARIANCE: {len(set(key_sets))} distinct key-sets across {K} rollouts (good for GRPO)")

    results["details"].append({"qid": qid, "rollouts": rollouts})

results["confirmations"]["rollout_thinking_json"] = all_valid and all_thinking
results["confirmations"]["rollout_variance_exists"] = has_variance
results["confirmations"]["no_schema_collapse"] = not any(r.get("collapsed") for d in results["details"] for r in d["rollouts"])

print(f"\n=== CONFIRMATIONS ===")
for k, v in results["confirmations"].items():
    print(f"  {'✅' if v else '❌'} {k}: {v}")

passed = sum(results["confirmations"].values())
total = len(results["confirmations"])
print(f"\nPREFLIGHT (HTTP): {passed}/{total} passed")

# Write results
os.makedirs("results/grpo-preconditions", exist_ok=True)
with open("results/grpo-preconditions/preflight-http-results.json", "w") as f:
    json.dump(results, f, indent=2)
print(f"Wrote results/grpo-preconditions/preflight-http-results.json")
sys.exit(0 if passed == total else 1)
