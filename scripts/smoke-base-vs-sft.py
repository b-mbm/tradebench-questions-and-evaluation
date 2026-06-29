#!/usr/bin/env python3
"""Step 2 smoke: 3 questions × base + SFT, json_object + streaming.
Compares against OpenRouter reference values and rubric ranges."""
import json, subprocess, re, time, os, sys

BASE = os.environ.get("PROBE_ENDPOINT", "https://kba6kyxnzqyz3o-8000.proxy.runpod.net").rstrip("/")
ENDPOINT = BASE + "/v1/chat/completions"
PROMPTS = "prompts-300q.json"
MODELS = ["local-qwen36-27b-base", "local-qwen36-27b-sft"]

# OpenRouter reference (what stock Qwen got)
OR_REF = {
    "L9-001": {"pass": True, "expected_value": 18.525},
    "AGI-004": {"pass": True, "Ethena_USDe": 20000, "alloc": {"Curve_3pool": 30000, "Aave_USDC": 20000, "Ethena_USDe": 20000, "GMX_GLP": 30000}},
    "AGI-014": {"pass": True},
}

def load_prompt(qid):
    data = json.load(open(PROMPTS))
    rows = data if isinstance(data, list) else (data.get("rows") or data.get("questions") or data.get("prompts") or [])
    for r in rows:
        if str(r.get("id") or r.get("questionId")) == qid:
            return r["system"], r["user"]
    raise KeyError(qid)

def call_streaming(system, user, model):
    body = json.dumps({"model": model,
            "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
            "temperature": 0.1, "max_tokens": 16000,
            "response_format": {"type": "json_object"},
            "stream": True})
    t0 = time.time()
    result = subprocess.run(["curl", "-s", "-m", "900", "-N", ENDPOINT,
        "-H", "Content-Type: application/json", "-d", body],
        capture_output=True, text=True)
    dt = time.time() - t0
    content_parts = []; reasoning_parts = []; finish = None
    for line in result.stdout.split("\n"):
        line = line.strip()
        if not line.startswith("data: "): continue
        data = line[6:]
        if data == "[DONE]": break
        try:
            chunk = json.loads(data)
            ch = chunk.get("choices",[{}])[0]; delta = ch.get("delta",{})
            if delta.get("content"): content_parts.append(delta["content"])
            if delta.get("reasoning_content"): reasoning_parts.append(delta["reasoning_content"])
            if ch.get("finish_reason"): finish = ch["finish_reason"]
        except: pass
    return "".join(content_parts), "".join(reasoning_parts), finish, dt

def extract_json(text):
    text = (text or "").strip()
    try: return json.loads(text), "direct"
    except: pass
    m = re.search(r"\{.*\}", text, re.DOTALL)
    if m:
        try: return json.loads(m.group(0)), "extracted"
        except: pass
    return None, "failed"

PROBE = ["L9-001", "AGI-004", "AGI-014"]
print(f"=== BASE vs SFT SMOKE (json_object + streaming) ===")
print(f"endpoint={BASE}")
EXEC = {"intent","order_type","asset","size","unit","venue","venue_name","risk_controls","follow_up"}

for qid in PROBE:
    system, user = load_prompt(qid)
    print(f"\n{'='*60}")
    print(f"{qid}")
    print(f"{'='*60}")
    for model in MODELS:
        short = "base" if "base" in model else "SFT "
        print(f"\n  [{short}]", flush=True)
        try:
            content, reasoning, finish, dt = call_streaming(system, user, model)
        except Exception as e:
            print(f"    ERROR: {repr(e)[:120]}")
            continue
        has_think = bool(reasoning and reasoning.strip())
        obj, method = extract_json(content)
        print(f"    {dt:.0f}s finish={finish} think={'YES('+str(len(reasoning))+'c)' if has_think else 'NO'} json={method}")
        if obj is None:
            print(f"    PARSE FAILED; raw[:200]: {(content or '')[:200]}")
            continue
        actual = set(obj.keys()) - {"reasoning"}
        collapsed = actual.issubset(EXEC) and "order_type" in actual
        print(f"    keys: {list(actual)[:8]} {'⚠️ COLLAPSED' if collapsed else '✓ schema ok'}")
        if qid == "AGI-004":
            alloc = obj.get("allocation_usd")
            if isinstance(alloc, dict):
                print(f"    allocation_usd: {json.dumps(alloc)}")
                ethena = alloc.get("Ethena_USDe")
                or_ethena = OR_REF["AGI-004"]["Ethena_USDe"]
                match = "✓ MATCHES OR" if ethena == or_ethena else f"✗ OR={or_ethena}, ours={ethena}"
                print(f"    Ethena: {match}")
            else:
                print(f"    allocation_usd: MISSING")
        elif qid == "AGI-014":
            perp = obj.get("perp_short_allocation_usd")
            if isinstance(perp, dict):
                print(f"    perp_short_allocation_usd: {json.dumps(perp)}")
            else:
                print(f"    perp_short_allocation_usd: MISSING")
        elif qid == "L9-001":
            ev = obj.get("expected_value")
            or_ev = OR_REF["L9-001"]["expected_value"]
            match = "✓ close to OR" if ev and abs(ev - or_ev) < 1.0 else f"✗ OR={or_ev}, ours={ev}"
            print(f"    expected_value: {ev} ({match})")

print(f"\n{'='*60}")
print("DONE — compare base vs SFT values above against OR reference")
print(f"{'='*60}")
