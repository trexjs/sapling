# WorkforceOS (PeopleOS) — Product Requirements

## Purpose
Provide the WorkforceOS business capability within PeopleOS, without creating a separate service or duplicate master data.

## In-scope resources
- `capacity_plans`: tenant-scoped record lifecycle and metadata.
- `resource_assignments`: tenant-scoped record lifecycle and metadata.

## Actors
Tenant administrators, domain operators and read-only viewers.

## Acceptance criteria
- Every record is scoped to the authenticated organization.
- Editors can create and modify records; viewers can only read.
- Domain-specific state transitions must be implemented before operational launch.
- Events crossing application boundaries must be idempotent and observable.

## Non-goals for baseline
No external provider connectivity, regulatory certification, or end-to-end workflow execution is claimed.
