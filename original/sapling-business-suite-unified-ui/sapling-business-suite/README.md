# Sapling Business Suite v2

A **modular monolith foundation** covering **22 logical capabilities consolidated into 10 application areas**. This extends the prior Business Suite archive, retaining its existing React UI and 24-resource API, and adding 68+ resource tables and tenant-scoped CRUD routes under `/api/v2`.

## Start
```bash
corepack enable
pnpm install
cp .env.example .env
# Set JWT_SECRET and DATABASE_URL
docker compose -f infra/docker-compose.yml up -d
pnpm db:push
pnpm dev
```

`GET /api/v2/catalog` lists ownership, with a signed JWT. `GET/POST /api/v2/{resource}` and `PATCH /api/v2/{resource}/{uuid}` use generic records for newly added resources. Existing v1 resources continue using the earlier typed tables and UI.

## Documentation
- `docs/modules/<Capability>/PRD.md`, `HLD.md`, `LLD.md`, `QUICK_START.md`, `GAPS_IMPROVEMENTS.md` for each of the 22 capabilities.
- `docs/ARCHITECTURE.md`, `CLOUD_CAPABILITY_AUDIT.md`, `IMPLEMENTATION_MATRIX.md`, `DOMAIN_EVENTS.md`.
- Earlier root `docs/` documentation retained.

## Scope honesty
This is a broad **working CRUD skeleton**, not a complete production SaaS ERP. The new generic JSONB resource models do not implement payroll, accounting journals, payment execution, compliance certification, approval engines, or workflow state machines. New modules do not yet have dedicated React screens; the original portal remains. The API has not been tested in this environment. See all gaps documents.


## Unified React application (v3)
All 22 capabilities are now navigable under 10 application areas. Each resource has its own register and form with contextual fields for priority business entities. This is a **UI and CRUD foundation**, not a production-complete business operating system. Read `docs/TRANSACTIONAL_WORKFLOWS.md` and `docs/GAPS_IMPROVEMENTS.md` before use.
