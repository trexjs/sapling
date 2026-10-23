export interface Job<T>{id:string;tenantId:string;payload:T;maxAttempts:number;attempts:number;status:'queued'|'running'|'completed'|'dead'|'canceled';error?:string}
export class MemoryExecutionQueue<T>{private readonly jobs=new Map<string,Job<T>>();private accepting=true;
 enqueue(job:Omit<Job<T>,'attempts'|'status'>){if(!this.accepting)throw new Error('Queue draining');if(!this.jobs.has(job.id))this.jobs.set(job.id,{...job,attempts:0,status:'queued'})}
 async runNext(handler:(payload:T,tenantId:string)=>Promise<void>){const j=[...this.jobs.values()].find(x=>x.status==='queued');if(!j)return undefined;j.status='running';j.attempts++;try{await handler(j.payload,j.tenantId);j.status='completed'}catch(e){j.error=String(e);j.status=j.attempts>=j.maxAttempts?'dead':'queued'}return {...j}}
 cancel(id:string){const j=this.jobs.get(id);if(j&&j.status==='queued')j.status='canceled'}
 drain(){this.accepting=false}list(){return [...this.jobs.values()].map(x=>({...x}))}
}
