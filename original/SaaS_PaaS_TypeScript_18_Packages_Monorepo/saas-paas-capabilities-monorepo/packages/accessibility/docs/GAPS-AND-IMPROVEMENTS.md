# Gaps, Missing Capabilities & Improvements — Accessibility

## Current status
Starter/reference implementation of a narrow primary workflow. **Not complete feature parity with the source PDF; do not rely on it as hardened production infrastructure.**

## Source scope requiring incremental delivery
Keyboard navigation Provide predictable tab order, visible focus, keyboard-operable controls, skip links, and escape behavior for overlays and dialogs. Screen-reader semantics Use correct names, roles, states, relationships, live-region announcements, and accessible descriptions. Color and visual presentation Define contrast requirements, non-color status indicators, zoom/reflow behavior, and support for high-contrast and reduced-motion preferences. Forms and validation Associate labels and help text with fields, announce errors, summarize validation failures, and move focus to useful recovery points. Testing and compliance Provide automated checks plus manual testing guidance. Treat automation as a useful signal, not proof of full conformance. User preferences Respect system and product preferences for font scaling, reduced motion, contrast, and other supported accessibility settings.

## Production hardening backlog
- [ ] Review each capability area above and map it to exported APIs, server-side enforcement, config and operational owner.
- [ ] Implement durable, recoverable multi-node adapters where state is required.
- [ ] Define tenant isolation and identity trust-boundary guarantees.
- [ ] Add structured observability, capacity controls, dashboards and alerts.
- [ ] Define API/SDK version support, migrations and deprecation strategy.
- [ ] Address supplied operational failure and degradation requirements: • If a complex widget cannot provide a complete accessible interaction, provide a simpler accessible alternative rather than shipping a silent dead end. • Automated test failures should block critical regressions; false positives must be triaged and documented. • Tenant branding must not be allowed to produce unreadable contrast or hide focus indicators.
- [ ] Document applicable security and privacy threat models, plus data retention.
- [ ] Measure source-proposed success metrics: • Critical accessibility defects per release • Automated test coverage of shared components • Keyboard and screen-reader task completion in manual audits • Time to remediate high-severity issues

## Explicitly postponed
- All automated tests and test frameworks (user-requested deferral), **including for the quality-engineering package**.
- End-to-end deployment, KMS, distributed storage, provider credentials and production CI/CD environment wiring.

## Recommended release gates (future phase; not implemented)
- Contract/API compatibility review.
- Tenant/security and concurrency verification.
- Load, fault and recovery validation appropriate to the capability.
- Ownership, rollback and operational readiness sign-off.
