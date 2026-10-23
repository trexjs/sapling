# Quick Start Guide

## Prerequisites
Node 22+, npm, Docker. From the repository root:

```bash
cp .env.example .env
# Edit .env with a long random JWT_SECRET and Brave Search API key.
set -a; source .env; set +a
docker compose up -d
npm install
npm run db:generate
npm run db:migrate
npm run dev:api
# In another terminal:
npm run dev:web
```

Open `http://localhost:5173`. Register with a password of at least 12 characters. Create a project and API key (copy it immediately).

```bash
curl -X POST http://localhost:4000/v1/extract \
  -H 'content-type: application/json' -H "x-api-key: $ATLAS_API_KEY" \
  -d '{"urls":["https://example.com"]}'
```

Search uses `BRAVE_SEARCH_API_KEY`; map and crawl use outbound HTTP. Crawling arbitrary untrusted URLs is **not safe for public deployment** without network-level egress restrictions; see gaps.

## SDK
```ts
import {AtlasClient} from '@atlas/sdk';
const client=new AtlasClient({apiKey:process.env.ATLAS_API_KEY!,baseUrl:'http://localhost:4000'});
console.log(await client.search({query:'TypeScript release notes',limit:3}));
console.log(await client.extract({urls:['https://example.com']}));
console.log(await client.map({url:'https://example.com'}));
console.log(await client.crawl({url:'https://example.com',limit:3,depth:1}));
```

SDK keys belong on trusted servers, never in browser bundles. For development use the API playground; it stores the account JWT in sessionStorage and keeps generated API keys in React state only.
