/**
 * Framework-agnostic UI hooks utilities.
 * React hooks are not implemented here because calling React hooks requires React as a peer dependency.
 * These primitives can be consumed by React/Vue/Svelte adapters or wrapped as framework-specific hooks.
 */
export type Unsubscribe = () => void;
export interface ExternalStore<T> {
  getSnapshot(): T;
  subscribe(listener: () => void): Unsubscribe;
}
export function createExternalStore<T>(initialValue: T): ExternalStore<T> & { set(value: T | ((previous: T) => T)): void } {
  let value = initialValue;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => value,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    set(next) {
      const updated = typeof next === "function" ? (next as (previous: T) => T)(value) : next;
      if (Object.is(updated, value)) return;
      value = updated;
      for (const listener of [...listeners]) listener();
    }
  };
}
export function createEventEmitter<Events extends Record<string, unknown[]>>() {
  const listeners = new Map<keyof Events, Set<(...args: any[]) => void>>();
  return {
    on<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): Unsubscribe {
      let bucket = listeners.get(event); if (!bucket) listeners.set(event, bucket = new Set());
      bucket.add(listener); return () => bucket!.delete(listener);
    },
    once<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): Unsubscribe {
      let off: Unsubscribe = () => {};
      off = this.on(event, (...args: Events[K]) => { off(); listener(...args); });
      return off;
    },
    emit<K extends keyof Events>(event: K, ...args: Events[K]): void {
      for (const listener of [...(listeners.get(event) ?? [])]) listener(...args);
    },
    clear(event?: keyof Events): void { if (event === undefined) listeners.clear(); else listeners.delete(event); }
  };
}
export function createDebouncedValue<T>(initialValue: T, delayMs: number) {
  let value = initialValue, timer: ReturnType<typeof setTimeout> | undefined;
  const listeners = new Set<(value: T) => void>();
  return {
    get: () => value,
    set(next: T) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { value = next; for (const listener of listeners) listener(value); }, delayMs);
    },
    subscribe(listener: (value: T) => void): Unsubscribe { listeners.add(listener); return () => listeners.delete(listener); },
    flush(next?: T) {
      if (timer) clearTimeout(timer); timer = undefined;
      if (arguments.length) value = next as T;
      for (const listener of listeners) listener(value);
    },
    dispose() { if (timer) clearTimeout(timer); listeners.clear(); }
  };
}
export function createAsyncState<T, A extends unknown[]>(operation: (...args: A) => Promise<T>) {
  let generation = 0;
  return async (...args: A): Promise<{ status: "success"; data: T } | { status: "error"; error: unknown } | { status: "stale" }> => {
    const current = ++generation;
    try { const data = await operation(...args); return current === generation ? { status: "success", data } : { status: "stale" }; }
    catch (error) { return current === generation ? { status: "error", error } : { status: "stale" }; }
  };
}
export function createAbortableTask<T, A extends unknown[]>(operation: (signal: AbortSignal, ...args: A) => Promise<T>) {
  let controller: AbortController | undefined;
  return {
    run(...args: A): Promise<T> { controller?.abort(); controller = new AbortController(); return operation(controller.signal, ...args); },
    abort(reason?: unknown) { controller?.abort(reason); controller = undefined; },
    dispose() { controller?.abort(); controller = undefined; }
  };
}
export function createPreviousValue<T>() {
  let current: T | undefined, previous: T | undefined, initialized = false;
  return {
    update(value: T): T | undefined { previous = current; current = value; initialized = true; return previous; },
    get current() { return current; },
    get previous() { return previous; },
    get initialized() { return initialized; }
  };
}
export function createToggle(initial = false) {
  let value = initial;
  return { get: () => value, set: (next: boolean) => value = next, toggle: () => value = !value };
}
export function createCounter(initial = 0) {
  let value = initial;
  return { get: () => value, set: (next: number) => value = next, increment: (step = 1) => value += step, decrement: (step = 1) => value -= step, reset: () => value = initial };
}
export function createMediaQuery(query: string) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return { get matches() { return false; }, subscribe: (_listener: (matches: boolean) => void): Unsubscribe => () => {} };
  }
  const media = window.matchMedia(query);
  return {
    get matches() { return media.matches; },
    subscribe(listener: (matches: boolean) => void): Unsubscribe {
      const handler = (event: MediaQueryListEvent) => listener(event.matches);
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  };
}
export function onDocumentVisible(listener: (visible: boolean) => void): Unsubscribe {
  if (typeof document === "undefined") return () => {};
  const handler = () => listener(document.visibilityState === "visible");
  document.addEventListener("visibilitychange", handler);
  return () => document.removeEventListener("visibilitychange", handler);
}
export function onOnlineStatus(listener: (online: boolean) => void): Unsubscribe {
  if (typeof window === "undefined") return () => {};
  const online = () => listener(true), offline = () => listener(false);
  window.addEventListener("online", online); window.addEventListener("offline", offline);
  return () => { window.removeEventListener("online", online); window.removeEventListener("offline", offline); };
}
export function createInterval(callback: () => void, delayMs: number, options: { immediate?: boolean } = {}) {
  let timer: ReturnType<typeof setInterval> | undefined;
  return {
    start() { if (timer) return; if (options.immediate) callback(); timer = setInterval(callback, delayMs); },
    stop() { if (timer) clearInterval(timer); timer = undefined; },
    dispose() { if (timer) clearInterval(timer); timer = undefined; }
  };
}
