# Product Requirements Document

## Vision
Offer individuals and SaaS organizations project-scoped web intelligence APIs to power RAG, research agents, monitoring and AI search.

## Personas
Individual developer, SaaS product engineer, project administrator, organization billing administrator (future).

## MVP requirements
- Email/password signup and login.
- Project creation and project-scoped API keys with one-time reveal and revocation.
- Search via Brave Search adapter, structured results.
- HTML extraction for bounded lists of URLs.
- Same-domain sitemap-like link discovery (map) from a fetched page.
- Bounded breadth-first crawl with page text.
- Usage records and project console.
- Typed TypeScript SDK with timeouts and abort support.

## Non-goals in MVP
Native search index, organization memberships, subscription billing, JS rendering, asynchronous distributed crawling, comprehensive robots compliance, enterprise SSO.

## Acceptance criteria
Create account, project and key; call all four endpoints; revoke key and receive 401; observe per-project usage. Production release additionally requires all P0 security and operational gaps closed.
