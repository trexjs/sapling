export type SubscriptionState='trial'|'active'|'grace'|'suspended'|'canceled';
export interface Plan {id:string; capabilities:Record<string,boolean>; quotas:Record<string,number>}
export interface Subscription {tenantId:string;planId:string;state:SubscriptionState}
export interface UsageEvent {id:string;tenantId:string;metric:string;quantity:number;occurredAt:string}
export class EntitlementService {
 private readonly plans=new Map<string,Plan>();private readonly subscriptions=new Map<string,Subscription>();private readonly events=new Map<string,UsageEvent>();
 setPlan(p:Plan){this.plans.set(p.id,structuredClone(p))}
 setSubscription(s:Subscription){if(!this.plans.has(s.planId))throw new Error('Unknown plan');this.subscriptions.set(s.tenantId,{...s})}
 check(tenantId:string,capability:string){const s=this.subscriptions.get(tenantId);const p=s&&this.plans.get(s.planId);return {allowed:!!p&&!!p.capabilities[capability]&&['trial','active','grace'].includes(s!.state),reason:!s?'no-subscription':!p?'missing-plan':'plan-policy'} }
 recordUsage(e:UsageEvent){if(!Number.isFinite(e.quantity)||e.quantity<0)throw new Error('Invalid usage');if(this.events.has(e.id))return false;this.events.set(e.id,{...e});return true}
 quota(tenantId:string,metric:string){const s=this.subscriptions.get(tenantId);const p=s&&this.plans.get(s.planId);const max=p?.quotas[metric]??0;const used=[...this.events.values()].filter(e=>e.tenantId===tenantId&&e.metric===metric).reduce((n,e)=>n+e.quantity,0);return {used,max,remaining:Math.max(0,max-used),allowed:used<max}}
}
