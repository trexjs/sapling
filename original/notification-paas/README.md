# Notification as a Service (Internal PaaS)
TypeScript pnpm monorepo: Express API, Drizzle/PostgreSQL, React console and typed SDK.

## Local quick start
1. `corepack enable && pnpm install`
2. `docker compose up -d`
3. `cp .env.example .env` and set a **random 32-byte hex** encryption key and long admin token.
4. `pnpm db:generate && pnpm db:migrate`
5. `pnpm dev` — UI http://localhost:5173, API http://localhost:4000.
6. Enter admin token in UI, onboard a service, copy the returned API key (shown only once), paste into workspace field.
7. Configure SMTP, SES, SNS, or MSG91; save a template; preview and send.

**Important:** This is an executable core implementation, **not production-certified**. See `docs/GAPS.md` before any live deployment. No tests, billing, team usage audits, or team usage reports are included as requested.

## Structure
- `apps/api`: multi-tenant control + send endpoints, encrypted provider credentials
- `apps/web`: service onboarding, provider setup, template editor, preview, send, recent notifications
- `packages/sdk`: typed service-to-service client
- `docs`: PRD, architecture, onboarding, gaps, API contract
