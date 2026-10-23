# Getting started

## Requirements
Node.js 22, pnpm 9, Docker and Docker Compose.

```bash
cp .env.example .env
docker compose up -d
corepack enable
pnpm install
# Export DATABASE_URL from .env in your shell before running migrations
export DATABASE_URL=postgres://cms:cms@localhost:5432/cms
pnpm --filter @sapling/cms-api db:push
# In another terminal, export JWT_SECRET (32+ characters) and DATABASE_URL
pnpm dev
```

Open http://localhost:5173 and initialize admin. Use a strong password. Create model `articles` with fields `{"title":{"type":"text","required":true},"body":{"type":"richtext"}}`. Add entry `{"title":"Hello Sapling","body":"Content API demo"}` and publish it.

```bash
curl http://localhost:4000/api/delivery/articles
```

## SDK example
```ts
import { SaplingCMS } from '@sapling/cms-sdk';
const cms = new SaplingCMS({baseUrl:'http://localhost:4000',token:process.env.CMS_TOKEN});
const models = await cms.models();
const draft = await cms.create('articles',{title:'SDK example',body:'Hello'});
await cms.publish('articles',draft.id);
```

## Media setup
Create the `cms` bucket in MinIO console at http://localhost:9001. Request `POST /api/assets/upload-url` with `filename`, `mime`, `size`; upload bytes to returned URL using HTTP PUT with matching Content-Type. Signed GET URL at `GET /api/assets/:id/url`.

## Verification
`GET /health` should return `{ "ok": true }`. Confirm draft is absent from delivery and appears after publishing. Inspect revision list after editing. No automated tests are bundled.
