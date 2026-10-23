# ProjectOS (ProductOS) — High-Level Design

## Boundary
ProductOS owns this capability. Shared platform identity, tenancy, audit, notification and workflows are adapters, not replicated services.

## Context
React portal → Express /api/v2 → authorization/validation → Drizzle → PostgreSQL.

## Data ownership
- `projects` owned by ProductOS.
- `sprints` owned by ProductOS.
- `project_tasks` owned by ProductOS.
- `milestones` owned by ProductOS.

## Integration approach
Use internal TypeScript interfaces for in-process commands and durable outbox events for eventual cross-module integration. External Sapling Cloud APIs require availability checks and fallbacks.
