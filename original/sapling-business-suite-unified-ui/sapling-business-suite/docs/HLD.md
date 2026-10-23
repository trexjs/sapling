# High-Level Design
## Deployment
React SPA -> Express REST API -> PostgreSQL. Single backend deployable with domain modules; separate shared contracts package. Postgres can be moved to managed hosting.
## Bounded contexts
ReachOS (campaigns, content, audiences, events); PeopleOS (jobs, candidates, employees, leave, reviews, training); DealOS (contacts, leads, opportunities, quotes, contracts); CareOS (customers, onboardings, tickets, SLAs, feedback, renewals); Shared (organizations, users, audit, tasks, activities).
## Data isolation
Every business record carries `organization_id`; all list and update queries filter by it. The production target should add PostgreSQL RLS and tenant membership verification at the identity boundary.
## Authentication
Current foundation verifies a JWT signed with a local secret. Production should validate IdentityOS OIDC access tokens using JWKS, audience, issuer, scopes and verified org membership.
## Cross-domain workflows (target architecture)
Marketing campaign -> lead -> opportunity -> quote -> contract -> customer -> onboarding -> support -> renewal. Candidate -> employee -> training -> review -> separation. Event-driven orchestration should use transactional outbox, idempotent consumers and a queue/worker system.
## Reliability target
Structured request logs, trace IDs, metrics, health/readiness, graceful shutdown, backup/restore drills, schema migration gates, circuit breakers, retry policies and rate limiting. Not included in foundation.
