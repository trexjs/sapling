# SDK example

```ts
import { Kubera, KuberaApiError } from '@cpg/kubera';
const client = new Kubera({
  baseUrl: 'http://localhost:4000',
  tenantId: process.env.KUBERA_TENANT_ID!,
  // Use only on a trusted server. Browser UI uses this solely for a local demo.
  apiKey: process.env.KUBERA_ADMIN_API_KEY!,
  timeoutMs: 10_000,
  retries: 2,
});
const created = await client.products.create({
  name: 'Digital handbook', description: 'Downloadable PDF', priceMinor: 1499, currency: 'USD', metadata: {},
});
const order = await client.orders.create({
  productId: created.id, customerEmail: 'buyer@example.com', quantity: 1,
  idempotencyKey: crypto.randomUUID(),
});
console.log(order.order.id);
```

All namespace methods are available in `packages/sdk/src/index.ts`. Read `IMPLEMENTATION_GAPS.md` for missing production auth/token lifecycle and consumer-facing integrations.
