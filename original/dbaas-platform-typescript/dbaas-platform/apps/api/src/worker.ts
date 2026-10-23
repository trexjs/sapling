import 'dotenv/config';import {eq,and,lte,sql} from 'drizzle-orm';import {db,pool} from './db/index.js';import {operations,resources,jobs} from './db/schema.js';import {KubernetesProvisioner} from './kubernetes.js';
const mode=process.env.PROVISIONER_MODE||'simulate';let stopping=false;
function pause(ms:number){return new Promise(r=>setTimeout(r,ms));}
async function reconcile(){
 // Claim with FOR UPDATE SKIP LOCKED so replicas cannot concurrently process one operation.
 const candidates=await db.transaction(async tx=>{
  const result=await tx.execute(sql`SELECT id FROM operations WHERE status='queued' AND next_run_at <= NOW() ORDER BY created_at LIMIT 5 FOR UPDATE SKIP LOCKED`);
  const ids=(result.rows as Array<{id:string}>).map(x=>x.id);
  if(ids.length)await tx.execute(sql`UPDATE operations SET status='running', updated_at=NOW() WHERE id IN (${sql.join(ids.map(id=>sql`${id}::uuid`),sql`,`)})`);
  return ids;
 });
 for(const id of candidates){const [op]=await db.select().from(operations).where(eq(operations.id,id));if(!op)continue;const [r]=await db.select().from(resources).where(eq(resources.id,op.resourceId));if(!r)continue;
  try{
   if(op.type==='create')await db.update(resources).set({status:'provisioning',updatedAt:new Date()}).where(eq(resources.id,r.id));
   const desired={id:r.id,name:r.name,engine:r.engine as any,plan:r.plan,config:r.config};
   let observed:Record<string,unknown>={mode};
   if(mode==='kubernetes'){const provisioner=new KubernetesProvisioner();observed=op.type==='delete'?(await provisioner.delete(desired),{mode,deleteRequested:true}):await provisioner.apply(desired);}
   else if(mode!=='simulate')throw new Error('Invalid PROVISIONER_MODE');
   // Kubernetes apply indicates submitted desired state, NOT operator readiness.
   const nextStatus=op.type==='delete'?'deleted':mode==='simulate'?'ready':'provisioning';
   await db.transaction(async tx=>{await tx.update(resources).set({status:nextStatus,observed,lastError:null,updatedAt:new Date()}).where(eq(resources.id,r.id));await tx.update(operations).set({status:'succeeded',updatedAt:new Date()}).where(eq(operations.id,id));});
  }catch(e:any){const attempts=op.attempts+1;const message=String(e?.message||e).slice(0,500);const retry=attempts<5;await db.transaction(async tx=>{await tx.update(operations).set({attempts,status:retry?'queued':'failed',error:message,nextRunAt:new Date(Date.now()+Math.min(60000,2000*2**attempts)),updatedAt:new Date()}).where(eq(operations.id,id));await tx.update(resources).set({status:retry?'provisioning':'failed',lastError:message,updatedAt:new Date()}).where(eq(resources.id,r.id));});}
 }
 if(mode==='kubernetes'){
  const pending=await db.select().from(jobs).where(eq(jobs.status,'pending')).limit(10);
  for(const job of pending){try{const prov=new KubernetesProvisioner();await prov.applyJob({...job,command:job.command});await db.update(jobs).set({status:'submitted',updatedAt:new Date()}).where(eq(jobs.id,job.id));}catch(e:any){await db.update(jobs).set({status:'failed',lastError:String(e?.message||e),updatedAt:new Date()}).where(eq(jobs.id,job.id));}}
 }else if(mode==='simulate'){await db.update(jobs).set({status:'simulated',updatedAt:new Date()}).where(eq(jobs.status,'pending'));}
}
console.log('DBaaS provisioning worker mode:',mode);
process.on('SIGTERM',()=>{stopping=true;});process.on('SIGINT',()=>{stopping=true;});
while(!stopping){try{await reconcile();}catch(e){console.error('worker reconcile error',e);}await pause(2000);}await pool.end();
