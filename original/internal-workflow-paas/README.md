# Internal Workflow Execution PaaS

TypeScript monorepo starter implementing project onboarding, API keys, event ingestion, function registration/versioning, durable step result checkpoints, BullMQ-backed retry processing, run history, cancellation flagging, replay, cron triggers, audit log, SDK and React workflow graph editor.

> **Maturity: development prototype, NOT production-ready.** P0-P2 roadmap is included in `docs/GAPS_IMPROVEMENTS.md`. In particular, distributed correctness, enforced concurrency and graph execution are incomplete. See the matrix below.

## Quick start

Prerequisites: Node 22+, npm 10+, Docker Compose.

```bash
cp .env.example .env
# Change FLOW_ADMIN_KEY and FLOW_SIGNING_SECRET in .env
npm install
# Start PostgreSQL and Valkey
docker compose up -d
npm run db:push
# Run in separate terminals, loading .env into each process
npm run dev:api
npm run dev:worker
npm run dev:web
```

> npm workspace commands don't automatically load root .env from child cwd. Export DATABASE_URL, REDIS_URL, FLOW_ADMIN_KEY and FLOW_SIGNING_SECRET in your shell or use `node --env-file=.env` / a shell env loader. `db:push` reads root .env only when invoked from the root; if necessary run `cd packages/db && DATABASE_URL=... npm run db:push`.

Provision a project:

```bash
curl -X POST http://localhost:4000/v1/admin/projects \
 -H 'content-type: application/json' -H 'x-admin-key: YOUR_ADMIN_KEY' \
 -d '{"tenantName":"Demo Org","name":"orders","environment":"dev"}'
```

Copy returned `apiKey` (shown only once) to the UI Settings page at http://localhost:5173. To run example executor: `FLOW_API_KEY=flow_... FLOW_SIGNING_SECRET=... npm run dev --prefix examples/order-service` (workspace linking may require adding the example as a workspace). Register an externally reachable executor endpoint and publish an event:

```bash
curl -X POST http://localhost:4000/v1/events -H 'content-type: application/json' \
 -H 'x-api-key: flow_...' -H 'idempotency-key: order-123' \
 -d '{"name":"order.created","data":{"orderId":"123"}}'
```

**Security:** Example executor localhost URL works only when worker shares host networking; for containers use a reachable hostname. Never expose admin key or signing secret in a browser. Example payment code is mocked.

## Delivered feature matrix

| Capability | State |
|---|---|
| Tenant/project onboarding, environments, API key hash | Implemented baseline |
| Event ingestion + idempotency key | Implemented baseline |
| Function registration + immutable version rows | Implemented baseline |
| Async workers + exponential retries | Implemented baseline |
| Step result persistence + replay | Implemented baseline; not exactly-once |
| Run inspection, cancellation flag, audit | Implemented baseline; cancellation not interruptive |
| Cron | Single-worker only; duplicates possible |
| Graph editor and save/load | Implemented; does not execute graphs |
| Per-tenant RBAC, quotas, rate limiting | Not implemented |
| Per-function concurrency, fairness, priorities | Priorities forwarded; concurrency not enforced |
| Dead-letter and replay | Failed runs visible and manually replayable; no dedicated DLQ |
| Durable sleep / wait-for-event | Not implemented |
| Webhook trigger | Not implemented beyond authenticated event POST |
| AI workflows | SDK can call an AI API inside steps; no native AI orchestration |
| Distributed leases, transactional outbox, leader election | Not implemented |
| Automated tests, production hardening | Not implemented |

## Repository

- `apps/api` — REST API, project provisioning, event-to-run fan-out, run controls.
- `apps/worker` — BullMQ executor, retries, basic cron.
- `apps/web` — React control plane with @xyflow/react editor.
- `packages/db` — Drizzle PostgreSQL schema.
- `packages/sdk` — SDK registration, events and checkpointed step execution.
- `examples/order-service` — Minimal executor example.
- `docs/` — PRD, HLD, LLD, API, onboarding, deployment, gaps, security.

## Safety and correctness

This prototype is at-least-once, not exactly-once. An external side effect may happen before checkpoint persistence, and then repeat. Supply idempotency keys to payment/email/third-party providers. No production SLA is claimed.
