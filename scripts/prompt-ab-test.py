#!/usr/bin/env python3
"""
prompt-ab-test.py — Run a 17-question A/B test comparing prompt variants.

A: Current prompt (system prompt with ExecuteOneResponse interface for all questions)
B: Fixed prompt (L9+ questions get analytical system prompt without ExecuteOneResponse)

Test set: 13 flipper questions + 4 holdout schema siblings
  Flippers: L9-005, L9-024, L9-040, L9-051, L9-055, L9-059, L9-064,
            L10-006, L10-017, L10-043, L10-046, L10-047, L10-056
  Holdout siblings: L9-031, L10-024, L10-050, L10-055

Usage on pod:
  python3 scripts/prompt-ab-test.py --sglang-url http://127.0.0.1:30000

Gate (per GPT-5.5):
  If schema class improves by >=4/7 without hurting overcount questions → prompt conflict is the main target
  If not → GRPO may be justified as "obey user output schema despite conflicting system prompt"
"""
import json
import os
import sys
import time
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--sglang-url", default=os.environ.get("SGLANG_URL", "http://127.0.0.1:30000"))
    p.add_argument("--prompts-a", default=os.environ.get("PROMPTS_A", "prompts-300q.json"))
    p.add_argument("--prompts-b", default=os.environ.get("PROMPTS_B", "prompts-300q-variantB.json"))
    p.add_argument("--output-dir", default=os.environ.get("OUTPUT_DIR", "results/prompt-ab-test"))
    p.add_argument("--temperature", type=float, default=0.1)
    p.add_argument("--max-tokens", type=int, default=8000)
    p.add_argument("--model", default="local-qwen36-27b-base")
    p.add_argument("--concurrency", type=int, default=4)
    p.add_argument("--transport-retries", type=int, default=3)
    return p.parse_args()


TEST_QUESTIONS = [
    # 13 flippers
    "L9-005", "L9-024", "L9-040", "L9-051", "L9-055", "L9-059", "L9-064",
    "L10-006", "L10-017", "L10-043", "L10-046", "L10-047", "L10-056",
    # 4 holdout schema siblings
    "L9-031", "L10-024", "L10-050", "L10-055",
]

# Error class mapping (from our clustering analysis)
ERROR_CLASS = {
    # Schema contamination class
    "L9-024": "schema", "L9-040": "schema", "L9-064": "schema",
    "L10-043": "schema", "L10-046": "schema", "L10-047": "schema", "L10-056": "schema",
    # Moderate overcount class
    "L9-051": "overcount", "L9-055": "overcount", "L9-059": "overcount",
    # Bespoke errors
    "L9-005": "double_count", "L10-006": "5x_error", "L10-017": "decimal_percent",
    # Holdout siblings (unknown error class — will classify after)
    "L9-031": "holdout", "L10-024": "holdout", "L10-050": "holdout", "L10-055": "holdout",
}


def generate_one(url, system, user, model, temperature, max_tokens, retries=3):
    """Generate one completion via SGLang streaming."""
    import subprocess
    payload = json.dumps({
        "model": model,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "temperature": temperature,
        "max_tokens": max_tokens,
        "response_format": {"type": "json_object"},
        "stream": True,
    })

    for attempt in range(retries):
        try:
            result = subprocess.run(
                ["curl", "-s", "-m", "600", "-N", f"{url}/v1/chat/completions",
                 "-H", "Content-Type: application/json", "-d", payload],
                capture_output=True, text=True, timeout=620,
            )
            content_parts, reasoning_parts, finish = [], [], None
            for line in result.stdout.split("\n"):
                line = line.strip()
                if not line.startswith("data: "):
                    continue
                d = line[6:]
                if d == "[DONE]":
                    break
                try:
                    ch = json.loads(d)["choices"][0]
                    delta = ch.get("delta", {})
                    if delta.get("content"):
                        content_parts.append(delta["content"])
                    if delta.get("reasoning_content"):
                        reasoning_parts.append(delta["reasoning_content"])
                    if ch.get("finish_reason"):
                        finish = ch["finish_reason"]
                except (json.JSONDecodeError, KeyError, IndexError):
                    pass
            content = "".join(content_parts)
            if content.strip():
                return {"content": content, "reasoning": "".join(reasoning_parts), "finish": finish or "stop"}
        except Exception as e:
            if attempt == retries - 1:
                return {"content": "", "reasoning": "", "finish": "ERROR", "error": str(e)[:200]}
            time.sleep(2 ** attempt)
    return {"content": "", "reasoning": "", "finish": "ERROR"}


