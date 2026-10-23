import React,{createContext,useContext,useSyncExternalStore} from 'react';import type{ProductIntelligenceClient}from './index.js';
const Context=createContext<ProductIntelligenceClient|null>(null);
export function ProductIntelligenceProvider({client,children}:{client:ProductIntelligenceClient;children:React.ReactNode}){return <Context.Provider value={client}>{children}</Context.Provider>}
export function useProductIntelligence(){const client=useContext(Context);if(!client)throw Error('Missing ProductIntelligenceProvider');return client}
export function useFeatureFlag(key:string,fallback=false){const client=useProductIntelligence();return useSyncExternalStore(cb=>client.subscribe(cb),()=>client.flags.isEnabled(key,fallback),()=>fallback)}
export function useTrack(){const client=useProductIntelligence();return (event:string,properties:Record<string,any>={})=>client.capture(event,properties)}
