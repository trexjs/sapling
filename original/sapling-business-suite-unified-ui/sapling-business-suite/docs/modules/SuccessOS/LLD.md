# SuccessOS (CareOS) — Low-Level Design

## Schema
- `onboardings`: UUID id, organizationId, name, status, JSONB data, createdAt, updatedAt.
- `renewals`: UUID id, organizationId, name, status, JSONB data, createdAt, updatedAt.
- `health_scores`: UUID id, organizationId, name, status, JSONB data, createdAt, updatedAt.
- `success_plans`: UUID id, organizationId, name, status, JSONB data, createdAt, updatedAt.

## Routes
`GET /api/v2/:resource`, `POST /api/v2/:resource`, `PATCH /api/v2/:resource/:id`.

## Authorization
Bearer JWT decoded by existing API middleware; organization from verified token, never request body. Admin/editor writes.

## Caveats
JSONB records are scaffolding, not finalized financial, HR, legal or workflow schemas. Enforce field-level rules, constraints, transactional state machines and immutable audit before production.
