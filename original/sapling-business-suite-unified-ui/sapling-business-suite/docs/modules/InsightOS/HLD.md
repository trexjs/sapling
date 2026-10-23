# InsightOS (BusinessIntelligence) — High-Level Design

## Boundary
BusinessIntelligence owns this capability. Shared platform identity, tenancy, audit, notification and workflows are adapters, not replicated services.

## Context
React portal → Express /api/v2 → authorization/validation → Drizzle → PostgreSQL.

## Data ownership
- `metric_definitions` owned by BusinessIntelligence.
- `dashboard_definitions` owned by BusinessIntelligence.
- `saved_reports` owned by BusinessIntelligence.

## Integration approach
Use internal TypeScript interfaces for in-process commands and durable outbox events for eventual cross-module integration. External Sapling Cloud APIs require availability checks and fallbacks.
