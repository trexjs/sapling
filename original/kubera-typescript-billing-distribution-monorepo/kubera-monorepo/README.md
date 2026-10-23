# Kubera — billing & digital distribution

TypeScript monorepo with **React + Vite**, **Express**, **PostgreSQL + Drizzle ORM**, a typed SDK, and a queue worker.

> **Status:** deployable **foundation / reference implementation**, **not production-certified**. A real money-moving payment processor, real email delivery, hardened auth, webhook verification, comprehensive tests, and security/compliance work are NOT implemented. See `docs/IMPLEMENTATION_GAPS.md` before production use.

## Run locally

Prereqs: Node 22+, pnpm 9+, Docker and Docker Compose.

```bash
cp .env.example .env
pnpm install

docker compose up -d
pnpm db:generate
pnpm db:migrate
pnpm dev
```

- Admin UI: http://localhost:5173
- API health: http://localhost:4000/health
- SDK: `packages/sdk`
- API: `apps/api`
- Worker: `apps/worker`

For local development, use the exact demo credentials in `.env.example`. The admin UI currently uses a **development-only API key** placed in the browser: **NEVER expose a privileged API key in a production browser**. Replace with OIDC / PKCE BFF sessions before going live.

### Bootstrap tenant

```bash
curl -X POST http://localhost:4000/v1/bootstrap -H 'content-type: application/json' -H 'x-admin-api-key: replace-with-a-long-random-development-secret' -d '{"name":"Demo Studio","slug":"demo-studio"}'
```

Copy the returned `tenantId` into the UI's Tenant ID field. The API's tenant routing requires `x-tenant-id` for tenant endpoints. Create products; issue invoices from orders; use the **simulation-only** settle endpoint for local demos. No real funds move.

## Workspaces

| Package | Role |
|---|---|
| `packages/db` | Drizzle typed schema and migration tooling |
| `packages/contracts` | Zod request contracts and shared TS models |
| `packages/sdk` | Typed fetch SDK for integrations |
| `apps/api` | Express routes and transactional domain services |
| `apps/worker` | BullMQ outbox dispatch worker |
| `apps/admin` | React merchant-admin proof-of-flow UI |

## Key safety properties

- Integer amounts in minor currency units, never floats.
- Scope tenant-owned tables using `tenant_id`; operations check it explicitly.
- Checkout is idempotent by `(tenant_id, idempotency_key)` and writes an event to outbox.
- Payment simulation settles invoices + posts balanced ledger entries atomically in PostgreSQL.
- Outbox separates DB commitment from async queue publishing.
- Payment simulation is disabled unless `NODE_ENV !== production`.

## Runtime and license

Drizzle ORM is an open-source SQL toolkit; see https://github.com/drizzle-team/drizzle-orm for licensing. PostgreSQL is the primary persistence layer. No Prisma dependency.

## Required before production

Read `docs/IMPLEMENTATION_GAPS.md`, `docs/ARCHITECTURE.md`, `docs/API.md`, and `docs/TEST_PLAN.md`. Do not treat green builds or running containers as a claim of production readiness.
