#!/usr/bin/env python3
"""Fix 1b test: json_object WITHOUT reasoning-parser AND WITHOUT ExecuteOneResponse in system prompt.
If nested AGI schema survives, we've found the fix: strip the interface + no reasoning parser."""
import json, urllib.request, re, time

ENDPOINT = "http://localhost:8000/v1/chat/completions"
MODEL = "local-qwen36-27b-base"

# The ORIGINAL system prompt contains "interface ExecuteOneResponse {...}" + examples.
# Replace it with a generic instruction that lets the model follow the USER prompt's schema.
STRIPPED_SYSTEM = """You are Execute@1, a deterministic trading execution assistant.

Return ONLY a valid JSON object. Do not include explanations, markdown, or code fences outside of JSON.
Respond with exactly the JSON keys specified in the user prompt's "Output Requirements".
If the question specifies nested keys (e.g. allocation_usd with sub-keys), emit those nested objects exactly."""

def load_user(qid):
    data = json.load(open("/workspace/prompts-300q.json"))
    rows = data if isinstance(data, list) else (data.get("rows") or data.get("questions") or data.get("prompts") or [])
    for r in rows:
        if str(r.get("id") or r.get("questionId")) == qid:
            return r["system"], r["user"]
    raise KeyError(qid)

def call(system, user):
    body = {
        "model": MODEL,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        "temperature": 0.1, "max_tokens": 16000,
        "response_format": {"type": "json_object"},
    }
    req = urllib.request.Request(ENDPOINT, data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
    t0 = time.time()
    resp = json.loads(urllib.request.urlopen(req, timeout=600).read())
    dt = time.time() - t0
    choice = resp["choices"][0]
    content = choice["message"]["content"]
    finish = choice.get("finish_reason")
    return content, finish, dt

print("=" * 70)
print("FIX 1b: json_object + STRIPPED system prompt (no ExecuteOneResponse)")
print("=" * 70)

for qid in ["L9-001", "AGI-004", "AGI-014"]:
    orig_sys, user = load_user(qid)
    print(f"\n--- {qid} (json_object + stripped system prompt) ---", flush=True)
    print(f"  calling...", end=" ", flush=True)
    content, finish, dt = call(STRIPPED_SYSTEM, user)
    print(f"{dt:.1f}s finish={finish}")
    try:
        obj = json.loads(content)
        keys = list(obj.keys())
        print(f"  keys: {keys}")
        if qid == "AGI-004":
            alloc = obj.get("allocation_usd")
            if isinstance(alloc, dict) and any(v in str(alloc.keys()) for v in ["Curve","GMX","Ethena","Aave"]):
                print(f"  *** NESTED OK *** allocation_usd = {json.dumps(alloc, indent=2)}")
            elif alloc is not None:
                print(f"  allocation_usd present but wrong: {str(alloc)[:150]}")
            else:
                print(f"  COLLAPSED: no allocation_usd")
        elif qid == "AGI-014":
            perp = obj.get("perp_short_allocation_usd")
            if isinstance(perp, dict):
                print(f"  *** NESTED OK *** perp_short_allocation_usd = {json.dumps(perp, indent=2)}")
            elif perp is not None:
                print(f"  perp_short_allocation_usd present but wrong: {str(perp)[:150]}")
            else:
                print(f"  COLLAPSED: no perp_short_allocation_usd")
        elif qid == "L9-001":
            ev = obj.get("expected_value")
            print(f"  expected_value: {ev} {'*** OK ***' if ev is not None else 'MISSING'}")
    except Exception as e:
        print(f"  PARSE FAILED ({e}); raw[:300]: {content[:300]}")

print("\n" + "=" * 70)
print("VERDICT: if AGI rows show NESTED OK, the fix is: strip ExecuteOneResponse + no reasoning parser")
print("=" * 70)
