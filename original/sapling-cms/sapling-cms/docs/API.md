# REST API reference

| Method | Path | Access |
|---|---|---|
| GET | /health | Public |
| POST | /api/auth/bootstrap | Public, first-run only |
| POST | /api/auth/login | Public |
| GET/POST | /api/models | Auth / Admin |
| DELETE | /api/models/:slug | Admin |
| GET/POST | /api/content/:model | Auth / Editor |
| PATCH/DELETE | /api/content/:model/:id | Editor |
| POST | /api/content/:model/:id/publish | Editor |
| POST | /api/content/:model/:id/unpublish | Editor |
| GET | /api/delivery/:model | Public, published only |
| GET | /api/revisions/:id | Auth |
| POST | /api/revisions/:id/restore/:version | Editor |
| GET/POST | /api/locales | Auth / Admin |
| GET | /api/assets | Auth |
| POST | /api/assets/upload-url | Editor |
| GET | /api/assets/:id/url | Auth |
| GET/POST | /api/webhooks | Admin |
| GET | /api/audit | Admin |

Auth uses `Authorization: Bearer <jwt>`. Entries accept `{data:{...},locale:"en"}`; list accepts `locale`, `status`, `limit`, `offset`. API has no OpenAPI generation yet.
