#!/usr/bin/env python3
"""Mechanical spend and promotion interlocks for Lenny Researcher.

The guard is intentionally small and provider-neutral. It never owns the research
loop. It records hash-bound receipts, launches the actual paid-provider command,
and refuses unsafe retries or promotions.
"""

from __future__ import annotations

import argparse
import fcntl
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any, Iterable


SCHEMA_VERSION = 1
RUN_ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$")
VOLATILE_JSON_KEYS = {
    "created_at",
    "createdAt",
    "generated_at",
    "generatedAt",
    "timestamp",
    "timestamps",
    "updated_at",
    "updatedAt",
}
CONTRACT_RECEIPTS = ("eval_trust", "comparability", "budget")
BUNDLE_RECEIPTS = ("validation", "isolated_grader", "replication")


class GuardRefusal(RuntimeError):
    """A fail-closed interlock refusal."""


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def canonical_json(value: Any) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def _strip_volatile_json(value: Any) -> Any:
    if isinstance(value, dict):
        return {
            key: _strip_volatile_json(item)
            for key, item in value.items()
            if key not in VOLATILE_JSON_KEYS
        }
    if isinstance(value, list):
        return [_strip_volatile_json(item) for item in value]
    return value


def semantic_bytes(path: Path) -> bytes:
    raw = path.read_bytes()
    if path.suffix.lower() != ".json":
        return raw
    try:
        value = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise GuardRefusal(f"invalid JSON identity document: {path}: {exc}") from exc
    return canonical_json(_strip_volatile_json(value))


def semantic_hash(path: Path) -> str:
    return sha256_bytes(semantic_bytes(path))


def decimal_value(raw: str, label: str) -> Decimal:
    try:
        value = Decimal(raw)
    except InvalidOperation as exc:
        raise GuardRefusal(f"{label} must be a decimal number") from exc
    if not value.is_finite() or value < 0:
        raise GuardRefusal(f"{label} must be finite and non-negative")
    return value


def run_dir(store_root: Path, run_id: str) -> Path:
    if not RUN_ID_RE.fullmatch(run_id):
        raise GuardRefusal("run id must use only letters, numbers, dot, dash, or underscore")
    return store_root.resolve() / run_id


def events_path(store_root: Path, run_id: str) -> Path:
    return run_dir(store_root, run_id) / "events.jsonl"


def load_events(store_root: Path, run_id: str) -> list[dict[str, Any]]:
    path = events_path(store_root, run_id)
    if not path.exists():
        return []
    events: list[dict[str, Any]] = []
    previous = None
    for line_number, line in enumerate(path.read_text().splitlines(), 1):
        if not line.strip():
            raise GuardRefusal(f"blank event line at {path}:{line_number}")
        event = json.loads(line)
        supplied_hash = event.pop("eventHash", None)
        calculated_hash = sha256_bytes(canonical_json(event))
        if supplied_hash != calculated_hash:
            raise GuardRefusal(f"event hash mismatch at {path}:{line_number}")
        if event.get("previousHash") != previous:
            raise GuardRefusal(f"event chain mismatch at {path}:{line_number}")
        event["eventHash"] = supplied_hash
        events.append(event)
        previous = supplied_hash
    return events


def append_event(store_root: Path, run_id: str, event_type: str, data: dict[str, Any]) -> dict[str, Any]:
    directory = run_dir(store_root, run_id)
    directory.mkdir(parents=True, exist_ok=True)
    path = directory / "events.jsonl"
    with path.open("a+", encoding="utf-8") as handle:
        fcntl.flock(handle.fileno(), fcntl.LOCK_EX)
        handle.seek(0)
        lines = handle.read().splitlines()
        previous = None
        if lines:
            last = json.loads(lines[-1])
            previous = last.get("eventHash")
            # Validate the whole chain before extending it.
            load_events(store_root, run_id)
        event = {
            "schemaVersion": SCHEMA_VERSION,
            "sequence": len(lines) + 1,
            "recordedAt": utc_now(),
            "runId": run_id,
            "type": event_type,
            "previousHash": previous,
            "data": data,
        }
        event["eventHash"] = sha256_bytes(canonical_json(event))
        handle.seek(0, os.SEEK_END)
        handle.write(json.dumps(event, sort_keys=True, separators=(",", ":")) + "\n")
        handle.flush()
        os.fsync(handle.fileno())
        return event


