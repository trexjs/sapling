# High-Level Design — Communications

## Source of truth
`references/L_Notifications_Communications_Templates.pdf` (original supplied capability PDF, preserved verbatim).

## Intent and boundary
Centralize reusable delivery mechanics, template lifecycle, preference handling, and delivery tracking for email, SMS, push, in-product messages, and webhooks.

## Capability areas (from PDF)
Template management Version, review, localize, preview, and publish templates with clear ownership. Channel preferences Respect user and tenant delivery preferences and permitted channel choices. Delivery and failover Route through providers, handle provider outages, and support controlled failover. Receipts and suppression Track bounces, complaints, delivery receipts, unsubscribe state, and suppression lists. Deduplication and tracking Use stable notification identifiers and record lifecycle events without leaking sensitive content. Webhook security Sign outbound webhooks, retry safely, and protect replay and destination validation.

## Proposed architecture
- **Package:** `@platform/communications`.
- **Entry point:** `src/index.ts`; typed public API, with a local/reference implementation.
- **Consumers:** domain services and shared infrastructure that need this capability.
- **Authority:** domain services continue to own product-specific business decisions.
- **Deployment:** this package is a library/contract, **not automatically a standalone microservice**. Persistent/shared concerns will need external adapters and an owner-operated control plane when productionized.
- **Request flow:** consumer → validate typed input → apply package policy/mechanics → interact with local adapter/state or injected external provider → return typed result/error.

## Original shared contracts
• Domain services submit a typed notification intent rather than choosing provider-specific details. • Templates have versioned variables, localization behavior, and validation before publication. • Consent, unsubscribe, and suppression rules are enforced centrally where legally and operationally appropriate. • Delivery is asynchronous and has explicit accepted, queued, sent, delivered, failed, and suppressed states.

## Operations and failure semantics
• Provider failure should route to a permitted fallback or a retry queue without duplicating the user-visible message. • Permanent failures such as invalid addresses should be suppressed or surfaced for correction rather than retried endlessly. • Template rendering errors should be visible before send and should not fall back to leaking raw variables.

## Capability metrics from source
• Delivery success and latency by channel • Bounce and complaint rates • Provider failover frequency • Template render failures • Duplicate notification rate

## Architecture decisions
1. Use standalone packages to maintain versioned, independently consumable contracts.
2. Prefer dependency inversion; provide injected adapters for infrastructure-backed operations.
3. Scope state by tenant wherever applicable, with server-side authorization remaining authoritative.
4. Memory-backed reference implementations are non-durable and unsuitable for distributed operation without an adapter.
