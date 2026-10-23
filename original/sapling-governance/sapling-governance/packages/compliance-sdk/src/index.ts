export class ComplianceClient {constructor(private endpoint:string,private tenantId:string){}
 async list(module:string){const r=await fetch(`${this.endpoint}/v1/${encodeURIComponent(module)}`,{headers:{'x-tenant-id':this.tenantId}});if(!r.ok)throw Error(`Compliance API: ${r.status}`);return r.json()}
 async create(module:string,input:{name:string;status?:string;data?:Record<string,unknown>}){const r=await fetch(`${this.endpoint}/v1/${encodeURIComponent(module)}`,{method:'POST',headers:{'content-type':'application/json','x-tenant-id':this.tenantId},body:JSON.stringify(input)});if(!r.ok)throw Error(`Compliance API: ${r.status}`);return r.json()}
}
