#!/usr/bin/env python3
"""Convert SFT v2 training data to v3 format:
1. Swap system prompt: "AIX" → "Execute@1" + ExecuteOneResponse interface
2. Wrap user prompts in eval format (Question ID / Level / Output Requirements)
3. Keep all 1855 examples, same skills, same answers — just the eval format

The assistant answers stay exactly the same (same JSON content).
Only the system and user messages change format.
"""
import json, os, copy

SRC_DIR = os.path.expanduser("~/Documents/tradebench-lite-tests/training/sft-1500q-v2")
DST_DIR = os.path.expanduser("~/Documents/tradebench-lite-tests/training/sft-1500q-v3")
os.makedirs(DST_DIR, exist_ok=True)

# The EXACT eval system prompt (from prompts-300q.json)
EVAL_SYSTEM = """You are Execute@1, a deterministic trading execution assistant.

Return ONLY JSON. Do not include explanations outside of JSON.

You must respond with a valid JSON object matching this TypeScript interface:

interface ExecuteOneResponse {
  intent: string;
  order_type: string;
  asset: string;
  size: string | number;
  unit?: string;  // denomination of size (e.g., "usd", "btc", "eth")
  price?: string | number;
  venue: string;
  venue_name?: string;
  risk_controls: {
    stop_loss?: string | number;
    take_profit?: string | number;
    slippage_tolerance?: string | number;
    max_gas?: string | number;
    position_size_limit?: string | number;
  };
  follow_up?: string;
  reasoning?: string;
  requires_follow_up?: boolean;
  follow_up_description?: string;
}

Example 1:
{
  "intent": "buy",
  "order_type": "market",
  "asset": "BTC",
  "size": "0.5",
  "venue": "coinbase",
  "risk_controls": {
    "slippage_tolerance": "0.5%"
  },
  "follow_up": "confirm fill",
  "reasoning": "market order for immediate execution"
}

Example 2:
{
  "intent": "swap",
  "order_type": "dex",
  "asset": "DAI",
  "size": "5000",
  "price": "pool spot",
  "venue": "dex",
  "venue_name": "uniswap",
  "risk_controls": {
    "slippage_tolerance": "1%",
    "max_gas": "40 gwei"
  },
  "follow_up": "monitor pool depth",
  "reasoning": "route via largest pool"
}"""

def convert_user_prompt(original_user, meta):
    """Wrap the training question in the eval user prompt format."""
    tier = meta.get("tier", "?")
    # Map tier to level number
    level_map = {"L1": 1, "L2": 2, "L3": 3, "L4": 4, "L5": 5, "L6": 6, "L7": 7, "L8": 8,
                 "L9": 9, "L10": 10, "AGI": 11}
    level = level_map.get(tier, 11)

    # Generate a unique-ish question ID for the training example
    gen_id = meta.get("generated_id", meta.get("archetype_id", "TRAIN"))
    qid = f"TRAIN-{gen_id}"

    # Build the eval-style user prompt
    wrapped = f"""Question ID: {qid}
Level: {level}

Prompt:
{original_user}

Respond with a valid JSON object matching ExecuteOneResponse. Do not wrap in markdown fences."""
    return wrapped


def convert_split(split_name, filename):
    src_path = os.path.join(SRC_DIR, filename)
    dst_path = os.path.join(DST_DIR, filename)

    rows = [json.loads(l) for l in open(src_path)]
    converted = []

    for r in rows:
        messages = r.get("messages", [])
        if len(messages) < 3:
            converted.append(r)  # skip malformed
            continue

        meta = r.get("meta", {})
        original_user = messages[1]["content"]
        original_assistant = messages[2]["content"]

        # Build the v3 messages
        new_messages = [
            {"role": "system", "content": EVAL_SYSTEM},
            {"role": "user", "content": convert_user_prompt(original_user, meta)},
            {"role": "assistant", "content": original_assistant},  # answer unchanged
        ]

        new_row = {"messages": new_messages, "meta": meta}
        converted.append(new_row)

    with open(dst_path, "w") as f:
        for r in converted:
            f.write(json.dumps(r) + "\n")

    print(f"{split_name}: {len(converted)} examples written to {dst_path}")
    return converted


# Convert train + val
train = convert_split("train", "train.jsonl")
val = convert_split("val", "val.jsonl")

# Also convert the SMC format ({prompt, completion}) if it exists
smc_train_src = os.path.join(SRC_DIR, "smc", "train.jsonl")
if os.path.exists(smc_train_src):
    smc_dst = os.path.join(DST_DIR, "smc")
    os.makedirs(smc_dst, exist_ok=True)

    smc_rows = [json.loads(l) for l in open(smc_train_src)]
    smc_converted = []
    for r in smc_rows:
        prompt = r.get("prompt", "")
        completion = r.get("completion", "")

        # Reconstruct from messages if available, otherwise just swap system
        new_prompt = EVAL_SYSTEM + "\n\n" + prompt
        smc_converted.append({"prompt": new_prompt, "completion": completion})

    with open(os.path.join(smc_dst, "train.jsonl"), "w") as f:
        for r in smc_converted:
            f.write(json.dumps(r) + "\n")
    print(f"smc/train: {len(smc_converted)} examples")

    # val too
    smc_val_src = os.path.join(SRC_DIR, "smc", "val.jsonl")
    if os.path.exists(smc_val_src):
        smc_val_rows = [json.loads(l) for l in open(smc_val_src)]
        smc_val_converted = []
        for r in smc_val_rows:
            prompt = r.get("prompt", "")
            completion = r.get("completion", "")
            new_prompt = EVAL_SYSTEM + "\n\n" + prompt
            smc_val_converted.append({"prompt": new_prompt, "completion": completion})
        with open(os.path.join(smc_dst, "val.jsonl"), "w") as f:
            for r in smc_val_converted:
                f.write(json.dumps(r) + "\n")
        print(f"smc/val: {len(smc_val_converted)} examples")

# Verify
print(f"\n=== VERIFICATION ===")
sample = train[0]
print(f"System prompt match: {sample['messages'][0]['content'][:50]}... == 'You are Execute@1...'")
print(f"User prompt starts with 'Question ID': {sample['messages'][1]['content'][:15]}")
print(f"Assistant unchanged: {sample['messages'][2]['content'][:50]}...")
