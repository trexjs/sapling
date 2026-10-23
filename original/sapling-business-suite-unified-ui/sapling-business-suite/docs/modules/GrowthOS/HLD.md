# GrowthOS (ReachOS) — High-Level Design

## Boundary
ReachOS owns this capability. Shared platform identity, tenancy, audit, notification and workflows are adapters, not replicated services.

## Context
React portal → Express /api/v2 → authorization/validation → Drizzle → PostgreSQL.

## Data ownership
- `funnels` owned by ReachOS.
- `experiments` owned by ReachOS.
- `attribution_models` owned by ReachOS.

## Integration approach
Use internal TypeScript interfaces for in-process commands and durable outbox events for eventual cross-module integration. External Sapling Cloud APIs require availability checks and fallbacks.
