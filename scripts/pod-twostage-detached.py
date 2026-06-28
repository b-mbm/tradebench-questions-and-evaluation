#!/usr/bin/env python3
"""Run two-stage test detached, write results to file. Survives SSH timeout."""
import json, urllib.request, re, time, sys

ENDPOINT = "http://localhost:8000/v1/chat/completions"
MODEL = "local-qwen36-27b-base"
PROMPTS = "/workspace/prompts-300q.json"
OUT = "/workspace/twostage-full-results.txt"

def load_prompt(qid):
    data = json.load(open(PROMPTS))
    rows = data if isinstance(data, list) else (data.get("rows") or data.get("questions") or [])
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
    return msg.get("content", "") or "", msg.get("reasoning_content") or "", choice.get("finish_reason"), dt, resp.get("usage", {})

def extract_json(text):
    text = text.strip()
    try: return json.loads(text), "direct"
    except: pass
    m = re.search(r"\{.*\}", text, re.DOTALL)
    if m:
        try: return json.loads(m.group(0)), "extracted"
        except: pass
    return None, "failed"

PROBE = ["L9-001", "AGI-004", "AGI-014"]
lines = []
lines.append("=" * 70)
lines.append("TWO-STAGE: think → format (detached run)")
lines.append("=" * 70)

for qid in PROBE:
    system, user = load_prompt(qid)
    lines.append(f"\n--- {qid} ---")
    # Stage 1: think freely
    try:
        c1, r1, f1, dt1, u1 = call([{"role": "system", "content": system}, {"role": "user", "content": user}])
        ctok1 = u1.get("completion_tokens", "?")
        has_think = bool(r1 and r1.strip())
        obj1, m1 = extract_json(c1)
        lines.append(f"  stage1: {dt1:.0f}s finish={f1} ctok={ctok1} think={has_think} json={m1}")
        if obj1:
            lines.append(f"  stage1 keys: {list(obj1.keys())}")
            if qid == "AGI-004": lines.append(f"  stage1 allocation_usd: {json.dumps(obj1.get('allocation_usd'))}")
            if qid == "AGI-014": lines.append(f"  stage1 perp_short_allocation_usd: {json.dumps(obj1.get('perp_short_allocation_usd'))}")
        # Stage 2 only needed if stage 1 didn't produce valid JSON
        if obj1:
            lines.append(f"  RESULT: stage 1 produced valid JSON directly — stage 2 not needed")
        else:
            lines.append(f"  stage1 raw[:200]: {c1[:200]}")
            s2_sys = "Return ONLY a valid JSON object. Format the answer below as JSON with the keys specified in the question. Preserve all numeric values exactly."
            s2_usr = f"Question:\n{user}\n\nYour answer:\n{c1}\n\nReturn as valid JSON now."
            c2, r2, f2, dt2, u2 = call([{"role": "system", "content": s2_sys}, {"role": "user", "content": s2_usr}], use_json_object=True, max_tokens=4000)
            obj2, m2 = extract_json(c2)
            lines.append(f"  stage2: {dt2:.0f}s finish={f2} json={m2}")
            if obj2:
                lines.append(f"  stage2 keys: {list(obj2.keys())}")
                if qid == "AGI-004": lines.append(f"  stage2 allocation_usd: {json.dumps(obj2.get('allocation_usd'))}")
                if qid == "AGI-014": lines.append(f"  stage2 perp_short_allocation_usd: {json.dumps(obj2.get('perp_short_allocation_usd'))}")
    except Exception as e:
        lines.append(f"  ERROR: {e}")

with open(OUT, "w") as f:
    f.write("\n".join(lines))
print("\n".join(lines))
print(f"\nResults saved to {OUT}")
