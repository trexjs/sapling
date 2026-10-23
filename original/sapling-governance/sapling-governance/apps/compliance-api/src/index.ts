import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { eq, and, desc } from 'drizzle-orm';
import { db, complianceRecords, decisions, jobs } from '@sapling/database';
import { recordInput, decisionInput } from '@sapling/contracts';
import { z } from 'zod';
const app=express();app.use(helmet());app.use(cors({origin:process.env.CORS_ORIGIN?.split(',')??['http://localhost:5173']}));app.use(express.json({limit:'256kb'}));
// DEVELOPMENT ONLY: replace headers with verified IdentityOS JWT + tenant membership middleware.
app.use((req,res,next)=>{if(process.env.NODE_ENV==='production' && process.env.ALLOW_INSECURE_DEV_AUTH!=='true')return res.status(503).json({error:'IdentityOS integration required before production'});next();});
const tenant=(req:express.Request)=>String(req.header('x-tenant-id')||process.env.DEV_TENANT_ID||'local-tenant');
const allowed=new Set(["frameworks", "controls", "evidence", "monitoring", "risks", "audits"]);
const wrap=(fn:express.RequestHandler):express.RequestHandler=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
app.get('/health',(_,res)=>res.json({ok:true,service:'compliance'}));
app.get('/v1/modules',(_,res)=>res.json({modules:["frameworks", "controls", "evidence", "monitoring", "risks", "audits"]}));
app.get('/v1/:module',wrap(async(req,res)=>{if(!allowed.has(req.params.module))return void res.status(404).json({error:'Unknown module'});const rows=await db.select().from(complianceRecords).where(and(eq(complianceRecords.tenantId,tenant(req)),eq(complianceRecords.module,req.params.module))).orderBy(desc(complianceRecords.createdAt)).limit(200);res.json({items:rows});}));
app.post('/v1/:module',wrap(async(req,res)=>{if(!allowed.has(req.params.module))return void res.status(404).json({error:'Unknown module'});const payload=recordInput.parse(req.body);const [row]=await db.insert(complianceRecords).values({...payload,tenantId:tenant(req),module:req.params.module}).returning();res.status(201).json(row);}));
app.get('/v1/:module/:id',wrap(async(req,res)=>{if(!allowed.has(req.params.module))return void res.sendStatus(404);const [row]=await db.select().from(complianceRecords).where(and(eq(complianceRecords.id,req.params.id),eq(complianceRecords.tenantId,tenant(req)),eq(complianceRecords.module,req.params.module)));if(!row)return void res.sendStatus(404);res.json(row);}));
app.patch('/v1/:module/:id',wrap(async(req,res)=>{if(!allowed.has(req.params.module))return void res.sendStatus(404);const payload=recordInput.partial().parse(req.body);const [row]=await db.update(complianceRecords).set({...payload,updatedAt:new Date()}).where(and(eq(complianceRecords.id,req.params.id),eq(complianceRecords.tenantId,tenant(req)),eq(complianceRecords.module,req.params.module))).returning();if(!row)return void res.sendStatus(404);res.json(row);}));
app.delete('/v1/:module/:id',wrap(async(req,res)=>{if(!allowed.has(req.params.module))return void res.sendStatus(404);const [row]=await db.delete(complianceRecords).where(and(eq(complianceRecords.id,req.params.id),eq(complianceRecords.tenantId,tenant(req)),eq(complianceRecords.module,req.params.module))).returning();if(!row)return void res.sendStatus(404);res.sendStatus(204);}));
// Persist a control check result. Actual connector-driven monitoring is a future integration.
app.post('/v1/control-checks',wrap(async(req,res)=>{const input=z.object({controlId:z.string().uuid(),passed:z.boolean(),details:z.record(z.unknown()).default({})}).parse(req.body);const [run]=await db.insert(jobs).values({...input,tenantId:tenant(req)}).returning();res.status(201).json(run);}));
app.get('/v1/control-checks',wrap(async(req,res)=>{const rows=await db.select().from(jobs).where(eq(jobs.tenantId,tenant(req))).orderBy(desc(jobs.createdAt)).limit(200);res.json({items:rows});}));

app.use((err:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{if(err instanceof z.ZodError)return void res.status(400).json({error:'Validation failed',issues:err.issues});console.error(err);res.status(500).json({error:'Internal server error'});});
app.listen(Number(process.env.4102||4102),()=>console.log('compliance listening'));
