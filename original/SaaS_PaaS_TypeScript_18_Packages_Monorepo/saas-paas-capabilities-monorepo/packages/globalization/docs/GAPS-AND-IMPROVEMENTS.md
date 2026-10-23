# Gaps, Missing Capabilities & Improvements — Globalization

## Current status
Starter/reference implementation of a narrow primary workflow. **Not complete feature parity with the source PDF; do not rely on it as hardened production infrastructure.**

## Source scope requiring incremental delivery
Internationalization (i18n) Design APIs, data models, and interfaces so text expansion, multiple scripts, plural forms, locale-aware formatting, and translation can be supported without structural rewrites. Localization (l10n) Adapt product content, messages, terminology, and workflows for a particular language or market. Keep translated content separate from application logic. Formatting Standardize locale-aware dates, times, currencies, numbers, percentages, measurement units, and calendars. Avoid hand-built formatting and hard-coded symbols. Time zones Store event instants in a consistent representation, normally UTC, and render them in the user's or business's selected time zone. Handle daylight-saving transitions and ambiguous local times explicitly. Right-to-left support Support RTL layout direction, mirrored navigation where appropriate, bidirectional text, and mixed-direction content such as numbers or identifiers. Translation management Provide catalog versioning, fallback languages, pluralization, translation review workflows, missing-key detection, and safe deployment of translation updates. Locale-aware search and sorting Define Unicode normalization, collation, case handling, and language-specific search behavior. Avoid assuming ASCII or English sorting rules. Regionalization Represent data-residency regions, regional service endpoints, legal notices, market-specific business rules, and region-dependent availability explicitly.

## Production hardening backlog
- [ ] Review each capability area above and map it to exported APIs, server-side enforcement, config and operational owner.
- [ ] Implement durable, recoverable multi-node adapters where state is required.
- [ ] Define tenant isolation and identity trust-boundary guarantees.
- [ ] Add structured observability, capacity controls, dashboards and alerts.
- [ ] Define API/SDK version support, migrations and deprecation strategy.
- [ ] Address supplied operational failure and degradation requirements: • If a preferred locale is unavailable, fall back predictably and record a diagnostic rather than failing the entire request. • If a time zone is invalid, use a documented tenant or product fallback and surface validation errors at configuration time. • Never silently change data residency or legal-region behavior as a mere presentation fallback.
- [ ] Document applicable security and privacy threat models, plus data retention.
- [ ] Measure source-proposed success metrics: • Translation coverage and missing-key rate • Locale formatting defects • Requests by locale and region • Timezone-related support incidents • Regional configuration validation failures

## Explicitly postponed
- All automated tests and test frameworks (user-requested deferral), **including for the quality-engineering package**.
- End-to-end deployment, KMS, distributed storage, provider credentials and production CI/CD environment wiring.

## Recommended release gates (future phase; not implemented)
- Contract/API compatibility review.
- Tenant/security and concurrency verification.
- Load, fault and recovery validation appropriate to the capability.
- Ownership, rollback and operational readiness sign-off.
