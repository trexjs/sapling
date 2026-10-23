export type GateKind='contract'|'security'|'isolation'|'performance'|'accessibility'|'localization'|'release';
export interface QualityGate {id:string;kind:GateKind;owner:string;severity:'blocker'|'warning';threshold:number;metric:string}
export interface GateObservation {gateId:string;value:number;recordedAt:string}
export class QualityPolicyRegistry {private gates=new Map<string,QualityGate>();private observations=new Map<string,GateObservation>();
 register(g:QualityGate){if(!g.owner||!Number.isFinite(g.threshold))throw new Error('Invalid gate');this.gates.set(g.id,{...g})}
 record(o:GateObservation){if(!this.gates.has(o.gateId))throw new Error('Unknown gate');this.observations.set(o.gateId,{...o})}
 evaluate(){return [...this.gates.values()].map(g=>{const o=this.observations.get(g.id);return {gateId:g.id,kind:g.kind,status:!o?'unknown':o.value>=g.threshold?'pass':'fail',blocker:g.severity==='blocker',owner:g.owner}})}
}
// Quality-gate policy registry only; no test suite, runner, fixtures or CI test configuration is included.
