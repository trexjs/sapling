# High-Level Design — Entitlements

## Source of truth
`references/F_Entitlements_Plans_Commercial_Controls.pdf` (original supplied capability PDF, preserved verbatim).

## Intent and boundary
Give product domains a single, reliable way to evaluate plan capabilities, quotas, trials, subscription states, and billable usage without duplicating commercial policy.

## Capability areas (from PDF)
Plans and entitlements Represent plans, feature capabilities, limits, add-ons, and customer-specific grants. Subscription lifecycle Model trial, active, grace, suspended, canceled, and grandfathered states with explicit transitions. Usage metering Collect billable events with stable schemas, timestamps, units, source identity, and deduplication keys. Limits and overages Support soft warnings, hard enforcement, burst allowances, overage policies, and quota windows. Caching and invalidation Define safe caching for entitlement decisions and reliable invalidation when commercial state changes. Migration Support plan changes, grandfathered customers, staged migrations, and rollback or reconciliation procedures.

## Proposed architecture
- **Package:** `@platform/entitlements`.
- **Entry point:** `src/index.ts`; typed public API, with a local/reference implementation.
- **Consumers:** domain services and shared infrastructure that need this capability.
- **Authority:** domain services continue to own product-specific business decisions.
- **Deployment:** this package is a library/contract, **not automatically a standalone microservice**. Persistent/shared concerns will need external adapters and an owner-operated control plane when productionized.
- **Request flow:** consumer → validate typed input → apply package policy/mechanics → interact with local adapter/state or injected external provider → return typed result/error.

## Original shared contracts
• Expose a consistent entitlement-check API with explicit subject, resource, capability, and evaluation time. • Distinguish product authorization from commercial entitlement: a user may be authorized but not entitled to a feature. • Define whether each quota is advisory, soft-limited, or hard-enforced and where enforcement occurs. • Usage events are idempotent and auditable; billing calculations must be reconcilable to source events.

## Operations and failure semantics
• If entitlement evaluation is unavailable, choose behavior by capability risk: preserve safe reads where appropriate but do not grant expensive or restricted capabilities by default. • Prevent duplicate metering through idempotency keys and replay-safe ingestion. • Handle stale caches explicitly and expose the decision age for debugging.

## Capability metrics from source
• Entitlement decision latency and error rate • Quota enforcement correctness • Metering-to-billing reconciliation variance • Duplicate or missing usage events • Stale entitlement cache duration

## Architecture decisions
1. Use standalone packages to maintain versioned, independently consumable contracts.
2. Prefer dependency inversion; provide injected adapters for infrastructure-backed operations.
3. Scope state by tenant wherever applicable, with server-side authorization remaining authoritative.
4. Memory-backed reference implementations are non-durable and unsuitable for distributed operation without an adapter.
