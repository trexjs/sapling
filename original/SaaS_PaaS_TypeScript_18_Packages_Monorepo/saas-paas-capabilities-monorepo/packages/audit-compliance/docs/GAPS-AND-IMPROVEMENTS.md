# Gaps, Missing Capabilities & Improvements — Audit Compliance

## Current status
Starter/reference implementation of a narrow primary workflow. **Not complete feature parity with the source PDF; do not rely on it as hardened production infrastructure.**

## Source scope requiring incremental delivery
Audit record integrity Use append-oriented, access-controlled, and where needed tamper-evident records. Administrative history Record actor, action, target, timestamp, outcome, and relevant change summary. Policy-decision history Capture decision identifiers and reason codes while minimizing sensitive data. Access reviews Support periodic permission recertification, exceptions, and remediation tracking. Evidence collection Collect configuration, deployment, control-test, and operational evidence with provenance. Retention and legal hold Apply distinct retention and access rules to audit records and compliance artifacts. Data-subject requests Track privacy access, export, correction, and erasure workflows end to end. Separation of duties Require independent approvals for high-risk operations where policy demands it.

## Production hardening backlog
- [ ] Review each capability area above and map it to exported APIs, server-side enforcement, config and operational owner.
- [ ] Implement durable, recoverable multi-node adapters where state is required.
- [ ] Define tenant isolation and identity trust-boundary guarantees.
- [ ] Add structured observability, capacity controls, dashboards and alerts.
- [ ] Define API/SDK version support, migrations and deprecation strategy.
- [ ] Address supplied operational failure and degradation requirements: • Critical audit capture failures should alert and may block high-risk operations according to policy. • Evidence gaps must be reported as gaps rather than silently treated as compliant. • Retention changes require authorization and an auditable change record.
- [ ] Document applicable security and privacy threat models, plus data retention.
- [ ] Measure source-proposed success metrics: • Audit event coverage for critical actions • Evidence collection freshness • Access-review completion rate • Audit pipeline lag and loss • Overdue remediation items

## Explicitly postponed
- All automated tests and test frameworks (user-requested deferral), **including for the quality-engineering package**.
- End-to-end deployment, KMS, distributed storage, provider credentials and production CI/CD environment wiring.

## Recommended release gates (future phase; not implemented)
- Contract/API compatibility review.
- Tenant/security and concurrency verification.
- Load, fault and recovery validation appropriate to the capability.
- Ownership, rollback and operational readiness sign-off.
