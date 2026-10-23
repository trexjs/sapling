# Gaps, Missing Capabilities & Improvements — Coordination

## Current status
Starter/reference implementation of a narrow primary workflow. **Not complete feature parity with the source PDF; do not rely on it as hardened production infrastructure.**

## Source scope requiring incremental delivery
Optimistic concurrency Use versions, ETags, compare-and-swap, or conditional writes to prevent lost updates. Leases and locks Provide time-bounded distributed leases with fencing tokens where stale holders could cause damage. Duplicate detection Deduplicate messages and commands using stable idempotency keys and bounded retention. Ordering and partitioning Define per-key ordering guarantees and partition strategy for messages and events. Conflict resolution Document conflict detection and domain-owned resolution policies. Backpressure Use bounded queues, concurrency limits, and load shedding to protect dependencies. Fairness Support per-tenant and per-resource concurrency caps to prevent noisy-neighbor effects.

## Production hardening backlog
- [ ] Review each capability area above and map it to exported APIs, server-side enforcement, config and operational owner.
- [ ] Implement durable, recoverable multi-node adapters where state is required.
- [ ] Define tenant isolation and identity trust-boundary guarantees.
- [ ] Add structured observability, capacity controls, dashboards and alerts.
- [ ] Define API/SDK version support, migrations and deprecation strategy.
- [ ] Address supplied operational failure and degradation requirements: • If lock ownership cannot be confirmed, protected writes must reject stale fencing tokens. • On queue saturation, apply documented backpressure or load shedding rather than unbounded memory growth. • Duplicate messages should be harmless, observable, and safe to retry.
- [ ] Document applicable security and privacy threat models, plus data retention.
- [ ] Measure source-proposed success metrics: • Lock/lease contention and expiry • Duplicate message rate • Queue depth and age • Optimistic conflict rate • Per-tenant fairness and throttling events

## Explicitly postponed
- All automated tests and test frameworks (user-requested deferral), **including for the quality-engineering package**.
- End-to-end deployment, KMS, distributed storage, provider credentials and production CI/CD environment wiring.

## Recommended release gates (future phase; not implemented)
- Contract/API compatibility review.
- Tenant/security and concurrency verification.
- Load, fault and recovery validation appropriate to the capability.
- Ownership, rollback and operational readiness sign-off.
