# Low-Level Design — Entitlements

## Package identity
`@platform/entitlements` · `packages/entitlements/src/index.ts` · ESM/TypeScript.

## Implementation map
The exported interfaces, functions, and classes in `src/index.ts` are the **current executable contract**. Read that file before integrating; this document describes responsibilities rather than claiming unimplemented APIs exist.

## Implemented mechanics
- Input is represented by typed objects, with validation performed in the public entry points.
- Runtime state (if any) is held in process-local collections; no database, queue, cache or remote provider is installed by default.
- Any provider boundary is modeled using an explicit TypeScript interface where applicable.
- This first increment implements a **narrow vertical slice** of Entitlements + Usage Metering Platform, not every capability in the PDF.

## Detailed design constraints from PDF
• Expose a consistent entitlement-check API with explicit subject, resource, capability, and evaluation time. • Distinguish product authorization from commercial entitlement: a user may be authorized but not entitled to a feature. • Define whether each quota is advisory, soft-limited, or hard-enforced and where enforcement occurs. • Usage events are idempotent and auditable; billing calculations must be reconcilable to source events.

## Source-recommended implementation
• Create a versioned entitlement model and a central administrative workflow for plan changes. • Use local caches only with documented TTLs, invalidation, and safe behavior during control-plane outages. • Emit usage events at the authoritative point of consumption, not from unreliable UI interactions. • Build reconciliation jobs to compare source usage, metered usage, and billed quantities. • Provide sandbox plans and test fixtures for trial, upgrade, downgrade, suspension, and overage scenarios.

## Runtime behavior and error handling
• If entitlement evaluation is unavailable, choose behavior by capability risk: preserve safe reads where appropriate but do not grant expensive or restricted capabilities by default. • Prevent duplicate metering through idempotency keys and replay-safe ingestion. • Handle stale caches explicitly and expose the decision age for debugging.

## Data / trust / scalability
- Treat all external and event-driven inputs as untrusted.
- Do not infer authorization from presence of tenant metadata. Enforce trusted user/service identity upstream and at protected operations.
- Avoid in-memory state when multiple workers, nodes, regions or restarts are involved.
- Avoid universal exactly-once promises; choose explicit transactional/idempotent boundaries.
- Configure ownership, SLOs, observability, retention and operational alerts in the deployment environment.

## Extensibility
Add persistent adapters, metrics hooks, server-side enforcement, and explicit version migration policies before using this as critical production infrastructure.
