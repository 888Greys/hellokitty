#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${ENV_FILE:-/home/nvidia/.llm-stack.env}"
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

VLLM_ENV="${VLLM_ENV:-/home/nvidia/vllm-env}"
MODEL_PATH="${MODEL_PATH:-/home/nvidia/models/Llama-3.1-8B-Lexi-Uncensored-V2}"
MODEL_MAX_LEN="${MODEL_MAX_LEN:-8192}"
GPU_MEMORY_UTILIZATION="${GPU_MEMORY_UTILIZATION:-0.85}"
TUNNEL_NAME="${TUNNEL_NAME:-gpu}"
TUNNEL_TOKEN="${TUNNEL_TOKEN:-}"

LOG_DIR="${LOG_DIR:-/home/nvidia}"
VLLM_LOG="${VLLM_LOG:-$LOG_DIR/vllm.log}"
GATEKEEPER_LOG="${GATEKEEPER_LOG:-$LOG_DIR/gatekeeper.log}"
TUNNEL_LOG="${TUNNEL_LOG:-$LOG_DIR/tunnel.log}"

GATEKEEPER_SRC="${GATEKEEPER_SRC:-/home/nvidia/hellokitty/gatekeeper.go}"
GATEKEEPER_BIN="${GATEKEEPER_BIN:-/home/nvidia/gatekeeper}"

if [[ -z "${API_KEY:-${POMPOM_KEY:-}}" ]]; then
  echo "Missing API_KEY (or POMPOM_KEY) in $ENV_FILE"
  exit 1
fi

if [[ -z "${APP_PASS_SHA256:-}" && -z "${APP_PASS:-}" ]]; then
  echo "Missing APP_PASS_SHA256 (or APP_PASS) in $ENV_FILE"
  exit 1
fi

if [[ ! -f "$GATEKEEPER_SRC" ]]; then
  echo "Gatekeeper source not found at $GATEKEEPER_SRC"
  exit 1
fi

if [[ ! -x "$GATEKEEPER_BIN" || "$GATEKEEPER_SRC" -nt "$GATEKEEPER_BIN" ]]; then
  if command -v go >/dev/null 2>&1; then
    go build -o "$GATEKEEPER_BIN" "$GATEKEEPER_SRC"
  else
    echo "go is required to build gatekeeper"
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
screen -dmS gatekeeper-api bash -lc "set -a && [[ -f '$ENV_FILE' ]] && source '$ENV_FILE' && set +a && '$GATEKEEPER_BIN' > '$GATEKEEPER_LOG' 2>&1"
screen -dmS tunnel-gpu bash -lc "if [[ -n '$TUNNEL_TOKEN' ]]; then /usr/local/bin/cloudflared --no-autoupdate tunnel run --token '$TUNNEL_TOKEN' > '$TUNNEL_LOG' 2>&1; else /usr/local/bin/cloudflared --no-autoupdate tunnel run '$TUNNEL_NAME' > '$TUNNEL_LOG' 2>&1; fi"

echo "Started screens: vllm-api, gatekeeper-api, tunnel-gpu"
echo "Logs: $VLLM_LOG, $GATEKEEPER_LOG, $TUNNEL_LOG"
