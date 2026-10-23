# TalentOS (PeopleOS) — High-Level Design

## Boundary
PeopleOS owns this capability. Shared platform identity, tenancy, audit, notification and workflows are adapters, not replicated services.

## Context
React portal → Express /api/v2 → authorization/validation → Drizzle → PostgreSQL.

## Data ownership
- `jobs` owned by PeopleOS.
- `candidates` owned by PeopleOS.
- `interviews` owned by PeopleOS.
- `offers` owned by PeopleOS.

## Integration approach
Use internal TypeScript interfaces for in-process commands and durable outbox events for eventual cross-module integration. External Sapling Cloud APIs require availability checks and fallbacks.
