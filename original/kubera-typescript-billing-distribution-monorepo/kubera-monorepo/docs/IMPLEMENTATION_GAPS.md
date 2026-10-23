# Production readiness and missing implementation register

**Current status: functional foundation / demo. DO NOT process real customer payments or publish the admin UI publicly.**

The workspaces contain actual source code for the defined routes, schema, worker, SDK, and React UI; they are not a production-verified finished system. Tests were expressly deferred. The following statuses distinguish partial implementations from absent capabilities.

| Area | Current state | Standard production approach / acceptance gate | Priority |
|---|---|---|---|
| Payments | Simulated settlement, blocked in production | Integrate licensed payment service/provider; tokenize cards; signed webhooks; payment intents, retries, idempotency; PCI review | P0 |
| Auth | Shared development admin API key | OIDC authorization-code + PKCE, secure BFF/session, MFA for admins, RBAC and tenant memberships | P0 |
| Tenant isolation | `tenant_id` application filters only | PostgreSQL RLS policies, role separation, isolation/injection tests | P0 |
| Ledger | Paired sample postings | Enforced balanced journal grouped by transaction, immutable append-only entries, reversing adjustments, chart of accounts | P0 |
| Reconciliation | Missing | Provider settlements vs payments vs ledger; exception queues; daily close controls | P0 |
| Testing | Deferred by request | Unit, integration, property, API contract, tenant isolation, payment edge cases, E2E, security load testing in CI | P0 |
| Deployment | Local compose for dependencies | Multi-stage Dockerfiles, non-root workloads, managed PostgreSQL, migration job, K8s manifests, CI/CD, rollback strategy | P0 |
| Database migration | Drizzle generate/migrate commands | Commit reviewed migration SQL, expand/contract rollout, backups/restore drills | P0 |
| Error/security controls | Helmet, CORS, simple rate limit, Zod | Distributed rate limiting, secret rotation, WAF, CSP, SSRF safety, logging redaction, threat model, security review | P0 |
| Taxes and invoices | Invoice row only | Immutable numbered invoices, VAT/GST rules, jurisdictional tax rates, credit notes, PDF docs, tax audit | P0 |
| Subscriptions | Metadata and next bill date | Renewal scheduler, hosted mandates, dunning, cancellation, upgrades, trials, proration, proper timezone handling | P1 |
| Metered billing | Not implemented | Usage ingestion, dedupe, aggregates, price tiers, invoice preview, backfills and disputes | P1 |
| Credit wallet | Not implemented | Double-entry balance grants/consumption, expiry, reservation, refunds | P1 |
| License security | SHA-256 digest, one-per-order, verification | Key rotation, license activation limits, signed offline license claims, throttling, abuse prevention | P1 |
| Digital delivery | Missing | Object storage signed URLs, malware scan, expiry, secure CDN, fulfillment logs | P1 |
| Affiliates | Affiliate registration only | Attribution, coupon/referral model, conversion linkage, fraud rules, settlement, payout | P1 |
| Outbox | Poll + enqueue + published flag | DB locking/claim or SKIP LOCKED across replicas, dedupe consumer, DLQ, replay tooling, watchdog | P0 |
| Observability | Pino API logs/basic health | OpenTelemetry traces, Prometheus metrics, SLOs, log redaction, alerting, dashboards | P0 |
| Compliance | Not audited | GDPR/DPDP privacy review, PCI scope assessment, access logs, data retention, audit immutability | P0 |
| UI | Admin record screens and prompt-based forms | Protected login, polished forms, a11y, validation, pagination, search, admin roles, production customer portal | P1 |
| SDK | Typed wrappers for basic routes | Generated OpenAPI types, token renewal, compatibility policy, real contract tests, release tooling | P1 |
| Currency & FX | Currency code + minor integer | ISO 4217 minor-unit awareness, zero-decimal handling, FX quotes/rounding, overflow and tax rules | P0 |
| Reporting | Raw list endpoints | Aggregated metrics, immutable reporting snapshots, accurate revenue recognition | P1 |
| Webhooks | Not implemented | HMAC/EdDSA signatures, bounded retries, out-of-order handling, replay protection | P0 |
| Operations | No formal runbooks | Disaster recovery, backups, PITR, on-call playbooks, incident exercises | P0 |

## Known limitations and risks in delivered source

1. The worker publishes outbox messages but does not deliver emails or webhooks; multi-replica outbox publishing may duplicate jobs without DB claiming.
2. The dashboard hardcodes USD for the aggregate gross-paid widget. Mixed currencies must never be summed across currencies in financial reporting.
3. The API is not protected by production auth. CORS is **not authentication**.
4. Database constraints cover basic keys; additional check constraints are needed for negative amounts, invalid sides, and exact debit/credit balancing.
5. `simulate-settlement` is a developer convenience, not a financial payment workflow.
6. Subscription creation does not charge, invoice, or renew. Affiliate creation does not attribute or pay out. Licenses are not downloadable digital fulfillment.
7. The workspace was generated as source files. Dependency installation and runtime deployment have not been verified in this environment.

## Release gate

Before any production money movement require: security signoff, payment provider approval, passing automated tests, database migration validation, tenancy isolation tests, complete double-entry accounting design, reconciliation runbooks, encrypted backups/restore drill, incident response, monitoring, deployment pipelines, operational ownership and compliance review. Without these, mark release **NO-GO**.
