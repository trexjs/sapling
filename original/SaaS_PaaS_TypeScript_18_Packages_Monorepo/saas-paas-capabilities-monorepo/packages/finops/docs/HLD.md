# High-Level Design — Finops

## Source of truth
`references/O_Cost_Management_Resource_Accounting.pdf` (original supplied capability PDF, preserved verbatim).

## Intent and boundary
Attribute shared infrastructure consumption to the tenants, projects, services, and environments that cause it, then make cost, budget, and capacity signals actionable.

## Capability areas (from PDF)
Usage attribution Capture resource consumption with stable resource IDs, ownership tags, units, and time windows. Allocation and reporting Allocate shared and direct costs by tenant, project, service, and environment using documented methods. Budgets and alerts Support thresholds, forecasts, notifications, and escalation paths. Resource ownership Require cost owner, environment, service, and lifecycle metadata on billable resources. Waste detection Identify idle resources, oversized workloads, orphaned storage, and unused reserved capacity. Forecasting Estimate future spend and capacity needs from trends and planned growth. Showback and chargeback Provide transparent usage reporting and, where required, chargeback calculations.

## Proposed architecture
- **Package:** `@platform/finops`.
- **Entry point:** `src/index.ts`; typed public API, with a local/reference implementation.
- **Consumers:** domain services and shared infrastructure that need this capability.
- **Authority:** domain services continue to own product-specific business decisions.
- **Deployment:** this package is a library/contract, **not automatically a standalone microservice**. Persistent/shared concerns will need external adapters and an owner-operated control plane when productionized.
- **Request flow:** consumer → validate typed input → apply package policy/mechanics → interact with local adapter/state or injected external provider → return typed result/error.

## Original shared contracts
• Cost data includes source, unit, time interval, allocation method, and confidence or quality status. • Shared costs use documented allocation rules and are distinguishable from directly attributable costs. • Budgets trigger defined actions but should not unexpectedly interrupt critical workloads. • Resource metadata requirements are enforced at provisioning and periodically audited.

## Operations and failure semantics
• If usage data is delayed or incomplete, label reports as provisional and expose the missing interval. • Allocation changes must be versioned so historical reports remain explainable. • Automated cleanup should require safeguards for production resources and preserve recovery options.

## Capability metrics from source
• Percentage of spend with known owner • Invoice reconciliation variance • Budget forecast accuracy • Idle-resource spend • Cost per tenant or unit of product value

## Architecture decisions
1. Use standalone packages to maintain versioned, independently consumable contracts.
2. Prefer dependency inversion; provide injected adapters for infrastructure-backed operations.
3. Scope state by tenant wherever applicable, with server-side authorization remaining authoritative.
4. Memory-backed reference implementations are non-durable and unsuitable for distributed operation without an adapter.
