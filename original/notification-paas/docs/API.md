# HTTP API
`GET /health` unauthenticated. `POST /admin/services`, `GET /admin/services`: header `x-admin-token`. `POST /v1/providers`, `GET /v1/providers`, `POST /v1/templates`, `GET /v1/templates`, `POST /v1/templates/preview`, `POST /v1/notifications`, `GET /v1/notifications`: header `x-api-key`.

## Examples
`POST /v1/templates` `{ "key":"otp", "channel":"sms", "body":"Your OTP is {{code}}" }`

`POST /v1/notifications` `{ "channel":"sms", "templateKey":"otp", "to":"+919876543210", "variables":{"code":"123456"}, "idempotencyKey":"otp-123" }`

`POST /v1/providers` `{ "name":"SES India", "channel":"email", "kind":"aws-ses", "credentials":{"region":"ap-south-1","from":"verified@example.com"}, "isDefault":true }`

Responses include status codes 201 (created), 202 (provider accepted), 400 (invalid), 401 (unauthorized), 404 (template absent), 422 (provider absent), 502 (provider failed). Template upsert returns 200. Duplicate idempotency key returns previous record (note race limitation in gaps).
