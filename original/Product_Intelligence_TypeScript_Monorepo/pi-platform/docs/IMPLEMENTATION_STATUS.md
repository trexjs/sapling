# Implementation status and engineering backlog

## Working flows (implemented)

| Module | Capabilities |
|---|---|
| Platform foundation | Organizations/projects creation, environment-specific API credentials, seed project, isolated project data |
| Ingestion | Batch events, event UUID deduplication, JSON property storage, validation and timeline explorer |
| Identity | Identify/upsert user profile, anonymous-to-known alias table, user timeline API |
| Analytics | Grouped daily event trends, bounded event explorer, ordered-event funnel counts, daily cohort retention |
| SDK | TypeScript client, memory queue/batching/retry, `identify`, `capture`, `flush`, flag refresh/evaluation, experiment exposure, error capture, numeric metrics, React provider/hooks |
| Flags | Environment-scoped CRUD upsert, targeting rules, stable percentage buckets, variants, evaluation API |
| Experiments | Draft/running/paused/completed lifecycle, exposure idempotency, assignment validation, goal conversion grouping |
| Error tracking | Ingest exception, basic PII redaction, fingerprint/group into issues, issue status, occurrences, release metadata |
| Performance | Generic numeric metrics ingestion and aggregate report |
| Governance | Audit log for changes and credentials scoped to project/environment |
| Console | Overview charts, events explorer/form, funnel/retention, flags, experiments, issue management, releases, performance, settings |

## Partial or intentionally simplified

- Tenant security is scoped in SQL, but admin credential access is project-key based. No SSO, RBAC or service-to-service auth.
- Identity alias relationships are stored but analytical queries do **not** yet normalize historical anonymous identities.
- Flags evaluate locally in the SDK after config refresh; no streaming invalidation, TTL, persistent cache or signed snapshots.
- Experiment conversion query is exposure-based, but lacks sample-ratio checks, holdouts, mutually exclusive layers, statistics and attribution windows.
- Basic exception messages are scrubbed; structured context, arbitrary event properties and nested stack frames are not fully PII-sanitized.
- Trends/retention/funnels are educational baselines; no high-cardinality optimization, time-zone configuration or per-query budget.
- Database uses SQLite; transaction/concurrency/storage needs production review.
- Console makes local admin requests; it is not authenticated to a human identity provider.

## Not implemented (must not be presented as production-ready)

- Kafka/ClickHouse ingestion pipeline, scalable stream workers, DLQ, durable retry queue.
- Robust user deletion/GDPR/DPDP compliance workflows, configurable retention and consent enforcement server-side.
- Source-map upload and deminification pipeline, session replay and distributed tracing.
- Feature flag audit version history/rollback UI, flag dependency logic, schedule-based rollout, quota management.
- Statistical inference engine, sequential testing, SRM alerts and experiment guardrails.
- Dashboard builders and saved analytical reports, complex cohort segmentation and SQL analytics engine.
- OAuth/SSO, MFA, RBAC/ABAC, encrypted/hashed admin secrets, credential rotation.
- Usage quotas, billing, billing plans, alerts/webhooks and incident escalations.
- Production-grade observability, structured request logs, OpenTelemetry and Kubernetes manifests.
- End-to-end browser integration tests, comprehensive load/security tests and official SDK publishing pipeline.

## Recommended production evolution

1. Replace demo credentials with auth provider and scoped machine tokens; hash secrets and add RBAC, tenant test suite.
2. Introduce validated API contracts (Zod or JSON Schema), rate limits, quotas, redaction and idempotency retention.
3. Introduce PostgreSQL for operational state and ClickHouse for analytics, using Kafka ingestion workers.
4. Refactor modules into independently deployable services when throughput requires it.
5. Harden SDK for page lifecycle, offline persistence, sampling, clock skew and batching.
6. Build statistical service and source-map symbolication/artifact storage.
7. Implement replay, trace correlation, alerting, billing and enterprise governance.
