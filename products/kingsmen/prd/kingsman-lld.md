# Kingsman Low-Level Design (LLD)

## Service Responsibility Breakdown

### API Gateway (Express)
- Middlewares: request logging, rate limiting, realm context resolver (`X-Kingsman-Realm` header or subdomain), input validation.
- Route groups: `/realms`, `/users`, `/groups`, `/clients`, `/auth`, `/settings`.
- Delegates domain logic to injected service layer modules and handles response shaping/error mapping.

### Realm Service
- Repositories implemented with Mongoose models: `RealmRepository`, `UserRepository`, `GroupRepository`.
- Use-cases/commands: `CreateRealm`, `UpdateRealmSettings`, `InviteUser`, `AssignGroup`, `SuspendUser`.
- Transaction handling via MongoDB sessions for multi-document consistency.
- Emits domain events (`RealmCreated`, `UserInvited`, `GroupAssigned`) to message queue for auditing.

### Authentication Service
- Controllers for `POST /auth/login`, `POST /auth/register`, `POST /auth/reset`, `POST /auth/logout`.
- Strategy pattern for auth methods (password for v0; extensible for OTP/OIDC).
- Session manager orchestrates refresh token issuance, rotation, and revocation list using Redis.
- Password utilities leverage Argon2/bcrypt with realm-configurable cost factors.

### Token Service
- Key management module loads per-realm RSA key pairs; rotation tracked by `kid`.
- Token builder signs JWTs with claims: `iss`, `aud`, `sub`, `realm`, `roles`, `groups`, `exp`, `iat`.
- Introspection endpoint validates signature, expiration, and revocation cache status.
- JWKS endpoint exposes public keys for client verification; cached in Redis.

### Admin SPA (React)
- State management via Redux Toolkit/RTK Query for data fetching and caching.
- Component-level guards enforce RBAC (realm admin vs. client admin).
- Shared design system with theming controls to reflect realm branding settings.
- API client generated from OpenAPI specification for type-safety and consistency.

### Hosted Auth UI & SDK (React)
- Component props: `realmId`, `clientId`, `theme`, `redirectUri`, `postLoginPath`.
- Hooks: `useAuth()`, `useToken()`, `useSession()` handling token storage and refresh.
- Token storage abstraction switches between HTTP-only cookies or local storage depending on security mode.
- Analytics hooks capture login success/failure events for observability pipeline.

## Data Models (Mongoose Sketch)
- `Realm`: `{ _id, name, slug, status, settings: { passwordPolicy, tokenTTL, branding }, createdAt, updatedAt }`
- `User`: `{ _id, realmId, email, profile, passwordHash, status, groups: [groupId], lastLoginAt, createdAt, updatedAt }`
- `Group`: `{ _id, realmId, name, description, members: [userId], parentGroupId }`
- `Client`: `{ _id, realmId, name, clientId, clientSecretHash, redirectUris, scopes, grantTypes, jwksUri, createdAt, updatedAt }`
- `AuditEvent`: `{ _id, realmId, type, actorId, payload, createdAt }`
- `Session`: `{ _id, realmId, userId, clientId, refreshTokenHash, expiresAt, createdAt, revokedAt }`

## Sequence Details

### Login via SDK
1. SDK fetches configuration from `GET /realms/{realmId}/clients/{clientId}/config` (cached in Redis).
2. User submits credentials; SDK posts to `POST /auth/login` with realm context header/subdomain.
3. Authentication Service validates credentials, checks user/realm status, runs rate-limit guard.
4. Token Service issues access and refresh tokens; refresh token hashed and stored in `Session`.
5. SDK receives tokens, stores according to security mode, and notifies client app.

### Registration Flow
1. User submits details to `POST /auth/register`.
2. Realm Service validates password policy, uniqueness of email, and optional invitation token.
3. User created in MongoDB; verification email enqueued through Email Service.
4. Optional auto-login triggers `Token Service` for immediate JWT issuance if realm allows.

### Password Reset
1. User requests reset via `POST /auth/reset/request`; token stored in `PasswordReset` collection with TTL index.
2. Email Service sends reset link; upon submission, Authentication Service validates token, updates password hash, invalidates sessions in Redis.

## Non-Functional Details
- **Performance**: All Node services containerized with horizontal scaling; stateless endpoints except for Redis-backed rate limits/sessions.
- **Reliability**: MongoDB replica set with automated backups; Redis cluster with sentinel failover.
- **Observability**: OpenTelemetry instrumentation exporting traces and metrics; central log aggregation via ELK/Splunk.
- **Testing**: Jest + Supertest for API contracts, React Testing Library for UI, Cypress for end-to-end flows; contract tests for SDK integration.
- **Security Controls**: Helmet middleware, CSP headers on hosted UI, CSRF protection for form-based flows, strict HTTPS enforcement.
