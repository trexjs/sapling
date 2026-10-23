# SuccessOS (CareOS) — Product Requirements

## Purpose
Provide the SuccessOS business capability within CareOS, without creating a separate service or duplicate master data.

## In-scope resources
- `onboardings`: tenant-scoped record lifecycle and metadata.
- `renewals`: tenant-scoped record lifecycle and metadata.
- `health_scores`: tenant-scoped record lifecycle and metadata.
- `success_plans`: tenant-scoped record lifecycle and metadata.

## Actors
Tenant administrators, domain operators and read-only viewers.

## Acceptance criteria
- Every record is scoped to the authenticated organization.
- Editors can create and modify records; viewers can only read.
- Domain-specific state transitions must be implemented before operational launch.
- Events crossing application boundaries must be idempotent and observable.

## Non-goals for baseline
No external provider connectivity, regulatory certification, or end-to-end workflow execution is claimed.
