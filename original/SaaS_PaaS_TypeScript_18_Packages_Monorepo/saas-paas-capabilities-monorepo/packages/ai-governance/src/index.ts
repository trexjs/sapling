export interface ModelRequest {tenantId:string;actorId:string;model:string;promptVersion:string;input:string;maxOutputTokens:number}
export interface ModelResult {text:string;inputTokens:number;outputTokens:number;provider:string;model:string}
export interface ModelProvider {id:string;models:readonly string[];generate(request:ModelRequest):Promise<ModelResult>}
export interface Guardrails {allowInput(request:ModelRequest):Promise<boolean>;allowOutput(result:ModelResult):Promise<boolean>}
export class ModelGateway {private providers=new Map<string,ModelProvider>();constructor(private readonly guards:Guardrails,private readonly maxTokens=2048){}
 register(provider:ModelProvider){this.providers.set(provider.id,provider)}
 async generate(request:ModelRequest):Promise<ModelResult>{if(!request.tenantId||!request.actorId||!request.promptVersion||request.maxOutputTokens<1||request.maxOutputTokens>this.maxTokens)throw new Error('Invalid AI request');if(!await this.guards.allowInput(request))throw new Error('Input blocked by policy');const provider=[...this.providers.values()].find(p=>p.models.includes(request.model));if(!provider)throw new Error('No approved model provider');const result=await provider.generate(request);if(!await this.guards.allowOutput(result))throw new Error('Output blocked by policy');return result}
}
// Retrieval permission checks must run before passing protected documents to this gateway.
