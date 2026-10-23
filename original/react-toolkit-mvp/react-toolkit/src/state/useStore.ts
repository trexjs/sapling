import { useCallback, useSyncExternalStore } from "react";
import type { StoreApi } from "./createStore.js";
export function useStore<T extends object, U>(store: StoreApi<T>, selector: (state: T) => U): U {
 const getSnapshot = useCallback(() => selector(store.getState()), [store, selector]);
 return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
