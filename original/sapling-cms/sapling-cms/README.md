# Sapling CMS

TypeScript monorepo containing a React administration app, Express/Drizzle/PostgreSQL API, and typed TypeScript client SDK.

**Status: functional foundation, not a production-complete Strapi replacement.** Core CRUD, schema-driven content, draft/publish, revisions, locales, S3 presigning, audit, webhooks and basic role enforcement are implemented. Advanced workflows, dynamic zones, tenant isolation, GraphQL, scheduling, plugins and several security controls remain roadmap items. See `docs/IMPROVEMENTS.md` for an explicit gap register.

## Quick start

1. Install Node 22+, pnpm 9+, Docker.
2. `cp .env.example .env` and set a unique 32+ character `JWT_SECRET`.
3. `docker compose up -d`.
4. `corepack enable && pnpm install`.
5. `pnpm --filter @sapling/cms-api db:push` (with `DATABASE_URL` exported or loaded in shell).
6. `pnpm dev` (API `localhost:4000`, UI `localhost:5173`).
7. In the UI, initialize an admin with a 12+ character password, then sign in.
8. Create a model, then a content entry and publish it. Read published content at `GET /api/delivery/:model`.

Local MinIO bucket `cms` must be created before media uploads. Configure `S3_*` env vars for production object storage. API process loads `.env` from its working directory; export environment variables or place `.env` in `apps/api`.

See `docs/GETTING_STARTED.md`, `docs/PRD.md`, `docs/HLD.md`, `docs/LLD.md`, `docs/IMPROVEMENTS.md` and `docs/API.md`.
