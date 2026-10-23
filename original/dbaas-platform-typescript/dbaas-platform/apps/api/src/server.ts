import 'dotenv/config';
import express,{type Request,type Response,type NextFunction} from 'express';import cors from 'cors';import helmet from 'helmet';import pinoHttp from 'pino-http';import {randomUUID,createHash} from 'node:crypto';import {eq,desc,sql,and,lte} from 'drizzle-orm';import {z,ZodError} from 'zod';
import {teamCreateSchema,serviceCreateSchema,resourceCreateSchema,jobCreateSchema} from '@dbaas/contracts';
import {db,pool} from './db/index.js';import {teams,services,resources,operations,jobs,audit} from './db/schema.js';import {authenticate,requireRole} from './security.js';
const app=express();app.disable('x-powered-by');app.use(helmet());app.use(cors({origin:(process.env.WEB_ORIGIN||'http://localhost:5173').split(','),allowedHeaders:['authorization','content-type','idempotency-key','x-request-id']}));app.use(express.json({limit:'64kb'}));app.use(pinoHttp({genReqId:req=>String(req.headers['x-request-id']||randomUUID())}));
const wrap=(fn:(req:Request,res:Response)=>Promise<any>)=>(req:Request,res:Response,next:NextFunction)=>Promise.resolve(fn(req,res)).catch(next);
function err(res:Response,status:number,code:string,message:string){return res.status(status).json({error:{code,message}});}
async function record(actor:string,action:string,target:string,details:Record<string,unknown>={}){await db.insert(audit).values({actor,action,target,details});}
app.get('/health/live',(_req,res)=>res.json({status:'ok'}));app.get('/health/ready',wrap(async(_req,res)=>{await pool.query('select 1');res.json({status:'ready'});}));
app.use('/v1',authenticate);
app.get('/v1/teams',wrap(async(_req,res)=>res.json(await db.select().from(teams).orderBy(desc(teams.createdAt)))));
app.post('/v1/teams',requireRole('admin','developer'),wrap(async(req,res)=>{const data=teamCreateSchema.parse(req.body);const [item]=await db.insert(teams).values(data).returning();await record(req.principal!.id,'team.created',item.id);res.status(201).json(item);}));
app.get('/v1/services',wrap(async(_req,res)=>res.json(await db.select().from(services).orderBy(desc(services.createdAt)))));
app.post('/v1/services',requireRole('admin','developer'),wrap(async(req,res)=>{const data=serviceCreateSchema.parse(req.body);const [team]=await db.select().from(teams).where(eq(teams.id,data.teamId));if(!team)return err(res,404,'TEAM_NOT_FOUND','Team not found');const [item]=await db.insert(services).values(data).returning();await record(req.principal!.id,'service.created',item.id);res.status(201).json(item);}));
app.get('/v1/resources',wrap(async(_req,res)=>res.json(await db.select().from(resources).orderBy(desc(resources.createdAt)))));
app.get('/v1/resources/:id',wrap(async(req,res)=>{const [item]=await db.select().from(resources).where(eq(resources.id,req.params.id));if(!item)return err(res,404,'NOT_FOUND','Resource not found');res.json(item);}));
app.post('/v1/resources',requireRole('admin','developer'),wrap(async(req,res)=>{
 const data=resourceCreateSchema.parse(req.body),key=req.header('idempotency-key');if(!key||key.length>160)return err(res,400,'IDEMPOTENCY_KEY_REQUIRED','Provide a unique Idempotency-Key header');
 const hash=createHash('sha256').update(JSON.stringify(data)).digest('hex');
 const response=await db.transaction(async tx=>{
  await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${key}))`);
  const [existing]=await tx.select().from(operations).where(eq(operations.idempotencyKey,key));
  if(existing){if(existing.requestHash!==hash)return {conflict:true};return {resourceId:existing.resourceId,operationId:existing.id};}
  const [service]=await tx.select().from(services).where(eq(services.id,data.serviceId));if(!service)return {missing:true};
  const [r]=await tx.insert(resources).values({...data,status:'pending'}).returning();
  const [o]=await tx.insert(operations).values({resourceId:r.id,type:'create',idempotencyKey:key,requestHash:hash}).returning();return {resourceId:r.id,operationId:o.id};
 });
 if('conflict'in response)return err(res,409,'IDEMPOTENCY_CONFLICT','Key already used with a different request');if('missing'in response)return err(res,404,'SERVICE_NOT_FOUND','Service not found');
 await record(req.principal!.id,'resource.requested',response.resourceId!);res.status(202).json(response);
}));
app.delete('/v1/resources/:id',requireRole('admin'),wrap(async(req,res)=>{const [r]=await db.select().from(resources).where(eq(resources.id,req.params.id));if(!r)return err(res,404,'NOT_FOUND','Resource not found');if(r.status==='deleted'||r.status==='deleting')return err(res,409,'ALREADY_DELETING','Already deleting');const [op]=await db.transaction(async tx=>{await tx.update(resources).set({status:'deleting',updatedAt:new Date()}).where(eq(resources.id,r.id));return tx.insert(operations).values({resourceId:r.id,type:'delete'}).returning();});await record(req.principal!.id,'resource.delete.requested',r.id);res.status(202).json({operationId:op.id});}));
app.get('/v1/operations/:id',wrap(async(req,res)=>{const [op]=await db.select().from(operations).where(eq(operations.id,req.params.id));if(!op)return err(res,404,'NOT_FOUND','Operation not found');res.json(op);}));
app.get('/v1/jobs',wrap(async(_req,res)=>res.json(await db.select().from(jobs).orderBy(desc(jobs.createdAt)))));
app.post('/v1/jobs',requireRole('admin','developer'),wrap(async(req,res)=>{const data=jobCreateSchema.parse(req.body);const [service]=await db.select().from(services).where(eq(services.id,data.serviceId));if(!service)return err(res,404,'SERVICE_NOT_FOUND','Service not found');const [job]=await db.insert(jobs).values({...data,command:data.command||null}).returning();await record(req.principal!.id,'job.created',job.id);res.status(201).json(job);}));
app.get('/v1/usage/summary',wrap(async(_req,res)=>{const [resourceCounts,jobCounts,operationCounts]=await Promise.all([db.select({status:resources.status,count:sql<number>`count(*)::int`}).from(resources).groupBy(resources.status),db.select({status:jobs.status,count:sql<number>`count(*)::int`}).from(jobs).groupBy(jobs.status),db.select({status:operations.status,count:sql<number>`count(*)::int`}).from(operations).groupBy(operations.status)]);res.json({resources:resourceCounts,jobs:jobCounts,operations:operationCounts,note:'Inventory counters only; cost and runtime usage metering not yet implemented'});}));
app.get('/v1/audit',requireRole('admin'),wrap(async(_req,res)=>res.json(await db.select().from(audit).orderBy(desc(audit.createdAt)).limit(100))));
app.use((e:unknown,req:Request,res:Response,_next:NextFunction)=>{if(e instanceof ZodError)return err(res,400,'VALIDATION_FAILED',e.errors.map(x=>`${x.path.join('.')}: ${x.message}`).join('; '));if((e as any)?.code==='23505')return err(res,409,'CONFLICT','A record with this identifier already exists');if((e as any)?.code==='22P02')return err(res,400,'INVALID_ID','Invalid identifier');req.log?.error({err:e},'request failed');return err(res,500,'INTERNAL_ERROR','An internal error occurred');});
const server=app.listen(Number(process.env.API_PORT||4000),()=>console.log(`DBaaS API listening on ${process.env.API_PORT||4000}`));
process.on('SIGTERM',()=>{server.close(()=>pool.end().then(()=>process.exit(0)));});
