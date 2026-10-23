# FinanceOS (FinanceOS) — Low-Level Design

## Schema
- `accounts`: UUID id, organizationId, name, status, JSONB data, createdAt, updatedAt.
- `journal_entries`: UUID id, organizationId, name, status, JSONB data, createdAt, updatedAt.
- `receivables`: UUID id, organizationId, name, status, JSONB data, createdAt, updatedAt.
- `payables`: UUID id, organizationId, name, status, JSONB data, createdAt, updatedAt.

## Routes
`GET /api/v2/:resource`, `POST /api/v2/:resource`, `PATCH /api/v2/:resource/:id`.

## Authorization
Bearer JWT decoded by existing API middleware; organization from verified token, never request body. Admin/editor writes.

## Caveats
JSONB records are scaffolding, not finalized financial, HR, legal or workflow schemas. Enforce field-level rules, constraints, transactional state machines and immutable audit before production.
