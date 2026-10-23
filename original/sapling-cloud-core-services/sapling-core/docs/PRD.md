# Product Requirements Document

## Vision
Four reusable control-plane capabilities under Sapling Cloud, serving internal multi-tenant applications without duplicating identity, document lifecycle, business audit, and API access concerns.

## Users
Platform administrators, tenant administrators, application developers, compliance operators, service identities.

## IdentityOS
P0: tenant-scoped password login, sessions, admin users, access tokens, logout. P1: invitation workflow, MFA, passkeys, OIDC/OAuth authorization server, federation, service accounts, policy engine, recovery, security monitoring. P2: SAML/SCIM and advanced enterprise policies.

## DocumentOS
P0: metadata, S3-compatible signed URLs, versions, owner/admin ACL, soft deletion, retention guard. P1: upload verification, checksums, malware scanning, lifecycle workers, sharing grants, legal hold, encryption key policy. P2: OCR, search, evidence bundles.

## AuditOS
P0: structured actor/tenant events, append-only API, hash chain, NDJSON export. P1: externally anchored hashes, immutable storage, chain verification, actor/IP/device context, redaction policy, retention workers, signed evidence exports. P2: compliance mapping/report builder.

## GatewayOS
P0: API key creation/revocation/scopes, route registry. P1: actual safe proxy, request authentication/authorization, quotas, rate limits, API version routing, metering and observability. P2: developer portal, SDK credentials, monetization.

## Acceptance criteria
All CRUD paths are tenant scoped; unauthorized access rejected; audit on security-sensitive writes; no raw API keys stored; document URLs expire; migration path documented. Before production: security review, integration tests, HA, backups, alerting and threat modeling.

## Out of scope for this iteration
Production API reverse proxy, OIDC provider, MFA, admin UI, automatic retention enforcement, cryptographically independent audit attestation.
