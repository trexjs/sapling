# TrustOS (GovernanceOS) — High-Level Design

## Boundary
GovernanceOS owns this capability. Shared platform identity, tenancy, audit, notification and workflows are adapters, not replicated services.

## Context
React portal → Express /api/v2 → authorization/validation → Drizzle → PostgreSQL.

## Data ownership
- `risks` owned by GovernanceOS.
- `controls` owned by GovernanceOS.
- `evidence_records` owned by GovernanceOS.

## Integration approach
Use internal TypeScript interfaces for in-process commands and durable outbox events for eventual cross-module integration. External Sapling Cloud APIs require availability checks and fallbacks.
