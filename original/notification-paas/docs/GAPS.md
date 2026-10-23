# Implementation Status, Gaps and Recommended Production Approach
## Implemented core
- TypeScript pnpm monorepo; Express, PostgreSQL/Drizzle; React template/provider console; SDK; service-scoped API keys.
- Encrypted provider configs; SMTP, AWS SES, AWS SNS, MSG91 Flow adapter; Handlebars rendering and preview; send history.
## Critical before production
1. **Durability:** synchronous send can lose work on process crash. Use PostgreSQL transactional outbox + BullMQ/SQS/Kafka worker with leases, exponential retries, DLQ and deduplication.
2. **Idempotency concurrency:** current read-then-insert may race; catch unique violations and return existing request; also persist request hash and reject key reuse with different payload.
3. **Provider receipts:** add signed webhooks, SES/SNS events, MSG91 delivery receipts, canonical statuses (accepted/delivered/bounced/failed), callback deduplication.
4. **Authentication:** OIDC SSO for console, tenant RBAC, service account rotation, scoped API keys, KMS-backed envelope encryption and rotation; avoid storing service key in browser sessionStorage.
5. **Provider selection:** enforce single default per service/channel, priority/failover policies, circuit breaker, credential validation and provider health checks.
6. **India SMS:** approved DLT template IDs, consent/opt-out, sender IDs, regulatory message categorization, template-variable mapping, and vendor contract testing. Current MSG91 Flow body format is not a general SMS text adapter.
7. **Security:** HTML sanitization, template versioning/approval, strict recipient E.164/email validation, SSRF-resistant SMTP host policy, rate limits, quotas, CORS allowlist, CSP, secret redaction and input size limits.
8. **Operational:** request correlation, metrics/traces, structured logs, retention/PII redaction, backup/restore, migration CI, zero-downtime deployment, graceful shutdown and connection pooling.
9. **UX:** rich email editor, reusable blocks, localization, test-send/sandbox, provider edit/delete, template version history, pagination, delivery filters, accessible forms.
10. **Build verification:** dependencies are declared but installation, compilation, migrations, and live provider integrations have not been executed in this delivery environment. Resolve any integration/compiler issues before deployment.
## Intentionally deferred by request
Automated tests (unit/integration/e2e), team usage audit reports, billing/chargeback. Tests should be added before live production despite being deferred for this iteration.
## Important current limitations
- API sends directly in request; provider response is not proof of delivery.
- No provider-side failover, webhook processing, scheduled sends, queues, or campaign system.
- Provider API credentials are encrypted with a single environment key; rotation not implemented.
- AWS SNS delivery and India sender regulations need account-level configuration.
- Current console is an internal prototype, not suitable for exposure to untrusted users.
