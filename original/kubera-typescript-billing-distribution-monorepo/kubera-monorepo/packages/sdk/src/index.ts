import type { ProductInput, OrderInput, SubscriptionInput, AffiliateInput, LicenseInput } from '@kubera/contracts';
export class KuberaApiError extends Error {constructor(public status:number,public code:string,message:string,public requestId?:string){super(message);this.name='KuberaApiError'}}
export type KuberaConfig={baseUrl:string;apiKey?:string;tenantId:string;getToken?:()=>string|Promise<string>;timeoutMs?:number;retries?:number;fetchImpl?:typeof fetch};
export class Kubera {
  constructor(private config:KuberaConfig){}
  private async request<T>(path:string,method='GET',body?:unknown,headers:Record<string,string>={}):Promise<T>{
    const maxAttempts=(this.config.retries??2)+1;
    for(let attempt=0;attempt<maxAttempts;attempt++){
      const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),this.config.timeoutMs??10000);
      try{
        const token=await this.config.getToken?.();const response=await (this.config.fetchImpl??fetch)(this.config.baseUrl.replace(/\/$/,'')+path,{method,signal:controller.signal,headers:{'content-type':'application/json','x-tenant-id':this.config.tenantId,...(this.config.apiKey?{'x-admin-api-key':this.config.apiKey}:{}),...(token?{authorization:`Bearer ${token}`}:{}) ,...headers},body:body===undefined?undefined:JSON.stringify(body)});
        if((response.status===429||response.status>=500)&&attempt+1<maxAttempts&&(method==='GET'||headers['idempotency-key'])){await new Promise(r=>setTimeout(r,200*2**attempt));continue}
        const data=await response.json().catch(()=>null);if(!response.ok)throw new KuberaApiError(response.status,data?.error?.code||'HTTP_ERROR',data?.error?.message||response.statusText,data?.error?.requestId);return data as T;
      }catch(err){if(err instanceof KuberaApiError)throw err;if(attempt+1>=maxAttempts||method!=='GET')throw err;await new Promise(r=>setTimeout(r,200*2**attempt))}finally{clearTimeout(timer)}
    }throw new Error('Request attempts exhausted');
  }
  private path=(resource:string)=>`/v1/tenants/${encodeURIComponent(this.config.tenantId)}/${resource}`;
  products={list:()=>this.request<any[]>(this.path('products')),create:(input:ProductInput)=>this.request<any>(this.path('products'),'POST',input)};
  orders={list:()=>this.request<any[]>(this.path('orders')),create:(input:OrderInput)=>this.request<{order:any;replayed:boolean}>(this.path('orders'),'POST',input,{'idempotency-key':input.idempotencyKey}),simulateSettlement:(id:string)=>this.request<any>(this.path(`orders/${encodeURIComponent(id)}/simulate-settlement`),'POST')};
  invoices={list:()=>this.request<any[]>(this.path('invoices'))};
  payments={list:()=>this.request<any[]>(this.path('payments'))};
  entitlements={list:()=>this.request<any[]>(this.path('entitlements'))};
  licenses={issue:(input:LicenseInput)=>this.request<{key:string;id:string}>(this.path('licenses'),'POST',input),verify:(key:string)=>this.request<{valid:boolean}>(this.path('licenses/verify'),'POST',{key})};
  subscriptions={list:()=>this.request<any[]>(this.path('subscriptions')),create:(input:SubscriptionInput)=>this.request<any>(this.path('subscriptions'),'POST',input)};
  affiliates={list:()=>this.request<any[]>(this.path('affiliates')),create:(input:AffiliateInput)=>this.request<any>(this.path('affiliates'),'POST',input)};
  ledger={list:()=>this.request<any[]>(this.path('ledger'))};
  audit={list:()=>this.request<any[]>(this.path('audit'))};
}
