# Gaps, Missing Capabilities & Improvements — Control Plane

## Current status
Starter/reference implementation of a narrow primary workflow. **Not complete feature parity with the source PDF; do not rely on it as hardened production infrastructure.**

## Source scope requiring incremental delivery
Provisioning Create, configure, and retire tenants, projects, databases, services, and related resources through repeatable workflows. Inventory and discovery Maintain resource inventory, ownership, dependencies, state, and service registration. Placement and capacity Choose regions, zones, hosts, and capacity pools according to policy and availability. Health and maintenance Standardize readiness, health checks, maintenance windows, and planned downtime communication. Upgrade and rollback Orchestrate staged upgrades, compatibility checks, and rollback or recovery paths. Backup and disaster recovery Coordinate backups, restores, failover, and verification against recovery objectives. Status and incidents Expose platform status, incident communication, and resource-level operational state.

## Production hardening backlog
- [ ] Review each capability area above and map it to exported APIs, server-side enforcement, config and operational owner.
- [ ] Implement durable, recoverable multi-node adapters where state is required.
- [ ] Define tenant isolation and identity trust-boundary guarantees.
- [ ] Add structured observability, capacity controls, dashboards and alerts.
- [ ] Define API/SDK version support, migrations and deprecation strategy.
- [ ] Address supplied operational failure and degradation requirements: • Partial provisioning must remain visible and be resumable or safely cleaned up. • Control-plane outage should not unnecessarily interrupt healthy data-plane traffic. • Rollback limitations must be documented; irreversible operations need explicit safeguards.
- [ ] Document applicable security and privacy threat models, plus data retention.
- [ ] Measure source-proposed success metrics: • Provisioning lead time and success rate • Desired/observed state drift • Upgrade failure and rollback rates • Recovery objective attainment • Control-plane availability and queue age

## Explicitly postponed
- All automated tests and test frameworks (user-requested deferral), **including for the quality-engineering package**.
- End-to-end deployment, KMS, distributed storage, provider credentials and production CI/CD environment wiring.

## Recommended release gates (future phase; not implemented)
- Contract/API compatibility review.
- Tenant/security and concurrency verification.
- Load, fault and recovery validation appropriate to the capability.
- Ownership, rollback and operational readiness sign-off.
