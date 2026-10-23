# Gaps, Missing Capabilities & Improvements — Execution

## Current status
Starter/reference implementation of a narrow primary workflow. **Not complete feature parity with the source PDF; do not rely on it as hardened production infrastructure.**

## Source scope requiring incremental delivery
Worker lifecycle Provide startup readiness, graceful shutdown, draining, and safe interruption handling. Queue abstraction Standardize message consumption, acknowledgments, visibility timeouts, and consumer lifecycle. Scheduling and priority Support scheduled tasks, priority classes, fairness, and tenant-level concurrency controls. Retries and dead letters Define retry classification, backoff, poison-message handling, and dead-letter replay. Cancellation and deadlines Allow operators and callers to cancel work and propagate execution budgets. Isolation and resource limits Set CPU, memory, concurrency, and execution-time limits per workload class. Progress and results Expose job status, progress, result retrieval, and operational history.

## Production hardening backlog
- [ ] Review each capability area above and map it to exported APIs, server-side enforcement, config and operational owner.
- [ ] Implement durable, recoverable multi-node adapters where state is required.
- [ ] Define tenant isolation and identity trust-boundary guarantees.
- [ ] Add structured observability, capacity controls, dashboards and alerts.
- [ ] Define API/SDK version support, migrations and deprecation strategy.
- [ ] Address supplied operational failure and degradation requirements: • Workers should stop accepting new tasks during shutdown and leave uncompleted tasks recoverable. • Poison messages should be quarantined with diagnostic context, not retried indefinitely. • Overload should trigger bounded concurrency, backpressure, or admission control.
- [ ] Document applicable security and privacy threat models, plus data retention.
- [ ] Measure source-proposed success metrics: • Queue depth and oldest-message age • Job success and retry rates • Dead-letter volume • Worker shutdown drain time • Resource use per workload and tenant

## Explicitly postponed
- All automated tests and test frameworks (user-requested deferral), **including for the quality-engineering package**.
- End-to-end deployment, KMS, distributed storage, provider credentials and production CI/CD environment wiring.

## Recommended release gates (future phase; not implemented)
- Contract/API compatibility review.
- Tenant/security and concurrency verification.
- Load, fault and recovery validation appropriate to the capability.
- Ownership, rollback and operational readiness sign-off.
