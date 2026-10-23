import { useCallback, useEffect, useReducer } from "react";
import { useQueryClient } from "./QueryClient.js";
import type { QueryOptions, QueryResult } from "./types.js";
export function useQuery<T>(options: QueryOptions<T>): QueryResult<T> {
 const client=useQueryClient(); const [,forceRender]=useReducer(x=>x+1,0);
 const keyHash=JSON.stringify(options.queryKey); const enabled=options.enabled ?? true;
 const entry=client.getEntry(options.queryKey);
 const data=(entry?.data ?? options.initialData) as T|undefined;
 const status=entry?.status ?? (options.initialData===undefined ? "pending":"success");
 const error=entry?.error; const isFetching=entry?.fetching ?? false;
 const stale= !entry || entry.invalidated || Date.now()-entry.updatedAt >= (options.staleTime ?? client.getDefaultOptions().staleTime ?? 0);
 const fetch=useCallback(async () => { if(!enabled) return client.getQueryData<T>(options.queryKey); try { return await client.fetchQuery(options); } catch { return client.getQueryData<T>(options.queryKey); } }, [client,keyHash,enabled,options.queryFn,options.staleTime,options.retry,options.retryDelay]);
 useEffect(()=>client.subscribe(options.queryKey,forceRender,options.gcTime),[client,keyHash,options.gcTime]);
 useEffect(()=>{ if(enabled && stale) void fetch(); },[enabled,stale,keyHash,fetch]);
 useEffect(()=>{ if(!enabled || !options.refetchOnWindowFocus) return; const onFocus=()=>void client.fetchQuery({...options,force:true}).catch(()=>{}); window.addEventListener("focus",onFocus); return()=>window.removeEventListener("focus",onFocus); },[client,enabled,options.refetchOnWindowFocus,keyHash,fetch]);
 useEffect(()=>{ if(!enabled || !options.refetchInterval) return; const id=setInterval(()=>void client.fetchQuery({...options,force:true}).catch(()=>{}),options.refetchInterval); return()=>clearInterval(id); },[client,enabled,options.refetchInterval,keyHash,fetch]);
 return {data,error,status,isPending:status==="pending"&&data===undefined,isLoading:status==="pending"&&isFetching,isFetching,isSuccess:status==="success",isError:status==="error",isStale:stale,refetch:fetch};
}
