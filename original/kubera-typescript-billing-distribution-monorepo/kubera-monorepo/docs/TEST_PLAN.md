# Deferred test plan and future acceptance checks

Tests intentionally not implemented at the user's request. This is a **test specification**, not evidence tests passed.

## Unit
- Product schema validation, currency units, total overflow, invalid quantity.
- SDK timeout, retry only safe/idempotent operations, typed errors, token injection.
- License expiry/hash compare/revocation.
- Subscription interval calendar corner cases (month ends, leap years, DST).

## PostgreSQL integration
- Migrations up/down strategy from clean and existing databases.
- Duplicate order creation with same idempotency key: exactly one order, one invoice.
- Concurrent settlement attempts: exactly one payment, two ledger postings, one entitlement.
- Tenant A cannot read/write Tenant B including guessed IDs and license lookups.
- Rollback injection: every partial payment transaction leaves zero side-effects.
- Amounts never overflow, become negative, or lose minor unit precision.

## Workflow E2E
- Tenant -> product -> order -> invoice -> simulated settlement -> entitlement -> license issuance and verification.
- Invalid API key -> 401; unknown product -> 404; already-paid order -> stable no-op.
- Admin UI loading/error/empty states, keyboard navigation, accessibility.

## Reliability/security
- Worker restart, duplicate outbox, network timeouts, queue outage/recovery, DLQ.
- Ingress rate limits, log PII redaction, SQL injection, CORS/origin, CSRF in future BFF.
- Performance testing at expected tenant volume and DB connection limits.

## Later real-money tests
- Duplicate/out-of-order/signed webhook events; gateway timeout then success; full/partial refunds; disputes; settlement variance; GST/tax rules; subscription retry and dunning; monthly ledger reconciliation.
