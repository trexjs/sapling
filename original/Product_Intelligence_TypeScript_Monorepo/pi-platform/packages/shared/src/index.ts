export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
export type EventInput = {event:string; distinctId?:string; anonymousId?:string; sessionId?:string; eventId?:string; timestamp?:string; properties?:Record<string,Json>; release?:string};
export type FlagRule = {attribute:string; operator:'eq'|'neq'|'in'|'contains'; value:Json};
export type Flag = {key:string; enabled:boolean; defaultValue:Json; rules:FlagRule[]; rollout:number; variants?:Array<{key:string; weight:number}>; version:number};
export type Evaluation = {key:string; value:Json; variant?:string; reason:string; version:number};
export type Experiment = {id:string; flagKey:string; name:string; status:'draft'|'running'|'paused'|'completed'; goalEvent:string; variants:Array<{key:string;weight:number}>};
export type ErrorInput = {message:string; stack?:string; name?:string; release?:string; distinctId?:string; sessionId?:string; context?:Record<string,Json>};
export type ApiError = {error:string; code:string; requestId?:string};
export const uid = () => crypto.randomUUID();
export function bucket(seed:string):number { let h=2166136261; for(let i=0;i<seed.length;i++){h^=seed.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0)%10000; }
export function evaluate(flag:Flag, distinctId:string, attributes:Record<string,Json>={}):Evaluation {
  const result=(value:Json,reason:string,variant?:string):Evaluation=>({key:flag.key,value,reason,variant,version:flag.version});
  if(!flag.enabled)return result(flag.defaultValue,'disabled');
  if(flag.rules.some(r=>{const a=attributes[r.attribute];switch(r.operator){case'eq':return a!==r.value;case'neq':return a===r.value;case'in':return !Array.isArray(r.value)||!r.value.includes(a as never);case'contains':return typeof a!=='string'||!a.includes(String(r.value));}}))return result(flag.defaultValue,'not_targeted');
  const id=distinctId||'anonymous';const b=bucket(`${flag.key}:${id}`);
  if(b>=Math.min(100,Math.max(0,flag.rollout))*100)return result(flag.defaultValue,'outside_rollout');
  if(flag.variants?.length){let n=bucket(`${flag.key}:variant:${id}`);for(const v of flag.variants){n-=v.weight*100;if(n<0)return result(v.key,'variant',v.key)}return result(flag.defaultValue,'unallocated');}
  return result(true,'enabled');
}
