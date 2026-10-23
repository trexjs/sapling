# Low-Level Design — Finops

## Package identity
`@platform/finops` · `packages/finops/src/index.ts` · ESM/TypeScript.

## Implementation map
The exported interfaces, functions, and classes in `src/index.ts` are the **current executable contract**. Read that file before integrating; this document describes responsibilities rather than claiming unimplemented APIs exist.

## Implemented mechanics
- Input is represented by typed objects, with validation performed in the public entry points.
- Runtime state (if any) is held in process-local collections; no database, queue, cache or remote provider is installed by default.
- Any provider boundary is modeled using an explicit TypeScript interface where applicable.
- This first increment implements a **narrow vertical slice** of FinOps + Resource Accounting, not every capability in the PDF.

## Detailed design constraints from PDF
• Cost data includes source, unit, time interval, allocation method, and confidence or quality status. • Shared costs use documented allocation rules and are distinguishable from directly attributable costs. • Budgets trigger defined actions but should not unexpectedly interrupt critical workloads. • Resource metadata requirements are enforced at provisioning and periodically audited.

## Source-recommended implementation
• Ingest cloud and platform usage data into a normalized accounting model. • Join usage to authoritative tenant, project, service, and environment ownership records. • Create dashboards for spend, unit economics, budget variance, and resource efficiency. • Provide recommendations with estimated savings and risk context. • Reconcile platform accounting data with provider invoices and billing exports.

## Runtime behavior and error handling
• If usage data is delayed or incomplete, label reports as provisional and expose the missing interval. • Allocation changes must be versioned so historical reports remain explainable. • Automated cleanup should require safeguards for production resources and preserve recovery options.

## Data / trust / scalability
- Treat all external and event-driven inputs as untrusted.
- Do not infer authorization from presence of tenant metadata. Enforce trusted user/service identity upstream and at protected operations.
- Avoid in-memory state when multiple workers, nodes, regions or restarts are involved.
- Avoid universal exactly-once promises; choose explicit transactional/idempotent boundaries.
- Configure ownership, SLOs, observability, retention and operational alerts in the deployment environment.

## Extensibility
Add persistent adapters, metrics hooks, server-side enforcement, and explicit version migration policies before using this as critical production infrastructure.
