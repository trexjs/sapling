# Implementation Coverage and Gaps

## Current implementation — actual, not aspirational
| Capability | Status |
|---|---|
| One pnpm monorepo with React console and two Express APIs | Implemented foundation |
| 18 navigable modules | Implemented navigation |
| Tenant-scoped generic CRUD for all 18 modules | Implemented (insecure dev tenancy) |
| PostgreSQL Drizzle schema and migration generation | Implemented |
| Append-only consent decision insertion/history | Implemented basic API |
| Compliance control check result ingestion | Implemented basic API |
| TypeScript client SDKs | Implemented minimal clients |
| IdentityOS, AuditOS, DocumentOS, GatewayOS integrations | NOT implemented |
| Consent banner rendering, editing and publication | NOT implemented |
| Cookie scanning, categorization and scheduled crawling | NOT implemented |
| Tracker blocking and Google Consent Mode | NOT implemented |
| Cross-device preference sync and consent renewal | NOT implemented |
| Regulation-aware geolocation and consent policy engine | NOT implemented |
| IAB TCF and vendor integration | NOT implemented |
| Privacy request orchestration and evidence exports | NOT implemented |
| Compliance framework catalogs and requirement mappings | NOT implemented |
| Control ownership, evidence collection, monitoring connectors | NOT implemented |
| Risk scoring, auditor portal and audit lifecycle | NOT implemented |
| Background queues and workers | NOT implemented |
| Test suite, CI/CD, production Kubernetes deployment | NOT implemented |

## Recommended delivery phases
P0: identity integration, verified tenancy, domain model tables, site ownership, banner runtime, category-level script enforcement, receipts and policy versioning, control framework registry and evidence links.
P1: scanner workers, regional rules, GTM/Consent Mode, DSAR workflow, automated evidence ingestion, controls monitoring, risks and audit workflows.
P2: IAB TCF (certification as applicable), advanced analytics, regional residency, vendor marketplaces, auditor portal, SOC-grade operational hardening.

## Critical engineering corrections before production
1. Replace arbitrary `x-tenant-id` with verified IdentityOS identity and membership.
2. Replace generic record JSON with typed domain entities and constrained state transitions.
3. Add immutable audit trails, transactional outbox, idempotency and consent receipt signing.
4. Add SDK runtime blocking and real browser integration tests for scripts/tags/iframes.
5. Add database RLS, migrations review, pagination, query limits and robust rate limits.
6. Add tests, security threat model, backup/restore, alerts, dashboards and release controls.
