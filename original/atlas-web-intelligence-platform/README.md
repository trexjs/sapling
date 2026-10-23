# Atlas — Web Intelligence PaaS

A multi-tenant developer platform offering **Search, Extract, Map and Crawl** with a React console, Express API, PostgreSQL/Drizzle and TypeScript SDK.

**Status: functional MVP / production-oriented architecture, NOT production-certified.** Read `docs/gaps_improvements.md` before exposing to the public internet. Search requires a separately provisioned Brave Search API key; no results are fabricated.

## Start
1. Install Node.js 22+, Docker and npm.
2. `cp .env.example .env` and set a strong `JWT_SECRET` and `BRAVE_SEARCH_API_KEY`.
3. `docker compose up -d`
4. `npm install`
5. `npm run db:generate` and `npm run db:migrate` (with `.env` exported into your shell; see quick start).
6. Run `npm run dev:api` and `npm run dev:web` in separate terminals.
7. Open http://localhost:5173; register, create project, generate key, and try the playground.

See `docs/quick-start-guide.md`, `docs/HLD.md`, `docs/LLD.md`, `docs/SDK.md`, `docs/PRD.md`, `docs/gaps_improvements.md`.
