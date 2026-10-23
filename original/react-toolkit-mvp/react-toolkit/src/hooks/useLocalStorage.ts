import { useCallback, useEffect, useState } from "react";
type Serializer<T> = { serialize?: (value: T) => string; deserialize?: (raw: string) => T };
export function useLocalStorage<T>(key: string, initialValue: T, options: Serializer<T> = {}): [T, (value: T | ((prev: T) => T)) => void, () => void] {
 const serialize = options.serialize ?? JSON.stringify; const deserialize = options.deserialize ?? JSON.parse;
 const read = useCallback((): T => { try { const raw = typeof window === "undefined" ? null : window.localStorage.getItem(key); return raw == null ? initialValue : deserialize(raw); } catch { return initialValue; } }, [key, initialValue, deserialize]);
 const [value, setValue] = useState<T>(read);
 useEffect(() => { setValue(read()); }, [read]);
 const set = useCallback((next: T | ((prev: T) => T)) => { setValue(prev => { const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next; try { window.localStorage.setItem(key, serialize(resolved)); } catch { /* storage may be blocked or full */ } return resolved; }); }, [key, serialize]);
 const remove = useCallback(() => { try { window.localStorage.removeItem(key); } catch {} setValue(initialValue); }, [key, initialValue]);
 return [value, set, remove];
}
