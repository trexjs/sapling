# Marketing (ReachOS) — High-Level Design

## Boundary
ReachOS owns this capability. Shared platform identity, tenancy, audit, notification and workflows are adapters, not replicated services.

## Context
React portal → Express /api/v2 → authorization/validation → Drizzle → PostgreSQL.

## Data ownership
- `campaigns` owned by ReachOS.
- `audiences` owned by ReachOS.
- `content_assets` owned by ReachOS.
- `marketing_events` owned by ReachOS.

## Integration approach
Use internal TypeScript interfaces for in-process commands and durable outbox events for eventual cross-module integration. External Sapling Cloud APIs require availability checks and fallbacks.
