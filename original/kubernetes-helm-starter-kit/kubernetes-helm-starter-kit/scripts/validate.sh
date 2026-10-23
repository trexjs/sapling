#!/usr/bin/env bash
set -euo pipefail
CHART_DIR="${1:-charts/app-service}"
VALUES_FILE="${2:-environments/values-dev.yaml}"

command -v helm >/dev/null 2>&1 || { echo "ERROR: helm is required" >&2; exit 1; }
echo "== helm lint =="
helm lint "$CHART_DIR" -f "$VALUES_FILE"
echo "== helm template =="
helm template starter "$CHART_DIR" --namespace starter -f "$VALUES_FILE" >/tmp/helm-starter-rendered.yaml
echo "Rendered manifests: /tmp/helm-starter-rendered.yaml"
if command -v kubeconform >/dev/null 2>&1; then
  echo "== kubeconform =="
  kubeconform -strict -summary /tmp/helm-starter-rendered.yaml
else
  echo "NOTE: kubeconform not installed; skipping Kubernetes schema validation."
fi
echo "Validation complete. This does not prove runtime readiness."
