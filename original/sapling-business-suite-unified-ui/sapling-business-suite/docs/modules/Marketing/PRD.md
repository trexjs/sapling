# Marketing (ReachOS) — Product Requirements

## Purpose
Provide the Marketing business capability within ReachOS, without creating a separate service or duplicate master data.

## In-scope resources
- `campaigns`: tenant-scoped record lifecycle and metadata.
- `audiences`: tenant-scoped record lifecycle and metadata.
- `content_assets`: tenant-scoped record lifecycle and metadata.
- `marketing_events`: tenant-scoped record lifecycle and metadata.

## Actors
Tenant administrators, domain operators and read-only viewers.

## Acceptance criteria
- Every record is scoped to the authenticated organization.
- Editors can create and modify records; viewers can only read.
- Domain-specific state transitions must be implemented before operational launch.
- Events crossing application boundaries must be idempotent and observable.

## Non-goals for baseline
No external provider connectivity, regulatory certification, or end-to-end workflow execution is claimed.
