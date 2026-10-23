# High-level design

```mermaid
flowchart TD
 Git[Git Repository] --> API[Express Control Plane]
 UI[React Dashboard] --> API
 SDK[TypeScript SDK] --> API
 API --> PG[(PostgreSQL / Drizzle)]
 API --> Q[(Valkey / BullMQ)]
 Q --> Linux[Linux Android Runner]
 Q --> Mac[macOS iOS Runner]
 Linux --> Store[Fastlane Store APIs]
 Mac --> Store
 Linux --> S3[(MinIO)]
 Mac --> S3
 API --> OTA[Expo Updates Protocol Endpoint]
 OTA --> S3
 OTA --> Devices[React Native Devices]
```

Isolation boundaries: organization-scoped records and API keys, per-job ephemeral workspaces, separate Linux/macOS runners, private credentials, content-addressed immutable artifacts. Public OTA endpoint must authenticate assets and sign protocol responses before production use.
