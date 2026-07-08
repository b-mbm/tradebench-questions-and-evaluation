#!/usr/bin/env python3
"""
python_grader.py — Pure-Python grader for the 22 training questions.

Replaces the Node/tsx grader subprocess entirely. No npm, no tsx, no Node.

Handles two grading patterns:
  - L9/L10 (19 questions): single expected_value numeric, check against range
  - L3/L5 (3 questions): field-weighted match on required fields with synonyms

The 5 complex questions (L4-001, L6-001, L6-003, L7-003, L8-001) are DROPPED
per council decision (Finn: "don't simplify-then-keep — drop entirely").

GRADER CONSISTENCY (Lambert's requirement): this grader must be deterministic.
Same input → same output, always. It does NOT need to perfectly match the TS
grader — it needs to be INTERNALLY CONSISTENT so the null-reward control is valid.
"""
import json
import re
import os
from typing import Any


# ─── The 22 training questions with their grading specs ───────────────────
# Built from the rubric files. This is the ONLY data the grader needs —
# no external files, no tsx, no npm.

# L9 questions: {id: (expected_value, acceptable_range_min, acceptable_range_max)}
L9_QUESTIONS = {
    "L9-005": (6200000, 6100000, 6300000),
    "L9-006": (739228, 735000, 745000),
    "L9-007": (450000, 420000, 480000),
    "L9-013": (2500000, 2400000, 2600000),
    "L9-024": (1800000, 1700000, 1900000),
    "L9-029": (72.4, 70.4, 74.4),
    "L9-037": (1500000, 1400000, 1600000),
    "L9-040": (3500000, 3350000, 3650000),
    "L9-051": (890000, 850000, 930000),
    "L9-053": (51.7, 49.7, 53.7),
    "L9-055": (2100000, 2000000, 2200000),
    "L9-059": (680000, 650000, 710000),
    "L9-064": (1250000, 1200000, 1300000),
}

# L10 questions: {id: (expected_value, range_min, range_max, close_min, close_max, dir_min, dir_max)}
# range = full pass (score 1.0), close = partial (0.7), directional = partial (0.4)
L10_QUESTIONS = {
    "L10-015": (78, 70, 85, 65, 90, 60, 95),
    "L10-017": (75, 65, 85, 60, 90, 55, 95),
    "L10-022": (80, 70, 90, 65, 95, 60, 100),
    "L10-043": (72, 62, 82, 57, 87, 52, 92),
    "L10-047": (68, 58, 78, 53, 83, 48, 88),
    "L10-056": (85, 75, 95, 70, 100, 65, 105),
}

# L3/L5 questions: field-weighted match
# {id: {expected_values, required_fields, field_weights, synonyms, pass_threshold}}
L3_L5_QUESTIONS = {
    "L3-001": {
        "expected": {"intent": "bridge_and_swap", "order_type": "bridge", "asset": "USDC", "size": 1000, "venue": "bridge", "venue_name": "arbitrum bridge"},
        "required": ["intent", "order_type", "asset", "size", "venue"],
        "weights": {"intent": 0.18, "order_type": 0.16, "asset": 0.14, "size": 0.14, "venue": 0.12, "venue_name": 0.08, "risk_controls": 0.1, "follow_up": 0.04, "reasoning": 0.04},
        "synonyms": {"intent": ["action"], "order_type": ["bridge_type"], "venue": ["bridge", "platform", "protocol"], "venue_name": ["bridge_name"]},
        "pass_threshold": 0.7,
    },
    "L3-003": {
        "expected": {"intent": "bridge_and_swap", "order_type": "bridge", "asset": "ETH", "size": 2, "venue": "bridge", "venue_name": "polygon bridge"},
        "required": ["intent", "order_type", "asset", "size", "venue"],
        "weights": {"intent": 0.18, "order_type": 0.16, "asset": 0.14, "size": 0.14, "venue": 0.12, "venue_name": 0.08, "risk_controls": 0.1, "follow_up": 0.04, "reasoning": 0.04},
        "synonyms": {"intent": ["action"], "order_type": ["bridge_type"], "venue": ["bridge", "platform", "protocol"], "venue_name": ["bridge_name"]},
        "pass_threshold": 0.7,
    },
    "L5-003": {
        "expected": {"intent": "delta_neutral_yield", "order_type": "strategy", "asset": "ETH", "size": 5, "venue": "defi"},
        "required": ["intent", "order_type", "asset", "venue"],
        "weights": {"intent": 0.18, "order_type": 0.16, "asset": 0.12, "size": 0.1, "venue": 0.12, "venue_name": 0.1, "risk_controls": 0.1, "follow_up": 0.06, "reasoning": 0.06},
        "synonyms": {"intent": ["action"], "order_type": ["strategy", "trade_type"], "venue": ["platform", "exchange"], "venue_name": ["pool", "protocol"]},
        "pass_threshold": 0.7,
    },
}


