# Gaps, Missing Capabilities & Improvements — Entitlements

## Current status
Starter/reference implementation of a narrow primary workflow. **Not complete feature parity with the source PDF; do not rely on it as hardened production infrastructure.**

## Source scope requiring incremental delivery
Plans and entitlements Represent plans, feature capabilities, limits, add-ons, and customer-specific grants. Subscription lifecycle Model trial, active, grace, suspended, canceled, and grandfathered states with explicit transitions. Usage metering Collect billable events with stable schemas, timestamps, units, source identity, and deduplication keys. Limits and overages Support soft warnings, hard enforcement, burst allowances, overage policies, and quota windows. Caching and invalidation Define safe caching for entitlement decisions and reliable invalidation when commercial state changes. Migration Support plan changes, grandfathered customers, staged migrations, and rollback or reconciliation procedures.

## Production hardening backlog
- [ ] Review each capability area above and map it to exported APIs, server-side enforcement, config and operational owner.
- [ ] Implement durable, recoverable multi-node adapters where state is required.
- [ ] Define tenant isolation and identity trust-boundary guarantees.
- [ ] Add structured observability, capacity controls, dashboards and alerts.
- [ ] Define API/SDK version support, migrations and deprecation strategy.
- [ ] Address supplied operational failure and degradation requirements: • If entitlement evaluation is unavailable, choose behavior by capability risk: preserve safe reads where appropriate but do not grant expensive or restricted capabilities by default. • Prevent duplicate metering through idempotency keys and replay-safe ingestion. • Handle stale caches explicitly and expose the decision age for debugging.
- [ ] Document applicable security and privacy threat models, plus data retention.
- [ ] Measure source-proposed success metrics: • Entitlement decision latency and error rate • Quota enforcement correctness • Metering-to-billing reconciliation variance • Duplicate or missing usage events • Stale entitlement cache duration

## Explicitly postponed
- All automated tests and test frameworks (user-requested deferral), **including for the quality-engineering package**.
- End-to-end deployment, KMS, distributed storage, provider credentials and production CI/CD environment wiring.

## Recommended release gates (future phase; not implemented)
- Contract/API compatibility review.
- Tenant/security and concurrency verification.
- Load, fault and recovery validation appropriate to the capability.
- Ownership, rollback and operational readiness sign-off.