def run_variant(url, prompts_map, questions, model, temp, max_tokens, concurrency, label):
    """Run one variant (A or B) on all test questions."""
    print(f"\n{'='*60}")
    print(f"  Running variant {label} ({len(questions)} questions)")
    print(f"{'='*60}")

    results = {}

    with ThreadPoolExecutor(max_workers=concurrency) as pool:
        futures = {}
        for qid in questions:
            if qid not in prompts_map:
                print(f"  WARNING: {qid} not in prompts file, skipping")
                continue
            system, user = prompts_map[qid]
            f = pool.submit(generate_one, url, system, user, model, temp, max_tokens)
            futures[f] = qid

        for f in as_completed(futures):
            qid = futures[f]
            r = f.result()
            results[qid] = r
            ev = "(parse error)"
            try:
                parsed = json.loads(r["content"])
                ev = parsed.get("expected_value", "(missing)")
            except:
                pass
            print(f"  {qid}: finish={r['finish']} | EV={ev} | len={len(r['content'])}")

    return results


def grade_results(repo_root, results):
    """Grade results using the TS grader."""
    sys.path.insert(0, os.path.join(repo_root, "scripts"))
    from grpo_reward import GraderSubprocess
    grader = GraderSubprocess(repo_root)
    batch = [{"id": qid, "response": r["content"]} for qid, r in results.items() if r["content"].strip()]
    graded = grader.grade_batch(batch)
    grader.close()

    # Map back
    grades = {}
    for g in graded:
        grades[g["id"]] = g
    return grades


