# Sapling Cloud Shared Capability Audit

This is a design/history audit, **not** a live code-level verification of Sapling Cloud repositories. Only the previous Business Suite archive was available locally.

| Capability | Existing Sapling ownership | Assessment | Business Suite treatment |
|---|---|---|---|
| Identity & Access | IdentityOS | Designed / prototype; production SSO and RBAC not verified | JWT adapter only |
| Organization & Tenancy | IdentityOS / shared control plane | Design present; complete tenant lifecycle not verified | JWT organization scoping only |
| Workflow Execution | FlowForge | Initial implementation; durability gaps | No runtime integration |
| Notifications | Pingora | Initial provider-swappable platform | No runtime integration |
| Documents & Storage | No confirmed dedicated DocumentOS | Missing or unverified | Planned interface only |
| Audit | Cloud shared audit proposal | Unverified | Basic existing audit for legacy CRUD only |
| Search | Search PaaS / search design | Designed / implementation status uncertain | No runtime integration |
| Analytics | InsightOS | Initial implementation, scale gaps | No runtime integration |
| Integration Hub | No verified shared hub | Missing or unverified | Planned |
| API Gateway / SDK | Developer cloud contracts | Partial | Express REST baseline |
| Billing Infrastructure | Kubera / LedgerX | Prototype; accounting-grade readiness unverified | RevenueOS scaffolding only |

## Ownership rule
The cloud owns reusable infrastructure; the suite owns business rules, business data, and business-facing workflows. Do not silently duplicate cloud identity, payment engines, queue workers, notifications or analytics.

## Critical missing shared contracts
Identity claims, organization provisioning, document storage and signed access, event envelopes/outbox, search indexing, provider integrations, secret management, observability, data retention and disaster recovery.
