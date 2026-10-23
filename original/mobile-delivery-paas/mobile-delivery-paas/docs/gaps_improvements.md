# Gaps and improvements — must-read

This repository is an **implementable control-plane starter**, not a complete release product. The user-requested full feature set is **not yet implemented**. No end-to-end deployment or OTA smoke tests have been run.

## Blocking production gaps
1. **OTA**: Expo Updates manifest generation, correct multipart/JSON protocol responses, content hashes, asset publication, ECDSA signing, request negotiation, rollback directive and client integration tests. Current endpoint is an illustrative stub. Worker explicitly fails closed for OTA.
2. **Android/iOS native builds**: secure signing, Fastlane lane templates, build artifact discovery/upload, Google Play and App Store Connect API key integration, Xcode provisioning and real Mac runner fleet. Current worker invokes project-defined Fastlane lanes only.
3. **Store status**: asynchronous review status reconciliation, TestFlight/Play internal tracks, phased release, rejection handling, staged rollout, manual approval.
4. **Worker isolation**: replace local shell execution with sandboxed ephemeral Linux VMs and dedicated macOS hosts; protect secrets and network access. Implement fair scheduling, cancellation, timeouts, retry classes, and heartbeat.
5. **Auth/tenancy**: SSO/OIDC, user membership, role and approval enforcement, Postgres RLS, key rotation/revocation, audit retention and immutable log export.
6. **Repo integrations**: GitHub/GitLab App OAuth, signed webhooks, commit SHA pinning, pull request policies and protected branch checks.
7. **Reliability**: transactional outbox for DB->queue enqueue, idempotency keys, API pagination, distributed tracing, metrics, backup/restore, quota enforcement, error classification.
8. **Security**: OpenBao integration, build attestations, SBOM, package scanning, audit logging, HTTPS-only ingress, OTA update signing, per-app install identifiers and anti-abuse.
9. **UI**: onboarding wizard, release approvals, live log streaming, OTA management, rollout dashboard, store status and secrets workflows.
10. **Testing**: unit, integration, e2e, emulator/device smoke tests, store sandbox tests, OTA compatibility matrix, load and penetration tests (intentionally skipped for now).

## Known implementation constraints
- Expo vs bare is stored but worker uses same Expo CLI for OTA; bare projects require expo-updates and Expo Modules configured.
- Project Fastlane lanes must be supplied by each repository.
- API exposes rollout control but OTA updates are not yet created by a publishing path.
- Bootstrap allows one organization only; additional organization provisioning requires a secure admin API.
- Monorepo TypeScript builds may need workspace package export/build-order refinements; build not verified here.

## Suggested milestones
M1 harden control plane + Android signing/publishing; M2 macOS runners and iOS publishing; M3 fully compliant signed OTA service; M4 enterprise governance and rollout automation.
