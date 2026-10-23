# Unified React application

One app, 10 areas, 22 capabilities and 73 resource-specific screens. Navigation is grouped by application > capability > resource. Each screen has dedicated contextual fields and an entity register. Form layouts are configured per resource and are not separate business workflow implementations.

## Security
JWT from trusted identity provider is required; never ship a hardcoded token. Tenant ID comes from verified claims. RBAC is coarse-grained; object-level authorization is a gap.

## Implementation boundaries
The API v2 resource endpoints are generic and must not be mistaken for transactional domain services. In particular, invoices, payments, subscriptions, payroll and journal entries require state machines, ledger invariants, idempotency and reconciliation before production use.
