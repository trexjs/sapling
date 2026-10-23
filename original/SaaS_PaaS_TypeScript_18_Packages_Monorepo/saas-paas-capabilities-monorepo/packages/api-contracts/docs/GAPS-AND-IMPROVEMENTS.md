# Gaps, Missing Capabilities & Improvements — Api Contracts

## Current status
Starter/reference implementation of a narrow primary workflow. **Not complete feature parity with the source PDF; do not rely on it as hardened production infrastructure.**

## Source scope requiring incremental delivery
Schema registry Store and discover API, event, and message schemas with ownership, versions, and compatibility rules. Contract-first development Support specification-first design, validation, code generation, and review before implementation. Consumer-driven testing Verify provider changes against known consumer expectations and important integration contracts. Lifecycle policies Define deprecation notices, sunset dates, migration guidance, and compatibility support windows. Common conventions Standardize pagination, filtering, sorting, bulk operations, error formats, and stable error codes. SDK generation Generate and publish client SDKs with explicit language support, release versions, and compatibility guarantees.

## Production hardening backlog
- [ ] Review each capability area above and map it to exported APIs, server-side enforcement, config and operational owner.
- [ ] Implement durable, recoverable multi-node adapters where state is required.
- [ ] Define tenant isolation and identity trust-boundary guarantees.
- [ ] Add structured observability, capacity controls, dashboards and alerts.
- [ ] Define API/SDK version support, migrations and deprecation strategy.
- [ ] Address supplied operational failure and degradation requirements: • If schema publication fails, do not silently ship an undocumented breaking contract. • If a downstream consumer is incompatible, block release or require an explicit reviewed exception. • Unknown error codes should degrade to a safe generic message while preserving diagnostic details for operators.
- [ ] Document applicable security and privacy threat models, plus data retention.
- [ ] Measure source-proposed success metrics: • Breaking changes detected before release • Contract-test pass rate • Deprecated API usage • Time to publish SDKs after API release • Consumer incidents caused by contract drift

## Explicitly postponed
- All automated tests and test frameworks (user-requested deferral), **including for the quality-engineering package**.
- End-to-end deployment, KMS, distributed storage, provider credentials and production CI/CD environment wiring.

## Recommended release gates (future phase; not implemented)
- Contract/API compatibility review.
- Tenant/security and concurrency verification.
- Load, fault and recovery validation appropriate to the capability.
- Ownership, rollback and operational readiness sign-off.
