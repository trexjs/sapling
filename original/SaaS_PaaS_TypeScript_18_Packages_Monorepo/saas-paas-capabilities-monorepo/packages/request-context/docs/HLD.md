# High-Level Design — Request Context

## Source of truth
`references/C_Context_Propagation_Request_Lifecycle.pdf` (original supplied capability PDF, preserved verbatim).

## Intent and boundary
Carry trusted request metadata consistently across API calls, service-to-service calls, queues, scheduled jobs, and background workers while preserving deadlines, identity, and traceability.

## Capability areas (from PDF)
Correlation and tracing Propagate request IDs, correlation IDs, and trace context across synchronous and asynchronous boundaries. Tenant and actor context Represent tenant, organization, authenticated subject, initiating actor, and delegated actor separately. Locale and region Carry locale, time zone, and regional routing context where relevant. Deadlines and cancellation Propagate request deadlines and cancellation signals so downstream work does not continue needlessly after the caller has abandoned it. Trusted identity Distinguish authenticated workload identity from user-supplied metadata. Define how delegated authorization context is validated. Async propagation Serialize an allowlisted context envelope into messages and scheduled work, with validation at consumption time.

## Proposed architecture
- **Package:** `@platform/request-context`.
- **Entry point:** `src/index.ts`; typed public API, with a local/reference implementation.
- **Consumers:** domain services and shared infrastructure that need this capability.
- **Authority:** domain services continue to own product-specific business decisions.
- **Deployment:** this package is a library/contract, **not automatically a standalone microservice**. Persistent/shared concerns will need external adapters and an owner-operated control plane when productionized.
- **Request flow:** consumer → validate typed input → apply package policy/mechanics → interact with local adapter/state or injected external provider → return typed result/error.

## Original shared contracts
• Use a versioned context schema with required, optional, and prohibited fields. • Never trust tenant IDs or actor claims solely because they arrived in a header or message payload. • Define context propagation rules for HTTP, RPC, events, jobs, and scheduled tasks. • Keep secrets, access tokens, and unnecessary personal data out of context envelopes.

## Operations and failure semantics
• If optional context is malformed, reject or discard it according to the field's trust level and emit diagnostics. • If a deadline expires, cancel downstream work and return a standardized timeout outcome. • If tenant or actor context required for authorization is missing, fail closed rather than guessing.

## Capability metrics from source
• Percentage of requests with complete trace linkage • Missing or invalid tenant context incidents • Work canceled after deadline • Context schema compatibility errors

## Architecture decisions
1. Use standalone packages to maintain versioned, independently consumable contracts.
2. Prefer dependency inversion; provide injected adapters for infrastructure-backed operations.
3. Scope state by tenant wherever applicable, with server-side authorization remaining authoritative.
4. Memory-backed reference implementations are non-durable and unsuitable for distributed operation without an adapter.
