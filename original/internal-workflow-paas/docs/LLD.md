# Low-level design

## Relational model
`tenants -> projects -> api_keys`, `projects -> definitions`, `projects -> events`, `definitions/events -> runs`, `runs -> steps`; `projects -> workflows` and `projects -> audit`.

## Event ingestion
1. Authenticate API key hash.
2. Validate name and payload; dedupe by `(project_id, dedupe_key)` unique index.
3. Insert event, select active definitions by event name, insert run for each.
4. Enqueue `execute` job with run UUID, configured retries and backoff.
5. Return 202 with event ID and run IDs.

**Known atomicity flaw:** Steps 3 and 4 are not a transaction with an outbox. Queue outage after DB insert strands runs. Fix before production.

## Execution
1. Worker loads run and pinned definition ID.
2. Set running; sign JSON request with HMAC SHA256.
3. POST executor; SDK verifies signature and looks up function.
4. For each `step.run(id, fn)`, query checkpoint; if completed return stored result; else execute fn and write checkpoint.
5. Mark run completed or retrying/failed.

**Known race:** simultaneous workers may execute the same run; step get/put is not a distributed lock. Side effects must be idempotent. Production design requires lease owner, lease expiry, fencing token and atomic state transitions.

## Graph model
React Flow nodes/edges saved as JSON. Visual editor currently does not compile/execute DAGs. Future compiler validates acyclicity, schemas, node permissions, reachability and version pinning; executor schedules ready nodes and checkpoints each node output.

## API error envelope
`{error: string, details?: object}`. Validation uses Zod. Production should add correlation ID, typed codes and localized messages.
