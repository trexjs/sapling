# TypeScript SDK specification

`new FlowClient({baseUrl, apiKey, signingSecret})` initializes server-side SDK. `createFunction(options, handler)` registers handler in process memory; `register(endpoint)` POSTs function metadata. `send(event, dedupeKey?)` emits events. `handle(body,signature)` executes one registered function from an HMAC-signed callback. `step.run(stepId,callback)` reuses stored results on replay/retry.

Current `step.sleep` is an ordinary timer and **not durable**; `step.waitForEvent` is explicitly unimplemented. These interfaces are reserved for future orchestration semantics. SDK should ultimately support structured typed event schemas, distributed suspension, cancellation tokens, function version IDs and tracing propagation.
