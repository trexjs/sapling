export type Platform='android'|'ios';
export type Framework='expo'|'bare';
export class MobileDeliveryClient {
 constructor(private options:{baseUrl:string;apiKey:string}){}
 private async request<T>(path:string,method='GET',body?:unknown):Promise<T>{const response=await fetch(`${this.options.baseUrl.replace(/\/$/,'')}/v1${path}`,{method,headers:{authorization:`Bearer ${this.options.apiKey}`,'content-type':'application/json'},body:body?JSON.stringify(body):undefined});const json=await response.json();if(!response.ok)throw Error(json.error??`HTTP ${response.status}`);return json as T;}
 listProjects(){return this.request<unknown[]>('/projects')}
 createProject(data:{name:string;repoUrl:string;framework:Framework;androidApplicationId?:string;iosBundleId?:string}){return this.request<{id:string}>('/projects','POST',data)}
 createRelease(projectId:string,data:{gitRef:string;platform:Platform;kind:'native'|'ota';channel:string;runtimeVersion?:string}){return this.request<{id:string;status:string}>(`/projects/${projectId}/releases`,'POST',data)}
 getRelease(id:string){return this.request<{id:string;status:string;log:string}>(`/releases/${id}`)}
 setOtaRollout(updateId:string,percent:number,active=true){return this.request(`/ota/${updateId}/rollout`,'POST',{percent,active})}
}
