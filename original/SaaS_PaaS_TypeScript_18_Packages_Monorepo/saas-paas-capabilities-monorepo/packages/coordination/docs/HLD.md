# High-Level Design — Coordination

## Source of truth
`references/J_Concurrency_Coordination.pdf` (original supplied capability PDF, preserved verbatim).

## Intent and boundary
Provide clear, bounded coordination primitives for services and workers that share resources, while avoiding unrealistic guarantees such as universal exactly-once execution.

## Capability areas (from PDF)
Optimistic concurrency Use versions, ETags, compare-and-swap, or conditional writes to prevent lost updates. Leases and locks Provide time-bounded distributed leases with fencing tokens where stale holders could cause damage. Duplicate detection Deduplicate messages and commands using stable idempotency keys and bounded retention. Ordering and partitioning Define per-key ordering guarantees and partition strategy for messages and events. Conflict resolution Document conflict detection and domain-owned resolution policies. Backpressure Use bounded queues, concurrency limits, and load shedding to protect dependencies. Fairness Support per-tenant and per-resource concurrency caps to prevent noisy-neighbor effects.

## Proposed architecture
- **Package:** `@platform/coordination`.
- **Entry point:** `src/index.ts`; typed public API, with a local/reference implementation.
- **Consumers:** domain services and shared infrastructure that need this capability.
- **Authority:** domain services continue to own product-specific business decisions.
- **Deployment:** this package is a library/contract, **not automatically a standalone microservice**. Persistent/shared concerns will need external adapters and an owner-operated control plane when productionized.
- **Request flow:** consumer → validate typed input → apply package policy/mechanics → interact with local adapter/state or injected external provider → return typed result/error.

## Original shared contracts
• Every coordination primitive states its consistency model, expiry behavior, and failure assumptions. • Locks are not substitutes for idempotency or transactional storage constraints. • Consumers explicitly document at-most-once, at-least-once, or other delivery semantics. • Fencing tokens or equivalent safeguards are used when an expired lock holder could still act.

## Operations and failure semantics
• If lock ownership cannot be confirmed, protected writes must reject stale fencing tokens. • On queue saturation, apply documented backpressure or load shedding rather than unbounded memory growth. • Duplicate messages should be harmless, observable, and safe to retry.

## Capability metrics from source
• Lock/lease contention and expiry • Duplicate message rate • Queue depth and age • Optimistic conflict rate • Per-tenant fairness and throttling events

## Architecture decisions
1. Use standalone packages to maintain versioned, independently consumable contracts.
2. Prefer dependency inversion; provide injected adapters for infrastructure-backed operations.
3. Scope state by tenant wherever applicable, with server-side authorization remaining authoritative.
4. Memory-backed reference implementations are non-durable and unsuitable for distributed operation without an adapter.
