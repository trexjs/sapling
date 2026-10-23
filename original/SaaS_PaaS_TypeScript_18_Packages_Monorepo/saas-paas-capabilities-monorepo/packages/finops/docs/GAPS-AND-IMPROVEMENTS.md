# Gaps, Missing Capabilities & Improvements — Finops

## Current status
Starter/reference implementation of a narrow primary workflow. **Not complete feature parity with the source PDF; do not rely on it as hardened production infrastructure.**

## Source scope requiring incremental delivery
Usage attribution Capture resource consumption with stable resource IDs, ownership tags, units, and time windows. Allocation and reporting Allocate shared and direct costs by tenant, project, service, and environment using documented methods. Budgets and alerts Support thresholds, forecasts, notifications, and escalation paths. Resource ownership Require cost owner, environment, service, and lifecycle metadata on billable resources. Waste detection Identify idle resources, oversized workloads, orphaned storage, and unused reserved capacity. Forecasting Estimate future spend and capacity needs from trends and planned growth. Showback and chargeback Provide transparent usage reporting and, where required, chargeback calculations.

## Production hardening backlog
- [ ] Review each capability area above and map it to exported APIs, server-side enforcement, config and operational owner.
- [ ] Implement durable, recoverable multi-node adapters where state is required.
- [ ] Define tenant isolation and identity trust-boundary guarantees.
- [ ] Add structured observability, capacity controls, dashboards and alerts.
- [ ] Define API/SDK version support, migrations and deprecation strategy.
- [ ] Address supplied operational failure and degradation requirements: • If usage data is delayed or incomplete, label reports as provisional and expose the missing interval. • Allocation changes must be versioned so historical reports remain explainable. • Automated cleanup should require safeguards for production resources and preserve recovery options.
- [ ] Document applicable security and privacy threat models, plus data retention.
- [ ] Measure source-proposed success metrics: • Percentage of spend with known owner • Invoice reconciliation variance • Budget forecast accuracy • Idle-resource spend • Cost per tenant or unit of product value

## Explicitly postponed
- All automated tests and test frameworks (user-requested deferral), **including for the quality-engineering package**.
- End-to-end deployment, KMS, distributed storage, provider credentials and production CI/CD environment wiring.

## Recommended release gates (future phase; not implemented)
- Contract/API compatibility review.
- Tenant/security and concurrency verification.
- Load, fault and recovery validation appropriate to the capability.
- Ownership, rollback and operational readiness sign-off.
