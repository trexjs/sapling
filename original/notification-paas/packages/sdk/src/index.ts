export type Channel = 'email' | 'sms';
export type SendRequest = { channel: Channel; templateKey: string; to: string; variables?: Record<string,string|number|boolean>; idempotencyKey?: string; providerId?: string };
export class NotificationClient {
 constructor(private readonly options: { baseUrl:string; apiKey:string }) {}
 private async request<T>(path:string, body:unknown):Promise<T> {
  const response=await fetch(`${this.options.baseUrl.replace(/\/$/,'')}${path}`,{method:'POST',headers:{'content-type':'application/json','x-api-key':this.options.apiKey},body:JSON.stringify(body)});
  const result=await response.json(); if(!response.ok) throw new Error(result.error ?? `HTTP ${response.status}`);return result as T;
 }
 send(input:SendRequest){return this.request<{id:string;status:string}>('/v1/notifications',input)}
}
