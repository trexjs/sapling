/**
 * Browser storage helpers for localStorage, sessionStorage, and cookies.
 * Namespace is optional. Never store secrets in web storage; cookies require server-side
 * HttpOnly configuration for protection from JavaScript access.
 */
export type StorageKind = "local" | "session";
export interface StorageOptions { namespace?: string; prefix?: string; }
export interface CookieOptions {
  path?: string; domain?: string; maxAge?: number; expires?: Date;
  secure?: boolean; sameSite?: "Strict" | "Lax" | "None";
}
export interface KeyValueStorage {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clearNamespace(): void;
  keys(): string[];
  has(key: string): boolean;
}
const getBrowserStorage = (kind: StorageKind): Storage | undefined => {
  if (typeof window === "undefined") return undefined;
  try { return kind === "local" ? window.localStorage : window.sessionStorage; } catch { return undefined; }
};
const makeKey = (key: string, options: StorageOptions): string => {
  const scope = [options.prefix, options.namespace].filter(Boolean).join(":");
  return scope ? `${scope}:${key}` : key;
};
export function createStorage(kind: StorageKind, options: StorageOptions = {}): KeyValueStorage {
  const storage = getBrowserStorage(kind);
  const prefix = [options.prefix, options.namespace].filter(Boolean).join(":");
  const fullKey = (key: string) => makeKey(key, options);
  const inScope = (key: string) => prefix ? key.startsWith(`${prefix}:`) : true;
  return {
    get<T>(key: string): T | undefined {
      const raw = storage?.getItem(fullKey(key));
      if (raw == null) return undefined;
      try { return JSON.parse(raw) as T; } catch { return raw as T; }
    },
    set<T>(key: string, value: T): void {
      if (!storage) throw new Error(`${kind}Storage is not available in this environment`);
      storage.setItem(fullKey(key), JSON.stringify(value));
    },
    remove(key: string): void { storage?.removeItem(fullKey(key)); },
    clearNamespace(): void {
      if (!storage) return;
      for (let i = storage.length - 1; i >= 0; i--) {
        const key = storage.key(i);
        if (key && inScope(key)) storage.removeItem(key);
      }
    },
    keys(): string[] {
      if (!storage) return [];
      const result: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && inScope(key)) result.push(prefix ? key.slice(prefix.length + 1) : key);
      }
      return result;
    },
    has(key: string): boolean { return storage?.getItem(fullKey(key)) != null; }
  };
}
export const localStore = (options: StorageOptions = {}): KeyValueStorage => createStorage("local", options);
export const sessionStore = (options: StorageOptions = {}): KeyValueStorage => createStorage("session", options);
export function createCookieStore(options: CookieOptions & StorageOptions = {}) {
  const fullKey = (key: string) => makeKey(key, options);
  const readAll = (): Record<string, string> => {
    if (typeof document === "undefined") return {};
    return Object.fromEntries(document.cookie.split(";").map(part => {
      const index = part.indexOf("=");
      if (index < 0) return ["", ""];
      const key = part.slice(0, index).trim(), value = part.slice(index + 1).trim();
      try { return [key, decodeURIComponent(value)]; } catch { return [key, value]; }
    }).filter(([key]) => key));
  };
  const serialize = (key: string, value: string, expires?: Date): string => {
    const parts = [`${encodeURIComponent(key)}=${encodeURIComponent(value)}`, `Path=${options.path ?? "/"}`];
    if (options.domain) parts.push(`Domain=${options.domain}`);
    if (options.maxAge !== undefined) parts.push(`Max-Age=${Math.floor(options.maxAge)}`);
    if (expires ?? options.expires) parts.push(`Expires=${(expires ?? options.expires)!.toUTCString()}`);
    if (options.secure) parts.push("Secure");
    if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
    return parts.join("; ");
  };
  return {
    get<T>(key: string): T | undefined {
      const value = readAll()[fullKey(key)];
      if (value === undefined) return undefined;
      try { return JSON.parse(value) as T; } catch { return value as T; }
    },
    set<T>(key: string, value: T): void {
      if (typeof document === "undefined") throw new Error("Cookies are not available in this environment");
      document.cookie = serialize(fullKey(key), JSON.stringify(value));
    },
    remove(key: string): void {
      if (typeof document !== "undefined") document.cookie = serialize(fullKey(key), "", new Date(0));
    },
    keys(): string[] {
      const prefix = [options.prefix, options.namespace].filter(Boolean).join(":");
      return Object.keys(readAll()).filter(key => !prefix || key.startsWith(`${prefix}:`))
        .map(key => prefix ? key.slice(prefix.length + 1) : key);
    },
    clearNamespace(): void { for (const key of this.keys()) this.remove(key); },
    has(key: string): boolean { return readAll()[fullKey(key)] !== undefined; }
  };
}
export function createMemoryStore(options: StorageOptions = {}): KeyValueStorage {
  const values = new Map<string, string>();
  const fullKey = (key: string) => makeKey(key, options);
  const prefix = [options.prefix, options.namespace].filter(Boolean).join(":");
  const inScope = (key: string) => prefix ? key.startsWith(`${prefix}:`) : true;
  return {
    get<T>(key: string): T | undefined {
      const raw = values.get(fullKey(key)); if (raw === undefined) return undefined;
      try { return JSON.parse(raw) as T; } catch { return raw as T; }
    },
    set<T>(key: string, value: T): void { values.set(fullKey(key), JSON.stringify(value)); },
    remove(key: string): void { values.delete(fullKey(key)); },
    clearNamespace(): void { for (const key of values.keys()) if (inScope(key)) values.delete(key); },
    keys(): string[] { return [...values.keys()].filter(inScope).map(key => prefix ? key.slice(prefix.length + 1) : key); },
    has(key: string): boolean { return values.has(fullKey(key)); }
  };
}
