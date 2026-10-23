# API contracts (initial implementation)

All `/v1/**` routes require `x-admin-api-key` for development. Tenant endpoints include `/v1/tenants/:tenantId`. JSON input is validated with Zod in `packages/contracts`.

| Method | Path suffix | Purpose |
|---|---|---|
| POST | `/v1/bootstrap` | Create tenant (development admin) |
| GET/POST | `/products` | List/create catalog |
| GET/POST | `/orders` | List/create order (idempotency key in body) |
| POST | `/orders/:orderId/simulate-settlement` | **Demo only**, posts ledger and entitlement |
| GET | `/invoices` | List invoices |
| GET | `/payments` | List simulated payments |
| GET | `/entitlements` | List granted entitlements |
| POST | `/licenses` | Issue one license per paid order, return raw secret once |
| POST | `/licenses/verify` | Validate hash/expiry/revocation |
| GET/POST | `/subscriptions` | List and register schedule metadata; **no recurring charging** |
| GET/POST | `/affiliates` | List/register affiliate definitions; **no attribution/payouts** |
| GET | `/ledger` | Read example postings |
| GET | `/audit` | Read basic audit records |

Error shape: `{"error":{"code":"VALIDATION_ERROR","message":"...","requestId":"..."}}`.

Example:
```bash
curl -X POST http://localhost:4000/v1/tenants/TENANT_UUID/products \
  -H 'content-type: application/json' -H 'x-admin-api-key: YOUR_DEV_KEY' \
  -d '{"name":"Ebook","description":"PDF download","priceMinor":999,"currency":"USD"}'
```

Not yet implemented: customer-facing checkout auth, OpenAPI generation, pagination, webhook signatures, payment gateway, prorations, refunds, taxes, delivery downloads, secure customer portal.
