import type {Request,Response,NextFunction} from 'express';import {createHash,timingSafeEqual} from 'node:crypto';
export type Principal={id:string;role:'admin'|'developer'|'viewer'};
declare global {namespace Express {interface Request {principal?:Principal}}}
function safeToken(a:string,b:string){const x=createHash('sha256').update(a).digest();const y=createHash('sha256').update(b).digest();return timingSafeEqual(x,y);}
export function authenticate(req:Request,res:Response,next:NextFunction){
 const bearer=req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
 // DEVELOPMENT AUTH ONLY: production integration with enterprise OIDC is not implemented.
 if(process.env.NODE_ENV==='production' || process.env.DEV_AUTH_ENABLED!=='true')return res.status(503).json({error:{code:'AUTH_NOT_CONFIGURED',message:'Configure a production identity provider before accepting requests',requestId:req.header('x-request-id')}});
 if(!bearer||!process.env.DEV_API_TOKEN||process.env.DEV_API_TOKEN.length<20||!safeToken(bearer,process.env.DEV_API_TOKEN))return res.status(401).json({error:{code:'UNAUTHORIZED',message:'Invalid local development token'}});
 req.principal={id:'local-developer',role:'admin'};next();
}
export function requireRole(...roles:Principal['role'][]){return(req:Request,res:Response,next:NextFunction)=>req.principal&&roles.includes(req.principal.role)?next():res.status(403).json({error:{code:'FORBIDDEN',message:'Insufficient permissions'}});}
