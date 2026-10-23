# Sapling Governance — ConsentOS + ComplianceOS

A runnable **development foundation** for two governance services in one TypeScript monorepo. Includes 18 navigable modules with persisted record operations, append-only consent decision receipts, compliance control check results, a unified React console, SDK clients and documentation.

**Important:** This is **not** a production-ready CMP or compliance automation system. Most modules currently implement generic domain records rather than the full business-specific workflows. Do not deploy for regulatory compliance without completing `docs/GAPS_IMPROVEMENTS.md`.

## Quick start

```bash
corepack enable
pnpm install
docker compose up -d
cp .env.example .env
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Open http://localhost:5173, Consent API http://localhost:4101/health and Compliance API http://localhost:4102/health.

The UI supports record creation, listing, status editing and deletion across all 18 modules. Consent receipts are accessible via API; see docs for examples. Development authentication is intentionally **not secure** and production startup fails closed without an IdentityOS implementation.
