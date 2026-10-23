import {createHmac,timingSafeEqual} from 'node:crypto';
export type FlowEvent<T=unknown>={name:string,data:T,id?:string};
export type FlowContext<T=unknown>={event:FlowEvent<T>;runId:string;step:{run:<R>(id:string,fn:()=>Promise<R>)=>Promise<R>;sleep:(id:string,ms:number)=>Promise<void>;waitForEvent:(id:string,eventName:string,timeoutMs:number)=>Promise<FlowEvent>}};
export type FunctionOptions={id:string;event:string;retries?:number;concurrency?:number;priority?:number;timeoutMs?:number;cron?:string};
export type FlowFunction={options:FunctionOptions;handler:(ctx:FlowContext<any>)=>Promise<unknown>};
export class FlowClient {
 private functions=new Map<string,FlowFunction>();
 constructor(readonly config:{baseUrl:string;apiKey:string;signingSecret?:string}){}
 createFunction<T>(options:FunctionOptions,handler:(ctx:FlowContext<T>)=>Promise<unknown>){this.functions.set(options.id,{options,handler});return options;}
 async send<T>(event:FlowEvent<T>,dedupeKey?:string){const r=await fetch(`${this.config.baseUrl}/v1/events`,{method:'POST',headers:{'content-type':'application/json','x-api-key':this.config.apiKey,...(dedupeKey?{'idempotency-key':dedupeKey}:{})},body:JSON.stringify(event)});if(!r.ok)throw Error(await r.text());return r.json();}
 async register(endpoint:string){const functions=[...this.functions.values()].map(f=>({...f.options,endpoint}));const r=await fetch(`${this.config.baseUrl}/v1/functions/register`,{method:'POST',headers:{'content-type':'application/json','x-api-key':this.config.apiKey},body:JSON.stringify({functions})});if(!r.ok)throw Error(await r.text());return r.json();}
 async handle(body:any,signature?:string){if(this.config.signingSecret){if(!signature)throw Error('Missing signature');const expected=createHmac('sha256',this.config.signingSecret).update(JSON.stringify(body)).digest('hex');const a=Buffer.from(signature,'hex'),b=Buffer.from(expected,'hex');if(a.length!==b.length||!timingSafeEqual(a,b))throw Error('Invalid signature');}
 const fn=this.functions.get(body.functionId);if(!fn)throw Error('Unknown function');const step={run:async<R>(id:string,callback:()=>Promise<R>):Promise<R>=>{const old=await this.stepCall(body.runId,id,'get');if(old.found)return old.result as R;const value=await callback();await this.stepCall(body.runId,id,'put',value);return value;},sleep:async(id:string,ms:number)=>{await new Promise(resolve=>setTimeout(resolve,ms));},waitForEvent:async(id:string,eventName:string,timeoutMs:number)=>{throw Error('waitForEvent requires server-side suspension; not yet supported by SDK executor');}};
 return fn.handler({event:body.event,runId:body.runId,step});}
 private async stepCall(runId:string,stepId:string,method:'get'|'put',result?:unknown){const r=await fetch(`${this.config.baseUrl}/v1/internal/steps`,{method:'POST',headers:{'content-type':'application/json','x-api-key':this.config.apiKey},body:JSON.stringify({runId,stepId,method,result})});if(!r.ok)throw Error(await r.text());return r.json();}
}
