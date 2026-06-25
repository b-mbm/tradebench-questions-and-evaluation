#!/usr/bin/env bash
set -u
cd /Users/bradleymiles/Documents/tradebench-questions-and-evaluation || exit 1
export DOTENV_CONFIG_PATH=/Users/bradleymiles/Documents/tradebench-lite-tests/.env

audit_level() {
  local dir="$1"; local tag="$2"
  node - "$dir" "$tag" <<'NODE'
const fs = require("fs"), path = require("path");
const dir = process.argv[2], tag = process.argv[3];
function readJsonl(file){return fs.existsSync(file)?fs.readFileSync(file,"utf8").split(/\n/).filter(Boolean).map(JSON.parse):[];}
function latest(rows){const map=new Map(); for (const row of rows) map.set(`${row.model}\t${row.questionId}`, row); return [...map.values()];}
const gens=latest(readJsonl(path.join(dir,"generations.jsonl")));
const scores=latest(readJsonl(path.join(dir,"scores.jsonl")));
const genFailed=gens.filter(row=>row.status!=="ok");
const scoreFailed=scores.filter(row=>row.status!=="ok");
const byModel=new Map(); for (const row of genFailed) byModel.set(row.model,(byModel.get(row.model)||0)+1);
console.log(`AUDIT ${tag} dir=${dir}`);
console.log(`AUDIT ${tag} generations latest=${gens.length} ok=${gens.filter(row=>row.status==="ok").length} failed=${genFailed.length}`);
console.log(`AUDIT ${tag} scores latest=${scores.length} ok=${scores.filter(row=>row.status==="ok").length} failed=${scoreFailed.length}`);
const top=[...byModel.entries()].sort((a,b)=>b[1]-a[1]).slice(0,20);
if (top.length) console.log(`AUDIT ${tag} generation failures by model ${JSON.stringify(top)}`);
NODE
}
run_runner() {
  local tag="$1"; local level="$2"; local dir="$3"; local pass="$4"
  echo "=== START ${tag} L${level} ${pass} $(date) ==="
  npx tsx scripts/parallel-runner.ts \
    --models-file models.tradebench-sweep-60.yaml \
    --levels "${level}" \
    --results-dir "${dir}" \
    --concurrency 10 \
    --max-retries 2 \
    --free-model-min-interval-ms 4000 \
    --generate \
    --score \
    --retry-failed
  local status=$?
  echo "=== EXIT ${tag} L${level} ${pass} status=${status} $(date) ==="
  if [ "${status}" -ne 0 ]; then echo "STOPPING: runner failed for ${tag} L${level} ${pass}"; exit "${status}"; fi
}
run_level() {
  local tag="$1"; local level="$2"; local dir="$3"
  run_runner "${tag}" "${level}" "${dir}" "initial"
  run_runner "${tag}" "${level}" "${dir}" "repair"
  audit_level "${dir}" "${tag}-L${level}"
  echo "=== DONE ${tag} L${level} $(date) ==="
}

echo "=== CONTINUATION N2-ONLY SWEEP START $(date) ==="
for level in 9 10 11; do run_level "n1" "${level}" "results/parallel-level${level}-working"; done
for level in 1 2 3 4 5 6 7 8 9 10 11; do run_level "n2" "${level}" "results/parallel-n2-level${level}-working"; done
echo "=== CONTINUATION N2-ONLY SWEEP DONE $(date) ==="
