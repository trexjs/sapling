import {createHmac,randomBytes,timingSafeEqual,createHash} from 'node:crypto';
export type DataClass='public'|'internal'|'confidential'|'restricted';
export interface Decision {allowed:boolean;reason:string}
export interface PolicyInput {subject:string;tenantId:string;action:string;resourceTenantId:string;roles:readonly string[]}
export function authorize(input:PolicyInput,requiredRole:string):Decision {if(!input.subject||!input.tenantId||input.tenantId!==input.resourceTenantId)return {allowed:false,reason:'tenant-boundary'};return input.roles.includes(requiredRole)?{allowed:true,reason:'role-match'}:{allowed:false,reason:'missing-role'}}
export function sign(data:string,key:Uint8Array){if(key.byteLength<32)throw new Error('Signing key too short');return createHmac('sha256',key).update(data).digest('hex')}
export function verify(data:string,signature:string,key:Uint8Array):boolean {if(!/^[a-f0-9]{64}$/i.test(signature))return false;return timingSafeEqual(Buffer.from(sign(data,key),'hex'),Buffer.from(signature,'hex'))}
export function digest(data:string){return createHash('sha256').update(data).digest('hex')}
export const generateLocalSigningKey=()=>randomBytes(32);
export function mayLog(value:DataClass){return value==='public'||value==='internal'}
