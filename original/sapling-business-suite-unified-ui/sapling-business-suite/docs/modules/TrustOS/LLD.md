# TrustOS (GovernanceOS) — Low-Level Design

## Schema
- `risks`: UUID id, organizationId, name, status, JSONB data, createdAt, updatedAt.
- `controls`: UUID id, organizationId, name, status, JSONB data, createdAt, updatedAt.
- `evidence_records`: UUID id, organizationId, name, status, JSONB data, createdAt, updatedAt.

## Routes
`GET /api/v2/:resource`, `POST /api/v2/:resource`, `PATCH /api/v2/:resource/:id`.

## Authorization
Bearer JWT decoded by existing API middleware; organization from verified token, never request body. Admin/editor writes.

## Caveats
JSONB records are scaffolding, not finalized financial, HR, legal or workflow schemas. Enforce field-level rules, constraints, transactional state machines and immutable audit before production.
