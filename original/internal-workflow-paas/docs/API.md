# HTTP API reference

Base URL: `http://localhost:4000`. Auth: `x-api-key: flow_...` unless stated.

| Method | Path | Description |
|---|---|---|
| GET | /health | Health probe |
| POST | /v1/admin/projects | Provision tenant/project/key (`x-admin-key`) |
| POST | /v1/functions/register | Register function versions |
| POST | /v1/events | Ingest event, optional `idempotency-key` |
| GET | /v1/runs | Latest 100 project runs |
| GET | /v1/runs/:id | Run with checkpoints |
| POST | /v1/runs/:id/cancel | Set cancelled state |
| POST | /v1/runs/:id/replay | New run from old input |
| POST | /v1/internal/steps | Read/write checkpoint (executor only by convention) |
| GET | /v1/workflows | List saved graphs |
| POST | /v1/workflows | Save graph JSON |
| GET | /v1/audit | Latest 100 audit records |

## Event request
```json
{"name":"order.created","data":{"orderId":"123"},"id":"optional-id"}
```

## Function registration
```json
{"functions":[{"id":"order-confirmation","event":"order.created","endpoint":"http://localhost:4100/execute","retries":5,"concurrency":10,"priority":1,"timeoutMs":30000}]}
```

## Checkpoint call
```json
{"runId":"uuid","stepId":"charge","method":"get"}
```
`put` also accepts `result`. Production must use scoped short-lived execution tokens rather than project API keys for internal step calls.
