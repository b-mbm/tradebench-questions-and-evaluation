import json, urllib.request, re, sys
qid, maxtok, model = sys.argv[1], int(sys.argv[2]), sys.argv[3]
P = json.load(open("/workspace/probe-prompts.json"))[qid]
body = json.dumps({"model": model,
                   "messages": [{"role": "system", "content": P["system"]},
                                {"role": "user", "content": P["user"]}],
                   "temperature": 0.1, "max_tokens": maxtok}).encode()
req = urllib.request.Request("http://localhost:8000/v1/chat/completions", body, {"Content-Type": "application/json"})
try:
    r = json.load(urllib.request.urlopen(req, timeout=300))
    c = r["choices"][0]["message"]["content"]; fr = r["choices"][0].get("finish_reason")
    print("=== %s [%s] max=%d finish=%s len=%d ===" % (qid, model[-4:], maxtok, fr, len(c)))
    print("has_think:", "<think>" in c, "| has_json:", bool(re.search(r"\{.*\}", c, re.S)))
    print("GENERIC_schema:", ('"order_type"' in c and '"venue"' in c))
    print("SPECIFIC_fields:", any(k in c for k in ["chosen_strategy", "execution_sequence", "tranche", "_bps", "expected_", "shorts", "concentration", "tick_", "half_spread"]))
    print("--- raw (first 1500) ---"); print(c[:1500])
except Exception as e:
    print("FAILED:", repr(e)[:250])
