# Sapling Internal Cloud — Unified Control Plane

**A runnable TypeScript monorepo scaffold for all 12 cloud domains A–L, with PaaS integrations left as placeholders.** Includes React console, Express API, PostgreSQL/Drizzle, SDK, resource catalog, operation/audit records, architecture and gap documentation.

⚠️ **Scope disclosure:** A resource request is persisted but does **not** create infrastructure. The 12 domains are modeled in the console/catalog, not feature-complete. This repository is a foundation for implementation, not a production-ready cloud platform.

See [Quick Start](docs/QUICKSTART.md), [PRD](docs/PRD.md), [HLD](docs/HLD.md), [LLD](docs/LLD.md), [Capability Matrix](docs/CAPABILITY_MATRIX.md), [Security](docs/SECURITY.md) and [Gaps](docs/GAPS_IMPROVEMENTS.md).

## Layout
- `apps/console`: unified React UI with 12 capability navigation sections
- `apps/api`: Node.js Express control plane with Drizzle ORM
- `packages/sdk`: TypeScript consumer SDK
- `packages/catalog`: typed capability catalog
- `infra`: future infrastructure execution adapters
- `docs`: detailed scope and next steps

## Quick commands
`cp .env.example .env && docker compose up -d && npm install && npm run db:push && npm run dev`
Then `npm run dev:console` in another terminal.
