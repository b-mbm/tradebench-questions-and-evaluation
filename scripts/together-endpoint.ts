#!/usr/bin/env tsx
import "dotenv/config";

const BASE = process.env.TOGETHER_BASE_URL || "https://api.together.xyz/v1";
const KEY = process.env.TOGETHER_API_KEY;

async function request(method: string, path: string, body?: unknown) {
  if (!KEY) throw new Error("TOGETHER_API_KEY is required");
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`${method} ${path} ${res.status}: ${text}`);
  return json;
}

async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  if (cmd === "list") {
    console.log(JSON.stringify(await request("GET", "/endpoints"), null, 2));
    return;
  }
  if (cmd === "hardware") {
    const model = args.join(" ");
    console.log(JSON.stringify(await request("GET", `/hardware?model=${encodeURIComponent(model)}`), null, 2));
    return;
  }
  if (cmd === "create") {
    const [model, hardware = "2x_nvidia_h100_80gb_sxm", displayName = "aix-fast-sft1500-eval"] = args;
    console.log(JSON.stringify(await request("POST", "/endpoints", {
      model,
      hardware,
      display_name: displayName,
      autoscaling: { min_replicas: 1, max_replicas: 1 },
      inactive_timeout: Number(process.env.TOGETHER_ENDPOINT_INACTIVE_TIMEOUT_MINUTES || 10),
      state: "STARTED",
    }), null, 2));
    return;
  }
  if (cmd === "stop") {
    const [endpointId] = args;
    console.log(JSON.stringify(await request("PATCH", `/endpoints/${endpointId}`, { state: "STOPPED" }), null, 2));
    return;
  }
  if (cmd === "get") {
    const [endpointId] = args;
    console.log(JSON.stringify(await request("GET", `/endpoints/${endpointId}`), null, 2));
    return;
  }
  console.error("Usage: together-endpoint.ts list | hardware <model> | create <model> [hardware] [displayName] | stop <endpointId> | get <endpointId>");
  process.exit(2);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
