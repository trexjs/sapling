# High-Level Design — Audit Compliance

## Source of truth
`references/M_Auditability_Compliance_Evidence.pdf` (original supplied capability PDF, preserved verbatim).

## Intent and boundary
Create trustworthy records of security-sensitive and business-significant actions and make evidence collection repeatable for audits, access reviews, and regulatory obligations.

## Capability areas (from PDF)
Audit record integrity Use append-oriented, access-controlled, and where needed tamper-evident records. Administrative history Record actor, action, target, timestamp, outcome, and relevant change summary. Policy-decision history Capture decision identifiers and reason codes while minimizing sensitive data. Access reviews Support periodic permission recertification, exceptions, and remediation tracking. Evidence collection Collect configuration, deployment, control-test, and operational evidence with provenance. Retention and legal hold Apply distinct retention and access rules to audit records and compliance artifacts. Data-subject requests Track privacy access, export, correction, and erasure workflows end to end. Separation of duties Require independent approvals for high-risk operations where policy demands it.

## Proposed architecture
- **Package:** `@platform/audit-compliance`.
- **Entry point:** `src/index.ts`; typed public API, with a local/reference implementation.
- **Consumers:** domain services and shared infrastructure that need this capability.
- **Authority:** domain services continue to own product-specific business decisions.
- **Deployment:** this package is a library/contract, **not automatically a standalone microservice**. Persistent/shared concerns will need external adapters and an owner-operated control plane when productionized.
- **Request flow:** consumer → validate typed input → apply package policy/mechanics → interact with local adapter/state or injected external provider → return typed result/error.

## Original shared contracts
• Audit records are distinct from debug logs, security telemetry, and business analytics. • Events use a stable schema and include actor, action, target, time, result, source, and correlation identifiers where appropriate. • Audit writers cannot freely rewrite historical records; administrative access is tightly controlled. • Compliance evidence records its collection time, source, scope, and integrity metadata.

## Operations and failure semantics
• Critical audit capture failures should alert and may block high-risk operations according to policy. • Evidence gaps must be reported as gaps rather than silently treated as compliant. • Retention changes require authorization and an auditable change record.

## Capability metrics from source
• Audit event coverage for critical actions • Evidence collection freshness • Access-review completion rate • Audit pipeline lag and loss • Overdue remediation items

## Architecture decisions
1. Use standalone packages to maintain versioned, independently consumable contracts.
2. Prefer dependency inversion; provide injected adapters for infrastructure-backed operations.
3. Scope state by tenant wherever applicable, with server-side authorization remaining authoritative.
4. Memory-backed reference implementations are non-durable and unsuitable for distributed operation without an adapter.
