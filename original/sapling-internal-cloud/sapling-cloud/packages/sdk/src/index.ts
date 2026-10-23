export class SaplingCloudClient {constructor(private readonly options:{baseUrl:string;token:string;tenantId:string;projectId:string}){}
 private async request<T>(path:string,init:RequestInit={}):Promise<T>{const r=await fetch(this.options.baseUrl+'/v1'+path,{...init,headers:{authorization:'Bearer '+this.options.token,'content-type':'application/json','x-tenant-id':this.options.tenantId,'x-project-id':this.options.projectId,...init.headers}});const data=await r.json();if(!r.ok)throw new Error(data.error||'Request failed');return data as T}
 catalog(){return this.request<Array<{id:string;title:string;resources:string[]}>>('/catalog')}
 list(capability?:string){return this.request<Array<{id:string;name:string;status:string}>>('/resources'+(capability?'?capability='+encodeURIComponent(capability):''))}
 create(input:{capability:string;kind:string;name:string;spec:Record<string,unknown>}){return this.request('/resources',{method:'POST',body:JSON.stringify(input)})}
 operations(){return this.request('/operations')}
 audit(){return this.request('/audit')}
}
