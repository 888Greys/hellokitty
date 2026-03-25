#!/usr/bin/env bash
set -euo pipefail

VLLM_ENV="${VLLM_ENV:-/home/nvidia/vllm-env}"
MODEL_PATH="${MODEL_PATH:-/home/nvidia/models/Llama-3.1-8B-Lexi-Uncensored-V2}"
MODEL_MAX_LEN="${MODEL_MAX_LEN:-8192}"
GPU_MEMORY_UTILIZATION="${GPU_MEMORY_UTILIZATION:-0.85}"
POMPOM_KEY="${POMPOM_KEY:-pompom-888-alpha}"
TUNNEL_NAME="${TUNNEL_NAME:-gpu}"
TUNNEL_TOKEN="${TUNNEL_TOKEN:-}"

LOG_DIR="${LOG_DIR:-/home/nvidia}"
VLLM_LOG="${VLLM_LOG:-$LOG_DIR/vllm.log}"
GATEKEEPER_LOG="${GATEKEEPER_LOG:-$LOG_DIR/gatekeeper.log}"
TUNNEL_LOG="${TUNNEL_LOG:-$LOG_DIR/tunnel.log}"

GATEKEEPER_BIN="${GATEKEEPER_BIN:-/home/nvidia/gatekeeper}"
if [[ ! -x "$GATEKEEPER_BIN" ]]; then
  if [[ -f "/home/nvidia/gatekeeper.go" ]] && command -v go >/dev/null 2>&1; then
    go build -o /home/nvidia/gatekeeper /home/nvidia/gatekeeper.go
    GATEKEEPER_BIN="/home/nvidia/gatekeeper"
  else
    echo "Gatekeeper binary not found at $GATEKEEPER_BIN"
    exit 1
  fi
fi

pkill -f "vllm.entrypoints.openai.api_server" || true
pkill -f "cloudflared.*tunnel run.*$TUNNEL_NAME" || true
pkill -f "$GATEKEEPER_BIN" || true

screen -S vllm-api -X quit || true
screen -S gatekeeper-api -X quit || true
screen -S tunnel-gpu -X quit || true

if [[ -z "$TUNNEL_TOKEN" ]]; then
  TUNNEL_TOKEN="$(cloudflared tunnel token "$TUNNEL_NAME")"
fi

screen -dmS vllm-api bash -lc "cd /home/nvidia && source '$VLLM_ENV/bin/activate' && export PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True && python -m vllm.entrypoints.openai.api_server --model '$MODEL_PATH' --port 8000 --tensor-parallel-size 1 --max-model-len '$MODEL_MAX_LEN' --enforce-eager --gpu-memory-utilization '$GPU_MEMORY_UTILIZATION' > '$VLLM_LOG' 2>&1"
screen -dmS gatekeeper-api bash -lc "export POMPOM_KEY='$POMPOM_KEY' && '$GATEKEEPER_BIN' > '$GATEKEEPER_LOG' 2>&1"
screen -dmS tunnel-gpu bash -lc "/usr/local/bin/cloudflared --no-autoupdate tunnel run --token '$TUNNEL_TOKEN' > '$TUNNEL_LOG' 2>&1"

echo "Started screens: vllm-api, gatekeeper-api, tunnel-gpu"
echo "Logs: $VLLM_LOG, $GATEKEEPER_LOG, $TUNNEL_LOG"
