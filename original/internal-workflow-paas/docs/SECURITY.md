# Security review

Implemented: hashed API keys, per-project filters for main endpoints, JSON size cap, helmet, HMAC executor signing (when SDK configured), input validation.

Critical gaps: broad project key permits all project actions; no browser session auth; project API key used for internal checkpoint access; no key rotation/revocation API; no request throttling; no signed timestamp/nonce; no executor endpoint allowlist (SSRF risk); no TLS enforcement; no audit immutability; no secret encryption; no per-tenant resource isolation; CORS defaults for dev; UI stores API key in localStorage. Do not expose publicly.

Priority: scoped tokens for executor checkpoint, service identities and RBAC, allowlisted executor domains and private-network restrictions, rate limiting, security headers/CSP, rotation and audit, secure UI OIDC sessions, per-tenant quotas.
