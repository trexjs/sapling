# CRM (DealOS) — Product Requirements

## Purpose
Provide the CRM business capability within DealOS, without creating a separate service or duplicate master data.

## In-scope resources
- `contacts`: tenant-scoped record lifecycle and metadata.
- `leads`: tenant-scoped record lifecycle and metadata.
- `opportunities`: tenant-scoped record lifecycle and metadata.
- `quotes`: tenant-scoped record lifecycle and metadata.
- `contracts`: tenant-scoped record lifecycle and metadata.

## Actors
Tenant administrators, domain operators and read-only viewers.

## Acceptance criteria
- Every record is scoped to the authenticated organization.
- Editors can create and modify records; viewers can only read.
- Domain-specific state transitions must be implemented before operational launch.
- Events crossing application boundaries must be idempotent and observable.

## Non-goals for baseline
No external provider connectivity, regulatory certification, or end-to-end workflow execution is claimed.
