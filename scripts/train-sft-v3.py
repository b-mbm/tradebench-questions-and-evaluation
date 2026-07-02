#!/usr/bin/env python3
"""SFT v3 training script — QLoRA on Qwen3.6-27B with corrected eval-format data.
Same recipe as v2 (r=32, alpha=64, 2 epochs, completion-only loss) but with
the Execute@1 system prompt and eval-format user prompts.

Run on RunPod H100 with the training data at /workspace/training/sft-1500q-v3/
"""
import os, json, torch
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, DataCollatorForSeq2Seq
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer, SFTConfig
from datasets import Dataset
from bitsandbytes import BitsAndBytesConfig

MODEL_PATH = "/workspace/models/qwen3.6-27b"
TRAIN_FILE = "/workspace/training/sft-1500q-v3/train.jsonl"
VAL_FILE = "/workspace/training/sft-1500q-v3/val.jsonl"
OUTPUT_DIR = "/workspace/out/sft-v3"
MERGED_DIR = "/workspace/out/sft-v3-merged"

print("=== SFT v3 TRAINING ===")
print(f"Model: {MODEL_PATH}")
print(f"Train: {TRAIN_FILE}")
print(f"Val: {VAL_FILE}")
print(f"Output: {OUTPUT_DIR}")

# Load data
train_rows = [json.loads(l) for l in open(TRAIN_FILE)]
val_rows = [json.loads(l) for l in open(VAL_FILE)]
print(f"Train: {len(train_rows)}, Val: {len(val_rows)}")

train_ds = Dataset.from_list([{"messages": r["messages"]} for r in train_rows])
val_ds = Dataset.from_list([{"messages": r["messages"]} for r in val_rows])

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH, trust_remote_code=True)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token
print(f"Tokenizer loaded: {tokenizer.model_type}")

# Load model in 4-bit (QLoRA)
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,
)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_PATH,
    quantization_config=bnb_config,
    device_map="auto",
    trust_remote_code=True,
    torch_dtype=torch.bfloat16,
)
model = prepare_model_for_kbit_training(model)
print(f"Model loaded in 4-bit. Param count: {sum(p.numel() for p in model.parameters())/1e9:.1f}B")

# LoRA config (identical to v2)
lora_config = LoraConfig(
    r=32,
    lora_alpha=64,
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()

# Training config (identical to v2)
sft_config = SFTConfig(
    output_dir=OUTPUT_DIR,
    num_train_epochs=2,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=8,
    learning_rate=1e-4,
    lr_scheduler_type="cosine",
    warmup_ratio=0.03,
    logging_steps=10,
    eval_strategy="steps",
    eval_steps=100,
    save_strategy="steps",
    save_steps=100,
    save_total_limit=3,
    bf16=True,
    gradient_checkpointing=True,
    optim="paged_adamw_8bit",
    max_seq_length=4096,
    dataset_text_field=None,  # use messages format
    completion_only_loss=True,  # mask prompt, train only on assistant response
    report_to="none",
)

# Trainer
trainer = SFTTrainer(
    model=model,
    args=sft_config,
    train_dataset=train_ds,
    eval_dataset=val_ds,
    processing_class=tokenizer,
)

print("\n=== STARTING TRAINING ===")
trainer.train()

# Save adapter
trainer.save_model(OUTPUT_DIR)
print(f"\n=== ADAPTER SAVED to {OUTPUT_DIR} ===")

# Also save the merged model for serving
print("Merging adapter for serving...")
merged = model.merge_and_unload()
merged.save_pretrained(MERGED_DIR, safe_serialization=True)
tokenizer.save_pretrained(MERGED_DIR)
print(f"=== MERGED MODEL SAVED to {MERGED_DIR} ===")
print("\n=== TRAINING COMPLETE ===")