def main():
    args = parse_args()
    os.makedirs(args.output_dir, exist_ok=True)

    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    # Load both prompt variants
    def load_prompts(path):
        with open(path) as f:
            data = json.load(f)
        rows = data if isinstance(data, list) else data.get("rows", data.get("questions", []))
        pmap = {}
        for r in rows:
            qid = str(r.get("id") or r.get("questionId"))
            if qid in TEST_QUESTIONS:
                system = r.get("system", "")
                user = r.get("user", r.get("prompt", ""))
                pmap[qid] = (system, user)
        return pmap

    prompts_a = load_prompts(os.path.join(repo_root, args.prompts_a))
    prompts_b = load_prompts(os.path.join(repo_root, args.prompts_b))

    print(f"Loaded {len(prompts_a)} A prompts, {len(prompts_b)} B prompts")

    # Run variant A
    results_a = run_variant(args.sglang_url, prompts_a, TEST_QUESTIONS,
                           args.model, args.temperature, args.max_tokens,
                           args.concurrency, "A (current)")

    # Run variant B
    results_b = run_variant(args.sglang_url, prompts_b, TEST_QUESTIONS,
                           args.model, args.temperature, args.max_tokens,
                           args.concurrency, "B (fixed schema)")

    # Grade both
    print(f"\n{'='*60}")
    print("  Grading variant A")
    print(f"{'='*60}")
    grades_a = grade_results(repo_root, results_a)

    print(f"\n{'='*60}")
    print("  Grading variant B")
    print(f"{'='*60}")
    grades_b = grade_results(repo_root, results_b)

    # Compare
    print(f"\n{'='*80}")
    print("  A/B COMPARISON")
    print(f"{'='*80}")
    print(f"\n{'Question':<12} {'Class':<15} {'A score':<10} {'A pass':<8} {'B score':<10} {'B pass':<8} {'Delta':<8}")
    print("-" * 80)

    pass_a_by_class = {}
    pass_b_by_class = {}

    for qid in TEST_QUESTIONS:
        cls = ERROR_CLASS.get(qid, "?")
        ga = grades_a.get(qid, {})
        gb = grades_b.get(qid, {})
        score_a = ga.get("score", 0)
        score_b = gb.get("score", 0)
        pass_a = ga.get("pass", False)
        pass_b = gb.get("pass", False)
        delta = score_b - score_a

        pass_a_by_class.setdefault(cls, []).append(pass_a)
        pass_b_by_class.setdefault(cls, []).append(pass_b)

        flag = "✅" if (pass_b and not pass_a) else ("❌" if (pass_a and not pass_b) else "")
        print(f"{qid:<12} {cls:<15} {score_a:<10.2f} {'YES' if pass_a else 'NO':<8} {score_b:<10.2f} {'YES' if pass_b else 'NO':<8} {delta:<+8.2f} {flag}")

    # Summary by error class
    print(f"\n{'='*80}")
    print("  SUMMARY BY ERROR CLASS")
    print(f"{'='*80}")
    print(f"\n{'Class':<20} {'N':<5} {'A pass':<10} {'B pass':<10} {'Delta':<10} {'Gate'}")
    print("-" * 60)

    for cls in ["schema", "overcount", "double_count", "5x_error", "decimal_percent", "holdout"]:
        if cls not in pass_a_by_class:
            continue
        n = len(pass_a_by_class[cls])
        a_passes = sum(pass_a_by_class[cls])
        b_passes = sum(pass_b_by_class[cls])
        delta = b_passes - a_passes

        gate = ""
        if cls == "schema":
            gate = "✅ PASS" if delta >= 4 else "❌ FAIL"
        elif cls == "overcount":
            gate = "✅ OK (not hurt)" if b_passes >= a_passes else "❌ REGRESSION"

        print(f"{cls:<20} {n:<5} {a_passes}/{n:<8} {b_passes}/{n:<8} {delta:<+10} {gate}")

    # GPT-5.5's gate
    schema_a = sum(pass_a_by_class.get("schema", []))
    schema_b = sum(pass_b_by_class.get("schema", []))
    overcount_a = sum(pass_a_by_class.get("overcount", []))
    overcount_b = sum(pass_b_by_class.get("overcount", []))

    print(f"\n{'='*80}")
    print("  GPT-5.5 GATE")
    print(f"{'='*80}")
    print(f"\n  Schema class: {schema_a}/7 → {schema_b}/7 (need >=+4)")
    print(f"  Overcount class: {overcount_a}/3 → {overcount_b}/3 (must not regress)")
    gate_pass = (schema_b - schema_a >= 4) and (overcount_b >= overcount_a)
    print(f"\n  {'✅ GATE PASSED — prompt conflict is the main target, skip GRPO for schema class' if gate_pass else '❌ GATE FAILED — GRPO may be needed'}")

    # Save results
    output = {
        "variant_a": {qid: {"score": grades_a.get(qid, {}).get("score", 0), "pass": grades_a.get(qid, {}).get("pass", False)} for qid in TEST_QUESTIONS},
        "variant_b": {qid: {"score": grades_b.get(qid, {}).get("score", 0), "pass": grades_b.get(qid, {}).get("pass", False)} for qid in TEST_QUESTIONS},
        "gate_pass": gate_pass,
        "schema_delta": schema_b - schema_a,
        "overcount_delta": overcount_b - overcount_a,
    }
    with open(os.path.join(args.output_dir, "ab-summary.json"), "w") as f:
        json.dump(output, f, indent=2)

    # Save raw responses for debugging
    for qid in TEST_QUESTIONS:
        if qid in results_a:
            with open(os.path.join(args.output_dir, f"{qid}-A.json"), "w") as f:
                json.dump(results_a[qid], f, indent=2)
        if qid in results_b:
            with open(os.path.join(args.output_dir, f"{qid}-B.json"), "w") as f:
                json.dump(results_b[qid], f, indent=2)

    print(f"\nResults saved to {args.output_dir}/")
    return 0 if gate_pass else 1


if __name__ == "__main__":
    sys.exit(main())
