# PeopleOS (PeopleOS) — High-Level Design

## Boundary
PeopleOS owns this capability. Shared platform identity, tenancy, audit, notification and workflows are adapters, not replicated services.

## Context
React portal → Express /api/v2 → authorization/validation → Drizzle → PostgreSQL.

## Data ownership
- `employees` owned by PeopleOS.
- `leave_requests` owned by PeopleOS.
- `performance_reviews` owned by PeopleOS.
- `training_courses` owned by PeopleOS.
- `training_enrollments` owned by PeopleOS.

## Integration approach
Use internal TypeScript interfaces for in-process commands and durable outbox events for eventual cross-module integration. External Sapling Cloud APIs require availability checks and fallbacks.
