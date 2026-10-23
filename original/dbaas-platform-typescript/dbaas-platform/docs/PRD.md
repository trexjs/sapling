# DBaaS product requirements — internal offering

## Vision

Enable engineering teams to onboard Node.js services and self-service Valkey KV, PostgreSQL SQL, MongoDB document storage, Kafka pub/sub, and recurring distributed workloads on Kubernetes. Infrastructure operations, usage, policy and lifecycle are centrally governed.

## Users

Developer: create/connect resources without managing cluster internals. Platform team: operator health, backups, upgrades and quotas. SRE/security: audit, alerts, recovery and isolation. Engineering manager: see service ownership, usage and allocated cost.

## Requirements

- Service registration, environment, team membership, ownership and lifecycle.
- Engine-scoped resource catalog, plans, quotas, provisioning operations and status.
- Real native engine connectivity with isolated authentication and secret rotation.
- Scheduled jobs with retries, timezone, overlap policy, logs and execution history.
- Metrics, audit, logs, traces, usage collection, showback and alerting.
- Tiered HA/backup/restore, resource expansion/upgrades and safe deletion.
- SDK, API, CLI and UI integration. Kubernetes-only deployment.

## MVP acceptance criteria

1. Authorized team registers a service and environment.
2. Request creates a real accessible resource and returns a verified ready state with approved credentials.
3. One service cannot access another without an authorized grant.
4. Database recovery succeeds against declared RPO/RTO.
5. Job scheduler records real runs, failures, overlap and retries.
6. Inventory, uptime, resource usage and audit can be filtered by team/service/resource.
7. Quotas, admission security, incident runbooks and full lifecycle are exercised.

The current code does NOT pass this MVP acceptance suite. See missing implementation register.
