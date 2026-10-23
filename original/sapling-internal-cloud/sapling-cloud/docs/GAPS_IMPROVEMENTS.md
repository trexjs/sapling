# Gaps and Improvements (must-read)

## Current implementation truth
- All 12 A–L domains and their resource kinds are **represented**, not fully implemented.
- Working: React catalog/resource request console; Express catalog/list/create/operations/audit endpoints; Postgres schema; Drizzle; SDK; local Docker Postgres.
- Not working: actual provisioning, lifecycle reconciliation, resource updates/deletes, IAM tenant enforcement, provider integrations, telemetry ingestion, alert execution, key management, DNS management, cost computation, backups, release automation, cluster upgrades.
- Audit and operation writes are not transactional with resource creation; this must be fixed before reliability claims.
- Tests are intentionally omitted; CI is not configured.

## Prioritized delivery plan
P0: AuthZ + tenancy, per-domain schemas, idempotent transactions/outbox, worker reconciliation, IaC adapters, secrets, networking, compute, observability, backup/restore, security controls.
P1: Storage, cost metering, release automation, catalog/templates, quotas, policy enforcement, UX improvements, event streaming.
P2: Multi-region fleet, residency, GPU workloads, service mesh, cost optimization, automated DR.

## Domain-specific missing execution engines
A Kubernetes scheduler adapters and HPA; B ingress/DNS/ACME controllers; C Vault/KMS adapters; D CSI/S3 provisioners; E OTel/Prometheus/Loki/Tempo/Alertmanager; F Trivy/Syft/Cosign/Kyverno/Falco; G OpenTofu/Crossplane/Argo CD; H OpenCost; I Velero/pgBackRest; J Argo Rollouts/Flux; K Backstage-like catalog integrations; L Cluster API/fleet controllers.

Provider/tool suggestions are architectural candidates, not installed dependencies.
