export interface SearchDocument{id:string;tenantId:string;version:number;text:string;allowedActorIds:readonly string[];updatedAt:string}
export interface SearchQuery{tenantId:string;actorId:string;query:string;limit?:number}
export class MemorySearchIndex{
 private readonly docs=new Map<string,SearchDocument>();
 upsert(doc:SearchDocument){if(!doc.tenantId||!doc.id)throw new Error('Missing document scope');this.docs.set(doc.tenantId+':'+doc.id,structuredClone(doc))}
 delete(tenantId:string,id:string){this.docs.delete(tenantId+':'+id)}
 search(q:SearchQuery){if(!q.actorId||!q.tenantId)throw new Error('Authenticated search context required');const term=q.query.toLocaleLowerCase();return [...this.docs.values()].filter(d=>d.tenantId===q.tenantId&&d.allowedActorIds.includes(q.actorId)&&d.text.toLocaleLowerCase().includes(term)).slice(0,Math.max(0,Math.min(q.limit??20,100))).map(x=>structuredClone(x))}
}
