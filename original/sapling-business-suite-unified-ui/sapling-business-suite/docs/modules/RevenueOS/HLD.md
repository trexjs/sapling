# RevenueOS (RevenueOS) — High-Level Design

## Boundary
RevenueOS owns this capability. Shared platform identity, tenancy, audit, notification and workflows are adapters, not replicated services.

## Context
React portal → Express /api/v2 → authorization/validation → Drizzle → PostgreSQL.

## Data ownership
- `plans` owned by RevenueOS.
- `subscriptions` owned by RevenueOS.
- `invoices` owned by RevenueOS.
- `payments` owned by RevenueOS.
- `usage_records` owned by RevenueOS.
- `entitlements` owned by RevenueOS.

## Integration approach
Use internal TypeScript interfaces for in-process commands and durable outbox events for eventual cross-module integration. External Sapling Cloud APIs require availability checks and fallbacks.
