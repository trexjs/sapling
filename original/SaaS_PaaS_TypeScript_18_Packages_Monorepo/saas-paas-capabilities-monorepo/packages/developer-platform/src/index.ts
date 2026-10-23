export interface ServiceEntry {id:string;name:string;owner:string;supportRoute:string;repository:string;runbook:string;dependencies:readonly string[];lifecycle:'active'|'deprecated'|'retired'}
export interface ArchitectureDecision{id:string;serviceId:string;title:string;decision:string;owner:string;recordedAt:string}
export class ServiceCatalog {private services=new Map<string,ServiceEntry>();private decisions=new Map<string,ArchitectureDecision>();
 register(s:ServiceEntry){if(!s.owner||!s.supportRoute||!s.runbook)throw new Error('Service ownership/runbook required');this.services.set(s.id,structuredClone(s))}
 recordDecision(a:ArchitectureDecision){if(!this.services.has(a.serviceId))throw new Error('Unknown service');if(this.decisions.has(a.id))throw new Error('Immutable ADR ID');this.decisions.set(a.id,{...a})}
 get(id:string){const s=this.services.get(id);return s?structuredClone(s):undefined}
 list(){return [...this.services.values()].map(s=>structuredClone(s))}
 listDecisions(serviceId:string){return [...this.decisions.values()].filter(a=>a.serviceId===serviceId).map(a=>({...a}))}
}
