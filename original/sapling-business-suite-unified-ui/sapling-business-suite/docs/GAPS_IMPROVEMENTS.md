# Gaps, Limitations and Production Hardening
## Critical — before real users
- No sign-in/SSO, account provisioning or verified organization membership; JWTs are only signature-checked, no issuer/audience enforcement.
- No per-field permissions, resource ownership checks, Postgres row-level security, or granular HR data confidentiality.
- No CSRF strategy for cookie auth (currently bearer), rate limits, security headers, CORS allowlist, or secrets manager.
- Domain tables have no foreign keys, unique constraints, enum validation, or typed monetary/date fields.
- No transactional audit writes; audit logging may fail after a successful mutation.
- No migration review pipeline, automated tests, observability, backups, deployment manifests or CI/CD.
- Generic APIs have no pagination cursors, sorting, search, filtering or delete/archive lifecycle.
## Business features not implemented
- Marketing: SEO tooling, PPC platform integrations, email/social publishing, journey orchestration, attribution, campaign budgets/ROI calculations, consent tracking.
- HR: employee self-service, recruitment interviews, offer letters, onboarding automation, attendance, payroll, tax/statutory compliance, benefits, offboarding, HR KPIs.
- Sales: lead scoring logic, deduplication, pipeline board, quote line items, approval workflows, e-signatures, contracts/documents, forecasting, orders and invoices.
- Customer success: ticket messaging, email ingestion, SLA timer workers, escalation, knowledge base, CSAT surveys, customer health scoring, renewals automation.
- Platform: notifications, file uploads, workflow engine, integrations, analytics dashboards, report exports and background jobs.
## Recommended sequence
P0: identity integration, schema integrity, tenant RLS, migrations, transactional outbox/audit, error model, tests.
P1: domain state machines, real forms and approval flows, notifications, integrations, KPI calculations.
P2: campaign automation, HR/payroll connectors, advanced CRM, omnichannel support, BI and predictive models.
## Testing intentionally deferred
Unit tests for validation/state machines; integration tests with real Postgres for tenant isolation; API contract tests; e2e tests for each domain; security and load testing. **Skipping tests is not production-safe.**

## V2 cross-cutting gaps
- 22 capabilities represented, but domain-specific business functionality is not complete.
- New resource writes need audit/outbox, fine-grained ABAC and DB-enforced tenant isolation.
- Production integrations with IdentityOS, Pingora, FlowForge, Kubera and InsightOS remain unverified.
- No automated tests or complete business UI for new capabilities.


## UI and transactional workflows — v3 assessment
- [x] Unified React application with navigation across 10 areas, 22 capabilities, and 73 resource views.
- [x] Resource-specific form fields for selected high-use screens; fallback fields for other screens.
- [ ] All 73 resources require schema-specific validated forms and accessibility review.
- [ ] Payroll engine, statutory rules, payslips and bank disbursements are NOT implemented.
- [ ] Subscription lifecycle, payment gateway reconciliation, invoicing, taxation and entitlement provisioning are NOT implemented.
- [ ] Durable workflow engine, approvals execution, job leasing and compensations are NOT implemented.
- [ ] Ledger balancing, accounting period close and financial audit controls are NOT implemented.
- [ ] Cross-module lead-to-cash process is specified, not executed.
- [ ] Shared Sapling Cloud integration contracts need verification against running cloud services.
- [ ] Fine-grained ABAC, security reviews, migrations, CI, integration and E2E tests.
