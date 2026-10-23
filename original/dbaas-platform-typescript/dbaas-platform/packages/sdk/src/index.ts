import type {TeamCreate,ServiceCreate,ResourceCreate,JobCreate} from '@dbaas/contracts';
export class DbaaSError extends Error {constructor(public status:number,public code:string,message:string,public requestId?:string){super(message);this.name='DbaaSError';}}
export type ClientOptions={baseUrl:string;tokenProvider:()=>Promise<string>;fetchImpl?:typeof fetch};
export class DbaaSClient {
  constructor(private options:ClientOptions){}
  private async call<T>(path:string,method='GET',body?:unknown,idempotencyKey?:string):Promise<T>{
    const token=await this.options.tokenProvider();
    const response=await (this.options.fetchImpl||fetch)(this.options.baseUrl.replace(/\/$/,'')+path,{method,headers:{'content-type':'application/json','authorization':`Bearer ${token}`,...(idempotencyKey?{'idempotency-key':idempotencyKey}:{})},body:body===undefined?undefined:JSON.stringify(body)});
    const result=await response.json().catch(()=>({}));
    if(!response.ok)throw new DbaaSError(response.status,result.error?.code||'HTTP_ERROR',result.error?.message||response.statusText,result.error?.requestId);
    return result as T;
  }
  teams={list:()=>this.call<any[]>('/v1/teams'),create:(data:TeamCreate)=>this.call<any>('/v1/teams','POST',data)};
  services={list:()=>this.call<any[]>('/v1/services'),create:(data:ServiceCreate)=>this.call<any>('/v1/services','POST',data)};
  resources={list:()=>this.call<any[]>('/v1/resources'),create:(data:ResourceCreate,idempotencyKey:string)=>this.call<{resourceId:string;operationId:string}>('/v1/resources','POST',data,idempotencyKey),get:(id:string)=>this.call<any>(`/v1/resources/${encodeURIComponent(id)}`),remove:(id:string)=>this.call<any>(`/v1/resources/${encodeURIComponent(id)}`,'DELETE')};
  operations={get:(id:string)=>this.call<any>(`/v1/operations/${encodeURIComponent(id)}`),wait:async(id:string,options:{timeoutMs?:number;pollMs?:number}={})=>{const deadline=Date.now()+(options.timeoutMs??120000);while(Date.now()<deadline){const op=await this.operations.get(id);if(op.status==='succeeded')return op;if(op.status==='failed')throw new Error(op.error||'Provisioning failed');await new Promise(r=>setTimeout(r,options.pollMs??1500));}throw new Error('Operation timed out');}};
  jobs={list:()=>this.call<any[]>('/v1/jobs'),create:(data:JobCreate)=>this.call<any>('/v1/jobs','POST',data)};
  usage={summary:()=>this.call<any>('/v1/usage/summary')};
}
