#!/usr/bin/env python3
"""Thinking ON vs OFF test: 3 questions × 2 modes, compare answers.
Tests whether disabling thinking (matching OpenRouter's behavior) changes answer quality."""
import json, subprocess, re, time, os, sys

BASE_URL = os.environ.get("PROBE_ENDPOINT", "http://localhost:8000")
ENDPOINT = BASE_URL + "/v1/chat/completions"
PROMPTS = "prompts-300q.json"
MODEL = "local-qwen36-27b-base"
PROBE = ["L9-001", "AGI-004", "AGI-014"]


def load_prompt(qid):
    data = json.load(open(PROMPTS))
    rows = data if isinstance(data, list) else (data.get("rows") or data.get("questions") or [])
    for r in rows:
        if str(r.get("id") or r.get("questionId")) == qid:
            return r["system"], r["user"]
    raise KeyError(qid)


def call(system, user, enable_thinking, max_tokens=16000):
    payload = {
        "model": MODEL,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        "temperature": 0.1,
        "max_tokens": max_tokens,
        "response_format": {"type": "json_object"},
        "stream": True,
    }
    if not enable_thinking:
        payload["chat_template_kwargs"] = {"enable_thinking": False}

    body = json.dumps(payload)
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


# OpenRouter reference values (from fresh 29Q run)
OR_REF = {
    "L9-001": {"expected_value": 18.525},
    "AGI-004": {"Ethena_USDe": 0, "alloc": {"Aave_USDC": 30000, "Curve_3pool": 30000, "Ethena_USDe": 0, "GMX_GLP": 30000}},
    "AGI-014": {"apr_pct": 26.56, "pnl_30d_usd": 27400},
}

# Rubric expected values (from rubric files)
RUBRIC = {
    "L9-001": {"expected_value_range": [18.0, 19.0]},
    "AGI-004": {"Ethena_USDe_range": [19900, 20100], "Curve_range": [29900, 30100]},
    "AGI-014": {"apr_pct_range": [28.7, 29.2], "pnl_30d_range": [11750, 12050]},
}

print("=" * 70)
print("THINKING ON vs OFF: 3 questions, both modes")
print(f"endpoint={BASE_URL}")
print("=" * 70)

for qid in PROBE:
    system, user = load_prompt(qid)
    print(f"\n{'='*60}")
    print(f"{qid}")
    print(f"{'='*60}")

    for mode_label, thinking_on in [("THINK ON", True), ("THINK OFF", False)]:
        print(f"\n  [{mode_label}]", flush=True)
        try:
            content, reasoning, finish, dt = call(system, user, thinking_on)
        except Exception as e:
            print(f"    ERROR: {e}")
            continue

        has_think = bool(reasoning and reasoning.strip())
        obj, method = extract_json(content)
        print(f"    {dt:.0f}s finish={finish} think={'YES('+str(len(reasoning))+'c)' if has_think else 'NO'} json={method}")

        if obj is None:
            print(f"    PARSE FAILED; raw[:200]: {(content or '')[:200]}")
            continue

        print(f"    keys: {list(obj.keys())[:8]}")

        if qid == "AGI-004":
            alloc = obj.get("allocation_usd")
            if isinstance(alloc, dict):
                ethena = alloc.get("Ethena_USDe", "?")
                curve = alloc.get("Curve_3pool", "?")
                r = RUBRIC["AGI-004"]
                ethena_ok = isinstance(ethena, (int, float)) and r["Ethena_USDe_range"][0] <= ethena <= r["Ethena_USDe_range"][1]
                curve_ok = isinstance(curve, (int, float)) and r["Curve_range"][0] <= curve <= r["Curve_range"][1]
                print(f"    allocation_usd: {json.dumps(alloc)}")
                print(f"    Ethena={ethena} ({'✓ in range' if ethena_ok else '✗ out of range ['+str(r['Ethena_USDe_range'])+']'})")
                print(f"    Curve={curve} ({'✓' if curve_ok else '✗'})")
            else:
                print(f"    allocation_usd: MISSING")

        elif qid == "AGI-014":
            apr = obj.get("apr_pct")
            pnl = obj.get("pnl_30d_usd")
            r = RUBRIC["AGI-014"]
            apr_ok = isinstance(apr, (int, float)) and r["apr_pct_range"][0] <= apr <= r["apr_pct_range"][1]
            pnl_ok = isinstance(pnl, (int, float)) and r["pnl_30d_range"][0] <= pnl <= r["pnl_30d_range"][1]
            print(f"    apr_pct={apr} ({'✓ in range' if apr_ok else '✗ out of range ['+str(r['apr_pct_range'])+']'})")
            print(f"    pnl_30d={pnl} ({'✓ in range' if pnl_ok else '✗ out of range ['+str(r['pnl_30d_range'])+']'})")

        elif qid == "L9-001":
            ev = obj.get("expected_value")
            r = RUBRIC["L9-001"]
            ev_ok = isinstance(ev, (int, float)) and r["expected_value_range"][0] <= ev <= r["expected_value_range"][1]
            print(f"    expected_value={ev} ({'✓ in range' if ev_ok else '✗ out of range ['+str(r['expected_value_range'])+']'})")

print(f"\n{'='*70}")
print("COMPARE: which mode scores better on each question?")
print(f"{'='*70}")
