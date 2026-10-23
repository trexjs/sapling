# Gaps, Missing Capabilities & Improvements — Communications

## Current status
Starter/reference implementation of a narrow primary workflow. **Not complete feature parity with the source PDF; do not rely on it as hardened production infrastructure.**

## Source scope requiring incremental delivery
Template management Version, review, localize, preview, and publish templates with clear ownership. Channel preferences Respect user and tenant delivery preferences and permitted channel choices. Delivery and failover Route through providers, handle provider outages, and support controlled failover. Receipts and suppression Track bounces, complaints, delivery receipts, unsubscribe state, and suppression lists. Deduplication and tracking Use stable notification identifiers and record lifecycle events without leaking sensitive content. Webhook security Sign outbound webhooks, retry safely, and protect replay and destination validation.

## Production hardening backlog
- [ ] Review each capability area above and map it to exported APIs, server-side enforcement, config and operational owner.
- [ ] Implement durable, recoverable multi-node adapters where state is required.
- [ ] Define tenant isolation and identity trust-boundary guarantees.
- [ ] Add structured observability, capacity controls, dashboards and alerts.
- [ ] Define API/SDK version support, migrations and deprecation strategy.
- [ ] Address supplied operational failure and degradation requirements: • Provider failure should route to a permitted fallback or a retry queue without duplicating the user-visible message. • Permanent failures such as invalid addresses should be suppressed or surfaced for correction rather than retried endlessly. • Template rendering errors should be visible before send and should not fall back to leaking raw variables.
- [ ] Document applicable security and privacy threat models, plus data retention.
- [ ] Measure source-proposed success metrics: • Delivery success and latency by channel • Bounce and complaint rates • Provider failover frequency • Template render failures • Duplicate notification rate

## Explicitly postponed
- All automated tests and test frameworks (user-requested deferral), **including for the quality-engineering package**.
- End-to-end deployment, KMS, distributed storage, provider credentials and production CI/CD environment wiring.

## Recommended release gates (future phase; not implemented)
- Contract/API compatibility review.
- Tenant/security and concurrency verification.
- Load, fault and recovery validation appropriate to the capability.
- Ownership, rollback and operational readiness sign-off.
