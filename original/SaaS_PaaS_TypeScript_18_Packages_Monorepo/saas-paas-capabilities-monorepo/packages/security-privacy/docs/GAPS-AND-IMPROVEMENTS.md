# Gaps, Missing Capabilities & Improvements — Security Privacy

## Current status
Starter/reference implementation of a narrow primary workflow. **Not complete feature parity with the source PDF; do not rely on it as hardened production infrastructure.**

## Source scope requiring incremental delivery
Cryptography and key lifecycle Standardize encryption, hashing, signing, key rotation, and KMS integration. Use approved algorithms and libraries. Data classification Label data by sensitivity and define handling rules for storage, transport, access, logging, and retention. Privacy controls Support consent, purpose limitation, access/export requests, erasure workflows, and retention enforcement where applicable. Security policy enforcement Provide secure headers, SSRF protections, safe parsing, input validation guidance, and secure configuration defaults. Supply-chain security Produce SBOMs, sign artifacts, record provenance, scan dependencies, and verify build integrity. Workload identity Use short-lived credentials and service identity for service-to-service authentication and authorization. Abuse prevention Support rate controls, anomaly signals, bot defenses, suspicious-activity workflows, and tenant-level abuse limits.

## Production hardening backlog
- [ ] Review each capability area above and map it to exported APIs, server-side enforcement, config and operational owner.
- [ ] Implement durable, recoverable multi-node adapters where state is required.
- [ ] Define tenant isolation and identity trust-boundary guarantees.
- [ ] Add structured observability, capacity controls, dashboards and alerts.
- [ ] Define API/SDK version support, migrations and deprecation strategy.
- [ ] Address supplied operational failure and degradation requirements: • If identity, policy, or key validation cannot be performed safely, fail closed for protected operations. • Define explicit degraded modes for non-critical controls; never silently bypass critical security enforcement. • Key rotation failures should alert operators and prevent new use of compromised or expired keys. • Privacy workflows must report partial completion rather than claiming erasure when downstream copies remain.
- [ ] Document applicable security and privacy threat models, plus data retention.
- [ ] Measure source-proposed success metrics: • Critical vulnerabilities past SLA • Percentage of artifacts with verified provenance • Secret-scanning findings • Workload identity adoption • Privacy request completion time • Security policy bypass incidents

## Explicitly postponed
- All automated tests and test frameworks (user-requested deferral), **including for the quality-engineering package**.
- End-to-end deployment, KMS, distributed storage, provider credentials and production CI/CD environment wiring.

## Recommended release gates (future phase; not implemented)
- Contract/API compatibility review.
- Tenant/security and concurrency verification.
- Load, fault and recovery validation appropriate to the capability.
- Ownership, rollback and operational readiness sign-off.
