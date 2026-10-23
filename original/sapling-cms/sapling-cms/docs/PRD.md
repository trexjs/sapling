# Product requirements — Sapling CMS

## Vision
A reusable headless CMS for Sapling applications with content schemas, editorial UI, API delivery, asset handling, localization and governance.

## Personas
Platform admin, content editor, reviewer, API consumer, SDK developer, security administrator.

## Functional scope
1. Content modeling: collection/single types, typed fields, validation, reusable components and dynamic zones (latter planned).
2. Content management: CRUD, filtering, draft/publish, bulk actions (bulk planned).
3. APIs: REST, API keys, GraphQL, filtering and pagination (only REST and basic pagination implemented).
4. Media: S3-compatible signed upload/download, foldering, transformations (only presigned transfers implemented).
5. Identity: admin login, RBAC, SSO, service auth (basic admin login and coarse RBAC implemented).
6. Publishing: drafts, review workflows, scheduling and previews (draft/publish implemented).
7. Localization: locale codes and per-entry locale; translation relationships/fallbacks planned.
8. Versioning: revision snapshots and restore implemented; diffs planned.
9. Webhooks: registration, HMAC signing, event delivery; durable retries planned.
10. Extensibility: plugin hooks, custom controllers, SDK (SDK implemented; plugins planned).
11. Tenancy: orgs, projects, environments, isolated scopes (planned).
12. Operations: audit, monitoring, backup, import/export (basic audit implemented).

## Nonfunctional requirements (targets, not achieved guarantees)
99.9% availability; p95 delivery API <200ms at specified load; encrypted secrets; tenant isolation; audit integrity; zero-downtime schema migrations; accessibility WCAG 2.2 AA; secure webhook egress; reproducible deployments.

## Success metrics
Time to first content type <10 minutes; publish-to-delivery latency <5 seconds; error budget; API p95; editor task completion; content revision recovery success.
