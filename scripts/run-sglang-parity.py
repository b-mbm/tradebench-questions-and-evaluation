#!/usr/bin/env python3
"""SGLang runner with FULL PARITY to OpenRouter runner:
- Transport retries (6, exponential backoff on network errors)
- Budget escalation (8000→16000→24000 on finish=length or blank)
- Streaming (required for RunPod proxy timeout)
- json_object + thinking (reasoning parser)

Records every attempt. If transport fails at budget X, retries at same budget.
If truncation/blank at budget X, escalates to next budget.
Only re-runs on: transport error, truncation, or blank. NEVER re-runs a wrong answer.
"""
import json, subprocess, re, time, os, sys, urllib.request

BASE_URL = os.environ.get("PROBE_ENDPOINT", "http://localhost:8000")
ENDPOINT = BASE_URL + "/v1/chat/completions"
PROMPTS = os.environ.get("PROMPTS_FILE", "prompts-300q.json")
OUT_DIR = os.environ.get("OUT_DIR", "results/community/300/sglang-run")
MODELS = [m.strip() for m in os.environ.get("MODELS", "local-qwen36-27b-base,local-qwen36-27b-sft").split(",")]
IDS = [x.strip() for x in os.environ.get("IDS", "").split(",") if x.strip()]
BUDGETS = [int(x) for x in os.environ.get("BUDGET_LADDER", "8000,16000,24000").split(",")]
TEMPERATURE = float(os.environ.get("TEMPERATURE", "0.1"))
TRANSPORT_RETRIES = int(os.environ.get("TRANSPORT_RETRIES", "6"))
ENABLE_THINKING = os.environ.get("ENABLE_THINKING", "1") == "1"
TIMEOUT_S = int(os.environ.get("CURL_TIMEOUT", "900"))

os.makedirs(OUT_DIR, exist_ok=True)
RESULTS_FILE = os.path.join(OUT_DIR, "results.jsonl")

# Load prompts
data = json.load(open(PROMPTS))
rows = data if isinstance(data, list) else (data.get("rows") or data.get("questions") or data.get("prompts") or [])
prompts = {}
for r in rows:
    qid = str(r.get("id") or r.get("questionId"))
    prompts[qid] = (r["system"], r["user"])
if IDS:
    question_ids = [q for q in IDS if q in prompts]
else:
    question_ids = list(prompts.keys())

# Resume: skip completed
done = set()
if os.path.exists(RESULTS_FILE):
    for line in open(RESULTS_FILE):
        try:
            r = json.loads(line)
            if r.get("status") == "ok":
                done.add((r["model"], r["questionId"]))
        except: pass

total = len(MODELS) * len(question_ids)
pending = [(m, q) for m in MODELS for q in question_ids if (m, q) not in done]
print(f"RUNNER: {len(pending)} pending of {total} ({len(done)} done). budgets={BUDGETS} retries={TRANSPORT_RETRIES} thinking={ENABLE_THINKING}", flush=True)


def call_once(system, user, model, max_tokens):
    """Single streaming request. Returns content, reasoning, finish, usage."""
    payload = {
        "model": model,
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}],
        "temperature": TEMPERATURE,
        "max_tokens": max_tokens,
        "response_format": {"type": "json_object"},
        "stream": True,
    }
    if not ENABLE_THINKING:
        payload["chat_template_kwargs"] = {"enable_thinking": False}

    body = json.dumps(payload)
    t0 = time.time()
    try:
        result = subprocess.run(
            ["curl", "-s", "-m", str(TIMEOUT_S), "-N", ENDPOINT,
             "-H", "Content-Type: application/json", "-d", body],
            capture_output=True, text=True
        )
        dt = time.time() - t0
        if result.returncode != 0:
            raise OSError(f"curl exit {result.returncode}: {result.stderr[:100]}")

        content_parts = []; reasoning_parts = []; finish = None; usage = {}
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
                if chunk.get("usage"): usage = chunk["usage"]
            except: pass

        content = "".join(content_parts)
        reasoning = "".join(reasoning_parts)
        return content, reasoning, finish, dt, usage, None

    except Exception as e:
        dt = time.time() - t0
        return "", "", "ERROR", dt, {}, str(e)[:200]


def generate(system, user, model):
    """Escalate budget on truncation/blank; retry transport errors per budget."""
    last = None
    attempts = 0
    for budget in BUDGETS:
        for tr in range(TRANSPORT_RETRIES + 1):
            attempts += 1
            content, reasoning, finish, dt, usage, error = call_once(system, user, model, budget)
            last = {"content": content, "reasoning": reasoning, "finish": finish,
                    "dt": dt, "budget": budget, "attempts": attempts, "error": error}

            if finish == "ERROR":
                # Transport error — retry at same budget
                if tr < TRANSPORT_RETRIES:
                    wait = min(2 * (2 ** tr), 30)
                    print(f"    retry {tr+1}/{TRANSPORT_RETRIES} after {wait}s (transport error)", flush=True)
                    time.sleep(wait)
                    continue
                else:
                    break  # exhausted retries at this budget, try next budget

            raw = (content or "").strip()
            if finish == "length" or not raw:
                # Truncated or blank — escalate budget
                print(f"    escalate budget {budget}→{BUDGETS[-1] if budget == BUDGETS[-1] else BUDGETS[BUDGETS.index(budget)+1]} (finish={finish}, blank={not raw})", flush=True)
                break  # move to next budget
            break  # clean completion
        else:
            continue
        # Check if we got a clean completion
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


completed = len(done)
for model, qid in pending:
    short = "sft" if "sft" in model else "base"
    system, user = prompts[qid]
    print(f"[{completed+1}/{total}] {short} {qid}...", end=" ", flush=True)

    res = generate(system, user, model)
    obj, method = extract_json(res["content"])

    status = "ok" if obj is not None and res["finish"] == "stop" else \
             ("truncated" if res["finish"] == "length" else "error")

    row = {
        "model": model, "questionId": qid,
        "status": status, "finish_reason": res["finish"],
        "raw": res["content"], "reasoning": res["reasoning"][:500],
        "reasoning_len": len(res["reasoning"]),
        "duration_s": round(res["dt"], 1),
        "budget_used": res["budget"], "attempts": res["attempts"],
        "obj_keys": list(obj.keys()) if obj else None,
    }
    with open(RESULTS_FILE, "a") as f:
        f.write(json.dumps(row) + "\n")
    completed += 1
    think_c = res["reasoning"][:0] or f"{len(res['reasoning'])}c"
    print(f"{status} fin={res['finish']} {res['dt']:.0f}s budget={res['budget']} think={len(res['reasoning'])}c", flush=True)

print(f"\nRUN COMPLETE: {completed}/{total}", flush=True)
