# Quick Start

Requires Node.js 22+, npm 10+, Docker.

```bash
cp .env.example .env
# Replace ADMIN_TOKEN with a long random secret
docker compose up -d
npm install
npm run db:push
npm run dev
# another terminal:
npm run dev:console
```

Open http://localhost:5173 and enter the same ADMIN_TOKEN from `.env`. Set VITE_API_URL if the API is remote. The console currently stores the token in sessionStorage and uses default tenant/project values; this is a **local development-only bootstrap**.

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:4100/v1/catalog
curl -X POST http://localhost:4100/v1/resources -H "Authorization: Bearer $ADMIN_TOKEN" -H 'Content-Type: application/json' -d '{"capability":"A-compute","kind":"applications","name":"hello","spec":{"image":"nginx:alpine"}}'
```

The resource will remain `requested` until a future reconciler is installed.
