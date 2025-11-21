import "dotenv/config";

import { callExecuteOneModel } from "../src/models/model-runner";
import { L0_QUESTIONS } from "../src/questions/l0-questions";

async function main() {
  const modelId = "minimax/minimax-m2";
  const question = L0_QUESTIONS[0];
  console.log(`Running hello-world smoke for ${modelId} on ${question.id}...`);
  const result = await callExecuteOneModel(modelId, question, {
    temperature: 0.1,
    maxTokens: 512,
  });
  console.log("Duration:", result.durationMs, "ms");
  console.log("Preview:", result.text.slice(0, 300));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
