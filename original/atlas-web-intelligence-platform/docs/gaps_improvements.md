# Gaps and Improvements — Release Gate

**Do not deploy the MVP as an unrestricted public web crawling service.** Tests were intentionally omitted by request, not because they are unnecessary.

## P0 — Required before production
1. **SSRF hardening:** run fetch/crawl in isolated workers with default-deny egress to private, link-local, metadata and control-plane ranges; DNS pinning and redirect checks; enforce both IPv4/IPv6; block DNS rebinding.
2. **Rate limits and quotas:** atomic per-project API quotas, account signup/login limits, provider spend ceilings, concurrency controls, maximum bytes and total crawl budgets.
3. **Robots and abuse compliance:** robots.txt checks, crawl-delay, domain-specific throttles, explicit bot identity/contact, takedown handling, acceptable-use enforcement.
4. **Authentication hardening:** email verification, password reset, refresh-token rotation or secure cookie sessions, CSRF protection if cookies used, MFA, brute-force prevention, token invalidation.
5. **Async crawl infrastructure:** durable queue, dedicated worker pool, retries, cancellation, dead-letter handling, idempotency and job polling; avoid holding HTTP requests open for long crawls.
6. **Observability:** structured redacted logs, request IDs, metrics, traces, error monitoring, alerts, audit trail and usage reconciliation.
7. **Security reviews:** threat model, penetration testing, dependency scans, secret scanning, content safety, malicious HTML and prompt-injection boundaries.
8. **Deployment readiness:** TLS, trusted proxy configuration, backups/PITR, migration rollback plan, HA, graceful shutdown and readiness probes.
9. **Tests (intentionally omitted):** auth/tenant isolation integration tests, SSRF regression suite, SDK contract tests, adapter mocks, concurrency/load and end-to-end tests.

## P1 — Product improvements
- Organization workspaces, invitations, RBAC and enterprise SSO.
- Billing plans, metered usage ledger, credits, invoices, webhooks and overage protection.
- Search adapter abstraction for multiple search engines, fallback and cost optimization.
- Render JavaScript sites with sandboxed headless browser workers.
- True sitemap.xml discovery, canonical URLs, pagination, crawl frontier deduplication and domain allow/deny filters.
- Markdown extraction, metadata, structured data, content chunking, embeddings, citation provenance and result freshness.
- Asynchronous bulk extraction, batch APIs, streaming, job status and downloadable exports.
- API versioning, OpenAPI-generated clients, key scopes, expiry and scheduled rotation.
- Improved UX: usage charts, pagination, key permissions, onboarding and organization settings.

## Known MVP limitations
- Search requires Brave Search credentials and depends on its external service.
- The current provider is hard-coded, not truly provider-swappable yet.
- Map fetches one page; crawl only HTML, same hostname, max 20 pages and depth 3.
- No domain robots enforcement, no per-tenant quotas, no caching, no distributed crawling.
- Account model is individual/project, not multi-user organization/team.
- Error handling maps some upstream errors to HTTP 502; not all statuses are differentiated.
- Usage writes are best-effort and can be lost if DB logging fails.
- Browser stores JWT in sessionStorage (XSS risk); API key playground accepts a pasted secret.
- No automated tests or production build verification in this deliverable.
