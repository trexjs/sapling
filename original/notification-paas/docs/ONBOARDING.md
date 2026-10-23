# Internal Team Onboarding
1. Platform operator sets `ADMIN_TOKEN`, `ENCRYPTION_KEY_HEX`, PostgreSQL and HTTPS reverse proxy.
2. Open UI and register a service using the admin token. Save the generated API key securely; only its hash is persisted.
3. Select an email provider (`smtp` or `aws-ses`) and/or SMS provider (`msg91` or `aws-sns`). Configure approved sender identity and provider account. For AWS, configure server IAM role and `region` in provider config.
4. Create a `welcome` email/SMS template with `{{name}}` and preview sample variables.
5. In service backend, install `@notify/sdk` from workspace or internal registry and initialize:
```ts
import {NotificationClient} from '@notify/sdk';
const client = new NotificationClient({baseUrl:process.env.NOTIFY_URL!,apiKey:process.env.NOTIFY_API_KEY!});
await client.send({channel:'email',templateKey:'welcome',to:'user@example.com',variables:{name:'Asha'},idempotencyKey:'welcome-user-123'});
```
6. Inspect recent notification submissions from UI. A `sent` result means provider accepted request, not final delivery.

## Provider configuration examples
SMTP: `{ "host":"smtp.example.com", "port":"587", "user":"...", "password":"...", "from":"notifications@example.com" }`.
AWS SES: `{ "region":"ap-south-1", "from":"verified@example.com" }`.
AWS SNS: `{ "region":"ap-south-1" }`; send phone in E.164 form.
MSG91: `{ "authkey":"...", "flowId":"approved-flow", "sender":"APPROVED" }`. **MSG91 adapter expects the rendered SMS body to be valid JSON containing Flow variables**; ordinary free-text templates will not work with this adapter. This is a known integration limitation.

India SMS use requires applicable DLT entity/sender/template registrations, operator/provider configuration and consent compliance. Validate current MSG91 API contract against your account before go-live.
