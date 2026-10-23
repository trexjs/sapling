import { useCallback, useEffect, useRef } from "react";
export function useDebouncedCallback<T extends (...args: any[]) => void>(callback: T, delay = 300) {
  const callbackRef = useRef(callback);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastArgs = useRef<Parameters<T> | undefined>(undefined);
  useEffect(() => { callbackRef.current = callback; }, [callback]);
  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = undefined;
    lastArgs.current = undefined;
  }, []);
  const debounced = useCallback((...args: Parameters<T>) => {
    cancel();
    lastArgs.current = args;
    timer.current = setTimeout(() => {
      timer.current = undefined;
      const currentArgs = lastArgs.current;
      lastArgs.current = undefined;
      if (currentArgs) callbackRef.current(...currentArgs);
    }, Math.max(0, delay));
  }, [cancel, delay]);
  const flush = useCallback(() => {
    if (!timer.current) return;
    clearTimeout(timer.current);
    timer.current = undefined;
    const currentArgs = lastArgs.current;
    lastArgs.current = undefined;
    if (currentArgs) callbackRef.current(...currentArgs);
  }, []);
  useEffect(() => cancel, [cancel]);
  return Object.assign(debounced, { cancel, flush });
}
