#!/usr/bin/env python3
"""Fix 1 test: serve WITHOUT reasoning-parser, send json_object, check if nested AGI schema survives.
Tests AGI-004 (needs allocation_usd with venue sub-keys) and L9-001 (needs expected_value).
This is the decisive test for the vLLM #18819 hypothesis."""
import json, urllib.request, sys, re, time

PROMPTS = "/workspace/prompts-300q.json"
ENDPOINT = "http://localhost:8000/v1/chat/completions"
MODEL = "local-qwen36-27b-base"

def load_prompt(qid):
    data = json.load(open(PROMPTS))
    rows = data if isinstance(data, list) else (data.get("rows") or data.get("questions") or data.get("prompts") or [])
    for r in rows:
        if str(r.get("id") or r.get("questionId")) == qid:
            return r["system"], r["user"]
    raise KeyError(qid)

def call(system, user, use_json_object):
    body = {
        "model": MODEL,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        "temperature": 0.1,
        "max_tokens": 16000,
    }
    if use_json_object:
        body["response_format"] = {"type": "json_object"}
    req = urllib.request.Request(ENDPOINT, data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
    t0 = time.time()
    resp = json.loads(urllib.request.urlopen(req, timeout=600).read())
    dt = time.time() - t0
    choice = resp["choices"][0]
    content = choice["message"]["content"]
    finish = choice.get("finish_reason")
    usage = resp.get("usage", {})
    return content, finish, dt, usage

def strip_think(text):
    """Remove <think>...</think> blocks (since we have no reasoning parser)."""
    return re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()

def extract_json(text):
    """Tolerant JSON extraction."""
    text = strip_think(text)
    # try direct parse
    try: return json.loads(text), "direct"
    except: pass
    # try first { to last }
    m = re.search(r"\{.*\}", text, re.DOTALL)
    if m:
        try: return json.loads(m.group(0)), "extracted"
        except: pass
    return None, "failed"

def check_agi004(obj):
    """AGI-004 needs allocation_usd with venue sub-keys."""
    if obj is None: return "NO JSON PARSED"
    alloc = obj.get("allocation_usd")
    if alloc is None: return f"COLLAPSED: no allocation_usd (keys: {list(obj.keys())})"
    if isinstance(alloc, dict):
        venues = list(alloc.keys())
        has_venues = any(v in str(venues) for v in ["Curve", "GMX", "Ethena", "Aave"])
        return f"NESTED OK: allocation_usd has venue keys {venues}"
    return f"WRONG TYPE: allocation_usd is {type(alloc).__name__} = {str(alloc)[:100]}"

def check_l9001(obj):
    """L9-001 needs expected_value (numeric)."""
    if obj is None: return "NO JSON PARSED"
    ev = obj.get("expected_value")
    if ev is None: return f"MISSING: no expected_value (keys: {list(obj.keys())})"
    return f"OK: expected_value = {ev}"

print("=" * 70)
print("FIX 1 TEST: json_object WITHOUT reasoning-parser")
print("=" * 70)

for qid, checker in [("L9-001", check_l9001), ("AGI-004", check_agi004)]:
    system, user = load_prompt(qid)
    print(f"\n--- {qid} ---")

    # Test WITHOUT json_object (baseline — should work, like our no-json runs)
    print(f"  [no response_format] ...", end=" ", flush=True)
    content, finish, dt, usage = call(system, user, use_json_object=False)
    obj, method = extract_json(content)
    result = checker(obj)
    print(f"{dt:.1f}s finish={finish} parse={method}")
    print(f"    {result}")
    print(f"    has <think>: {'<think>' in content}")
    print(f"    raw keys: {list(obj.keys()) if obj else 'N/A'}")

    # Test WITH json_object (the fix under test)
    print(f"  [json_object] ........", end=" ", flush=True)
    content, finish, dt, usage = call(system, user, use_json_object=True)
    obj, method = extract_json(content)
    result = checker(obj)
    print(f"{dt:.1f}s finish={finish} parse={method}")
    print(f"    {result}")
    print(f"    has <think>: {'<think>' in content}")
    if obj:
        print(f"    raw keys: {list(obj.keys())}")
        if qid == "AGI-004":
            print(f"    allocation_usd: {json.dumps(obj.get('allocation_usd'), indent=2)[:300]}")
    else:
        print(f"    RAW (first 300): {content[:300]}")

print("\n" + "=" * 70)
print("VERDICT:")
print("  If json_object AGI-004 shows 'NESTED OK' → FIX 1 WORKS, reasoning parser was the bug")
print("  If json_object AGI-004 shows 'COLLAPSED'  → need to also strip ExecuteOneResponse, or use SGLang")
print("=" * 70)
