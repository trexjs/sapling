# Low-Level Design

## Routes
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /auth/register | Public | Create account and issue JWT |
| POST | /auth/login | Public | Verify password and issue JWT |
| GET/POST | /projects | Bearer JWT | List/create owned projects |
| GET/POST | /projects/:id/keys | Bearer JWT | List/generate keys |
| DELETE | /projects/:id/keys/:keyId | Bearer JWT | Revoke key |
| GET | /projects/:id/usage | Bearer JWT | Recent usage |
| POST | /v1/search | x-api-key | Query search provider |
| POST | /v1/extract | x-api-key | Extract HTML text |
| POST | /v1/map | x-api-key | Collect same-domain links from one page |
| POST | /v1/crawl | x-api-key | Bounded breadth-first crawl |

## Persistence
`users(id,email,password_hash,created_at)`; `projects(id,owner_id,name,created_at)`; `api_keys(id,project_id,name,key_prefix,key_hash,revoked_at,created_at)`; `usage(id,project_id,operation,status,created_at)`.

## Request lifecycle
Validate API key hash and active status -> validate request schema -> execute adapter/fetcher -> record operation status -> JSON response. Errors use `{error:{code,message,details?}}`.

## Crawler algorithm
Queue starts at root depth 0. Pop first URL; skip visited; fetch bounded HTML; save text; add same-host links until depth, queue and page caps. Map extracts links from only the starting page, not a complete sitemap. Robots.txt, canonicalization, content deduplication and distributed scheduling are future work.

## Security limitations
URL checks reject obvious private IPs and IPv6 literals after DNS resolution, and disallow redirects, but fetch does a new DNS resolution; therefore DNS rebinding remains possible. Egress firewall or proxy with pinned resolved addresses is mandatory before public release. Search and crawler also lack tenant quotas.
