# Low-Level Design

## Entities
`cloud_resources`: tenant/project/capability/kind/name/spec/status/generation. `cloud_operations`: queued operations. `cloud_audit`: actor/action metadata.

## API
`GET /health`; authenticated `GET /v1/catalog`, `GET /v1/resources?capability=`, `POST /v1/resources`, `GET /v1/operations`, `GET /v1/audit`.

## Create request sequence
```mermaid
sequenceDiagram
participant U as Console/SDK
participant A as API
participant P as Postgres
U->>A: POST resource request
A->>A: Authenticate bootstrap token; validate catalog kind
A->>P: Insert requested resource
A->>P: Insert queued operation
A->>P: Insert audit event
A-->>U: 201 requested resource
Note over A,P: No infrastructure provisioning occurs
```

## Production improvements
Use a single database transaction for resource/operation/audit writes; idempotency key unique per tenant; outbox and at-least-once reconciler; optimistic concurrency; deletion finalizers; policy admission; per-domain Zod schemas; scoped JWT auth; resource state machine; pagination; server-side search; signed audit integrity; observability instrumentation.
