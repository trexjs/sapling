# Low-Level Design — Globalization

## Package identity
`@platform/globalization` · `packages/globalization/src/index.ts` · ESM/TypeScript.

## Implementation map
The exported interfaces, functions, and classes in `src/index.ts` are the **current executable contract**. Read that file before integrating; this document describes responsibilities rather than claiming unimplemented APIs exist.

## Implemented mechanics
- Input is represented by typed objects, with validation performed in the public entry points.
- Runtime state (if any) is held in process-local collections; no database, queue, cache or remote provider is installed by default.
- Any provider boundary is modeled using an explicit TypeScript interface where applicable.
- This first increment implements a **narrow vertical slice** of Globalization SDK + Locale Service, not every capability in the PDF.

## Detailed design constraints from PDF
• Resolve locale and time-zone preferences using a documented precedence order, such as user preference → tenant default → product default. • Expose stable SDK helpers for formatting and message lookup; avoid domain services inventing their own locale conventions. • Version translation catalogs and define behavior for missing keys, unavailable locales, and stale clients. • Keep regulatory and business rules owned by the relevant domain, while providing reusable mechanisms for regional configuration.

## Source-recommended implementation
• Create a locale context object containing language tag, formatting locale, time zone, direction, and region where applicable. • Use standard locale identifiers and mature internationalization libraries rather than custom string manipulation. • Store canonical timestamps and currency amounts with explicit currency codes; do not infer currency from a symbol. • Add pseudo-localization and RTL test modes to development environments. • Build translation extraction, catalog validation, and missing-translation checks into CI.

## Runtime behavior and error handling
• If a preferred locale is unavailable, fall back predictably and record a diagnostic rather than failing the entire request. • If a time zone is invalid, use a documented tenant or product fallback and surface validation errors at configuration time. • Never silently change data residency or legal-region behavior as a mere presentation fallback.

## Data / trust / scalability
- Treat all external and event-driven inputs as untrusted.
- Do not infer authorization from presence of tenant metadata. Enforce trusted user/service identity upstream and at protected operations.
- Avoid in-memory state when multiple workers, nodes, regions or restarts are involved.
- Avoid universal exactly-once promises; choose explicit transactional/idempotent boundaries.
- Configure ownership, SLOs, observability, retention and operational alerts in the deployment environment.

## Extensibility
Add persistent adapters, metrics hooks, server-side enforcement, and explicit version migration policies before using this as critical production infrastructure.
