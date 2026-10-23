# ServiceOS (OperationsOS) — High-Level Design

## Boundary
OperationsOS owns this capability. Shared platform identity, tenancy, audit, notification and workflows are adapters, not replicated services.

## Context
React portal → Express /api/v2 → authorization/validation → Drizzle → PostgreSQL.

## Data ownership
- `incidents` owned by OperationsOS.
- `changes` owned by OperationsOS.
- `service_catalog` owned by OperationsOS.

## Integration approach
Use internal TypeScript interfaces for in-process commands and durable outbox events for eventual cross-module integration. External Sapling Cloud APIs require availability checks and fallbacks.
