# Low-Level Design
## Tables
`services(id,name,api_key_hash,created_at)`; `providers(id,service_id,channel,kind,name,credentials,is_default)`; `templates(id,service_id,key,channel,subject,body,updated_at)` unique `(service_id,key,channel)`; `notifications(id,service_id,provider_id,channel,recipient,template_key,variables,idempotency_key,status,attempts,error,created_at)` unique `(service_id,idempotency_key)`.
## Request flow
1. SHA-256 hash `x-api-key`, look up service.
2. Validate input with Zod; locate template by service, key, channel.
3. Choose explicit provider ID or default provider or first configured provider, always scoped to service.
4. Render Handlebars placeholders using supplied variables.
5. Persist pending notification; call provider adapter; mark sent or failed.
6. Return notification ID and submission status.
## Provider interface
`Provider.send({to,subject?,body}):Promise<void>`; factory selects `smtp`, `aws-ses`, `aws-sns`, `msg91`. Provider-specific config stays behind factory boundary. To add an adapter, extend union validation, channel mapping, factory, and documentation.
## Security limitations
Console stores API key in sessionStorage and is **not a production identity system**; admin token is entered manually. No RBAC, KMS, key rotation, per-recipient validation, HTML sanitization, webhook signature checks or per-tenant rate limits yet. Treat template authors as trusted; do not expose public self-service access.
