# LegalOS (GovernanceOS) — High-Level Design

## Boundary
GovernanceOS owns this capability. Shared platform identity, tenancy, audit, notification and workflows are adapters, not replicated services.

## Context
React portal → Express /api/v2 → authorization/validation → Drizzle → PostgreSQL.

## Data ownership
- `legal_agreements` owned by GovernanceOS.
- `policy_acknowledgements` owned by GovernanceOS.

## Integration approach
Use internal TypeScript interfaces for in-process commands and durable outbox events for eventual cross-module integration. External Sapling Cloud APIs require availability checks and fallbacks.
