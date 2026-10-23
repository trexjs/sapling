# Getting Started

## Requirements
Node.js 22+, pnpm 9+, Docker Compose.

## Setup
```bash
corepack enable
pnpm install
docker compose up -d
cp .env.example .env
pnpm db:generate
pnpm db:migrate
pnpm dev
```

If `.env` is not automatically loaded by a process, export `DATABASE_URL` in the shell before running migrations. The API processes load `.env` from their working directory; defaults point to the local Compose database.

## Example: create a banner record
```bash
curl -X POST http://localhost:4101/v1/banners -H 'Content-Type: application/json' -d '{"name":"Default banner","status":"draft","data":{"locale":"en"}}'
```

## Example: append consent decision
```bash
curl -X POST http://localhost:4101/v1/decisions -H 'Content-Type: application/json' -d '{"subjectId":"user-123","domainId":"example.com","policyVersion":"v1","categories":{"necessary":true,"analytics":false,"marketing":false},"region":"IN"}'
```

## Example: create compliance control
```bash
curl -X POST http://localhost:4102/v1/controls -H 'Content-Type: application/json' -d '{"name":"Access review","status":"active","data":{"cadence":"quarterly"}}'
```

## Known limitations
The console is a generic record administration interface; it is not a cookie banner editor or auditor workspace. See `GAPS_IMPROVEMENTS.md` before relying on any governance workflow.
