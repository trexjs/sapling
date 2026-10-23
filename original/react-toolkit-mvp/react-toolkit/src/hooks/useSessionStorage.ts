import { useCallback, useEffect, useState } from "react";
export function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
 const read = useCallback((): T => { try { const raw = typeof window === "undefined" ? null : sessionStorage.getItem(key); return raw === null ? initialValue : JSON.parse(raw) as T; } catch { return initialValue; } }, [key, initialValue]);
 const [value, setValue] = useState<T>(read); useEffect(() => setValue(read()), [read]);
 const set = useCallback((next: T | ((prev: T) => T)) => setValue(prev => { const v = typeof next === "function" ? (next as (p:T)=>T)(prev) : next; try { sessionStorage.setItem(key, JSON.stringify(v)); } catch {} return v; }), [key]);
 const remove = useCallback(() => { try { sessionStorage.removeItem(key); } catch {} setValue(initialValue); }, [key, initialValue]);
 return [value, set, remove];
}
