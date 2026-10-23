import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { QueryKey } from "./types.js";
type Listener = () => void;
export interface QueryEntry<T = unknown> { key: QueryKey; hash: string; data?: T; error?: unknown; status: "pending"|"success"|"error"; updatedAt: number; invalidated: boolean; fetching: boolean; promise?: Promise<T>; controller?: AbortController; listeners: Set<Listener>; gcTimer?: ReturnType<typeof setTimeout>; }
export function hashQueryKey(key: QueryKey): string { return stableStringify(key); }
function stableStringify(value: unknown): string {
 if (value === undefined) return '"__undefined__"';
 if (value === null || typeof value !== "object") return JSON.stringify(value);
 if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
 const obj = value as Record<string, unknown>;
 return `{${Object.keys(obj).sort().map(k => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`;
}
export class QueryClient {
 private cache = new Map<string, QueryEntry>();
 constructor(private defaults: { staleTime?: number; gcTime?: number; retry?: number | boolean; retryDelay?: number } = {}) {}
 getQueryData<T>(key: QueryKey): T | undefined { return this.cache.get(hashQueryKey(key))?.data as T | undefined; }
 setQueryData<T>(key: QueryKey, updater: T | ((old: T | undefined) => T)): T {
  const hash = hashQueryKey(key); let entry = this.cache.get(hash);
  if (!entry) { entry = this.makeEntry(key, hash); this.cache.set(hash, entry); }
  const next = typeof updater === "function" ? (updater as (old:T|undefined)=>T)(entry.data as T|undefined) : updater;
  entry.data = next; entry.status = "success"; entry.error = undefined; entry.updatedAt = Date.now(); entry.invalidated = false; this.notify(entry); return next;
 }
 getEntry(key: QueryKey) { return this.cache.get(hashQueryKey(key)); }
 ensureEntry(key: QueryKey) { const hash = hashQueryKey(key); let entry = this.cache.get(hash); if (!entry) { entry = this.makeEntry(key, hash); this.cache.set(hash, entry); } return entry; }
 subscribe(key: QueryKey, listener: Listener, gcTime = this.defaults.gcTime ?? 300000) {
  const entry = this.ensureEntry(key); if (entry.gcTimer) clearTimeout(entry.gcTimer); entry.listeners.add(listener);
  return () => { entry.listeners.delete(listener); if (!entry.listeners.size) entry.gcTimer = setTimeout(() => { if (!entry.listeners.size) { entry.controller?.abort(); this.cache.delete(entry.hash); } }, Math.max(0, gcTime)); };
 }
 notify(entry: QueryEntry) { entry.listeners.forEach(fn => fn()); }
 async fetchQuery<T>(options: { queryKey: QueryKey; queryFn: (ctx:{signal:AbortSignal;queryKey:QueryKey})=>Promise<T>; staleTime?:number; retry?:number|boolean; retryDelay?:number|((attempt:number)=>number); force?:boolean }): Promise<T> {
  const entry = this.ensureEntry(options.queryKey);
  const staleTime = options.staleTime ?? this.defaults.staleTime ?? 0;
  if (!options.force && entry.status === "success" && !entry.invalidated && Date.now()-entry.updatedAt < staleTime) return entry.data as T;
  if (entry.promise) return entry.promise as Promise<T>;
  const controller = new AbortController(); entry.controller = controller; entry.fetching = true; entry.error = undefined;
  if (entry.data === undefined) entry.status = "pending"; this.notify(entry);
  const retries = options.retry ?? this.defaults.retry ?? 0; const maxRetries = retries === true ? 3 : retries === false ? 0 : retries;
  const delayOpt = options.retryDelay ?? this.defaults.retryDelay ?? 300;
  const run = async (): Promise<T> => {
   let attempt = 0;
   while (true) {
    try { return await options.queryFn({ signal: controller.signal, queryKey: options.queryKey }); }
    catch (error) {
     if (controller.signal.aborted || attempt >= maxRetries) throw error;
     attempt++; const delay = typeof delayOpt === "function" ? delayOpt(attempt) : delayOpt * 2 ** (attempt - 1);
     await new Promise<void>((resolve, reject) => { const id = setTimeout(resolve, Math.max(0, delay)); controller.signal.addEventListener("abort", () => { clearTimeout(id); reject(error); }, { once: true }); });
    }
   }
  };
  const promise = run().then(data => { entry.data=data; entry.error=undefined; entry.status="success"; entry.updatedAt=Date.now(); entry.invalidated=false; return data; }).catch(error => { if (!controller.signal.aborted) { entry.error=error; entry.status="error"; } throw error; }).finally(() => { entry.fetching=false; entry.promise=undefined; entry.controller=undefined; this.notify(entry); });
  entry.promise = promise; return promise;
 }
 invalidateQueries(prefix: QueryKey = []) {
  for (const entry of this.cache.values()) {
   if (prefix.every((part, i) => stableStringify(part) === stableStringify(entry.key[i]))) { entry.invalidated=true; this.notify(entry); }
  }
 }
 removeQueries(prefix: QueryKey = []) {
  for (const [hash, entry] of this.cache) if (prefix.every((part,i)=>stableStringify(part)===stableStringify(entry.key[i]))) { entry.controller?.abort(); if(entry.gcTimer)clearTimeout(entry.gcTimer); this.cache.delete(hash); }
 }
 clear() { for (const entry of this.cache.values()) { entry.controller?.abort(); if(entry.gcTimer)clearTimeout(entry.gcTimer); } this.cache.clear(); }
 getDefaultOptions() { return { ...this.defaults }; }
 private makeEntry(key: QueryKey, hash: string): QueryEntry { return { key, hash, status:"pending", updatedAt:0, invalidated:true, fetching:false, listeners:new Set() }; }
}
const QueryContext = createContext<QueryClient | null>(null);
export function QueryClientProvider({ client, children }: {client:QueryClient;children:ReactNode}) { return <QueryContext.Provider value={client}>{children}</QueryContext.Provider>; }
export function useQueryClient() { const client=useContext(QueryContext); if(!client) throw new Error("useQueryClient must be used inside QueryClientProvider"); return client; }
