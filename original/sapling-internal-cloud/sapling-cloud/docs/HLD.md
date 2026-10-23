# High-Level Design

```mermaid
flowchart TD
 User[Platform developer] --> Console[React Cloud Console]
 User --> SDK[TypeScript Cloud SDK]
 Console --> API[Express Control Plane API]
 SDK --> API
 API --> Auth[Bootstrap admin auth - replace with IdentityOS later]
 API --> DB[(PostgreSQL / Drizzle)]
 API --> Op[Durable operation queue table]
 Op -. future .-> Recon[Reconciliation workers]
 Recon -. future .-> IaC[OpenTofu / Kubernetes / Cloud APIs]
 IaC -. future .-> Infra[Compute Network Storage Clusters]
 API -. future .-> PaaS[Existing Sapling PaaS connectors]
```

All A–L domains are represented as catalog entries and resource kinds. A single generic resource request model is intentionally a bootstrap scaffold; production domain APIs require typed specs, validation and reconcilers. No existing PaaS code is copied.

Trust boundaries: console is untrusted, bearer token required for /v1, PostgreSQL is the control-plane state store. Current tenant headers are **not trustworthy authorization** and must be replaced before multi-user deployment.
