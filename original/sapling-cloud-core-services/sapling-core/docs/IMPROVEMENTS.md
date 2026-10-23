# Gaps, improvements and release gates

**Status: implementation scaffold / development foundation; NOT production-ready.** The design uses production-oriented patterns but does not claim feature-complete services.

## Release-blocking security and correctness
1. Add login brute-force throttling, credential stuffing detection, breached password checks, email verification and secure account recovery.
2. Build OAuth 2.1/OIDC compliant authorization server or integrate a proven IdP; current HS256 JWT is not OIDC, SSO, MFA, or enterprise IAM.
3. Enforce role/permission scopes across all endpoints; service API keys currently authenticate but many handlers expect human users. Separate machine and human access paths.
4. Document uploads: atomic version allocation, PUT completion verification (HEAD), checksums, file size limits, malware scan, content sniffing, lifecycle jobs, bucket policy, encryption, access grants and legal hold.
5. Audit: database append-only permissions/triggers, external hash anchoring, canonical serialization, integrity verification endpoint, retention/legal holds, PII minimization, evidence signing, actor IP/user-agent and transactional outbox.
6. Gateway: **actual proxy/data plane is not implemented**; add hardened proxy with SSRF prevention, DNS rebinding defense, route allowlists, authn/authz, per-tenant quotas/rate limiting, metering, tracing, API versioning and graceful failover.
7. Move bootstrap behind one-time operational process and remove from public listener; currently races if two bootstrap calls arrive together.
8. Integrate audit with mutations atomically (transactional outbox); current mutation+audit can partially succeed.
9. Add migrations review, tenant isolation RLS, unique-violation mapping, idempotency keys, pagination, structured logs, metrics, traces and secret rotation.
10. Run full unit, integration, load, chaos, security and cross-tenant isolation test suites. **No automated tests are included.**

## UI and DX
- Unified React admin console with 4 modules, tenant switcher, login UX, documents explorer, audit viewer, API key management, developer portal.
- Publish OpenAPI contract and generated SDKs; current TypeScript SDK is lightweight and not schema-generated.
- Provide sample integrations, webhooks, events and operational runbooks.

## Operations
- HA Postgres + PITR, object backups/versioning, KMS, network policy, workload identity, staging/prod manifests, deployment pipeline, dashboards, alerts, SLOs, disaster recovery drills.

## Priority
P0: release blockers above; P1: UI, OIDC/SSO, compliance exports, robust data plane; P2: SCIM, advanced ABAC, automated evidence and lifecycle automation.
