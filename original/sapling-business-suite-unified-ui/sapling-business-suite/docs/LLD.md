# Low-Level Design
## Schema conventions
All domain tables: UUID id, UUID organization_id, text domain attributes, JSONB metadata, created_at. Shared tables: organizations, users, audit_logs. Text attributes deliberately simplify this foundation; replace with typed money/date/status columns and foreign keys.
## API
`GET /health`; `GET /api/me`; `GET /api/:resource` (max 100 rows); `POST /api/:resource`; `PATCH /api/:resource/:id`. Bearer JWT required on /api. Roles admin/editor write, any valid role read. Whitelist resource names and accepted string fields. Validation uses Zod; errors use simple envelopes.
## Transactions
Current write and audit insert are separate database statements. Production must wrap in a single transaction; append outbox event inside the transaction. Add idempotency key to all external-effect mutations.
## Domain state machines (target)
Lead: new -> qualified -> converted / disqualified. Opportunity: discovery -> proposal -> negotiation -> won/lost. Candidate: applied -> screening -> interview -> offer -> hired/rejected. Ticket: open -> triaged -> in_progress -> resolved -> closed. Enforce server-side state transitions and authorization.
## Data retention
HR and candidate records require per-region retention rules, access restrictions, encryption and erasure workflows; customer and marketing contact data require consent and suppression lists.
## Frontend
Navigation grouped by domain, generic create/list screens; no edit controls in UI yet (PATCH is available via API). Replace generic forms with domain-specific UX and validation.
