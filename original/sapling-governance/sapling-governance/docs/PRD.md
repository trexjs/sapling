# Product Requirements Document

## Vision
Sapling Governance offers ConsentOS (privacy choices and enforcement) and ComplianceOS (framework controls, monitoring, evidence and audits) as independent domain services in one monorepo.

## Users
Tenant admins, privacy managers, compliance owners, auditors, developers, data subjects.

## ConsentOS — 12 modules
1. Banners: templates, locales, publish/version, region targeting, accessibility.
2. Scans: Playwright crawler, first/third-party cookie inventory, classification, diffing.
3. Preferences: category toggles, renewals, withdrawal, identity linkage.
4. Enforcement: pre-consent blocking, GTM/Consent Mode, vendor controls, embedded content.
5. Receipts: append-only proof, policy revision, provenance, retention and export.
6. Regulations: configurable jurisdiction policies, consent defaults, legal review.
7. Integrations: vendor adapters, IAB TCF certification where required, webhooks.
8. Policies: notice editor, approvals, versioning and hosting.
9. Privacy requests: intake, identity verification, SLA tracking, deletion orchestration.
10. Analytics: category acceptance, region, trends and privacy-preserving aggregation.
11. Developers: domain verification, API credentials, SDKs, docs, environments.
12. Administration: tenant RBAC, domains, approvals, separation of duties.

## ComplianceOS — 6 modules
13. Frameworks: framework revisions, requirement mapping, custom frameworks.
14. Controls: reusable control library, owners, test procedures, review cadence.
15. Evidence: immutable evidence references, source attribution, expiration, exports.
16. Monitoring: connectors, scheduled checks, alerts, remediation lifecycle.
17. Risks: scoring matrix, treatment plans, acceptance/expiry, approval.
18. Audits: engagements, auditor portal, sampling, findings and reports.

## Acceptance criteria for full product
- Every module has domain-specific API, validation, workflows, permissions, and UI.
- Consent blocking is verified before all nonessential scripts and tags execute.
- Withdrawal propagates to downstream processors with traceable outcomes.
- Evidence is tamper-evident, versioned, and exportable under least privilege.
- Every automated control has executable checks and recorded provenance.
- Tenant isolation and authorization pass adversarial security tests.
- Accessibility, localization, performance, incident response, disaster recovery and compliance review complete.

## Delivery status
Current repository implements foundational records for 18 modules and two specialized append-only/control-check APIs; acceptance criteria above are **not** met yet.
