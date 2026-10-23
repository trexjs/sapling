# CRM (DealOS) — High-Level Design

## Boundary
DealOS owns this capability. Shared platform identity, tenancy, audit, notification and workflows are adapters, not replicated services.

## Context
React portal → Express /api/v2 → authorization/validation → Drizzle → PostgreSQL.

## Data ownership
- `contacts` owned by DealOS.
- `leads` owned by DealOS.
- `opportunities` owned by DealOS.
- `quotes` owned by DealOS.
- `contracts` owned by DealOS.

## Integration approach
Use internal TypeScript interfaces for in-process commands and durable outbox events for eventual cross-module integration. External Sapling Cloud APIs require availability checks and fallbacks.
