# Mobile Delivery PaaS — implementation starter

Self-hosted control plane for Expo and bare React Native projects. TypeScript monorepo: React dashboard, Express API, Postgres/Drizzle, Valkey/BullMQ, MinIO, SDK, and a runner adapter.

**Status: engineering foundation, NOT a complete production-ready mobile delivery service.** See `docs/gaps_improvements.md` for the exact incomplete pieces. Never point a production mobile application at this OTA endpoint in its current state.

## Quick start

1. Install Node 22+, pnpm 9+, Docker and Docker Compose.
2. `cp .env.example .env` and replace `BOOTSTRAP_ADMIN_TOKEN` with a long random secret.
3. `docker compose up -d`.
4. Create the MinIO bucket `mobile-artifacts` in the MinIO console at http://localhost:9001 (credentials in `.env`).
5. `corepack enable && pnpm install`.
6. `pnpm db:generate && pnpm db:migrate`.
7. `pnpm dev` and, separately, `pnpm worker` (run `pnpm --filter @mobile/db build && pnpm --filter @mobile/core build` first).
8. Bootstrap exactly once: `curl -X POST http://localhost:4000/v1/bootstrap -H 'content-type: application/json' -H 'x-bootstrap-token: YOUR_BOOTSTRAP_TOKEN' -d '{"name":"Internal Mobile"}'`. Save returned API key.
9. Open http://localhost:5173 and enter the API key.

Default `RUNNER_MODE=disabled` means builds will fail closed; this is intentional. Set up dedicated isolated build hosts, signing and repository allowlisting before enabling a worker. The worker requires per-project Fastlane lanes and its current native runner does not automatically discover built artifacts.

See `docs/quick-start-guide.md` and `docs/gaps_improvements.md` before using any release pipeline.
