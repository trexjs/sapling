# Pulse — Product Intelligence Platform

Runnable **TypeScript monorepo reference implementation** combining product analytics, flags, experiments, error tracking and a unified SDK. Includes a React management console and Node API with SQLite persistence.

> **Scope disclosure:** This is a working local-development MVP, **not** a production-hardened Mixpanel/PostHog replacement. See `docs/IMPLEMENTATION_STATUS.md` for implemented, partial, and missing functionality.

## Prerequisites

- Node.js >= 22.13 (uses built-in `node:sqlite`)
- npm >= 10
- An internet connection for the first `npm install` (dependencies are not vendored)

## Start

```bash
npm install
npm run dev
```

Open **http://localhost:5173** for the console and **http://localhost:4000/health** for the API.

Default local credentials:

- **Admin key:** `pi_demo_admin` (console)
- **Public SDK key:** `pi_demo_public`
- **Environment:** `production`

Database: `apps/api/data/pulse.db` (depending on command working directory; default relative to the API process). Set `PI_DB_PATH` to a stable path if desired. **These demo credentials are intentional development shortcuts and must never be deployed publicly.**

## Test and build

```bash
npm run test
npm run typecheck
npm run build
```

## Smoke test

```bash
curl -s http://localhost:4000/health
curl -s -X POST http://localhost:4000/v1/events/batch \
  -H 'Content-Type: application/json' -H 'x-project-key: pi_demo_public' \
  -d '{"events":[{"event":"page_view","distinctId":"user_1","properties":{"path":"/home"}}]}'
curl -s http://localhost:4000/v1/events \
  -H 'x-project-key: pi_demo_admin'
```

## Integration

```ts
import { createClient } from '@pi/sdk';

const pi = createClient({ projectKey: 'pi_demo_public', endpoint: 'http://localhost:4000' });
pi.capture('signup_started', { source: 'homepage' });
await pi.identify('user_123', { plan: 'pro' });
await pi.flags.refresh();
const allowed = pi.flags.isEnabled('new_checkout', false);
await pi.errors.captureException(new Error('Checkout failed'), { route: '/checkout' });
await pi.flush();
await pi.close();
```

For external usage, package SDK using a TypeScript bundler (e.g. tsup) before npm publishing. This workspace uses source-linked package exports for local development.

## Architecture

- `apps/api` — Express + SQLite, all feature services exposed through REST
- `apps/console` — React/Vite operator console
- `packages/shared` — typed contracts and deterministic flag evaluator
- `packages/sdk` — browser/Node SDK, batching, identity, flags, experiments, errors, performance, React hooks
- `docs` — API, security and production roadmap

## Caveats

- A **local developer reference**, with deliberately simple admin keys, no authentication provider, no production RBAC and no background queue.
- Server and console are single-instance; SQLite is not intended for distributed event-scale workloads.
- Funnels use a simplified event-sequence model without conversion windows, and retention is daily cohort-based.
- Experiment results are descriptive conversion rates, **not** statistical significance or causal inference.
- No source-map upload/symbolication, session replay, tracing, alert integrations or deployment manifests.
- The SDK uses best-effort in-memory buffering; reliable offline storage and background lifecycle flushing are not yet implemented.

See `docs/IMPLEMENTATION_STATUS.md` and `docs/API.md` for more detail.
