#!/usr/bin/env python3
"""Full parity validation: test the new runner's retry/escalation logic,
then thinking ON vs OFF on BOTH base and SFT. 3 questions × 2 models × 2 modes."""
import json, subprocess, re, time, os, sys

BASE_URL = os.environ.get("PROBE_ENDPOINT", "http://localhost:8000")
ENDPOINT = BASE_URL + "/v1/chat/completions"
PROMPTS = "prompts-300q.json"
MODELS = ["local-qwen36-27b-base", "local-qwen36-27b-sft"]
PROBE = ["L9-001", "AGI-004", "AGI-014"]

# Budget escalation test (matches OR runner): 8000→16000→24000
BUDGETS = [8000, 16000, 24000]
TRANSPORT_RETRIES = 6


def load_prompt(qid):
    data = json.load(open(PROMPTS))
    rows = data if isinstance(data, list) else (data.get("rows") or data.get("questions") or [])
    for r in rows:
        if str(r.get("id") or r.get("questionId")) == qid:
            return r["system"], r["user"]
    raise KeyError(qid)


def call_once(system, user, model, max_tokens, enable_thinking=True):
    payload = {
        "model": model,
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
    try:
        result = subprocess.run(
            ["curl", "-s", "-m", "900", "-N", ENDPOINT,
             "-H", "Content-Type: application/json", "-d", body],
            capture_output=True, text=True
        )
        dt = time.time() - t0
        if result.returncode != 0:
            raise OSError(f"curl exit {result.returncode}")
        c = []; r = []; f = None
        for line in result.stdout.split("\n"):
            line = line.strip()
            if not line.startswith("data: "): continue
            d = line[6:]
            if d == "[DONE]": break
            try:
                ch = json.loads(d)["choices"][0]
                dl = ch.get("delta", {})
                if dl.get("content"): c.append(dl["content"])
                if dl.get("reasoning_content"): r.append(dl["reasoning_content"])
                if ch.get("finish_reason"): f = ch["finish_reason"]
            except: pass
        return "".join(c), "".join(r), f, dt
    except Exception as e:
        dt = time.time() - t0
        return "", "", "ERROR", dt


def generate_with_parity(system, user, model, enable_thinking=True, label=""):
    """Replicates OR runner logic: transport retries + budget escalation on truncation/blank."""
    last = None
    attempts = 0
    for budget in BUDGETS:
        for tr in range(TRANSPORT_RETRIES + 1):
            attempts += 1
            content, reasoning, finish, dt = call_once(system, user, model, budget, enable_thinking)
            last = {"content": content, "reasoning": reasoning, "finish": finish,
                    "dt": dt, "budget": budget, "attempts": attempts}
            if finish == "ERROR":
                if tr < TRANSPORT_RETRIES:
                    wait = min(2 * (2 ** tr), 30)
                    print(f"      [{label}] transport retry {tr+1}/{TRANSPORT_RETRIES} after {wait}s", flush=True)
                    time.sleep(wait)
                    continue
                else:
                    break
            raw = (content or "").strip()
            if finish == "length" or not raw:
                next_b = BUDGETS[-1] if budget == BUDGETS[-1] else BUDGETS[BUDGETS.index(budget)+1]
                print(f"      [{label}] escalate {budget}→{next_b} (finish={finish})", flush=True)
                break
            break
        else:
            continue
        if last["finish"] not in ("ERROR", "length") and (last["content"] or "").strip():
            break
    return last


def extract_json(text):
    text = (text or "").strip()
    try: return json.loads(text), "direct"
    except: pass
    m = re.search(r"\{.*\}", text, re.DOTALL)
    if m:
        try: return json.loads(m.group(0)), "extracted"
        except: pass
    return None, "failed"


RUBRIC = {
    "L9-001": {"expected_value_range": [18.0, 19.0]},
    "AGI-004": {"Ethena_range": [19900, 20100], "Curve_range": [29900, 30100]},
    "AGI-014": {"apr_range": [28.7, 29.2], "pnl_range": [11750, 12050]},
}

EXEC_KEYS = {"intent","order_type","asset","size","unit","venue","venue_name","risk_controls","follow_up"}

results = []

print("=" * 75)
print("FULL PARITY VALIDATION: retry logic + thinking ON/OFF on both models")
print(f"endpoint={BASE_URL}")
print("=" * 75)

# STEP 1: Validate retry/escalation with thinking ON, base only, 1 question
print("\n>>> STEP 1: Validate runner retry/escalation logic (L9-001 base, thinking ON)")
sys.stdout.flush()
system, user = load_prompt("L9-001")
res = generate_with_parity(system, user, "local-qwen36-27b-base", enable_thinking=True, label="validate")
obj, method = extract_json(res["content"])
collapsed = obj and set(obj.keys()) - {"reasoning"} <= EXEC_KEYS and "order_type" in (obj or {})
print(f"  RESULT: finish={res['finish']} budget={res['budget']} attempts={res['attempts']} "
      f"json={method} think={len(res['reasoning'])}c collapsed={collapsed}")
if res["attempts"] > 1:
    print(f"  ✓ Retry/escalation FIRED ({res['attempts']} attempts)")
else:
    print(f"  (1 attempt — no retry needed, but logic is wired)")
if not collapsed and obj:
    print(f"  ✓ Schema preserved")
    ev = obj.get("expected_value")
    r = RUBRIC["L9-001"]
    ok = isinstance(ev, (int,float)) and r["expected_value_range"][0] <= ev <= r["expected_value_range"][1]
    print(f"  expected_value={ev} ({'✓' if ok else '✗'})")

# STEP 2: Thinking ON vs OFF on BOTH models, all 3 questions
print(f"\n>>> STEP 2: Thinking ON vs OFF — both models, 3 questions")
for qid in PROBE:
    system, user = load_prompt(qid)
    print(f"\n{'='*60}")
    print(f"{qid}")
    print(f"{'='*60}")
    for model in MODELS:
        short = "SFT " if "sft" in model else "base"
        for mode, thinking in [("THINK ON", True), ("THINK OFF", False)]:
            label = f"{short} {mode}"
            print(f"\n  [{label}]", flush=True)
            res = generate_with_parity(system, user, model, enable_thinking=thinking, label=label)
            obj, method = extract_json(res["content"])
            has_think = bool(res["reasoning"] and res["reasoning"].strip())
            collapsed = bool(obj) and set(obj.keys()) - {"reasoning"} <= EXEC_KEYS and "order_type" in (obj or {})

            print(f"    {res['dt']:.0f}s finish={res['finish']} budget={res['budget']} "
                  f"think={'YES('+str(len(res['reasoning']))+'c)' if has_think else 'NO'} "
                  f"json={method} {'⚠️ COLLAPSED' if collapsed else '✓ schema'}")

            detail = ""
            if obj:
                if qid == "AGI-004":
                    a = obj.get("allocation_usd")
                    if isinstance(a, dict):
                        ethena = a.get("Ethena_USDe", "?")
                        curve = a.get("Curve_3pool", "?")
                        r = RUBRIC["AGI-004"]
                        e_ok = isinstance(ethena,(int,float)) and r["Ethena_range"][0]<=ethena<=r["Ethena_range"][1]
                        c_ok = isinstance(curve,(int,float)) and r["Curve_range"][0]<=curve<=r["Curve_range"][1]
                        detail = f"Ethena={ethena}({'✓' if e_ok else '✗'}) Curve={curve}({'✓' if c_ok else '✗'})"
                elif qid == "AGI-014":
                    apr = obj.get("apr_pct"); pnl = obj.get("pnl_30d_usd")
                    r = RUBRIC["AGI-014"]
                    a_ok = isinstance(apr,(int,float)) and r["apr_range"][0]<=apr<=r["apr_range"][1]
                    p_ok = isinstance(pnl,(int,float)) and r["pnl_range"][0]<=pnl<=r["pnl_range"][1]
                    detail = f"APR={apr}({'✓' if a_ok else '✗'}) PnL={pnl}({'✓' if p_ok else '✗'})"
                elif qid == "L9-001":
                    ev = obj.get("expected_value")
                    r = RUBRIC["L9-001"]
                    ok = isinstance(ev,(int,float)) and r["expected_value_range"][0]<=ev<=r["expected_value_range"][1]
                    detail = f"ev={ev}({'✓' if ok else '✗'})"
            else:
                detail = "NO JSON"
            print(f"    {detail}")

            results.append({"qid": qid, "model": short, "mode": mode,
                           "finish": res["finish"], "collapsed": collapsed,
                           "values": detail, "dt": res["dt"], "think_chars": len(res["reasoning"])})

print(f"\n{'='*75}")
print("SUMMARY TABLE")
print(f"{'='*75}")
print(f"{'qid':8} {'model':5} {'mode':10} {'finish':6} {'schema':10} {'values':40} {'time':5}")
print("-" * 80)
for r in results:
    schema = "COLLAPSED" if r["collapsed"] else "ok"
    print(f"{r['qid']:8} {r['model']:5} {r['mode']:10} {r['finish']:6} {schema:10} {r['values']:40} {r['dt']:.0f}s")
