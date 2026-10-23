export type Channel='email'|'sms'|'push'|'in-app'|'webhook';
export interface Template {id:string;version:number;locale:string;body:string}
export interface NotificationIntent{id:string;tenantId:string;recipient:string;channel:Channel;templateId:string;locale:string;variables:Record<string,string>}
export interface DeliveryRecord{id:string;status:'sent'|'suppressed'|'failed';reason?:string}
export interface DeliveryAdapter{send(recipient:string,channel:Channel,body:string):Promise<void>}
export class Communications {private templates=new Map<string,Template>();private suppressed=new Set<string>();private deliveries=new Map<string,DeliveryRecord>();
 constructor(private adapter:DeliveryAdapter){}register(t:Template){this.templates.set(t.id+':'+t.locale,structuredClone(t))}suppress(recipient:string){this.suppressed.add(recipient)}
 async send(intent:NotificationIntent):Promise<DeliveryRecord>{const previous=this.deliveries.get(intent.id);if(previous)return previous;if(this.suppressed.has(intent.recipient)){const out={id:intent.id,status:'suppressed' as const};this.deliveries.set(intent.id,out);return out}const t=this.templates.get(intent.templateId+':'+intent.locale);if(!t)throw new Error('Unknown template');const body=t.body.replace(/\{([\w-]+)\}/g,(_,key:string)=>{if(!(key in intent.variables))throw new Error('Unbound template variable');return intent.variables[key]});try{await this.adapter.send(intent.recipient,intent.channel,body);const out={id:intent.id,status:'sent' as const};this.deliveries.set(intent.id,out);return out}catch(e){const out={id:intent.id,status:'failed' as const,reason:String(e)};this.deliveries.set(intent.id,out);return out}}
}
