#!/usr/bin/env python3
"""
grpo_sglang_glue.py — SGLang weight-sync for TRL GRPOTrainer.

THE PROBLEM: TRL's vllm_mode="server" auto-syncs weights only to vLLM servers
started via `trl vllm-serve`. A standalone SGLang server receives NO weight
updates — rollouts come from the frozen base model. Silent failure.

THE FIX: A TrainerCallback that, after each gradient step:
  1. Saves the LoRA adapter to disk
  2. Merges it into the base model
  3. Calls SGLang's weight-sync APIs:
     - POST /pause_generation
     - POST /update_weights_from_disk (with merged model path)
     - POST /continue_generation

This ensures rollouts come from the CURRENT policy (on-policy), which is
required for a valid null-reward contamination control (Lambert's gate).
"""
import os
import json
import time
import shutil
import requests
import torch
from pathlib import Path


class SGLangWeightSyncCallback:
    """TrainerCallback that syncs LoRA weights to SGLang after each step.

    Usage:
        callback = SGLangWeightSyncCallback(
            sglang_url="http://localhost:8000",
            base_model_path="/workspace/models/qwen3.6-27b",
            merged_output_path="/workspace/merged_model",
            lora_adapter_path="/workspace/out/grpo_lora",
            sync_every=1,  # sync after every step
        )
        trainer = GRPOTrainer(..., callbacks=[callback])
    """

    def __init__(
        self,
        sglang_url: str,
        base_model_path: str,
        merged_output_path: str,
        lora_adapter_path: str,
        sync_every: int = 1,
    ):
        self.sglang_url = sglang_url.rstrip("/")
        self.base_model_path = base_model_path
        self.merged_output_path = merged_output_path
        self.lora_adapter_path = lora_adapter_path
        self.sync_every = sync_every
        self.step_count = 0
        self.sync_log = []
        self._merged_model = None  # lazy-load, keep in CPU memory for fast merge

    def _save_lora_adapter(self, model, tokenizer):
        """Save the current LoRA adapter to disk."""
        from peft import PeftModel
        if isinstance(model, PeftModel):
            model.save_pretrained(self.lora_adapter_path)
        else:
            # Fallback: try to save via the trainer's model
            if hasattr(model, 'save_pretrained'):
                model.save_pretrained(self.lora_adapter_path)
        tokenizer.save_pretrained(self.lora_adapter_path)

    def _merge_lora_to_disk(self):
        """Merge the LoRA adapter into the base model and save to merged_output_path.

        Uses transformers + peft to merge, writes a full model directory.
        The merge is done on CPU to avoid GPU memory conflicts with training.
        """
        from transformers import AutoModelForCausalLM, AutoTokenizer
        from peft import PeftModel

        # Load base model on CPU (bfloat16, no GPU)
        base = AutoModelForCausalLM.from_pretrained(
            self.base_model_path,
            torch_dtype=torch.bfloat16,
            device_map="cpu",
            trust_remote_code=True,
        )
        # Apply LoRA
        merged = PeftModel.from_pretrained(base, self.lora_adapter_path)
        merged = merged.merge_and_unload()

        # Save to the merged output path
        os.makedirs(self.merged_output_path, exist_ok=True)
        merged.save_pretrained(self.merged_output_path, safe_serialization=True)
        del base, merged

        # Copy tokenizer/config files from base
        for fname in os.listdir(self.base_model_path):
            if fname.endswith(('.json', '.txt', '.model', '.py')) and not os.path.exists(
                os.path.join(self.merged_output_path, fname)
            ):
                shutil.copy2(
                    os.path.join(self.base_model_path, fname),
                    os.path.join(self.merged_output_path, fname),
                )

    def _call_sglang(self, endpoint: str, payload: dict = None) -> dict:
        """Call a SGLang server endpoint."""
        url = f"{self.sglang_url}{endpoint}"
        try:
            resp = requests.post(url, json=payload or {}, timeout=120)
            resp.raise_for_status()
            return resp.json() if resp.text else {}
        except Exception as e:
            return {"error": str(e)}

    def sync_weights(self):
        """Full weight-sync sequence: merge → pause → update → continue."""
        t0 = time.time()

        # Step 1: Merge LoRA into base model
        merge_t0 = time.time()
        self._merge_lora_to_disk()
        merge_dt = time.time() - merge_t0

        # Step 2: Pause generation
        pause_result = self._call_sglang("/pause_generation", {"mode": "abort"})

        # Step 3: Update weights from disk
        update_result = self._call_sglang("/update_weights_from_disk", {
            "model_path": self.merged_output_path,
            "load_format": None,
        })

        # Step 4: Continue generation
        continue_result = self._call_sglang("/continue_generation")

        total_dt = time.time() - t0
        success = "error" not in update_result

        log_entry = {
            "step": self.step_count,
            "merge_time_s": round(merge_dt, 1),
            "total_time_s": round(total_dt, 1),
            "success": success,
            "pause": "error" not in pause_result,
            "update": "error" not in update_result,
            "continue": "error" not in continue_result,
            "errors": [
                r.get("error") for r in [pause_result, update_result, continue_result]
                if "error" in r
            ],
        }
        self.sync_log.append(log_entry)
        print(f"  [weight-sync] step {self.step_count}: {'OK' if success else 'FAILED'} "
              f"({total_dt:.0f}s total, {merge_dt:.0f}s merge)")

        # Write sync log
        log_path = os.path.join(os.path.dirname(self.lora_adapter_path), "weight_sync_log.jsonl")
        with open(log_path, "a") as f:
            f.write(json.dumps(log_entry) + "\n")

        return success

    # ─── TrainerCallback interface ───
    def on_step_end(self, args, state, control, model=None, tokenizer=None, **kwargs):
        """Called by TRL after each gradient step."""
        self.step_count = state.global_step
        if self.step_count % self.sync_every != 0:
            return
        if model is not None and tokenizer is not None:
            self._save_lora_adapter(model, tokenizer)
        success = self.sync_weights()
        if not success:
            print(f"  [weight-sync] WARNING: sync failed at step {self.step_count}")
            # Don't stop training — log the failure and continue
            # The smoke test will detect if sync never works

    def on_train_end(self, args, state, control, model=None, tokenizer=None, **kwargs):
        """Final sync after training completes."""
        if model is not None and tokenizer is not None:
            self._save_lora_adapter(model, tokenizer)
        self.sync_weights()


def verify_weight_sync(sglang_url: str, probe_prompt: str) -> dict:
    """Verify that weight-sync actually changes the model's output.

    Called before and after a sync to confirm the output differs.
    If the output is byte-identical, weights aren't reaching SGLang.
    """
    url = sglang_url.rstrip("/") + "/v1/chat/completions"
    payload = {
        "model": "local-qwen36-27b-base",
        "messages": [{"role": "user", "content": probe_prompt}],
        "temperature": 0.0,  # greedy for determinism
        "max_tokens": 100,
    }
    try:
        resp = requests.post(url, json=payload, timeout=60)
        resp.raise_for_status()
        content = resp.json()["choices"][0]["message"]["content"]
        return {"content_hash": hash(content), "content_preview": content[:200]}
    except Exception as e:
        return {"error": str(e)}
