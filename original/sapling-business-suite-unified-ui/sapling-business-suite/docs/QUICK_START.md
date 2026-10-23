# Quick Start and Example API
Run the commands in README. Sign a development JWT with the same secret and `{sub,org,role}` claims. Example:
```bash
curl http://localhost:4000/health
curl -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/campaigns
curl -X POST http://localhost:4000/api/campaigns -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"name":"Launch","channel":"email","status":"draft","budget":"10000"}'
```
For production use an OIDC provider, enforce verified memberships, and replace local JWT validation. API routes and sample payloads are for demonstration only.
