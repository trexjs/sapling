# Sapling Internal Cloud — Product Requirements

## Audience
Internal platform engineers, developers, security engineers, finance, SRE and administrators.

## Goal
A unified self-service infrastructure cloud: 12 domains A–L, consistent tenant/project scoping, resource requests, desired state, auditable operations, console and TypeScript SDK. PaaS product integrations are explicitly excluded for now.

## Scope and acceptance
Every domain must appear in catalog, UI and SDK, with resource types documented in `CAPABILITY_MATRIX.md`. Baseline functionality: create/list desired-state requests; log queued operations and audit events. **This is not equivalent to provisioning or executing those resources.** Full functional acceptance requires provider integration, controllers, RBAC, state transitions, operational safeguards and tests.

## Nonfunctional targets (future acceptance)
99.9% API availability; tenant isolation with verified access controls; encryption at rest and in transit; audit retention policy; idempotent operations; recovery objectives per service; rate limits; disaster recovery exercises; policy-enforced provisioning; accessible UI.

## Out of scope
PaaS-specific business implementations; billing engine; actual provider resources in this initial repository.
