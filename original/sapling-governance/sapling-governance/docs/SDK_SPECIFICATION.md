# SDK Specification

## Consent SDK
`new ConsentClient(endpoint, tenantId)` provides `decide`, `history` and static `allowed` helpers. Example:
```ts
import { ConsentClient } from '@sapling/consent-sdk';
const client = new ConsentClient('http://localhost:4101','local-tenant');
await client.decide({subjectId:'visitor-1',domainId:'example.com',policyVersion:'v1',categories:{necessary:true,analytics:false}});
```
**Warning:** `allowed()` only evaluates a supplied category map. It does **not** intercept scripts or guarantee pre-consent blocking. The SDK is development-only until authenticated domain-scoped credentials and browser-safe consent enforcement are added.

## Compliance SDK
`new ComplianceClient(endpoint, tenantId)` provides `list(module)` and `create(module, input)`.

## Future SDK contract
Typed client configuration, retries with idempotency, timeouts, signed bootstrap config, framework adapters, webhook verification, API key rotation and stable semver releases.
