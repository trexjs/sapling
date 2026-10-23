import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { eq, and, desc } from 'drizzle-orm';
import { db, consentRecords, decisions, jobs } from '@sapling/database';
import { recordInput, decisionInput } from '@sapling/contracts';
import { z } from 'zod';
const app=express();app.use(helmet());app.use(cors({origin:process.env.CORS_ORIGIN?.split(',')??['http://localhost:5173']}));app.use(express.json({limit:'256kb'}));
// DEVELOPMENT ONLY: replace headers with verified IdentityOS JWT + tenant membership middleware.
app.use((req,res,next)=>{if(process.env.NODE_ENV==='production' && process.env.ALLOW_INSECURE_DEV_AUTH!=='true')return res.status(503).json({error:'IdentityOS integration required before production'});next();});
const tenant=(req:express.Request)=>String(req.header('x-tenant-id')||process.env.DEV_TENANT_ID||'local-tenant');
const allowed=new Set(["banners", "scans", "preferences", "enforcement", "receipts", "regulations", "integrations", "policies", "privacy-requests", "analytics", "developers", "administration"]);
const wrap=(fn:express.RequestHandler):express.RequestHandler=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
app.get('/health',(_,res)=>res.json({ok:true,service:'consent'}));
app.get('/v1/modules',(_,res)=>res.json({modules:["banners", "scans", "preferences", "enforcement", "receipts", "regulations", "integrations", "policies", "privacy-requests", "analytics", "developers", "administration"]}));
app.get('/v1/:module',wrap(async(req,res)=>{if(!allowed.has(req.params.module))return void res.status(404).json({error:'Unknown module'});const rows=await db.select().from(consentRecords).where(and(eq(consentRecords.tenantId,tenant(req)),eq(consentRecords.module,req.params.module))).orderBy(desc(consentRecords.createdAt)).limit(200);res.json({items:rows});}));
app.post('/v1/:module',wrap(async(req,res)=>{if(!allowed.has(req.params.module))return void res.status(404).json({error:'Unknown module'});const payload=recordInput.parse(req.body);const [row]=await db.insert(consentRecords).values({...payload,tenantId:tenant(req),module:req.params.module}).returning();res.status(201).json(row);}));
app.get('/v1/:module/:id',wrap(async(req,res)=>{if(!allowed.has(req.params.module))return void res.sendStatus(404);const [row]=await db.select().from(consentRecords).where(and(eq(consentRecords.id,req.params.id),eq(consentRecords.tenantId,tenant(req)),eq(consentRecords.module,req.params.module)));if(!row)return void res.sendStatus(404);res.json(row);}));
app.patch('/v1/:module/:id',wrap(async(req,res)=>{if(!allowed.has(req.params.module))return void res.sendStatus(404);const payload=recordInput.partial().parse(req.body);const [row]=await db.update(consentRecords).set({...payload,updatedAt:new Date()}).where(and(eq(consentRecords.id,req.params.id),eq(consentRecords.tenantId,tenant(req)),eq(consentRecords.module,req.params.module))).returning();if(!row)return void res.sendStatus(404);res.json(row);}));
app.delete('/v1/:module/:id',wrap(async(req,res)=>{if(!allowed.has(req.params.module))return void res.sendStatus(404);const [row]=await db.delete(consentRecords).where(and(eq(consentRecords.id,req.params.id),eq(consentRecords.tenantId,tenant(req)),eq(consentRecords.module,req.params.module))).returning();if(!row)return void res.sendStatus(404);res.sendStatus(204);}));
// Append-only consent receipts: never modify historical decisions.
app.post('/v1/decisions',wrap(async(req,res)=>{const data=decisionInput.parse(req.body);const [receipt]=await db.insert(decisions).values({...data,tenantId:tenant(req)}).returning();res.status(201).json(receipt);}));
app.get('/v1/decisions/:subjectId',wrap(async(req,res)=>{const rows=await db.select().from(decisions).where(and(eq(decisions.tenantId,tenant(req)),eq(decisions.subjectId,req.params.subjectId))).orderBy(desc(decisions.createdAt)).limit(100);res.json({items:rows});}));
app.get('/v1/decisions/:subjectId/latest',wrap(async(req,res)=>{const [row]=await db.select().from(decisions).where(and(eq(decisions.tenantId,tenant(req)),eq(decisions.subjectId,req.params.subjectId))).orderBy(desc(decisions.createdAt)).limit(1);res.json(row??null);}));

app.use((err:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{if(err instanceof z.ZodError)return void res.status(400).json({error:'Validation failed',issues:err.issues});console.error(err);res.status(500).json({error:'Internal server error'});});
app.listen(Number(process.env.4101||4101),()=>console.log('consent listening'));
