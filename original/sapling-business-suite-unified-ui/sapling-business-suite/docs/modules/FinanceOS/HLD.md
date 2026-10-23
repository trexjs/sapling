# FinanceOS (FinanceOS) — High-Level Design

## Boundary
FinanceOS owns this capability. Shared platform identity, tenancy, audit, notification and workflows are adapters, not replicated services.

## Context
React portal → Express /api/v2 → authorization/validation → Drizzle → PostgreSQL.

## Data ownership
- `accounts` owned by FinanceOS.
- `journal_entries` owned by FinanceOS.
- `receivables` owned by FinanceOS.
- `payables` owned by FinanceOS.

## Integration approach
Use internal TypeScript interfaces for in-process commands and durable outbox events for eventual cross-module integration. External Sapling Cloud APIs require availability checks and fallbacks.
