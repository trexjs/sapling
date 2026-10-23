# Monorepo architecture

## Layout
- `packages/`: 18 independently named TypeScript library packages.
- `references/`: the 18 input PDF specifications, unmodified.
- `packages/*/docs/`: HLD, LLD, ONBOARDING and GAPS-AND-IMPROVEMENTS.

## Boundaries
A shared package is not automatically a shared deployed service. Stateful packages demonstrate local adapters and typed boundaries; production systems need durable storage, strong tenancy policies, IAM, observability and deployment contracts.

## Trust model
Never trust user-supplied tenant headers as identity. Authorization is enforced in a trusted service. Frontend accessibility helpers are not security policy. AI output must be treated as untrusted. Financial ledgers use integer minor currency units.

## Dependency policy
Avoid accidental runtime coupling across platform packages. Prefer contracts and injection at composition roots. Authentication, entitlement and authorization must remain distinct.

## Delivery phase
All 18 include implemented TypeScript entry points and documentation; they are *reference-quality foundations*, not end-to-end production systems. Tests are intentionally deferred.
