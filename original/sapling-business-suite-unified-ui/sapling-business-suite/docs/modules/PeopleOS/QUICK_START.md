# PeopleOS (PeopleOS) — Quick Start

1. Start PostgreSQL with `docker compose -f infra/docker-compose.yml up -d`.
2. Configure `.env`, install with `pnpm install`, run `pnpm db:push`, then `pnpm dev`.
3. Use a valid signed development JWT with `org` and `role` claims.
4. Example: `curl -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/v2/employees`.
5. Create: `curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"name":"Example","status":"draft","data":{}}' http://localhost:4000/api/v2/employees`.
