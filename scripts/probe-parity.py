#!/usr/bin/env python3
"""Unified parity probe — tests json_object WITH the ORIGINAL OpenRouter prompt.
This is the TRUE parity test: same prompt (ExecuteOneResponse intact), json_object, thinking ON.
Tests whether the model overcomes the ExecuteOneResponse bias via reasoning, like OpenRouter does.
Works against any OpenAI-compatible endpoint (vLLM or SGLang) on localhost:8000."""
import json, urllib.request, sys, re, time

ENDPOINT = "http://localhost:8000/v1/chat/completions"
MODEL = "local-qwen36-27b-base"
PROMPTS = "/workspace/prompts-300q.json"

def load_prompt(qid):
    data = json.load(open(PROMPTS))
    rows = data if isinstance(data, list) else (data.get("rows") or data.get("questions") or data.get("prompts") or [])
    for r in rows:
        if str(r.get("id") or r.get("questionId")) == qid:
            return r["system"], r["user"]
    raise KeyError(qid)

def call(system, user):
    """Send with json_object — exactly like OpenRunner."""
    body = {
        "model": MODEL,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        "temperature": 0.1, "max_tokens": 16000,
        "response_format": {"type": "json_object"},
    }
    req = urllib.request.Request(ENDPOINT, data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
    t0 = time.time()
    resp = json.loads(urllib.request.urlopen(req, timeout=900).read())
    dt = time.time() - t0
    choice = resp["choices"][0]
    msg = choice.get("message", {})
    content = msg.get("content", "") or ""
    reasoning = msg.get("reasoning_content") or msg.get("reasoning") or ""
    finish = choice.get("finish_reason")
    usage = resp.get("usage", {})
    return content, reasoning, finish, dt, usage

def extract_json(text):
    """Tolerant JSON extraction from content."""
    text = text.strip()
    try: return json.loads(text), "direct"
    except: pass
    # strip markdown fences
    m = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if m:
        try: return json.loads(m.group(1)), "fenced"
        except: pass
    # first { to last }
    m = re.search(r"\{.*\}", text, re.DOTALL)
    if m:
        try: return json.loads(m.group(0)), "extracted"
        except: pass
    return None, "failed"

PROBE = [("L9-001", "simple"), ("AGI-004", "nested_alloc"), ("AGI-014", "nested_perp")]

print("=" * 72)
print("PARITY PROBE: json_object + ORIGINAL prompt (ExecuteOneResponse intact)")
print("PASS = thinking present + valid JSON + nested schema survives")
print("=" * 72)

results = []
for qid, kind in PROBE:
    system, user = load_prompt(qid)
    print(f"\n--- {qid} ({kind}) ---", flush=True)
    print(f"  calling (json_object, original prompt)...", end=" ", flush=True)
    try:
        content, reasoning, finish, dt, usage = call(system, user)
    except Exception as e:
        print(f"ERROR: {e}")
        results.append((qid, False, "error", str(e)[:100]))
        continue
    ctok = usage.get("completion_tokens", "?")
    rtok = usage.get("completion_tokens_details", {}).get("reasoning_tokens", "?") if isinstance(usage.get("completion_tokens_details"), dict) else "?"
    print(f"{dt:.1f}s finish={finish} ctok={ctok}")

    # Check 1: did the model think?
    has_think = bool(reasoning and reasoning.strip()) or "<think>" in (content or "")
    print(f"  thinking: {'YES' if has_think else 'NO'} (reasoning_field={'present' if reasoning else 'empty'}, reasoning_tokens={rtok})")

    # Check 2: valid JSON?
    obj, method = extract_json(content)
    print(f"  json parse: {method}", end="")
    if obj is None:
        print(f" — FAILED. raw[:200]: {(content or '')[:200]}")
        results.append((qid, False, "no_json", f"parse={method}"))
        continue
    print(f" — OK. keys: {list(obj.keys())}")

    # Check 3: nested schema survived (not collapsed to ExecuteOneResponse)?
    exec_response_keys = {"intent","order_type","asset","size","unit","venue","venue_name","risk_controls","follow_up"}
    actual_keys = set(obj.keys()) - {"reasoning"}
    collapsed = actual_keys.issubset(exec_response_keys) and "order_type" in actual_keys

    if qid == "AGI-004":
        alloc = obj.get("allocation_usd")
        nested_ok = isinstance(alloc, dict) and len(alloc) >= 3
        status = "NESTED OK" if nested_ok else ("COLLAPSED" if collapsed else f"partial: {list(actual_keys)}")
        print(f"  schema: {status}")
        if isinstance(alloc, dict): print(f"    allocation_usd: {json.dumps(alloc)}")
    elif qid == "AGI-014":
        perp = obj.get("perp_short_allocation_usd")
        nested_ok = isinstance(perp, dict) and len(perp) >= 3
        status = "NESTED OK" if nested_ok else ("COLLAPSED" if collapsed else f"partial: {list(actual_keys)}")
        print(f"  schema: {status}")
        if isinstance(perp, dict): print(f"    perp_short_allocation_usd: {json.dumps(perp)}")
    elif qid == "L9-001":
        ev = obj.get("expected_value")
        status = "OK" if ev is not None else f"MISSING (keys: {list(actual_keys)})"
        print(f"  schema: {status} (expected_value={ev})")

    passed = has_think and obj is not None and not collapsed
    results.append((qid, passed, status, f"think={has_think} parse={method}"))

print("\n" + "=" * 72)
print("VERDICT:")
all_pass = all(r[1] for r in results)
for qid, passed, status, detail in results:
    mark = "✓ PASS" if passed else "✗ FAIL"
    print(f"  {qid}: {mark} — {status} ({detail})")
print(f"\n{'→ TIER 1 PASS — proceed to Tier 2' if all_pass else '→ TIER 1 FAIL — option does not achieve parity'}")
print("=" * 72)
