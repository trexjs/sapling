# High-Level Design

```mermaid
flowchart TB
  UI[React Governance Console] --> C[Consent Express API]
  UI --> G[Compliance Express API]
  SDK[Consent Browser SDK] --> C
  EXT[External Compliance SDK] --> G
  C --> DB[(Postgres consent schema)]
  G --> DB2[(Postgres compliance schema)]
  C -. future .-> ID[IdentityOS]
  G -. future .-> ID
  C -. future .-> AUD[AuditOS]
  G -. future .-> AUD
  G -. future .-> DOC[DocumentOS]
  C -. future .-> WF[Workflow Engine]
  G -. future .-> WF
```

## Boundaries
Each service owns its schema. No cross-service direct table access. Future integration via versioned API contracts, outbox and asynchronous events. A single console can deploy independently of either API.

## Availability & scalability
Use stateless APIs, horizontal pod autoscaling, bounded queues and backpressure, connection pooling, regional data residency and backups. None of these are configured for production in the current repo.

## Trust boundaries
Public browser SDK endpoints must not accept arbitrary tenant headers. Domain verification, API key scoping, signed configuration, replay resistance and rate limiting are required. IdentityOS authentication is a mandatory production dependency.
