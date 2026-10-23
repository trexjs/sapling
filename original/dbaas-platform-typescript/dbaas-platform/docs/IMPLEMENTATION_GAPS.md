# Missing implementation, skipped items, production standards and release blockers

**Release readiness: NOT PRODUCTION READY.** This repository is an end-to-end code foundation and local simulation UI, with partial Kubernetes submit adapters. Do not expose the current backend on a production network or run it against production clusters. Items below are intentionally not represented as implemented.

## Coverage matrix

| Capability | Current code | Missing production-standard implementation | Priority |
|---|---|---|---|
| TypeScript monorepo | pnpm workspaces, contracts, SDK, API, UI | Lockfile validation, dependency scanning, release pipelines | P1 |
| API framework | Express, Zod, basic error handling | pagination, OpenAPI docs, input config schemas, API version policy, rate limits, request IDs | P1 |
| Metadata | PostgreSQL, Drizzle definitions, migration generation | migrations committed/reviewed, backfill policy, backups, retention | P0 |
| Identity | local shared development token, production fail-closed | Enterprise OIDC, JWT signature/issuer/audience checks, workload identity, sessions | **P0 blocker** |
| Authorization | basic role gate with simulated admin | team/service membership, query-level tenant scoping, ABAC/RBAC, approval workflow | **P0 blocker** |
| Resource create | durable operation + idempotency + retries | approvals, per-engine validated config/quotas, drift reconciliation and true readiness | **P0 blocker** |
| Kubernetes | custom-resource submission for 3 engines | pinned operator/CRD compatibility, read status, secrets, TLS, failover/restore, lifecycle cleanup | **P0 blocker** |
| Valkey | catalog/metadata and simulation only | select and implement Valkey operator, client auth, persistence, replication, eviction/quota | **P0 blocker** |
| PostgreSQL | CloudNativePG CR submission only | database user lifecycle, secrets, connection TLS, backup/restore and readiness/HA checks | **P0 blocker** |
| MongoDB | Community operator CR submission only | valid users/secrets, secure replica-set config, auth, TLS, backup, ready status | **P0 blocker** |
| Kafka | Strimzi KafkaTopic submission only | cluster bootstrap, KafkaUser/ACL/SASL/TLS, capacity policy, consumer-lag metrics | **P0 blocker** |
| Scheduled jobs | CronJob submit, job create UI | job logs/history, retries/dead-letter policy, overlap locks, misfire handling, manual triggers, cancellations | P0 |
| Secrets | references planned but not implemented | KMS, external-secrets/Vault integration, issuance, rotation, revocation, secure endpoint resolution | **P0 blocker** |
| Service connectivity | resource metadata/status only | DNS/endpoints, network policy, service accounts, client examples per engine | **P0 blocker** |
| Worker durability | row-lock claim, limited exponential retry | crash recovery for stuck `running`, leases/heartbeats, terminal dead letters, deletion finalizers, reconciling loops | **P0 blocker** |
| Deletion | metadata deletion workflow and Kubernetes delete call | safe data deletion policies, retention approval, finalizer confirmation and cleanup verification | **P0 blocker** |
| UI | dashboards, create forms, inventory | real SSO, tenant roles, approval flows, operation details, pagination, usage graphs, accessible tests | P1 |
| SDK | fetch client, create/list, operation polling | typed responses, connection material orchestration, token refresh, abort/timeouts, retries, API contract generation | P1 |
| Audit | write some events and list last 100 | complete event coverage, tamper-evident append-only storage, correlation IDs, searchable retention | P0 |
| Usage | counts per resource/job/operation status | CPU/memory/storage/network measurements, OpenTelemetry/Prometheus collection, cost attribution, quotas | P1 |
| Observability | health endpoints, pino HTTP logs | Prometheus exporters, spans, OpenTelemetry, alerts, dashboards, SLOs, instrumentation | P0 |
| High availability | API replica example, DB pool | HA metadata DB, multi-AZ storage, controller leaders, database failover, validated resource plans | P0 |
| Disaster recovery | design notes only | encrypted backups, PITR, cross-failure-domain restore, regular restore drills, defined RPO/RTO | **P0 blocker** |
| Security hardening | helmet, limited CORS, JSON size cap, scoped sample RBAC | external penetration testing, egress deny, pod security admission, resource policy, image signing, supply-chain controls | **P0 blocker** |
| Testing | deliberately skipped by user | unit, integration, E2E, security, chaos, perf, restore and migration tests | Before release |

