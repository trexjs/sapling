export type ConsentCategories=Record<string,boolean>;
export class ConsentClient {constructor(private endpoint:string,private tenantId:string){}
 async decide(input:{subjectId:string;domainId:string;policyVersion:string;categories:ConsentCategories;region?:string;source?:string}){const r=await fetch(`${this.endpoint}/v1/decisions`,{method:'POST',headers:{'content-type':'application/json','x-tenant-id':this.tenantId},body:JSON.stringify(input)});if(!r.ok)throw Error(`Consent API: ${r.status}`);return r.json()}
 async history(subjectId:string){const r=await fetch(`${this.endpoint}/v1/decisions/${encodeURIComponent(subjectId)}`,{headers:{'x-tenant-id':this.tenantId}});if(!r.ok)throw Error(`Consent API: ${r.status}`);return r.json()}
 static allowed(category:string,categories:ConsentCategories){return category==='necessary'||categories[category]===true}
}
