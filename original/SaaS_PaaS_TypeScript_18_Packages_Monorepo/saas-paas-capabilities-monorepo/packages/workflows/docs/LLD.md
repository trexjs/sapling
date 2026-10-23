# Low-Level Design — Workflows

## Package identity
`@platform/workflows` · `packages/workflows/src/index.ts` · ESM/TypeScript.

## Implementation map
The exported interfaces, functions, and classes in `src/index.ts` are the **current executable contract**. Read that file before integrating; this document describes responsibilities rather than claiming unimplemented APIs exist.

## Implemented mechanics
- Input is represented by typed objects, with validation performed in the public entry points.
- Runtime state (if any) is held in process-local collections; no database, queue, cache or remote provider is installed by default.
- Any provider boundary is modeled using an explicit TypeScript interface where applicable.
- This first increment implements a **narrow vertical slice** of Workflow Runtime, not every capability in the PDF.

## Detailed design constraints from PDF
• Each workflow declares inputs, outputs, version, timeout, retry policy, idempotency strategy, and compensation behavior. • Activities are designed to be idempotent because retries may repeat execution. • Human approvals and administrative overrides are auditable. • Workflow definitions distinguish retryable, terminal, and compensatable failures.

## Source-recommended implementation
• Use a durable workflow engine or equivalent persisted state-machine runtime rather than in-memory orchestration for critical processes. • Define activity contracts and isolate external side effects behind idempotent adapters. • Provide operational tooling for pause, resume, retry, cancel, and inspect, with role-based permissions. • Test process crashes, duplicate signals, late callbacks, and definition upgrades. • Use workflow-specific dashboards and alerts for stuck or repeatedly failing executions.

## Runtime behavior and error handling
• Retries use bounded exponential backoff with jitter and a maximum attempt or time budget. • Compensation failures remain visible and require retry or operator intervention; do not mark the workflow successful. • Unknown workflow versions must be quarantined or handled through a documented migration path.

## Data / trust / scalability
- Treat all external and event-driven inputs as untrusted.
- Do not infer authorization from presence of tenant metadata. Enforce trusted user/service identity upstream and at protected operations.
- Avoid in-memory state when multiple workers, nodes, regions or restarts are involved.
- Avoid universal exactly-once promises; choose explicit transactional/idempotent boundaries.
- Configure ownership, SLOs, observability, retention and operational alerts in the deployment environment.

## Extensibility
Add persistent adapters, metrics hooks, server-side enforcement, and explicit version migration policies before using this as critical production infrastructure.