def store_artifact(store_root: Path, run_id: str, source: Path) -> str:
    raw = source.read_bytes()
    digest = sha256_bytes(raw)
    target_dir = run_dir(store_root, run_id) / "artifacts" / "sha256"
    target_dir.mkdir(parents=True, exist_ok=True)
    target = target_dir / digest
    if not target.exists():
        try:
            fd = os.open(target, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        except FileExistsError:
            pass
        else:
            with os.fdopen(fd, "wb") as handle:
                handle.write(raw)
                handle.flush()
                os.fsync(handle.fileno())
    if target.read_bytes() != raw:
        raise GuardRefusal(f"artifact collision or corruption for {digest}")
    return digest


def require_initialized(events: list[dict[str, Any]]) -> dict[str, Any]:
    initialized = [event for event in events if event["type"] == "run_initialized"]
    if len(initialized) != 1:
        raise GuardRefusal("run must have exactly one run_initialized event")
    return initialized[0]


def latest_receipt(events: Iterable[dict[str, Any]], kind: str, subject_hash: str) -> dict[str, Any] | None:
    matching = [
        event
        for event in events
        if event["type"] == "receipt_recorded"
        and event["data"].get("kind") == kind
        and event["data"].get("subjectSemanticHash") == subject_hash
    ]
    return matching[-1] if matching else None


def require_receipts(events: list[dict[str, Any]], kinds: Iterable[str], subject_hash: str) -> None:
    missing = [kind for kind in kinds if latest_receipt(events, kind, subject_hash) is None]
    if missing:
        raise GuardRefusal(
            f"required receipts missing for semantic hash {subject_hash}: {', '.join(missing)}"
        )


def active_or_ambiguous_submit(events: list[dict[str, Any]]) -> str | None:
    intents = {
        event["data"]["idempotencyKey"]: event
        for event in events
        if event["type"] == "paid_submit_intent"
    }
    closed: set[str] = set()
    active: set[str] = set()
    ambiguous: set[str] = set()
    for event in events:
        key = event["data"].get("idempotencyKey")
        if not key:
            continue
        if event["type"] == "paid_submit_succeeded":
            active.add(key)
        elif event["type"] == "paid_submit_ambiguous":
            ambiguous.add(key)
        elif event["type"] == "submit_resolved":
            outcome = event["data"]["outcome"]
            if outcome == "active":
                active.add(key)
                ambiguous.discard(key)
            else:
                closed.add(key)
                active.discard(key)
                ambiguous.discard(key)
        elif event["type"] == "teardown_verified":
            closed.add(key)
            active.discard(key)
            ambiguous.discard(key)
    for key in intents:
        if key not in closed and key not in active and key not in ambiguous:
            ambiguous.add(key)  # crash after intent, before outcome
    unresolved = sorted((active | ambiguous) - closed)
    return unresolved[0] if unresolved else None


def committed_cost(events: list[dict[str, Any]]) -> Decimal:
    intents: dict[str, Decimal] = {}
    actuals: dict[str, Decimal] = {}
    for event in events:
        key = event["data"].get("idempotencyKey")
        if event["type"] == "paid_submit_intent":
            intents[key] = Decimal(event["data"]["reservedCost"])
        elif event["type"] in {"submit_resolved", "teardown_verified"}:
            actual = event["data"].get("actualCost")
            if actual is not None:
                actuals[key] = Decimal(actual)
    return sum((actuals.get(key, reserved) for key, reserved in intents.items()), Decimal("0"))


def init_run(store_root: Path, run_id: str, budget_ceiling: Decimal) -> None:
    path = events_path(store_root, run_id)
    if path.exists() and path.stat().st_size:
        raise GuardRefusal("run already exists; the event ledger is append-only")
    append_event(
        store_root,
        run_id,
        "run_initialized",
        {"budgetCeiling": str(budget_ceiling), "profile": "post_training_advanced"},
    )


def record_receipt(
    store_root: Path,
    run_id: str,
    kind: str,
    subject: Path,
    payload: Path | None = None,
) -> None:
    events = load_events(store_root, run_id)
    require_initialized(events)
    subject_artifact = store_artifact(store_root, run_id, subject)
    data: dict[str, Any] = {
        "kind": kind,
        "subjectSemanticHash": semantic_hash(subject),
        "subjectArtifactHash": subject_artifact,
    }
    if payload is not None:
        data["payloadArtifactHash"] = store_artifact(store_root, run_id, payload)
    append_event(store_root, run_id, "receipt_recorded", data)


def run_paid(
    store_root: Path,
    run_id: str,
    contract: Path,
    evaluator: Path,
    estimated_cost: Decimal,
    balance: Decimal,
    idempotency_key: str,
    label: str,
    command: list[str],
) -> int:
    if not command:
        raise GuardRefusal("paid command is required after --")
    events = load_events(store_root, run_id)
    initialized = require_initialized(events)
    if any(
        event["data"].get("idempotencyKey") == idempotency_key
        for event in events
        if event["type"] == "paid_submit_intent"
    ):
        raise GuardRefusal(f"idempotency key already used: {idempotency_key}")
    unresolved = active_or_ambiguous_submit(events)
    if unresolved:
        raise GuardRefusal(f"submit {unresolved} is active or ambiguous; resolve/teardown it first")

    contract_hash = semantic_hash(contract)
    evaluator_hash = semantic_hash(evaluator)
    executor_hash = semantic_hash(Path(__file__))
    require_receipts(events, CONTRACT_RECEIPTS, contract_hash)
    require_receipts(events, ("evaluator_attack",), evaluator_hash)
    require_receipts(events, ("executor_conformance",), executor_hash)

    ceiling = Decimal(initialized["data"]["budgetCeiling"])
    committed = committed_cost(events)
    reserved = estimated_cost * Decimal("1.5")
    if committed + reserved > ceiling:
        raise GuardRefusal(
            f"budget ceiling exceeded: committed {committed} + reserve {reserved} > {ceiling}"
        )
    if reserved > balance:
        raise GuardRefusal(f"provider balance {balance} is below required reserve {reserved}")

    command_digest = sha256_bytes(canonical_json(command))
    append_event(
        store_root,
        run_id,
        "paid_submit_intent",
        {
            "idempotencyKey": idempotency_key,
            "label": label,
            "contractSemanticHash": contract_hash,
            "evaluatorSemanticHash": evaluator_hash,
            "commandDigest": command_digest,
            "estimatedCost": str(estimated_cost),
            "reservedCost": str(reserved),
        },
    )
    result = subprocess.run(command, check=False)
    event_type = "paid_submit_succeeded" if result.returncode == 0 else "paid_submit_ambiguous"
    append_event(
        store_root,
        run_id,
        event_type,
        {"idempotencyKey": idempotency_key, "exitCode": result.returncode},
    )
    return result.returncode


def resolve_submit(
    store_root: Path,
    run_id: str,
    idempotency_key: str,
    outcome: str,
    actual_cost: Decimal,
    proof: Path,
) -> None:
    events = load_events(store_root, run_id)
    require_initialized(events)
    if not any(
        event["type"] == "paid_submit_intent"
        and event["data"].get("idempotencyKey") == idempotency_key
        for event in events
    ):
        raise GuardRefusal(f"unknown submit idempotency key: {idempotency_key}")
    if any(
        event["data"].get("idempotencyKey") == idempotency_key
        for event in events
        if event["type"] in {"submit_resolved", "teardown_verified"}
    ):
        raise GuardRefusal(f"submit already resolved: {idempotency_key}")
    append_event(
        store_root,
        run_id,
        "submit_resolved",
        {
            "idempotencyKey": idempotency_key,
            "outcome": outcome,
            "actualCost": str(actual_cost),
            "proofArtifactHash": store_artifact(store_root, run_id, proof),
        },
    )


def verified_teardown(
    store_root: Path,
    run_id: str,
    idempotency_key: str,
    actual_cost: Decimal,
    teardown_command: list[str],
    verify_command: list[str],
) -> int:
    events = load_events(store_root, run_id)
    require_initialized(events)
    if not any(
        event["type"] == "paid_submit_intent"
        and event["data"].get("idempotencyKey") == idempotency_key
        for event in events
    ):
        raise GuardRefusal(f"unknown submit idempotency key: {idempotency_key}")
    if any(
        event["type"] == "teardown_verified"
        and event["data"].get("idempotencyKey") == idempotency_key
        for event in events
    ):
        raise GuardRefusal(f"teardown already verified: {idempotency_key}")
    if not teardown_command or not verify_command:
        raise GuardRefusal("both teardown and independent verification commands are required")
    teardown = subprocess.run(teardown_command, check=False)
    if teardown.returncode != 0:
        append_event(
            store_root,
            run_id,
            "teardown_failed",
            {"idempotencyKey": idempotency_key, "exitCode": teardown.returncode},
        )
        return teardown.returncode
    verification = subprocess.run(verify_command, check=False)
    if verification.returncode != 0:
        append_event(
            store_root,
            run_id,
            "teardown_unverified",
            {"idempotencyKey": idempotency_key, "exitCode": verification.returncode},
        )
        return verification.returncode
    append_event(
        store_root,
        run_id,
        "teardown_verified",
        {"idempotencyKey": idempotency_key, "actualCost": str(actual_cost)},
    )
    return 0


def authorize_promotion(
    store_root: Path,
    run_id: str,
    bundle: Path,
    contract: Path,
    evaluator: Path,
    human_approval: Path,
) -> None:
    events = load_events(store_root, run_id)
    require_initialized(events)
    unresolved = active_or_ambiguous_submit(events)
    if unresolved:
        raise GuardRefusal(f"submit {unresolved} is active or ambiguous; promotion is blocked")
    bundle_hash = semantic_hash(bundle)
    contract_hash = semantic_hash(contract)
    evaluator_hash = semantic_hash(evaluator)
    require_receipts(events, BUNDLE_RECEIPTS, bundle_hash)
    require_receipts(events, ("comparability",), contract_hash)
    require_receipts(events, ("evaluator_attack",), evaluator_hash)
    if any(
        event["type"] == "promotion_authorized"
        and event["data"].get("bundleSemanticHash") == bundle_hash
        for event in events
    ):
        raise GuardRefusal("promotion already authorized for this candidate bundle")
    try:
        approval = json.loads(human_approval.read_bytes())
    except json.JSONDecodeError as exc:
        raise GuardRefusal(f"invalid human approval JSON: {exc}") from exc
    if approval.get("decision") != "approve":
        raise GuardRefusal("human approval decision must be 'approve'")
    if approval.get("bundle_sha256") != bundle_hash:
        raise GuardRefusal("human approval is not bound to the exact semantic bundle hash")
    if not str(approval.get("approved_by", "")).strip():
        raise GuardRefusal("human approval must name approved_by")
    append_event(
        store_root,
        run_id,
        "promotion_authorized",
        {
            "bundleSemanticHash": bundle_hash,
            "bundleArtifactHash": store_artifact(store_root, run_id, bundle),
            "approvalArtifactHash": store_artifact(store_root, run_id, human_approval),
            "contractSemanticHash": contract_hash,
            "evaluatorSemanticHash": evaluator_hash,
        },
    )


def run_conformance_checks() -> None:
    """Zero-spend proof of refusal, crash/retry, teardown, and promotion paths."""
    with tempfile.TemporaryDirectory() as raw_root:
        root = Path(raw_root)
        run_id = "conformance"
        contract = root / "contract.json"
        evaluator_v1 = root / "evaluator-v1.json"
        evaluator_v2 = root / "evaluator-v2.json"
        bundle = root / "bundle.json"
        approval = root / "approval.json"
        for path, value in (
            (contract, {"goal": "test", "generatedAt": "ignored"}),
            (evaluator_v1, {"grader": "v1"}),
            (evaluator_v2, {"grader": "v2"}),
            (bundle, {"candidate": "abc"}),
        ):
            path.write_text(json.dumps(value))
        contract_copy = root / "contract-copy.json"
        contract_copy.write_text(json.dumps({"goal": "test", "generatedAt": "different"}))
        if semantic_hash(contract) != semantic_hash(contract_copy):
            raise GuardRefusal("conformance failed: volatile metadata changed semantic identity")
        init_run(root, run_id, Decimal("10"))
        try:
            run_paid(
                root,
                run_id,
                contract,
                evaluator_v1,
                Decimal("1"),
                Decimal("10"),
                "submit-missing-receipts",
                "must refuse missing receipts",
                [sys.executable, "-c", "raise SystemExit(0)"],
            )
        except GuardRefusal:
            pass
        else:
            raise GuardRefusal("conformance failed: missing-receipt refusal did not fire")
        for kind in CONTRACT_RECEIPTS:
            record_receipt(root, run_id, kind, contract)
        record_receipt(root, run_id, "evaluator_attack", evaluator_v1)
        record_receipt(root, run_id, "executor_conformance", Path(__file__))

        try:
            run_paid(
                root,
                run_id,
                contract,
                evaluator_v1,
                Decimal("8"),
                Decimal("100"),
                "submit-over-budget",
                "must refuse budget reserve",
                [sys.executable, "-c", "raise SystemExit(0)"],
            )
        except GuardRefusal:
            pass
        else:
            raise GuardRefusal("conformance failed: budget-ceiling refusal did not fire")

        code = run_paid(
            root,
            run_id,
            contract,
            evaluator_v1,
            Decimal("1"),
            Decimal("10"),
            "submit-1",
            "zero-cost fake",
            [sys.executable, "-c", "raise SystemExit(0)"],
        )
        if code != 0:
            raise GuardRefusal("conformance submit failed")
        try:
            run_paid(
                root,
                run_id,
                contract,
                evaluator_v1,
                Decimal("1"),
                Decimal("10"),
                "submit-2",
                "must refuse while active",
                [sys.executable, "-c", "raise SystemExit(0)"],
            )
        except GuardRefusal:
            pass
        else:
            raise GuardRefusal("conformance failed: active-submit refusal did not fire")
        code = verified_teardown(
            root,
            run_id,
            "submit-1",
            Decimal("0"),
            [sys.executable, "-c", "raise SystemExit(0)"],
            [sys.executable, "-c", "raise SystemExit(0)"],
        )
        if code != 0:
            raise GuardRefusal("conformance teardown failed")
        try:
            run_paid(
                root,
                run_id,
                contract,
                evaluator_v1,
                Decimal("1"),
                Decimal("10"),
                "submit-1",
                "must refuse duplicate key",
                [sys.executable, "-c", "raise SystemExit(0)"],
            )
        except GuardRefusal:
            pass
        else:
            raise GuardRefusal("conformance failed: duplicate idempotency key did not refuse")

        append_event(
            root,
            run_id,
            "paid_submit_intent",
            {
                "idempotencyKey": "submit-crash",
                "label": "simulated crash after intent",
                "contractSemanticHash": semantic_hash(contract),
                "evaluatorSemanticHash": semantic_hash(evaluator_v1),
                "commandDigest": "0" * 64,
                "estimatedCost": "1",
                "reservedCost": "1.5",
            },
        )
        try:
            run_paid(
                root,
                run_id,
                contract,
                evaluator_v1,
                Decimal("1"),
                Decimal("10"),
                "submit-2",
                "must refuse after crash",
                [sys.executable, "-c", "raise SystemExit(0)"],
            )
        except GuardRefusal:
            pass
        else:
            raise GuardRefusal("conformance failed: crash recovery refusal did not fire")
        proof = root / "provider-proof.json"
        proof.write_text(json.dumps({"state": "not-created"}))
        resolve_submit(root, run_id, "submit-crash", "not-created", Decimal("0"), proof)

        try:
            run_paid(
                root,
                run_id,
                contract,
                evaluator_v2,
                Decimal("1"),
                Decimal("10"),
                "submit-2",
                "must refuse changed evaluator",
                [sys.executable, "-c", "raise SystemExit(0)"],
            )
        except GuardRefusal:
            pass
        else:
            raise GuardRefusal("conformance failed: evaluator-change refusal did not fire")

        for kind in BUNDLE_RECEIPTS:
            record_receipt(root, run_id, kind, bundle)
        wrong = {"decision": "approve", "bundle_sha256": "0" * 64, "approved_by": "human"}
        approval.write_text(json.dumps(wrong))
        try:
            authorize_promotion(root, run_id, bundle, contract, evaluator_v1, approval)
        except GuardRefusal:
            pass
        else:
            raise GuardRefusal("conformance failed: mismatched human approval did not refuse")
        approval.write_text(
            json.dumps(
                {"decision": "approve", "bundle_sha256": semantic_hash(bundle), "approved_by": "human"}
            )
        )
        authorize_promotion(root, run_id, bundle, contract, evaluator_v1, approval)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command_name", required=True)

    identity = subparsers.add_parser("hash")
    identity.add_argument("--subject", type=Path, required=True)

    init = subparsers.add_parser("init")
    init.add_argument("--store-root", type=Path, required=True)
    init.add_argument("--run-id", required=True)
    init.add_argument("--budget-ceiling", required=True)

    receipt = subparsers.add_parser("receipt")
    receipt.add_argument("--store-root", type=Path, required=True)
    receipt.add_argument("--run-id", required=True)
    receipt.add_argument(
        "--kind",
        required=True,
        choices=CONTRACT_RECEIPTS
        + BUNDLE_RECEIPTS
        + ("evaluator_attack", "executor_conformance", "phase_live_qa"),
    )
    receipt.add_argument("--subject", type=Path, required=True)
    receipt.add_argument("--payload", type=Path)

    paid = subparsers.add_parser("run-paid")
    paid.add_argument("--store-root", type=Path, required=True)
    paid.add_argument("--run-id", required=True)
    paid.add_argument("--contract", type=Path, required=True)
    paid.add_argument("--evaluator", type=Path, required=True)
    paid.add_argument("--estimated-cost", required=True)
    paid.add_argument("--balance", required=True)
    paid.add_argument("--idempotency-key", required=True)
    paid.add_argument("--label", required=True)
    paid.add_argument("provider_command", nargs=argparse.REMAINDER)

    resolve = subparsers.add_parser("resolve-submit")
    resolve.add_argument("--store-root", type=Path, required=True)
    resolve.add_argument("--run-id", required=True)
    resolve.add_argument("--idempotency-key", required=True)
    resolve.add_argument("--outcome", choices=("active", "not-created", "terminated"), required=True)
    resolve.add_argument("--actual-cost", required=True)
    resolve.add_argument("--proof", type=Path, required=True)

    teardown = subparsers.add_parser("teardown")
    teardown.add_argument("--store-root", type=Path, required=True)
    teardown.add_argument("--run-id", required=True)
    teardown.add_argument("--idempotency-key", required=True)
    teardown.add_argument("--actual-cost", required=True)
    teardown.add_argument("--verify-command-json", type=Path, required=True)
    teardown.add_argument("provider_command", nargs=argparse.REMAINDER)

    promote = subparsers.add_parser("promote")
    promote.add_argument("--store-root", type=Path, required=True)
    promote.add_argument("--run-id", required=True)
    promote.add_argument("--bundle", type=Path, required=True)
    promote.add_argument("--contract", type=Path, required=True)
    promote.add_argument("--evaluator", type=Path, required=True)
    promote.add_argument("--human-approval", type=Path, required=True)

    conformance = subparsers.add_parser("conformance")
    conformance.add_argument("--store-root", type=Path, required=True)
    conformance.add_argument("--run-id", required=True)
    return parser


def strip_separator(command: list[str]) -> list[str]:
    return command[1:] if command and command[0] == "--" else command


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        if args.command_name == "hash":
            print(semantic_hash(args.subject))
        elif args.command_name == "init":
            init_run(args.store_root, args.run_id, decimal_value(args.budget_ceiling, "budget ceiling"))
        elif args.command_name == "receipt":
            record_receipt(args.store_root, args.run_id, args.kind, args.subject, args.payload)
        elif args.command_name == "run-paid":
            return run_paid(
                args.store_root,
                args.run_id,
                args.contract,
                args.evaluator,
                decimal_value(args.estimated_cost, "estimated cost"),
                decimal_value(args.balance, "balance"),
                args.idempotency_key,
                args.label,
                strip_separator(args.provider_command),
            )
        elif args.command_name == "resolve-submit":
            resolve_submit(
                args.store_root,
                args.run_id,
                args.idempotency_key,
                args.outcome,
                decimal_value(args.actual_cost, "actual cost"),
                args.proof,
            )
        elif args.command_name == "teardown":
            verify_command = json.loads(args.verify_command_json.read_text())
            if not isinstance(verify_command, list) or not all(isinstance(item, str) for item in verify_command):
                raise GuardRefusal("verify command JSON must be an array of strings")
            return verified_teardown(
                args.store_root,
                args.run_id,
                args.idempotency_key,
                decimal_value(args.actual_cost, "actual cost"),
                strip_separator(args.provider_command),
                verify_command,
            )
        elif args.command_name == "promote":
            authorize_promotion(
                args.store_root,
                args.run_id,
                args.bundle,
                args.contract,
                args.evaluator,
                args.human_approval,
            )
        elif args.command_name == "conformance":
            events = load_events(args.store_root, args.run_id)
            require_initialized(events)
            run_conformance_checks()
            record_receipt(args.store_root, args.run_id, "executor_conformance", Path(__file__))
        return 0
    except (GuardRefusal, FileNotFoundError, PermissionError, json.JSONDecodeError) as exc:
        print(f"INTERLOCK REFUSED: {exc}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
