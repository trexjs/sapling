export type ResourceState='requested'|'provisioning'|'ready'|'failed'|'deleting'|'deleted';
export interface ManagedResource{id:string;tenantId:string;region:string;owner:string;desiredState:ResourceState;observedState:ResourceState;version:number}
export interface Provisioner{apply(resource:ManagedResource):Promise<ResourceState>}
export class ControlPlane {private resources=new Map<string,ManagedResource>();
 request(resource:Omit<ManagedResource,'version'|'observedState'>){if(!resource.tenantId||!resource.region||!resource.owner)throw new Error('Missing resource metadata');const old=this.resources.get(resource.id);const updated:ManagedResource={...resource,observedState:old?.observedState??'requested',version:(old?.version??0)+1};this.resources.set(resource.id,updated);return {...updated}}
 async reconcile(id:string,adapter:Provisioner){const r=this.resources.get(id);if(!r)throw new Error('Unknown resource');try{r.observedState=await adapter.apply({...r})}catch{r.observedState='failed'}return {...r}}
 get(id:string,tenantId:string){const r=this.resources.get(id);if(!r||r.tenantId!==tenantId)return undefined;return {...r}}
 drift(){return [...this.resources.values()].filter(r=>r.desiredState!==r.observedState).map(r=>({...r}))}
}