## Build verification status

Package installation and TypeScript compilation could not be completed because the authoring environment could not connect to the npm registry. The code has not been exercised end-to-end. Correct compilation and runtime integration issues revealed by a real install before any staging rollout.

## Known caveats in code

1. `PROVISIONER_MODE=simulate` marks resources ready without creating them; **development demonstration only**. This MUST NEVER be considered proof of an actual database.
2. `PROVISIONER_MODE=kubernetes` considers an operation succeeded once an API submission returns; resource remains in `provisioning`. Add operator condition/endpoint reconciler. Workers can leave operations stuck in `running` after process termination: add lease recovery.
3. MongoDB operator example is incomplete by design (`users: []`), and operator schemas change. Kafka assumes existing `shared-kafka` cluster and topic operator. CloudNativePG manifests do not satisfy service credential delivery.
4. Kubernetes Valkey adapter explicitly rejects requests instead of guessing an operator-specific CRD. No production Valkey resources are provisioned.
5. DELETE is not safe for real production resources without retention, approvals, finalizers, and confirmation of cleanup.
6. Current local auth grants every valid token an admin role and does not enforce tenants. API rejects authentication if NODE_ENV=production.
7. UI stores the development bearer token in sessionStorage; replace with proper OIDC login/BFF and robust CSRF/session policy before production.
8. Cron expression validation is minimal, image provenance is unchecked, operator resources may be rejected. Scheduling is at-least-once in practice.
9. No API rate limit, quota engine, secret lifecycle, tenant filtering, connection endpoints, backup flows, or cost meters are implemented.
10. Deployment manifests are illustrative; registry image placeholder, private image pull, storage/proxy/ingress, secret injection, TLS and egress policy must be configured.

## Standard approach for skipped tests

- **Contract**: OpenAPI schema generation and contract testing between API/SDK/UI; errors and status behavior.
- **Unit**: validation, ownership authorization, resource schema, request hashes, transitions, retry/backoff, quota calculations.
- **Integration**: isolated PostgreSQL/Valkey/MongoDB/Kafka containers and a Kubernetes test namespace with operator CRDs.
- **End-to-end**: register team -> service -> resource -> readiness -> connect from real Node.js native driver -> query/publish -> rotate credentials -> delete.
- **Security**: cross-tenant query attacks, auth token tampering, unsafe manifests, privilege escalation, injection, leaking secrets in logs, credential revocation.
- **Reliability**: crash between operation commit and apply, queued/running recovery, double submit, operator outage, cluster outage, backup restore, conflicting config.
- **Load**: thousands of concurrent provisioning requests, scheduler concurrency, API p95 and operator reconciliation lag.
- **Release gate**: tests must run automatically in CI; include restore drills and security approvals before launching a production tier.

## Recommended implementation order

0. Define data tenancy, production plan tiers, cluster policies and operator compatibility matrix.
1. Enterprise OIDC and workload identity; tenant-aware authorization and data access policies.
2. Approved secret management; private network connectivity and principals per engine.
3. Complete reconcile loop including operator readiness, retries, leases and drift detection.
4. Real PostgreSQL provisioning end-to-end with restore test, then MongoDB, Valkey and Kafka.
5. Scheduled-job execution history, monitoring and idempotent execution template.
6. OpenAPI generation, SDK typed responses, quotas, usage metering and operational dashboards.
7. Harden Kubernetes resources, automated supply-chain controls, and full testing/regression gates.

## Production acceptance gate

Launch only when every P0 blocker is closed, end-to-end native connectivity works for every enabled engine, backed-up data is restored in a drill, cross-tenant access tests pass, operator versions are pinned and verified, runbooks/SLIs/SLOs are accepted, and the security team approves the release.
