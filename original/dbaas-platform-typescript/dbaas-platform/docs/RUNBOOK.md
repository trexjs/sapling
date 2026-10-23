# Operator and developer runbook

## Starting locally

1. Copy `.env.example` to `apps/api/.env` and set a random local token.
2. Start local metadata PostgreSQL with Docker Compose.
3. `pnpm install` then generate/apply Drizzle migrations using scripts in README.
4. Run API, worker and UI as separate processes. Simulated resources are never real connections.

## Kubernetes prerequisites

Install operators for selected engines, confirm CRD versions with `kubectl api-resources`, verify storageClass and encryption, create namespace, define network/egress policy, create service accounts and approved secret resources. Check real `status.conditions` and backing pods manually; HTTP success on CR creation is NOT readiness.

## Operations

- Stuck operation: inspect `operations` and resource state in PostgreSQL, compare actual Kubernetes objects, do not mark ready by hand.
- Operator resource failures: inspect custom-resource `status` and operator events/logs.
- Credentials: never paste passwords into API config, Git, logs or UI; use an approved secret workflow.
- Recovery: restore metadata DB from protected backup; reconcile operator state only after validating intended resource ownership and IDs.
- Deletion: review retention and dependency requirements; current delete workflow is not approved for production.

## Production hard stops

Production authentication is intentionally disabled until OIDC is implemented. Do not change `NODE_ENV=production` checks simply to make production launch succeed. `docs/IMPLEMENTATION_GAPS.md` is the authoritative unresolved-work register.
