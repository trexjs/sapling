import {DbaaSClient} from '@dbaas/sdk';
const client=new DbaaSClient({baseUrl:process.env.DBAAS_API_URL!,tokenProvider:async()=>process.env.DBAAS_TOKEN!});
const created=await client.resources.create({serviceId:process.env.DBAAS_SERVICE_ID!,name:'orders-db',engine:'postgres',plan:'dev',config:{storageGiB:10}},'orders-db-demo-v1');
console.log('Operation:',created.operationId);
console.log('Result:',await client.operations.wait(created.operationId,{timeoutMs:120000}));
// NOTE: the SDK is for provisioning, not querying. Use native pg, MongoDB, Redis or Kafka clients.
// The API never returns application DB passwords; external secret integration is a future requirement.
