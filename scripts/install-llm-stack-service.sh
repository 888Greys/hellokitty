#!/usr/bin/env bash
set -euo pipefail

SERVICE_PATH="/etc/systemd/system/llm-stack.service"
SCRIPT_PATH="/home/nvidia/hellokitty/scripts/start-stack.sh"

sudo tee "$SERVICE_PATH" >/dev/null <<EOF
[Unit]
Description=LLM stack (vLLM + Gatekeeper + Cloudflare tunnel)
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
User=nvidia
RemainAfterExit=true
ExecStart=$SCRIPT_PATH

[Install]
WantedBy=multi-user.target
EOF

sudo chmod +x "$SCRIPT_PATH"
sudo systemctl daemon-reload
sudo systemctl enable llm-stack.service
echo "Installed and enabled llm-stack.service"
echo "Start now with: sudo systemctl start llm-stack.service"
