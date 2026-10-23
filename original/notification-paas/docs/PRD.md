# Product Requirements Document
## Problem
Internal SaaS teams need consistent, self-service SMS and email notifications without embedding provider-specific SDKs or secrets.
## Actors
Platform admin onboards services; service owner manages templates/providers; application server invokes send API.
## In scope
Service-scoped API keys, template authoring and preview, provider onboarding with encrypted credentials, email/SMS sends, idempotency key, delivery submission status, simple recent history, TypeScript SDK, tenant isolation.
## Provider options
India: MSG91 (SMS; provider-specific Flow API integration requires preapproved flow/template); SMTP-compatible India email vendors. Global/AWS: SES v2 email and SNS SMS. Provider credentials and sender identity remain service-owned.
## Out of scope
Billing, audits/team usage reporting, tests, campaigns, segmentation, inbound replies, sophisticated analytics.
## Acceptance criteria
Service can onboard, register one provider per channel, save template, preview variables, send from SDK, retrieve status; cross-service records inaccessible with a different API key.
## Operational requirements
Secrets encrypted at rest; API keys hashed; stateless API instances; HTTPS required at edge; provider failure recorded; secrets never returned in list endpoints.
