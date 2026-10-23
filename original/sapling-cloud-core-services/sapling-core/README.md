# Sapling Cloud — Core Platform Services

TypeScript workspace with **IdentityOS**, **DocumentOS**, **AuditOS**, and **GatewayOS**. This is an **executable foundation**, not a finished enterprise production deployment. See `docs/IMPROVEMENTS.md` for important incomplete capabilities and security limitations.

## Included
- Express API with JWT login, tenant-aware users, session revocation, admin RBAC
- Document metadata, version records, S3-compatible presigned upload/download URLs, soft delete and retention guard
- Append-only audit API with per-tenant hash chaining and NDJSON export
- API key issuance, hashing, revocation, scopes, allowlisted route registry (not a forwarding proxy)
- PostgreSQL/Drizzle schema, MinIO development compose, TypeScript client SDK, detailed docs

## Run
See [Getting Started](docs/GETTING_STARTED.md). API starts on port 4000. No UI is included in this initial backend foundation.