def normalize_categorical(value: Any) -> str:
    """Match the TS grader's normalizeCategorical exactly."""
    if value is None:
        return ""
    s = str(value).lower()
    s = re.sub(r'[^a-z0-9%/.\-\s]', '', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s


def levenshtein_ratio(a: str, b: str) -> float:
    """Levenshtein similarity ratio (1.0 = identical, 0.0 = completely different)."""
    if not a and not b:
        return 1.0
    if not a or not b:
        return 0.0
    # Simple Levenshtein
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    dist = dp[m][n]
    return 1.0 - dist / max(m, n)


def fuzzy_score(expected: str, received: str, synonyms: list = None) -> float:
    """Return 1.0 for exact/synonym match, else levenshtein ratio."""
    exp_norm = normalize_categorical(expected)
    rec_norm = normalize_categorical(received)
    if not exp_norm:
        return 1.0  # empty expected = free point
    if exp_norm == rec_norm:
        return 1.0
    if synonyms:
        for syn in synonyms:
            if normalize_categorical(syn) == rec_norm:
                return 1.0
    return levenshtein_ratio(exp_norm, rec_norm)


def field_present(value: Any) -> bool:
    """Check if a field has meaningful content."""
    if value is None:
        return False
    if isinstance(value, str) and not value.strip():
        return False
    if isinstance(value, (list, dict)) and len(value) == 0:
        return False
    return True


def try_parse_json(text: str) -> Any:
    """Parse JSON with fallbacks (fenced code, regex extraction)."""
    if not text:
        return None
    text = text.strip()
    # Direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # Fenced code block
    m = re.search(r'```(?:json)?\s*\n?(.*?)\n?```', text, re.DOTALL)
    if m:
        try:
            return json.loads(m.group(1).strip())
        except json.JSONDecodeError:
            pass
    # Regex extract first JSON object
    m = re.search(r'\{.*\}', text, re.DOTALL)
    if m:
        try:
            return json.loads(m.group(0))
        except json.JSONDecodeError:
            pass
    return None


def grade_l9(question_id: str, response_text: str) -> dict:
    """Grade an L9 question: single numeric expected_value within range."""
    expected, range_min, range_max = L9_QUESTIONS[question_id]
    parsed = try_parse_json(response_text)
    if parsed is None or not isinstance(parsed, dict):
        return {"id": question_id, "score": 0.0, "pass": False, "detail": "json_parse_failed"}

    # Try to extract expected_value
    val = parsed.get("expected_value")
    if val is None:
        # Try common alternative field names
        for alt in ["value", "answer", "result", "capital", "cost"]:
            if alt in parsed:
                val = parsed[alt]
                break

    if val is None:
        return {"id": question_id, "score": 0.0, "pass": False, "detail": "no_expected_value"}

    try:
        num_val = float(val)
    except (TypeError, ValueError):
        return {"id": question_id, "score": 0.0, "pass": False, "detail": "non_numeric_value"}

    if range_min <= num_val <= range_max:
        return {"id": question_id, "score": 1.0, "pass": True, "detail": "in_range"}
    else:
        return {"id": question_id, "score": 0.0, "pass": False, "detail": f"out_of_range: {num_val} not in [{range_min}, {range_max}]"}


def grade_l10(question_id: str, response_text: str) -> dict:
    """Grade an L10 question: numeric with range + partial credit bands."""
    expected, range_min, range_max, close_min, close_max, dir_min, dir_max = L10_QUESTIONS[question_id]
    parsed = try_parse_json(response_text)
    if parsed is None or not isinstance(parsed, dict):
        return {"id": question_id, "score": 0.0, "pass": False, "detail": "json_parse_failed"}

    val = parsed.get("expected_value")
    if val is None:
        for alt in ["value", "answer", "result", "upside_capture", "capture"]:
            if alt in parsed:
                val = parsed[alt]
                break

    if val is None:
        return {"id": question_id, "score": 0.0, "pass": False, "detail": "no_expected_value"}

    try:
        num_val = float(val)
    except (TypeError, ValueError):
        return {"id": question_id, "score": 0.0, "pass": False, "detail": "non_numeric_value"}

    if range_min <= num_val <= range_max:
        return {"id": question_id, "score": 1.0, "pass": True, "detail": "in_primary_range"}
    elif close_min <= num_val <= close_max:
        return {"id": question_id, "score": 0.7, "pass": True, "detail": "close_match"}
    elif dir_min <= num_val <= dir_max:
        return {"id": question_id, "score": 0.4, "pass": False, "detail": "directionally_correct"}
    else:
        return {"id": question_id, "score": 0.0, "pass": False, "detail": f"out_of_range: {num_val}"}


def grade_l3_l5(question_id: str, response_text: str) -> dict:
    """Grade an L3/L5 question: field-weighted match with synonyms."""
    spec = L3_L5_QUESTIONS[question_id]
    expected = spec["expected"]
    required = spec["required"]
    weights = spec["weights"]
    synonyms = spec.get("synonyms", {})
    threshold = spec["pass_threshold"]

    parsed = try_parse_json(response_text)
    if parsed is None or not isinstance(parsed, dict):
        return {"id": question_id, "score": 0.0, "pass": False, "detail": "json_parse_failed"}

    # Check required fields exist
    for field in required:
        if not field_present(parsed.get(field)):
            return {"id": question_id, "score": 0.0, "pass": False, "detail": f"missing_required: {field}"}

    # Score each field
    total_score = 0.0
    max_possible = 0.0
    field_scores = {}

    for field, weight in weights.items():
        max_possible += weight
        exp_val = expected.get(field)
        rec_val = parsed.get(field)

        if exp_val is None:
            # Field not in expected — check if present (partial credit for optional fields)
            if field_present(rec_val):
                total_score += weight * 0.5  # half credit for presence
            continue

        # Numeric field
        if isinstance(exp_val, (int, float)):
            try:
                rec_num = float(rec_val)
                if abs(rec_num - exp_val) <= abs(exp_val) * 0.05:  # 5% tolerance
                    total_score += weight
                    field_scores[field] = 1.0
                else:
                    field_scores[field] = 0.0
            except (TypeError, ValueError):
                field_scores[field] = 0.0
        else:
            # String field — fuzzy match
            syns = synonyms.get(field, [])
            score = fuzzy_score(str(exp_val), str(rec_val) if rec_val is not None else "", syns)
            if score >= 0.8:
                total_score += weight
                field_scores[field] = score
            else:
                field_scores[field] = score

    normalized_score = total_score / max_possible if max_possible > 0 else 0.0
    passed = normalized_score >= threshold

    return {
        "id": question_id,
        "score": round(normalized_score, 4),
        "pass": passed,
        "detail": f"score={normalized_score:.3f} fields={field_scores}",
    }


def grade(question_id: str, response_text: str) -> dict:
    """Grade a single response. Returns {id, score, pass, detail}."""
    if question_id in L9_QUESTIONS:
        return grade_l9(question_id, response_text)
    elif question_id in L10_QUESTIONS:
        return grade_l10(question_id, response_text)
    elif question_id in L3_L5_QUESTIONS:
        return grade_l3_l5(question_id, response_text)
    else:
        return {"id": question_id, "score": 0.0, "pass": False, "detail": "unknown_question"}


def grade_batch(batch: list) -> list:
    """Grade a batch of {id, response} dicts. Returns list of grading results."""
    results = []
    for item in batch:
        qid = item.get("id", "?")
        resp = item.get("response", "")
        results.append(grade(qid, resp))
    return results


# The 22 training question IDs
TRAINING_IDS = list(L9_QUESTIONS.keys()) + list(L10_QUESTIONS.keys()) + list(L3_L5_QUESTIONS.keys())


if __name__ == "__main__":
    # Self-test
    print("=== Python Grader Self-Test ===")
    print(f"Training questions: {len(TRAINING_IDS)}")
    print(f"  L9: {len(L9_QUESTIONS)}, L10: {len(L10_QUESTIONS)}, L3/L5: {len(L3_L5_QUESTIONS)}")

    # Test L9 with correct answer
    r = grade("L9-005", json.dumps({"expected_value": 6200000}))
    print(f"\nL9-005 correct: {r}")

    # Test L9 with wrong answer
    r = grade("L9-005", json.dumps({"expected_value": 100}))
    print(f"L9-005 wrong: {r}")

    # Test L10 with correct answer
    r = grade("L10-015", json.dumps({"expected_value": 78}))
    print(f"\nL10-015 correct: {r}")

    # Test L10 with close match
    r = grade("L10-015", json.dumps({"expected_value": 67}))
    print(f"L10-015 close: {r}")

    # Test L3 with correct answer
    r = grade("L3-001", json.dumps({"intent": "bridge_and_swap", "order_type": "bridge", "asset": "USDC", "size": 1000, "venue": "bridge"}))
    print(f"\nL3-001 correct: {r}")

    # Test L3 with wrong answer
    r = grade("L3-001", json.dumps({"intent": "buy", "order_type": "market", "asset": "BTC", "size": 1, "venue": "cex"}))
    print(f"L3-001 wrong: {r}")

    # Test invalid JSON
    r = grade("L9-005", "not json at all")
    print(f"\nL9-005 invalid: {r}")

    print("\n✅ Self-test passed")
