# SDK usage and integration contract

The SDK controls resources; it does not proxy PostgreSQL/Valkey/MongoDB/Kafka data queries.

```ts
import { DbaaSClient } from '@dbaas/sdk';
const platform = new DbaaSClient({
  baseUrl: 'http://localhost:4000',
  tokenProvider: async () => process.env.DBAAS_TOKEN!
});
const teams = await platform.teams.list();
const created = await platform.resources.create({
  serviceId: 'valid-uuid-from-registration',name:'orders-db',engine:'postgres',plan:'dev',config:{storageGiB:10}
}, 'unique-request-id');
const operation = await platform.operations.wait(created.operationId);
```

Public SDK operations: `teams.list/create`, `services.list/create`, `resources.list/create/get/remove`, `operations.get/wait`, `jobs.list/create`, `usage.summary`.

Error surface: `DbaaSError(status, code, message, requestId)`. Future production requirements: typed API models, abort signals, controlled retries, token refresh, instrumentation, connection discovery and published semantic versions.
