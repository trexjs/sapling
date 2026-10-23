# Gaps and prioritized implementation plan

**This is not a complete P0-P2 implementation.** The current code is an executable foundation. Do not deploy as a production multi-tenant orchestration service.

## P0 blockers
1. Atomic event/run creation + PostgreSQL transactional outbox and queue relay.
2. Distributed leases with fencing tokens, compare-and-swap run state, crash reconciliation.
3. Enforced per-function concurrency (currently config is metadata only).
4. Durable sleep/wait-for-event and rehydration; SDK `sleep` uses in-process timer and `waitForEvent` throws.
5. Secure executor authorization, scoped checkpoint tokens, key management and OIDC UI.
6. Dedicated queue metrics/logging/tracing, health/readiness, paging, RBAC and tenant boundaries.
7. Idempotent cron scheduling with leader election; cron currently schedules in each worker and lacks resync.
8. Tests for all core paths, DB migration scripts, CI/CD and reproducible deployment.

## P1 gaps
9. Cancellation interrupts running executor; currently flag only.
10. Tenant rate limits, quotas, priority fairness and bulkheads.
11. Dedicated DLQ, failure categorization and automatic replay policies.
12. Webhook triggers with signature verification, replay protection and subscriptions.
13. Timeout/deadline propagation, resource limits and backpressure.
14. Version rollout policy, retention, archival, search and paginated history.
15. Per-project dashboards, structured audit actor attribution and alert rules.

## P2 gaps
16. Graph builder currently persists and edits graphs, **but cannot execute them**; implement compiler, DAG interpreter, typed nodes and publish/version lifecycle.
17. AI agent workflows: model adapters, tool-call steps, human-in-loop, token budgets and safety policies.
18. Visual node configuration, validation, conditional branching, loops, parallel joins, secrets binding and execution overlays.
19. Workflow templates, reusable subworkflows and version diff/rollback.

## Known defects / design constraints
- The root SDK uses Node crypto and is server-side only.
- Ingest uses DB write followed by queue add without atomic outbox.
- Checkpoint result write is not atomic with external side effects.
- Cron registration only happens on worker startup; multiple worker replicas duplicate schedules.
- Retry status is updated in worker, but worker crash may leave stale `running` state until a reattempt.
- Failed BullMQ jobs are retained but not exposed as a dedicated DLQ.
- The dashboard stores the API key in browser localStorage for local development.
- Running a standalone example service requires workspace linking or local package install.
- `npm run build` may need TS project-reference refinements across packages; validate in CI.

## Recommended phases
Phase 1: correctness (outbox, leases, idempotency, integration tests).
Phase 2: secure multi-tenant control plane and fair scheduling.
Phase 3: durable wait/cancel and graph runtime.
Phase 4: AI/human workflows, advanced observability and operational hardening.
