# SuccessOS (CareOS) — High-Level Design

## Boundary
CareOS owns this capability. Shared platform identity, tenancy, audit, notification and workflows are adapters, not replicated services.

## Context
React portal → Express /api/v2 → authorization/validation → Drizzle → PostgreSQL.

## Data ownership
- `onboardings` owned by CareOS.
- `renewals` owned by CareOS.
- `health_scores` owned by CareOS.
- `success_plans` owned by CareOS.

## Integration approach
Use internal TypeScript interfaces for in-process commands and durable outbox events for eventual cross-module integration. External Sapling Cloud APIs require availability checks and fallbacks.
