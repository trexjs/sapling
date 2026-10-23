# High-Level Design — Workflows

## Source of truth
`references/G_Workflow_State_Machine_Infrastructure.pdf` (original supplied capability PDF, preserved verbatim).

## Intent and boundary
Run long-lived, multi-step business and infrastructure processes reliably across services, including retries, human approvals, compensation, and recovery after failures.

## Capability areas (from PDF)
Durable orchestration Persist workflow state and resume execution after process or infrastructure restarts. Human approvals Model approvals, rejections, timeouts, delegation, and audit history. Versioning and migration Keep active workflows compatible as definitions change; provide explicit migration paths. Compensation and sagas Define compensating actions for partial completion where true distributed transactions are unavailable. Concurrency and timeouts Coordinate concurrent operations, enforce deadlines, and prevent duplicate execution. Operational visibility Expose workflow status, step history, retry state, owner, and recovery actions.

## Proposed architecture
- **Package:** `@platform/workflows`.
- **Entry point:** `src/index.ts`; typed public API, with a local/reference implementation.
- **Consumers:** domain services and shared infrastructure that need this capability.
- **Authority:** domain services continue to own product-specific business decisions.
- **Deployment:** this package is a library/contract, **not automatically a standalone microservice**. Persistent/shared concerns will need external adapters and an owner-operated control plane when productionized.
- **Request flow:** consumer → validate typed input → apply package policy/mechanics → interact with local adapter/state or injected external provider → return typed result/error.

## Original shared contracts
• Each workflow declares inputs, outputs, version, timeout, retry policy, idempotency strategy, and compensation behavior. • Activities are designed to be idempotent because retries may repeat execution. • Human approvals and administrative overrides are auditable. • Workflow definitions distinguish retryable, terminal, and compensatable failures.

## Operations and failure semantics
• Retries use bounded exponential backoff with jitter and a maximum attempt or time budget. • Compensation failures remain visible and require retry or operator intervention; do not mark the workflow successful. • Unknown workflow versions must be quarantined or handled through a documented migration path.

## Capability metrics from source
• Workflow completion and failure rates • Age of oldest running workflow • Retries per activity • Compensation failure rate • Time spent awaiting human approval

## Architecture decisions
1. Use standalone packages to maintain versioned, independently consumable contracts.
2. Prefer dependency inversion; provide injected adapters for infrastructure-backed operations.
3. Scope state by tenant wherever applicable, with server-side authorization remaining authoritative.
4. Memory-backed reference implementations are non-durable and unsuitable for distributed operation without an adapter.
