import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { db, pool, outbox } from '@kubera/db';
import { eq, isNull, asc } from 'drizzle-orm';
const redisUrl=process.env.REDIS_URL||'redis://localhost:6379';
const connection=new IORedis(redisUrl,{maxRetriesPerRequest:null});
const queue=new Queue('kubera-events',{connection});
const consumer=new Worker('kubera-events',async job=>{console.log('Event:',job.name,job.data); /* Integrate signed webhooks + email adapters here */},{connection});
let running=true;
async function poll(){if(!running)return;try{const events=await db.select().from(outbox).where(isNull(outbox.publishedAt)).orderBy(asc(outbox.createdAt)).limit(50);for(const event of events){await queue.add(event.topic,{tenantId:event.tenantId,...event.payload},{jobId:event.id,attempts:5,backoff:{type:'exponential',delay:1000},removeOnComplete:1000});await db.update(outbox).set({publishedAt:new Date()}).where(eq(outbox.id,event.id))}}catch(e){console.error('Outbox polling failed',e)}setTimeout(poll,2000)}
void poll();
process.on('SIGTERM',()=>{running=false;void Promise.all([consumer.close(),queue.close(),connection.quit(),pool.end()]).then(()=>process.exit(0))});
