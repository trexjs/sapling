import { useEffect } from "react";
export function useEventListener<K extends keyof WindowEventMap>(event: K, handler: (event: WindowEventMap[K]) => void, target: Window = window) {
 useEffect(() => { if (!target?.addEventListener) return; const listener = (e: Event) => handler(e as WindowEventMap[K]); target.addEventListener(event, listener); return () => target.removeEventListener(event, listener); }, [event, handler, target]);
}
