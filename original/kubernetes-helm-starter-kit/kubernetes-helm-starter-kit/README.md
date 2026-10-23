# Kubernetes Helm Starter Kit

A reusable Helm 3 chart for stateless HTTP applications, especially UI frontends and API services. The sample image is nginx-unprivileged, listening on port 8080, to demonstrate non-root execution. It provides secure baseline settings and environment-specific values files.

> **Production-readiness note:** This is a production-oriented starting point, not a certification that any deployment is production-ready. Validate the chart against your cluster, ingress controller, policies, image, identity provider, monitoring, and organizational requirements before production use.

## Contents

- `charts/app-service/` — reusable Helm chart and templates
- `environments/values-dev.yaml` — development overrides
- `environments/values-staging.yaml` — staging example
- `environments/values-prod.yaml` — production example
- `docs/SOP.md` — step-by-step standard operating procedure
- `docs/CONFIGURATION-REFERENCE.md` — file/value reference and why/when to change settings
- `docs/OPERATIONS-RUNBOOK.md` — deploy, verify, troubleshoot, rollback
- `scripts/validate.sh` — local validation helper
- `.github/workflows/helm-validate.yml` — CI lint/template checks

## Prerequisites

- Kubernetes cluster and a working `kubectl` context
- Helm 3
- A container image accessible by the cluster
- For ingress: an installed ingress controller and DNS/TLS configuration
- Optional tools: `kubeconform`, `yamllint`, `helm-unittest`, `kubectl` plugins or your organization's equivalents

## Quick start

```bash
helm version
kubectl cluster-info
kubectl create namespace demo
helm lint ./charts/app-service
helm template demo ./charts/app-service -n demo -f environments/values-dev.yaml
```

Edit `environments/values-dev.yaml` to point to your own image, then install:

```bash
helm upgrade --install demo ./charts/app-service \
  --namespace demo --create-namespace \
  -f environments/values-dev.yaml \
  --wait --timeout 5m
```

Inspect:

```bash
helm status demo -n demo
kubectl get deploy,rs,pods,svc,ingress -n demo
kubectl rollout status deployment/demo-app-service -n demo
kubectl logs deployment/demo-app-service -n demo
```

Package the chart:

```bash
helm package ./charts/app-service --destination ./dist
```

Read `docs/SOP.md` before changing production values. Never put passwords, tokens, private keys, or other secrets in values files or source control. Use your approved secret manager / external-secrets workflow.
