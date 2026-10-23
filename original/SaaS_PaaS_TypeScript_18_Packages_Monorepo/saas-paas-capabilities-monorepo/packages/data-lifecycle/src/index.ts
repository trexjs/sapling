export interface DataAsset {id:string;owner:string;classification:'public'|'internal'|'confidential'|'restricted';retentionDays:number;legalHold:boolean;createdAt:number;deletedAt?:number}
export interface Migration {id:string;phase:'expand'|'migrate'|'contract';apply:()=>Promise<void>}
export class DataLifecycle {
 private assets=new Map<string,DataAsset>();private applied=new Set<string>();
 register(asset:DataAsset){if(asset.retentionDays<0||!asset.owner)throw new Error('Invalid asset');this.assets.set(asset.id,{...asset})}
 eligibleForDeletion(id:string,now=Date.now()){const a=this.assets.get(id);return !!a&&!a.legalHold&&now-a.createdAt>=a.retentionDays*86400000}
 softDelete(id:string,now=Date.now()){const a=this.assets.get(id);if(!a||a.legalHold)throw new Error('Unknown asset or legal hold');a.deletedAt=now}
 async migrate(migrations:readonly Migration[]){for(const m of migrations){if(this.applied.has(m.id))continue;await m.apply();this.applied.add(m.id)}}
 list(){return [...this.assets.values()].map(a=>({...a}))}
}
