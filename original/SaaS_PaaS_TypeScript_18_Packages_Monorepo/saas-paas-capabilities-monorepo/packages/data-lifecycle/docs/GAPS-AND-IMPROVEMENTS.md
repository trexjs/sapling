# Gaps, Missing Capabilities & Improvements — Data Lifecycle

## Current status
Starter/reference implementation of a narrow primary workflow. **Not complete feature parity with the source PDF; do not rely on it as hardened production infrastructure.**

## Source scope requiring incremental delivery
Schema and migrations Standardize migration versioning, expand-contract changes, rollback strategy, and deployment ordering. Event and API evolution Maintain compatibility across producers and consumers during staggered deployments. Lifecycle and archival Define retention, archival, deletion, and legal-hold behavior by data class. Portability Support controlled data export/import with integrity checks, authorization, and resumability. Recovery Define backup, restore, disaster-recovery, and recovery validation contracts. Lineage and quality Track data provenance, quality checks, reconciliation, and tenant moves across shards or regions.

## Production hardening backlog
- [ ] Review each capability area above and map it to exported APIs, server-side enforcement, config and operational owner.
- [ ] Implement durable, recoverable multi-node adapters where state is required.
- [ ] Define tenant isolation and identity trust-boundary guarantees.
- [ ] Add structured observability, capacity controls, dashboards and alerts.
- [ ] Define API/SDK version support, migrations and deprecation strategy.
- [ ] Address supplied operational failure and degradation requirements: • Stop destructive migrations when preconditions or integrity checks fail. • Partial exports/imports must be resumable or clearly marked incomplete. • Recovery plans should define data-loss and recovery-time objectives, with escalation paths when targets are missed.
- [ ] Document applicable security and privacy threat models, plus data retention.
- [ ] Measure source-proposed success metrics: • Migration failure rate • Restore-test success rate • Retention-policy compliance • Data reconciliation discrepancies • Tenant migration duration and rollback rate

## Explicitly postponed
- All automated tests and test frameworks (user-requested deferral), **including for the quality-engineering package**.
- End-to-end deployment, KMS, distributed storage, provider credentials and production CI/CD environment wiring.

## Recommended release gates (future phase; not implemented)
- Contract/API compatibility review.
- Tenant/security and concurrency verification.
- Load, fault and recovery validation appropriate to the capability.
- Ownership, rollback and operational readiness sign-off.
