#!/usr/bin/env python3
"""Two-stage generation: think freely (stage 1), then format as JSON (stage 2).
Stage 1: normal call, no json_object — model thinks and answers in natural language.
Stage 2: pass the answer back with json_object — model formats it as clean JSON.
This sidesteps ALL grammar/reasoning conflicts. Works on vLLM (proven stable)."""
import json, urllib.request, re, time, sys

ENDPOINT = "http://localhost:8000/v1/chat/completions"
MODEL = sys.argv[1] if len(sys.argv) > 1 else "local-qwen36-27b-base"
PROMPTS = "/workspace/prompts-300q.json"

def load_prompt(qid):
    data = json.load(open(PROMPTS))
    rows = data if isinstance(data, list) else (data.get("rows") or data.get("questions") or data.get("prompts") or [])
    for r in rows:
        if str(r.get("id") or r.get("questionId")) == qid:
            return r["system"], r["user"]
    raise KeyError(qid)

def call(messages, use_json_object=False, max_tokens=16000):
    body = {"model": MODEL, "messages": messages, "temperature": 0.1, "max_tokens": max_tokens}
    if use_json_object:
        body["response_format"] = {"type": "json_object"}
    req = urllib.request.Request(ENDPOINT, data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
    t0 = time.time()
    resp = json.loads(urllib.request.urlopen(req, timeout=900).read())
    dt = time.time() - t0
    choice = resp["choices"][0]
    msg = choice.get("message", {})
    content = msg.get("content", "") or ""
    reasoning = msg.get("reasoning_content") or ""
    finish = choice.get("finish_reason")
    usage = resp.get("usage", {})
    return content, reasoning, finish, dt, usage

def extract_json(text):
    text = text.strip()
    try: return json.loads(text), "direct"
    except: pass
    m = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if m:
        try: return json.loads(m.group(1)), "fenced"
        except: pass
    m = re.search(r"\{.*\}", text, re.DOTALL)
    if m:
        try: return json.loads(m.group(0)), "extracted"
        except: pass
    return None, "failed"

PROBE = [("L9-001", "simple"), ("AGI-004", "nested_alloc"), ("AGI-014", "nested_perp")]

print("=" * 72)
print("TWO-STAGE: think freely → format as JSON (json_object)")
print("=" * 72)

results = []
for qid, kind in PROBE:
    system, user = load_prompt(qid)
    print(f"\n--- {qid} ({kind}) ---", flush=True)

    # STAGE 1: think freely, no json_object
    print(f"  [stage 1: think] ...", end=" ", flush=True)
    try:
        s1_content, s1_reasoning, s1_finish, s1_dt, s1_usage = call(
            [{"role": "system", "content": system}, {"role": "user", "content": user}],
            use_json_object=False
        )
    except Exception as e:
        print(f"ERROR: {e}")
        results.append((qid, False, "stage1_error", str(e)[:80]))
        continue
    s1_ctok = s1_usage.get("completion_tokens", "?")
    has_think = bool(s1_reasoning and s1_reasoning.strip()) or "<think>" in (s1_content or "")
    print(f"{s1_dt:.1f}s finish={s1_finish} ctok={s1_ctok} thinking={'YES' if has_think else 'NO'}")

    # Check if stage 1 already produced valid JSON (reasoning models often do)
    s1_obj, s1_method = extract_json(s1_content)
    if s1_obj:
        print(f"  [stage 1 already JSON: {s1_method}]")

    # STAGE 2: format as JSON with json_object
    s2_system = "Return ONLY a valid JSON object. Format the answer below as JSON with exactly the keys specified in the original question's Output Requirements. Preserve all numeric values exactly."
    s2_user = f"Original question:\n{user}\n\nYour answer:\n{s1_content}\n\nReturn this as a valid JSON object now."
    print(f"  [stage 2: format] ...", end=" ", flush=True)
    try:
        s2_content, s2_reasoning, s2_finish, s2_dt, s2_usage = call(
            [{"role": "system", "content": s2_system}, {"role": "user", "content": s2_user}],
            use_json_object=True, max_tokens=4000
        )
    except Exception as e:
        print(f"ERROR: {e}")
        results.append((qid, False, "stage2_error", str(e)[:80]))
        continue
    print(f"{s2_dt:.1f}s finish={s2_finish}")

    # Check the result
    obj, method = extract_json(s2_content)
    if obj is None:
        print(f"  json: FAILED ({method}). raw[:200]: {(s2_content or '')[:200]}")
        results.append((qid, False, "no_json", f"think={has_think} parse={method}"))
        continue
    print(f"  json: {method} OK. keys: {list(obj.keys())}")

    # Check nested schema
    exec_keys = {"intent","order_type","asset","size","unit","venue","venue_name","risk_controls","follow_up"}
    actual = set(obj.keys()) - {"reasoning"}
    collapsed = actual.issubset(exec_keys) and "order_type" in actual

    if qid == "AGI-004":
        alloc = obj.get("allocation_usd")
        ok = isinstance(alloc, dict) and len(alloc) >= 3
        print(f"  schema: {'NESTED OK' if ok else ('COLLAPSED' if collapsed else 'partial')}")
        if isinstance(alloc, dict): print(f"    allocation_usd: {json.dumps(alloc)}")
        results.append((qid, has_think and ok, "nested" if ok else "collapsed", f"think={has_think}"))
    elif qid == "AGI-014":
        perp = obj.get("perp_short_allocation_usd")
        ok = isinstance(perp, dict) and len(perp) >= 3
        print(f"  schema: {'NESTED OK' if ok else ('COLLAPSED' if collapsed else 'partial')}")
        if isinstance(perp, dict): print(f"    perp_short_allocation_usd: {json.dumps(perp)}")
        results.append((qid, has_think and ok, "nested" if ok else "collapsed", f"think={has_think}"))
    else:
        ev = obj.get("expected_value")
        ok = ev is not None
        print(f"  schema: {'OK' if ok else 'MISSING'} (expected_value={ev})")
        results.append((qid, has_think and ok, "ok" if ok else "missing", f"think={has_think}"))

print("\n" + "=" * 72)
print("VERDICT:")
for qid, passed, status, detail in results:
    print(f"  {qid}: {'✓ PASS' if passed else '✗ FAIL'} — {status} ({detail})")
all_pass = all(r[1] for r in results)
print(f"\n{'→ TIER 1 PASS' if all_pass else '→ TIER 1 FAIL'}")
print("=" * 72)
