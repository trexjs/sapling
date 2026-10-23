# Internal DBaaS Platform — TypeScript Monorepo

An **implementation starter**, not a certified production-ready managed database service. Includes React management UI, Express API, PostgreSQL/Drizzle metadata, a durable operation worker, Kubernetes resource adapters, a typed TS SDK, and container/Kubernetes deployment references. See `docs/IMPLEMENTATION_GAPS.md` before deploying.

## Components

| Package | Responsibility |
|---|---|
| `apps/api` | Express REST API, local auth gate, Drizzle schema, provisioning worker, Kubernetes adapter |
| `apps/web` | React/Vite resource inventory and create forms |
| `packages/contracts` | Shared Zod contracts and TS models |
| `packages/sdk` | TypeScript provisioning API SDK |
| `deploy/kubernetes` | Scoped RBAC, namespaces, API + worker reference manifests |
| `docs` | Architecture, operations, API, future testing and missing implementation |

## Local setup

Requirements: Node.js 22+, pnpm 9+, Docker Compose.

```bash
cp .env.example apps/api/.env
# Edit apps/api/.env DEV_API_TOKEN to a random value >= 20 chars
corepack enable
pnpm install
docker compose up -d postgres
pnpm --filter @dbaas/api db:generate
pnpm --filter @dbaas/api db:migrate
pnpm --filter @dbaas/contracts build
pnpm --filter @dbaas/sdk build
pnpm --filter @dbaas/api dev
```

Second terminal:

```bash
pnpm --filter @dbaas/api exec tsx watch src/worker.ts
```

Third terminal:

```bash
pnpm --filter @dbaas/web dev
```

Open http://localhost:5173 and sign in with `DEV_API_TOKEN`. **Simulation mode** creates metadata and changes lifecycle states but DOES NOT create an actual database or job. For Kubernetes submission set `PROVISIONER_MODE=kubernetes` and first install/configure each corresponding operator. Kubernetes mode only submits manifests; it does not certify readiness, provide secrets, or complete engine user provisioning. Valkey Kubernetes adapter is intentionally fail-closed pending operator selection.

## API sample

```bash
curl -H "Authorization: Bearer $DEV_API_TOKEN" http://localhost:4000/v1/teams
curl -X POST http://localhost:4000/v1/teams \
  -H "Authorization: Bearer $DEV_API_TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"Payments","slug":"payments"}'
```

Then create service, resource and inspect operation via the UI, SDK or API. Every resource POST requires an `Idempotency-Key` header.

## Security

The local shared token is **development-only** and production startup rejects API authentication. Do not bypass this gate. OIDC JWT verification, tenant authorization, secret distribution, and environment approval are release blockers, detailed in the gaps document.

## Technology decisions

- Express 4 / Node 22 / TypeScript
- PostgreSQL for control-plane metadata
- Open-source Drizzle ORM with generated versioned SQL migrations (not Prisma)
- React / Vite portal
- Kubernetes API adapter for CloudNativePG, MongoDB Community Operator, Strimzi and CronJobs. Operator versions, CRDs and production hardening need verification.
- Native DB clients for application data traffic; control plane is not a query proxy.

## Source guidance

Drizzle: https://orm.drizzle.team/docs/get-started-postgresql
Kubernetes CronJob: https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/
Strimzi: https://strimzi.io/docs/operators/latest/
CloudNativePG: https://cloudnative-pg.io/documentation/current/
MongoDB Community operator: https://github.com/mongodb/mongodb-kubernetes-operator

**Verification note:** package installation and TypeScript build could not be executed in the authoring environment because the npm registry was unreachable. Validate build, operator manifests, and integration workflows before using this repository.
