# Deployment and operations

## Development
Docker Compose supplies Postgres and Valkey. Start API, worker and Vite app separately.

## Production reference topology (not provided as production manifests)
Ingress/WAF -> API replicas -> PostgreSQL HA; Valkey HA -> worker replicas -> tenant executors. Separate control-plane and data-plane networks. Store secrets in a secret manager, use TLS everywhere, backup Postgres with PITR, monitor queue depth, worker stalls, run latency, failure ratios and database saturation.

## Release gates
Migration review, tenant isolation tests, fault injection, crash-recovery tests, retry/idempotency tests, load tests, penetration test, resource limits, circuit breakers, distributed leader election and DR exercises. Never use `drizzle-kit push` against production without reviewed migrations.
