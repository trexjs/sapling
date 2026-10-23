# Getting started

1. Install Node 22+, Docker, npm. Run `cp .env.example .env` and change `JWT_SECRET`, `ADMIN_BOOTSTRAP_EMAIL`, `ADMIN_BOOTSTRAP_PASSWORD` to strong values. Development compose credentials are NOT production-safe.
2. `docker compose up -d` then `npm install`.
3. `npm run db:generate && npm run db:migrate`.
4. Create MinIO bucket `sapling-documents` in the MinIO console at http://localhost:9001 (development credentials are in compose).
5. `npm run dev`. Verify `curl http://localhost:4000/health`.
6. Bootstrap once:
```bash
curl -X POST http://localhost:4000/v1/identity/bootstrap -H 'content-type: application/json' -d '{"tenantName":"Demo","email":"admin@example.com","password":"replace-with-strong-password"}'
```
7. Copy the returned `tenantId`; login:
```bash
curl -X POST http://localhost:4000/v1/identity/login -H 'content-type: application/json' -d '{"tenantId":"TENANT_UUID","email":"admin@example.com","password":"replace-with-strong-password"}'
```
8. Send `Authorization: Bearer ACCESS_TOKEN` to `GET /v1/identity/me`, `POST /v1/documents`, `GET /v1/audit/events`, or `POST /v1/gateway/keys`.

## Upload flow
POST `/v1/documents` with `{ "name":"contract.pdf", "mime":"application/pdf" }`. POST `/v1/documents/{id}/versions` to get a presigned PUT URL. Upload binary bytes with matching Content-Type using PUT, then GET `/v1/documents/{id}/download` for a presigned GET URL. Upload completion is **not** currently verified; see improvements.

## Environment
`DATABASE_URL`, `JWT_SECRET`, `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `CORS_ORIGIN`, `GATEWAY_ALLOWED_ORIGINS`, `PORT`.
