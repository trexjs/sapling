# Product requirements document

## Goal
Offer a shared internal workflow execution PaaS with a self-service project portal, event ingestion, function SDK, durable multi-step orchestration, replay and observability. Consumers: billing, notifications, CI/CD, data processing, search and AI agent teams.

## Personas
Platform administrator provisions tenants and quotas; developer publishes versioned functions and events; operator diagnoses failed runs and replays safely; auditor reviews access and lifecycle events.

## P0 acceptance criteria
- Multi-tenant project isolation; environment-scoped credentials and role-based authorization.
- Idempotent event ingestion, authenticated function registration, version pinning per run.
- Durable checkpoints, crash recovery, retries/backoff, concurrency, cron and job scheduling.
- Searchable run history, logs, failure diagnostics, replay, alerting and audit.

## P1 acceptance criteria
- Durable waits and sleeps; cancellation with cooperative worker interrupts; timeouts.
- Tenant quotas, per-function concurrency, rate limits, priority and fairness.
- Dedicated DLQ, manual and policy-based replay, webhooks, subscription management.
- Multiple replicas with leader election, transactional outbox and lease fencing.

## P2 acceptance criteria
- AI workflow primitives with model tool calls, human approval, budget and time limits.
- Visual builder supports validation, versioned publish, runnable DAG execution and inspection.
- Fine-grained permissions, advanced analytics, templates and rollout controls.

## Nonfunctional requirements
Availability target 99.9% after production validation; RPO/RTO set by deployment tier; tenant isolation, encryption in transit, secure secrets, OTEL tracing, bounded execution, backpressure and safe migrations.

## Delivery status
See `README.md` matrix and `GAPS_IMPROVEMENTS.md`. This package implements a functional foundation, not all acceptance criteria.
