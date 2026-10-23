import {createHash,randomUUID} from 'node:crypto';
export interface AuditInput{tenantId:string;actorId:string;action:string;target:string;outcome:'success'|'denied'|'failure';occurredAt:string;correlationId?:string}
export interface AuditRecord extends AuditInput{id:string;previousHash:string;hash:string}
export class AppendOnlyAuditLog{private readonly records:AuditRecord[]=[];
 append(input:AuditInput){if(!input.tenantId||!input.actorId)throw new Error('Missing audit identity');const previousHash=this.records.at(-1)?.hash??'GENESIS';const id=randomUUID();const hash=createHash('sha256').update(JSON.stringify({id,...input,previousHash})).digest('hex');const record={id,...input,previousHash,hash};this.records.push(record);return {...record}}
 list(tenantId:string){return this.records.filter(r=>r.tenantId===tenantId).map(x=>({...x}))}
 verifyChain(){let prior='GENESIS';for(const r of this.records){const {hash,...input}=r;const computed=createHash('sha256').update(JSON.stringify(input)).digest('hex');if(r.previousHash!==prior||computed!==hash)return false;prior=hash}return true}
}
// An in-memory hash chain is not tamper resistant to a privileged process operator.
