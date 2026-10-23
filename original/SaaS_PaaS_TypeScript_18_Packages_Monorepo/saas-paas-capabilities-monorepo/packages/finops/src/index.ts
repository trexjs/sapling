export interface CostRecord {id:string;tenantId:string;projectId:string;service:string;environment:string;currency:string;amountMinor:number;start:string;end:string;source:string}
export interface Budget {tenantId:string;currency:string;limitMinor:number}
export class CostLedger {private records=new Map<string,CostRecord>();private budgets=new Map<string,Budget>();
 record(x:CostRecord){if(!Number.isSafeInteger(x.amountMinor)||x.amountMinor<0||!x.source)throw new Error('Invalid cost');if(this.records.has(x.id))return false;this.records.set(x.id,{...x});return true}
 setBudget(x:Budget){if(x.limitMinor<0)throw new Error('Invalid budget');this.budgets.set(x.tenantId+':'+x.currency,{...x})}
 summary(tenantId:string,currency:string){const rows=[...this.records.values()].filter(r=>r.tenantId===tenantId&&r.currency===currency);const actualMinor=rows.reduce((v,r)=>v+r.amountMinor,0);const limitMinor=this.budgets.get(tenantId+':'+currency)?.limitMinor;return {tenantId,currency,actualMinor,limitMinor,exceeded:limitMinor!==undefined&&actualMinor>limitMinor,provisional:true}}
}
