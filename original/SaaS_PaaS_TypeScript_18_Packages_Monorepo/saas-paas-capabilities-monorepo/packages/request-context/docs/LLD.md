# Low-Level Design — Request Context

## Package identity
`@platform/request-context` · `packages/request-context/src/index.ts` · ESM/TypeScript.

## Implementation map
The exported interfaces, functions, and classes in `src/index.ts` are the **current executable contract**. Read that file before integrating; this document describes responsibilities rather than claiming unimplemented APIs exist.

## Implemented mechanics
- Input is represented by typed objects, with validation performed in the public entry points.
- Runtime state (if any) is held in process-local collections; no database, queue, cache or remote provider is installed by default.
- Any provider boundary is modeled using an explicit TypeScript interface where applicable.
- This first increment implements a **narrow vertical slice** of Request Context SDK, not every capability in the PDF.

## Detailed design constraints from PDF
• Use a versioned context schema with required, optional, and prohibited fields. • Never trust tenant IDs or actor claims solely because they arrived in a header or message payload. • Define context propagation rules for HTTP, RPC, events, jobs, and scheduled tasks. • Keep secrets, access tokens, and unnecessary personal data out of context envelopes.

## Source-recommended implementation
• Provide language-specific middleware and SDK adapters for incoming requests, outgoing calls, and message handlers. • Generate trace and request identifiers at trusted boundaries when absent. • Use allowlists for fields crossing trust boundaries and validate all propagated values. • Set explicit deadline defaults and maximums; distinguish an absent deadline from an unlimited deadline. • Define how context is reconstructed for scheduled work that has no live initiating request.

## Runtime behavior and error handling
• If optional context is malformed, reject or discard it according to the field's trust level and emit diagnostics. • If a deadline expires, cancel downstream work and return a standardized timeout outcome. • If tenant or actor context required for authorization is missing, fail closed rather than guessing.

## Data / trust / scalability
- Treat all external and event-driven inputs as untrusted.
- Do not infer authorization from presence of tenant metadata. Enforce trusted user/service identity upstream and at protected operations.
- Avoid in-memory state when multiple workers, nodes, regions or restarts are involved.
- Avoid universal exactly-once promises; choose explicit transactional/idempotent boundaries.
- Configure ownership, SLOs, observability, retention and operational alerts in the deployment environment.

## Extensibility
Add persistent adapters, metrics hooks, server-side enforcement, and explicit version migration policies before using this as critical production infrastructure.
