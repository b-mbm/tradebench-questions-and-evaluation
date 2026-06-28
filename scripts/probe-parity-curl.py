#!/usr/bin/env python3
"""Parity probe using curl subprocess (urllib gets 403 from RunPod proxy)."""
import json, subprocess, re, time, os

BASE = os.environ.get("PROBE_ENDPOINT", "https://2ke3spanjt95vo-8000.proxy.runpod.net").rstrip("/")
ENDPOINT = BASE + "/v1/chat/completions"
MODEL = os.environ.get("PROBE_MODEL", "local-qwen36-27b-base")
PROMPTS = "prompts-300q.json"

def load_prompt(qid):
    data = json.load(open(PROMPTS))
    rows = data if isinstance(data, list) else (data.get("rows") or data.get("questions") or data.get("prompts") or [])
    for r in rows:
        if str(r.get("id") or r.get("questionId")) == qid:
            return r["system"], r["user"]
    raise KeyError(qid)

def call(system, user):
    body = json.dumps({"model": MODEL,
            "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
            "temperature": 0.1, "max_tokens": 16000, "response_format": {"type": "json_object"}})
    t0 = time.time()
    result = subprocess.run(["curl", "-s", "-m", "900", ENDPOINT,
        "-H", "Content-Type: application/json",
        "-d", body], capture_output=True, text=True)
    dt = time.time() - t0
    resp = json.loads(result.stdout)
    ch = resp["choices"][0]; msg = ch.get("message", {})
    content = msg.get("content", "") or ""
    reasoning = msg.get("reasoning_content") or msg.get("reasoning") or ""
    return content, reasoning, ch.get("finish_reason"), dt, resp.get("usage", {})

def extract_json(text):
    text = (text or "").strip()
    try: return json.loads(text), "direct"
    except: pass
    m = re.search(r"\{.*\}", text, re.DOTALL)
    if m:
        try: return json.loads(m.group(0)), "extracted"
        except: pass
    return None, "failed"

PROBE = [("L9-001", "simple"), ("AGI-004", "nested_alloc"), ("AGI-014", "nested_perp")]
print(f"=== PARITY PROBE (curl) endpoint={BASE} ===")
EXEC = {"intent","order_type","asset","size","unit","venue","venue_name","risk_controls","follow_up"}
results = []
for qid, kind in PROBE:
    system, user = load_prompt(qid)
    print(f"\n--- {qid} ({kind}) ---", flush=True)
    try:
        content, reasoning, finish, dt, usage = call(system, user)
    except Exception as e:
        print(f"  ERROR: {repr(e)[:140]}"); results.append((qid, False, "error")); continue
    ctok = usage.get("completion_tokens", "?")
    has_think = bool(reasoning and reasoning.strip())
    obj, method = extract_json(content)
    actual = (set(obj.keys()) - {"reasoning"}) if obj else set()
    collapsed = bool(obj) and actual.issubset(EXEC) and "order_type" in actual
    detail = ""
    if obj and qid == "AGI-004":
        a = obj.get("allocation_usd"); detail = f"allocation_usd={'nested:'+json.dumps(a) if isinstance(a,dict) else a}"
    elif obj and qid == "AGI-014":
        p = obj.get("perp_short_allocation_usd"); detail = f"perp_short_allocation_usd={'nested:'+json.dumps(p) if isinstance(p,dict) else p}"
    elif obj and qid == "L9-001":
        detail = f"expected_value={obj.get('expected_value')}"
    print(f"  {dt:.1f}s finish={finish} ctok={ctok}")
    print(f"  thinking={'YES' if has_think else 'NO'} | json={method} keys={list(actual)[:8]}")
    print(f"  {'COLLAPSED' if collapsed else 'SCHEMA OK'} | {detail}")
    results.append((qid, has_think and obj is not None and not collapsed, "ok" if obj else method))
print("\n=== VERDICT ===")
for qid, p, s in results: print(f"  {qid}: {'✓ PASS' if p else '✗ FAIL'} ({s})")
allpass = all(r[1] for r in results)
print(f"\n{'→ TIER 1 PASS — SGLang achieves parity!' if allpass else '→ TIER 1 FAIL'}")
