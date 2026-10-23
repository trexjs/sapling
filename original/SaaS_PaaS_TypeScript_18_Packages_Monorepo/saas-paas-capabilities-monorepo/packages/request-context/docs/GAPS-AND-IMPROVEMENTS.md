# Gaps, Missing Capabilities & Improvements — Request Context

## Current status
Starter/reference implementation of a narrow primary workflow. **Not complete feature parity with the source PDF; do not rely on it as hardened production infrastructure.**

## Source scope requiring incremental delivery
Correlation and tracing Propagate request IDs, correlation IDs, and trace context across synchronous and asynchronous boundaries. Tenant and actor context Represent tenant, organization, authenticated subject, initiating actor, and delegated actor separately. Locale and region Carry locale, time zone, and regional routing context where relevant. Deadlines and cancellation Propagate request deadlines and cancellation signals so downstream work does not continue needlessly after the caller has abandoned it. Trusted identity Distinguish authenticated workload identity from user-supplied metadata. Define how delegated authorization context is validated. Async propagation Serialize an allowlisted context envelope into messages and scheduled work, with validation at consumption time.

## Production hardening backlog
- [ ] Review each capability area above and map it to exported APIs, server-side enforcement, config and operational owner.
- [ ] Implement durable, recoverable multi-node adapters where state is required.
- [ ] Define tenant isolation and identity trust-boundary guarantees.
- [ ] Add structured observability, capacity controls, dashboards and alerts.
- [ ] Define API/SDK version support, migrations and deprecation strategy.
- [ ] Address supplied operational failure and degradation requirements: • If optional context is malformed, reject or discard it according to the field's trust level and emit diagnostics. • If a deadline expires, cancel downstream work and return a standardized timeout outcome. • If tenant or actor context required for authorization is missing, fail closed rather than guessing.
- [ ] Document applicable security and privacy threat models, plus data retention.
- [ ] Measure source-proposed success metrics: • Percentage of requests with complete trace linkage • Missing or invalid tenant context incidents • Work canceled after deadline • Context schema compatibility errors

## Explicitly postponed
- All automated tests and test frameworks (user-requested deferral), **including for the quality-engineering package**.
- End-to-end deployment, KMS, distributed storage, provider credentials and production CI/CD environment wiring.

## Recommended release gates (future phase; not implemented)
- Contract/API compatibility review.
- Tenant/security and concurrency verification.
- Load, fault and recovery validation appropriate to the capability.
- Ownership, rollback and operational readiness sign-off.
