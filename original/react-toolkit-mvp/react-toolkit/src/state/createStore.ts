export type StoreListener<T> = (state: T, previousState: T) => void;
export interface StoreApi<T> { getState(): T; setState(update: Partial<T> | T | ((state: T) => Partial<T> | T)): void; subscribe(listener: StoreListener<T>): () => void; destroy(): void; }
export function createStore<T extends object>(initialState: T): StoreApi<T> {
 let state = initialState; let listeners = new Set<StoreListener<T>>();
 return {
  getState: () => state,
  setState(update) { const next = typeof update === "function" ? (update as (s:T)=>Partial<T>|T)(state) : update; const resolved = { ...state, ...next } as T; if (Object.is(state, resolved)) return; const previous = state; state = resolved; listeners.forEach(listener => listener(state, previous)); },
  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  destroy() { listeners.clear(); }
 };
}
