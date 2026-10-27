# Kingsman v0 Roadmap

## Vision
Kingsman is a multi-tenant identity and access management (IAM) platform that serves as the centralized authentication provider for products across the organization. The v0 launch delivers the minimum viable feature set to allow other applications to delegate login and registration, validate users via JWTs, and manage access through realms, users, groups, and clients.

## Product Goals for v0
- Expose a secure authentication service capable of issuing signed JWTs for validated users.
- Provide realm isolation so multiple products or environments can coexist on the same platform.
- Allow administrators to manage users, user groups, and clients within each realm.
- Offer embeddable login/register UI components and REST APIs for projects to integrate quickly.
- Establish foundational realm-level settings for branding, policies, and authentication behavior.

## Success Criteria
- An external application can create a realm, register a client, embed the Kingsman login experience, and receive/verifiy JWTs for protected routes.
- Administrators can invite/manage users and groups without database edits.
- Realm settings enforce baseline password policy and token lifetimes.
- Documentation and sample integration demonstrate end-to-end usage.

## Milestone Plan

### Phase 0 – Platform Foundations (Week 1)
- Project scaffolding (monorepo structure, service layout, linting/testing setup).
- Environment configuration (dev/staging), infrastructure as code skeleton.
- Choose key technologies (database, cache, messaging) aligned with long-term roadmap.

### Phase 1 – Realm Architecture (Weeks 2-3)
- Design multi-tenant data model with realm isolation and auditing fields.
- Realm CRUD APIs and admin screens.
- Realm-level metadata: display name, slug, primary contact, status (active/suspended).
- Bootstrap "System Realm" for platform-wide administration.

### Phase 2 – User & Group Management (Weeks 3-5)
- User entity with profile attributes, status (active/disabled), and password hashing.
- CRUD APIs and admin UI for users; invite flow with email template.
- Group entity scoped to realm; add/remove users and nested groups (single level for v0).
- Permissions model placeholder to tie groups to roles (define schema even if enforcement is limited for v0).

### Phase 3 – Client Lifecycle & Token Service (Weeks 5-6)
- Client registration with secrets/keys, allowed grant types (authorization code, client credentials for v0).
- Token issuance service issuing signed JWT access + refresh tokens per realm.
- JWKS endpoint per realm and token introspection API.
- Client admin UI for key rotation, redirect URIs, CORS origins, and scopes.

### Phase 4 – Authentication & Session Experience (Weeks 6-8)
- Hosted login & registration screens with email/password flow.
- Embeddable UI library (e.g., React components) for login/register with configurable themes.
- Authentication APIs for projects opting to build custom UIs (login, register, password reset).
- Session management: remember-me cookies, logout, refresh token rotation, event logging.

### Phase 5 – Realm Settings & Policy Controls (Weeks 8-9)
- Realm settings UI/API: password policy (length, complexity), session timeout, token lifetimes.
- Branding controls: logo, primary colors, custom domain mapping (CNAME) groundwork.
- MFA opt-in toggle and audit-ready event history (schema & logging, UI surfacing minimal for v0).

### Phase 6 – Hardening & Launch Prep (Weeks 9-10)
- Security review (OWASP ASVS checklist, dependency scanning, secret management validation).
- Performance baselines: load test authentication flows, caching for JWKS/token validation.
- Observability: logging, metrics, tracing spans across major services.
- Integration artifacts: sample client app, quick-start docs, Postman collection, FAQ.

## Technical Considerations

### Architecture
- Modular service architecture: Core API (realms, users, groups, clients), Auth Service (token issuance), UI package.
- Shared libraries for domain models, validation, and JWT signing.
- Database: relational store with realm_id scoping, plus caching layer for configuration and JWKS.
- Event bus (optional for v0) for audit trail and future provisioning workflows.

### Integration Surfaces
1. **Hosted Login Experience** – default realm-branded screens hosted by Kingsman.
2. **Embeddable UI Package** – installable component library exposing Login/Register; configurable via realm client settings.
3. **REST APIs** – endpoints for login, registration, password reset, client validation, and realm management.
4. **SDKs (stretch)** – lightweight JS SDK for handling redirects, token storage, and refresh.

### Security & Compliance
- Token signing with realm-scoped asymmetric keys; enforce rotation policy.
- Password hashing with bcrypt/argon2 and configurable cost per environment.
- Rate limiting on authentication endpoints; IP allow/deny lists per client (config hooks even if UI is limited).
- Audit logging for admin actions and authentication events, persisted per realm.

### Post-v0 Backlog Seeds
- MFA methods (TOTP, WebAuthn), social login federation.
- Fine-grained authorization with role-based and attribute-based controls.
- Admin analytics dashboards (login trends, error rates).
- Lifecycle automation (SCIM, just-in-time provisioning, deprovisioning workflows).
- Marketplace for realm extensions (custom flows, workflows, triggers).

## Further Design Documentation

- **High-Level Design (HLD)**: see [kingsman-hld.md](./kingsman-hld.md) for architecture diagrams, core modules, data management strategy, integrations, and security posture.
- **Low-Level Design (LLD)**: see [kingsman-lld.md](./kingsman-lld.md) for service breakdowns, detailed data models, key sequences, and non-functional specifications.
- **Technology Stack Summary**: both HLD and LLD highlight the MERN foundation (MongoDB, Express.js, React, Node.js) and supporting tooling for the Kingsman platform.
