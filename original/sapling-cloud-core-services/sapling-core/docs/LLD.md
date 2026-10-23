# Low-level design

## Data model
`tenants` 1:N `users`; `users` 1:N `sessions`; `documents` 1:N `document_versions`; `audit_events` tenant-partitioned logically by tenant_id; `api_keys` hashed with SHA-256; `gateway_routes` scoped by tenant. UUID primary keys. Drizzle schema in `apps/api/src/schema.ts`.

## IdentityOS endpoints
`POST /v1/identity/bootstrap` (single initial tenant), `POST /v1/identity/login`, `GET /v1/identity/me`, `POST /v1/identity/logout`, `GET|POST /v1/identity/users`. Passwords bcrypt cost 12; JWT HS256 1h; session DB lookup on every request; logout revokes session. Role model `admin|member` only.

## DocumentOS endpoints
`POST|GET /v1/documents`, `POST /v1/documents/:id/versions`, `GET /v1/documents/:id/download`, `DELETE /v1/documents/:id`. Keys are tenant/document/version. Metadata and current version in DB. Signed URLs expire in 300 seconds. Owner or admin access; retentionUntil prevents soft deletion until elapsed. **Concurrent version creation currently races; implement atomic increment and finalize endpoint before production.**

## AuditOS endpoints
`POST|GET /v1/audit/events`, `GET /v1/audit/export`. Hash = SHA256(JSON.stringify({tenantId,actorId,action,resource,payload,prevHash})); transaction-scoped advisory lock serializes per tenant; append-only is currently **application-level only**, not database-enforced. Need independent verification, canonical serialization, external checkpointing, and dedicated DB privileges.

## GatewayOS endpoints
`POST|GET /v1/gateway/keys`, `DELETE /v1/gateway/keys/:id`, `POST|GET /v1/gateway/routes`. Keys prefixed `spk_`, shown once, SHA-256 stored. Routes require explicit allowlisted origin. No request forwarding is implemented. API keys authenticate to shared middleware and must carry appropriate scopes.

## Error model
JSON `{error: string, details?: object}`. Zod 400; invalid token 401; forbidden 403; unknown 500. Add conflict and unique constraint translation before production.

## Security controls
Helmet, body limit, CORS, JWT issuer/audience, session revocation, tenant-filtered queries, owner/admin checks, API-key hash. Known gaps: login throttling, MFA, S3 object confirmation, object size validation, CSRF for cookie flows, fine-grained permissions, DB append-only grants, quotas, full observability.
