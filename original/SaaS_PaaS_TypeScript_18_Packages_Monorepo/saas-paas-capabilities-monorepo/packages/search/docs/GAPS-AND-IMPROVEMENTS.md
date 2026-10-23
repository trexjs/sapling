# Gaps, Missing Capabilities & Improvements — Search

## Current status
Starter/reference implementation of a narrow primary workflow. **Not complete feature parity with the source PDF; do not rely on it as hardened production infrastructure.**

## Source scope requiring incremental delivery
Search interfaces Provide consistent full-text and optional semantic search interfaces with filters, facets, pagination, and suggestions. Index lifecycle Manage index creation, versioning, reindexing, aliases, and retirement. Permissions and tenancy Apply tenant filters and authorization-aware document visibility consistently. Synchronization Propagate source changes to indexes with explicit eventual-consistency expectations. Relevance and analytics Measure zero-result searches, click-through, latency, and relevance changes without centralizing domain-specific ranking decisions.

## Production hardening backlog
- [ ] Review each capability area above and map it to exported APIs, server-side enforcement, config and operational owner.
- [ ] Implement durable, recoverable multi-node adapters where state is required.
- [ ] Define tenant isolation and identity trust-boundary guarantees.
- [ ] Add structured observability, capacity controls, dashboards and alerts.
- [ ] Define API/SDK version support, migrations and deprecation strategy.
- [ ] Address supplied operational failure and degradation requirements: • If the index is stale or unavailable, expose a clear degraded state and avoid returning unauthorized cached results. • Reindexing should be restartable and should not publish a partially built index as current. • Deletion and permission revocation should have defined propagation objectives.
- [ ] Document applicable security and privacy threat models, plus data retention.
- [ ] Measure source-proposed success metrics: • Search latency and error rate • Index freshness lag • Zero-result rate • Reconciliation drift • Unauthorized-result test failures

## Explicitly postponed
- All automated tests and test frameworks (user-requested deferral), **including for the quality-engineering package**.
- End-to-end deployment, KMS, distributed storage, provider credentials and production CI/CD environment wiring.

## Recommended release gates (future phase; not implemented)
- Contract/API compatibility review.
- Tenant/security and concurrency verification.
- Load, fault and recovery validation appropriate to the capability.
- Ownership, rollback and operational readiness sign-off.
