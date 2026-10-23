export interface ApiContract {name:string; version:string; owner:string; schema:Record<string,unknown>; deprecatedAt?:string; sunsetAt?:string}
export interface ApiError {code:string; message:string; correlationId?:string; details?:Record<string,unknown>}
export const apiError=(code:string,message:string,correlationId?:string):ApiError=>({code,message,correlationId});
export interface PageRequest {limit:number;cursor?:string}
export function normalizePage(input:PageRequest,maxLimit=100):PageRequest {if(!Number.isInteger(input.limit)||input.limit<1)throw new Error('Invalid limit');return {limit:Math.min(input.limit,maxLimit),cursor:input.cursor}}
export class ContractRegistry {
 private readonly definitions=new Map<string,ApiContract>();
 publish(contract:ApiContract){if(!contract.name||!contract.owner||!/^\d+\.\d+\.\d+$/.test(contract.version))throw new Error('Invalid contract');const key=contract.name+'@'+contract.version;if(this.definitions.has(key))throw new Error('Immutable version already exists');this.definitions.set(key,structuredClone(contract));}
 get(name:string,version:string):ApiContract|undefined {const value=this.definitions.get(name+'@'+version);return value?structuredClone(value):undefined}
 list(){return [...this.definitions.values()].map(x=>structuredClone(x))}
}
