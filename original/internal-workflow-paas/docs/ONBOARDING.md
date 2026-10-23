# Service onboarding

1. Start infra and push schema (see root README).
2. Provision a project with `POST /v1/admin/projects` and store returned key securely.
3. Instantiate `FlowClient({baseUrl,apiKey,signingSecret})` in your service.
4. Define event-driven function with `createFunction({id,event,retries}, handler)`.
5. Mount an Express POST handler to `client.handle(req.body,req.header('x-flow-signature'))`.
6. Register public/internal executor endpoint with `client.register(endpoint)`.
7. Emit events using `client.send({name,data},dedupeKey)`.
8. Inspect runs and checkpoints in the dashboard.

Example in `examples/order-service/index.ts`. Avoid sharing the API key with browsers; browser dashboard key entry is a development convenience only. Configure network reachability, timeouts and HMAC signing consistently.
