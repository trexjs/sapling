export type SearchResult = { title:string; url:string; snippet:string };
export type ExtractResult = { url:string; title:string; content:string };
export type MapResult = { url:string; links:string[] };
export type CrawlResult = { url:string; pages:ExtractResult[]; discovered:number };
export class AtlasClient {
  constructor(private config:{apiKey:string;baseUrl?:string;timeoutMs?:number}){}
  private async request<T>(path:string,body:unknown,signal?:AbortSignal):Promise<T>{
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),this.config.timeoutMs??30000);
    const abort=()=>controller.abort();signal?.addEventListener('abort',abort,{once:true});
    try {const res=await fetch((this.config.baseUrl??'http://localhost:4000')+path,{method:'POST',headers:{'content-type':'application/json','x-api-key':this.config.apiKey},body:JSON.stringify(body),signal:controller.signal});
      const data=await res.json();if(!res.ok)throw new Error(data.error?.message??`HTTP ${res.status}`);return data as T;
    }finally{clearTimeout(timer);signal?.removeEventListener('abort',abort)}
  }
  search(input:{query:string;limit?:number},signal?:AbortSignal){return this.request<{results:SearchResult[]}>('/v1/search',input,signal)}
  extract(input:{urls:string[]},signal?:AbortSignal){return this.request<{results:ExtractResult[]}>('/v1/extract',input,signal)}
  map(input:{url:string;limit?:number},signal?:AbortSignal){return this.request<MapResult>('/v1/map',input,signal)}
  crawl(input:{url:string;limit?:number;depth?:number},signal?:AbortSignal){return this.request<CrawlResult>('/v1/crawl',input,signal)}
}
