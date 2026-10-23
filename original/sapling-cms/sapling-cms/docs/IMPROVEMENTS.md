# Implementation gaps and improvement plan

## Status legend
**Implemented** = code path exists, not independently production validated. **Partial** = limited coverage. **Not implemented** = roadmap.

| Capability | Status | Next step |
|---|---|---|
| Schema-driven collections and single types | Partial | DB uniqueness, schema evolution, relation integrity |
| Content CRUD and filtering | Partial | Search, sorting, bulk operations, soft delete |
| Draft/publish | Implemented | Preview tokens, release bundles |
| Revisions/rollback | Partial | Atomic snapshots, diffs, publish revisions |
| Localization | Partial | Locale fallbacks and translation links |
| REST API | Partial | OpenAPI, delivery API auth, quotas |
| GraphQL | Not implemented | Typed schema generation |
| Asset management | Partial | Verify uploads, transformations, folders, virus scan |
| Authentication/RBAC | Partial | IdentityOS integration, ABAC, API keys, SSO |
| Editorial approvals | Not implemented | FlowForge workflow states and assignments |
| Scheduled publishing | Not implemented | Durable worker and clock-safe scheduler |
| Content preview | Not implemented | Signed preview tokens |
| Rich text editor | Not implemented | Structured editor UI and sanitization |
| Dynamic zones/components/relations | Not implemented | Typed nested field and relation engine |
| Webhooks | Partial | Outbox, retries, DLQ, SSRF protection |
| Plugin framework | Not implemented | Versioned extension API, sandboxing |
| Multi-tenancy and environments | Not implemented | Tenant IDs and row-level isolation |
| Audit | Partial | Append-only controls, AuditOS export |
| Cache/search | Not implemented | Valkey, invalidation, OpenSearch |
| Backups/import/export | Not implemented | PITR, export formats, restore drills |
| Monitoring | Partial | OTel, dashboards, SLOs |
| CI/CD and tests | Not implemented | Unit/integration/e2e/security/load suites |

## P0 before production
- Add tenant/project/environment IDs to every domain table and enforce isolation at SQL and authorization layers.
- Replace open bootstrap with an installation-only one-time token and atomic first-user creation; remove public bootstrap in production.
- Add session/token revocation, signing-key rotation, secure cookies or scoped API keys, brute-force protection.
- Restrict public delivery to configured published fields; redact secrets and sensitive metadata.
- Wrap entry/revision/audit writes in DB transactions; add optimistic concurrency and DB constraints.
- Replace synchronous webhook delivery with outbox + BullMQ retries, signatures, destination allowlists and SSRF defense.
- Add object verification, file scanning, MIME checks and lifecycle cleanup.
- Add structured request correlation, security headers policy, request size limits, metrics and tracing.
- Write automated tests, load tests, threat model, migration strategy and backups/restore drills.

## P1
- Reusable components, dynamic zones, relations, rich-text editor, field-level policies, translation grouping.
- Preview, scheduled publishing, review approvals, editorial comments, full-text search and cache invalidation.
- Admin UI for revisions, media, workflows, webhooks, locale translations and environment promotion.

## P2
- GraphQL, plugin SDK, visual content preview, schema diff tooling, audit evidence exports, advanced analytics.

## Integration approach
Use IdentityOS for auth, DocumentOS for file policy and lifecycle, AuditOS for immutable audit events, GatewayOS for delivery quotas, FlowForge for approvals and scheduled tasks. Adapters are not wired in this starter.
