# Product requirements

## Vision
A multi-tenant internal mobile delivery PaaS supporting Expo and bare React Native apps, iOS and Android native builds, store distribution, and safe OTA updates.

## Roles
Platform administrator, mobile developer, release approver, read-only observer.

## Capabilities
- Register and isolate organization projects; store Git HTTPS repository and framework.
- Trigger platform-specific builds from approved Git refs; inspect status and logs.
- Produce signed Android AAB / iOS IPA with project-controlled signing.
- Publish to Google Play tracks and App Store Connect/TestFlight using Fastlane.
- Publish compatible JavaScript and asset OTA updates with Expo Updates protocol, signed manifests, channels, runtimeVersion and deterministic staged rollouts.
- Audit changes, rotate credentials, protect secrets, enforce approvals and quotas.

## Acceptance criteria
A complete implementation must demonstrate repeatable signed store uploads on both platforms, compatible OTA delivery and rollback on both frameworks, tenant isolation, and hardened isolated runners. **This starter does not yet satisfy those criteria.**
