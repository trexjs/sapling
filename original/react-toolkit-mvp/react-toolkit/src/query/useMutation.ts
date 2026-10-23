import { useCallback, useState } from "react";
import { useQueryClient } from "./QueryClient.js";
import type { MutationOptions, MutationResult } from "./types.js";
export function useMutation<TData, TVariables=void>(options: MutationOptions<TData,TVariables>): MutationResult<TData,TVariables> {
 const client=useQueryClient(); const [state,setState]=useState<{data:TData|undefined;error:unknown;status:"idle"|"pending"|"success"|"error"}>({data:undefined,error:undefined,status:"idle"});
 const mutateAsync=useCallback(async (variables:TVariables):Promise<TData>=>{
  setState({data:undefined,error:undefined,status:"pending"}); let context:unknown;
  try { context=await options.onMutate?.(variables); const data=await options.mutationFn(variables); await options.onSuccess?.(data,variables,context); setState({data,error:undefined,status:"success"}); await options.onSettled?.(data,undefined,variables,context); return data; }
  catch(error) { setState({data:undefined,error,status:"error"}); await options.onError?.(error,variables,context); await options.onSettled?.(undefined,error,variables,context); throw error; }
 },[options.mutationFn,options.onMutate,options.onSuccess,options.onError,options.onSettled]);
 const mutate=useCallback((variables:TVariables)=>{void mutateAsync(variables).catch(()=>{});},[mutateAsync]);
 const reset=useCallback(()=>setState({data:undefined,error:undefined,status:"idle"}),[]);
 return {...state,isPending:state.status==="pending",mutate,mutateAsync,reset};
}
