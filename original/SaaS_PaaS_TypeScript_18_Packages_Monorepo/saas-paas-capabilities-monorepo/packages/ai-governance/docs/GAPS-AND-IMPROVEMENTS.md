# Gaps, Missing Capabilities & Improvements — Ai Governance

## Current status
Starter/reference implementation of a narrow primary workflow. **Not complete feature parity with the source PDF; do not rely on it as hardened production infrastructure.**

## Source scope requiring incremental delivery
Provider and model abstraction Route requests across approved models and providers while exposing capability differences and avoiding a false lowest-common-denominator API. Prompt and model versioning Version prompts, tools, model parameters, retrieval configuration, and deployment settings. Usage and cost metering Track tokens or equivalent usage, latency, provider, model version, tenant, and cost attribution. Evaluation and regression Maintain evaluation datasets, quality metrics, safety tests, and regression gates for prompt or model changes. Safety and validation Apply input/output validation, policy checks, tool permissions, and risk-appropriate human review. Retrieval permissions Enforce document access permissions during retrieval and before content is passed to a model. Reliability and rollout Handle timeouts, rate limits, fallbacks, staged rollout, and provider-specific degradation. Privacy and auditability Redact sensitive data where appropriate and record enough provenance to investigate outputs without retaining unnecessary content.

## Production hardening backlog
- [ ] Review each capability area above and map it to exported APIs, server-side enforcement, config and operational owner.
- [ ] Implement durable, recoverable multi-node adapters where state is required.
- [ ] Define tenant isolation and identity trust-boundary guarantees.
- [ ] Add structured observability, capacity controls, dashboards and alerts.
- [ ] Define API/SDK version support, migrations and deprecation strategy.
- [ ] Address supplied operational failure and degradation requirements: • Fallbacks must preserve safety and data-handling requirements, not merely switch to any available model. • If retrieval authorization cannot be verified, do not pass the protected content to the model. • On timeout or provider failure, return a clear degraded response or safe alternative instead of fabricating success. • Escalate uncertain or high-impact decisions to deterministic rules or human review where needed.
- [ ] Document applicable security and privacy threat models, plus data retention.
- [ ] Measure source-proposed success metrics: • Quality and safety evaluation scores • Cost and latency by model and tenant • Fallback and timeout rates • Unauthorized retrieval test failures • Prompt/model regression incidents • Sensitive-data leakage findings

## Explicitly postponed
- All automated tests and test frameworks (user-requested deferral), **including for the quality-engineering package**.
- End-to-end deployment, KMS, distributed storage, provider credentials and production CI/CD environment wiring.

## Recommended release gates (future phase; not implemented)
- Contract/API compatibility review.
- Tenant/security and concurrency verification.
- Load, fault and recovery validation appropriate to the capability.
- Ownership, rollback and operational readiness sign-off.
