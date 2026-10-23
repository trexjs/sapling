# Security Model and Deployment Gate

This code is **development-only**. Never expose it to the public internet.

- Authentication: currently none; production API intentionally returns 503 by default.
- Tenant isolation: header-selected tenant is insecure; replace with IdentityOS verified claims.
- Authorization: add per-module RBAC/ABAC and row-level policies.
- Secrets: add Vault/KMS, encryption at rest and rotation.
- Receipts: append-only application path is not tamper-proof; add signatures, retention and WORM export.
- Sensitive data: minimize subject identifiers; apply encryption, retention, DSAR workflows.
- API security: CSRF/CORS design, request quotas, signed browser configuration, domain ownership verification.
- Compliance: legal review required for jurisdiction rules and vendor certifications.
- Operational: backup/restore, observability, alerts, SLOs, disaster recovery, vulnerability scanning.
