# Gaps, Missing Capabilities & Improvements — Workflows

## Current status
Starter/reference implementation of a narrow primary workflow. **Not complete feature parity with the source PDF; do not rely on it as hardened production infrastructure.**

## Source scope requiring incremental delivery
Durable orchestration Persist workflow state and resume execution after process or infrastructure restarts. Human approvals Model approvals, rejections, timeouts, delegation, and audit history. Versioning and migration Keep active workflows compatible as definitions change; provide explicit migration paths. Compensation and sagas Define compensating actions for partial completion where true distributed transactions are unavailable. Concurrency and timeouts Coordinate concurrent operations, enforce deadlines, and prevent duplicate execution. Operational visibility Expose workflow status, step history, retry state, owner, and recovery actions.

## Production hardening backlog
- [ ] Review each capability area above and map it to exported APIs, server-side enforcement, config and operational owner.
- [ ] Implement durable, recoverable multi-node adapters where state is required.
- [ ] Define tenant isolation and identity trust-boundary guarantees.
- [ ] Add structured observability, capacity controls, dashboards and alerts.
- [ ] Define API/SDK version support, migrations and deprecation strategy.
- [ ] Address supplied operational failure and degradation requirements: • Retries use bounded exponential backoff with jitter and a maximum attempt or time budget. • Compensation failures remain visible and require retry or operator intervention; do not mark the workflow successful. • Unknown workflow versions must be quarantined or handled through a documented migration path.
- [ ] Document applicable security and privacy threat models, plus data retention.
- [ ] Measure source-proposed success metrics: • Workflow completion and failure rates • Age of oldest running workflow • Retries per activity • Compensation failure rate • Time spent awaiting human approval

## Explicitly postponed
- All automated tests and test frameworks (user-requested deferral), **including for the quality-engineering package**.
- End-to-end deployment, KMS, distributed storage, provider credentials and production CI/CD environment wiring.

## Recommended release gates (future phase; not implemented)
- Contract/API compatibility review.
- Tenant/security and concurrency verification.
- Load, fault and recovery validation appropriate to the capability.
- Ownership, rollback and operational readiness sign-off.
