# Low-level design

## API
- `POST /v1/bootstrap` bootstrap first organization/admin key (one time).
- `POST /v1/keys` admin key issuance.
- `GET /v1/projects`, `POST /v1/projects` organization-scoped projects.
- `GET /v1/projects/:id/releases`, `POST /v1/projects/:id/releases` queue releases.
- `GET /v1/releases/:id` release status.
- `POST /v1/ota/:id/rollout` admin rollout control.
- `GET /updates/:projectId` experimental OTA discovery, **not protocol-complete**.

## Data model
organizations -> projects -> releases; organizations -> api_keys; projects -> ota_updates; organizations -> audit_events. UUID keys; tenant access enforced in handlers. Implement stronger row-level security and cross-table constraints for production.

## Worker state machine
`queued -> running -> submitted | failed`. Submitted means Fastlane lane returned, **not** store approved. A later store reconciliation controller must transition uploaded/review/approved/live states.

## Expo and bare integration
Both app types can use `expo-updates` once installed/configured in native projects. For bare RN, Expo Modules and `expo-updates` native integration is required; runtime version and update URL must be embedded in the binary. Avoid silently claiming a bare project is OTA-ready without verifying that setup.

## OTA compatibility
Match `platform + runtimeVersion + channel`; staged rollout based on a stable, privacy-safe install identifier. Protocol response must include correct manifest, asset URLs, checksums, and code signing headers. Current endpoint is an unfinished scaffold and is unsafe for live apps.
