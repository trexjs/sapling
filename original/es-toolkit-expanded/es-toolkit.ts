/**
 * Original, dependency-free browser/shared utility toolkit.
 * This is a practical starter clone, not a verbatim copy or exhaustive mirror
 * of the upstream es-toolkit project.
 */

export type MaybePromise<T> = T | Promise<T>;

export const identity = <T>(value: T): T => value;
export const noop = (): void => {};
export const constant = <T>(value: T) => (): T => value;

export function isNil(value: unknown): value is null | undefined {
  return value == null;
}
export function isNull(value: unknown): value is null { return value === null; }
export function isUndefined(value: unknown): value is undefined { return value === undefined; }
export function isString(value: unknown): value is string { return typeof value === "string"; }
export function isNumber(value: unknown): value is number { return typeof value === "number" && !Number.isNaN(value); }
export function isFiniteNumber(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value); }
export function isBoolean(value: unknown): value is boolean { return typeof value === "boolean"; }
export function isFunction(value: unknown): value is (...args: any[]) => any { return typeof value === "function"; }
export function isObject(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === "object" && value !== null;
}
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (Object.prototype.toString.call(value) !== "[object Object]") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}
export function isArray<T = unknown>(value: unknown): value is T[] { return Array.isArray(value); }
export function isDate(value: unknown): value is Date { return value instanceof Date && !Number.isNaN(value.getTime()); }
export function isRegExp(value: unknown): value is RegExp { return value instanceof RegExp; }
export function isPromiseLike<T = unknown>(value: unknown): value is PromiseLike<T> {
  return isObject(value) && typeof value.then === "function";
}

export function clamp(value: number, min: number, max: number): number {
  if (min > max) throw new RangeError("min must be <= max");
  return Math.min(max, Math.max(min, value));
}
export const inRange = (value: number, start: number, end: number): boolean =>
  value >= Math.min(start, end) && value < Math.max(start, end);
export const lerp = (start: number, end: number, amount: number): number => start + (end - start) * amount;
export const sum = (values: readonly number[]): number => values.reduce((total, value) => total + value, 0);
export const mean = (values: readonly number[]): number => values.length ? sum(values) / values.length : Number.NaN;
export const median = (values: readonly number[]): number => {
  if (!values.length) return Number.NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle]! : (sorted[middle - 1]! + sorted[middle]!) / 2;
};
export const min = (values: readonly number[]): number => Math.min(...values);
export const max = (values: readonly number[]): number => Math.max(...values);
export const round = (value: number, precision = 0): number => {
  const factor = 10 ** precision;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};
export const randomInt = (minValue: number, maxValue: number): number => {
  const low = Math.ceil(Math.min(minValue, maxValue));
  const high = Math.floor(Math.max(minValue, maxValue));
  return Math.floor(Math.random() * (high - low + 1)) + low;
};

export const chunk = <T>(items: readonly T[], size: number): T[][] => {
  if (!Number.isInteger(size) || size < 1) throw new RangeError("size must be a positive integer");
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
  return result;
};
export const compact = <T>(items: readonly (T | null | undefined | false | 0 | "")[]): T[] =>
  items.filter(Boolean) as T[];
export const unique = <T>(items: readonly T[]): T[] => [...new Set(items)];
export const uniqueBy = <T, K>(items: readonly T[], keyOf: (item: T) => K): T[] => {
  const seen = new Set<K>();
  return items.filter(item => { const key = keyOf(item); if (seen.has(key)) return false; seen.add(key); return true; });
};
export const flatten = <T>(items: readonly (T | readonly T[])[]): T[] =>
  items.flatMap(item => Array.isArray(item) ? item : [item]) as T[];
export const flattenDeep = (items: readonly unknown[]): unknown[] =>
  items.flatMap(item => Array.isArray(item) ? flattenDeep(item) : [item]);
export const difference = <T>(left: readonly T[], right: readonly T[]): T[] => {
  const excluded = new Set(right); return left.filter(item => !excluded.has(item));
};
export const intersection = <T>(left: readonly T[], right: readonly T[]): T[] => {
  const included = new Set(right); return unique(left.filter(item => included.has(item)));
};
export const union = <T>(...arrays: readonly (readonly T[])[]): T[] => unique(arrays.flat());
export const partition = <T>(items: readonly T[], predicate: (item: T, index: number) => boolean): [T[], T[]] => {
  const yes: T[] = [], no: T[] = [];
  items.forEach((item, index) => (predicate(item, index) ? yes : no).push(item));
  return [yes, no];
};
export const groupBy = <T, K extends PropertyKey>(items: readonly T[], keyOf: (item: T) => K): Record<K, T[]> => {
  const result = Object.create(null) as Record<K, T[]>;
  for (const item of items) (result[keyOf(item)] ??= []).push(item);
  return result;
};
export const countBy = <T, K extends PropertyKey>(items: readonly T[], keyOf: (item: T) => K): Record<K, number> => {
  const result = Object.create(null) as Record<K, number>;
  for (const item of items) result[keyOf(item)] = (result[keyOf(item)] ?? 0) + 1;
  return result;
};
export const shuffle = <T>(items: readonly T[], random = Math.random): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
};
export const sample = <T>(items: readonly T[], random = Math.random): T | undefined =>
  items.length ? items[Math.floor(random() * items.length)] : undefined;
export const take = <T>(items: readonly T[], count: number): T[] => items.slice(0, Math.max(0, count));
export const takeRight = <T>(items: readonly T[], count: number): T[] => items.slice(Math.max(0, items.length - count));
export const drop = <T>(items: readonly T[], count: number): T[] => items.slice(Math.max(0, count));
export const compactMap = <T, U>(items: readonly T[], mapper: (item: T, index: number) => U | null | undefined): U[] =>
  items.map(mapper).filter((item): item is U => item != null);
export const zip = <A, B>(left: readonly A[], right: readonly B[]): [A | undefined, B | undefined][] =>
  Array.from({ length: Math.max(left.length, right.length) }, (_, i) => [left[i], right[i]]);
export const zipWith = <A, B, R>(left: readonly A[], right: readonly B[], fn: (a: A | undefined, b: B | undefined, i: number) => R): R[] =>
  Array.from({ length: Math.max(left.length, right.length) }, (_, i) => fn(left[i], right[i], i));
export const range = (start: number, end?: number, step = 1): number[] => {
  const from = end === undefined ? 0 : start;
  const to = end === undefined ? start : end;
  if (!step || !Number.isFinite(step)) throw new RangeError("step must be finite and non-zero");
  const result: number[] = [];
  if (step > 0) for (let n = from; n < to; n += step) result.push(n);
  else for (let n = from; n > to; n += step) result.push(n);
  return result;
};

export const capitalize = (value: string): string => value ? value[0]!.toLocaleUpperCase() + value.slice(1) : value;
export const upperFirst = (value: string): string => value ? value[0]!.toUpperCase() + value.slice(1) : value;
export const lowerFirst = (value: string): string => value ? value[0]!.toLowerCase() + value.slice(1) : value;
export const camelCase = (value: string): string => value
  .replace(/([a-z\d])([A-Z])/g, "$1 $2").toLowerCase().split(/[^a-z\d]+/i)
  .filter(Boolean).map((part, i) => i ? upperFirst(part) : part).join("");
export const kebabCase = (value: string): string => value
  .replace(/([a-z\d])([A-Z])/g, "$1-$2").replace(/[^a-z\d]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
export const snakeCase = (value: string): string => kebabCase(value).replace(/-/g, "_");
export const pascalCase = (value: string): string => camelCase(value).replace(/^./, c => c.toUpperCase());
export const words = (value: string): string[] => value.replace(/([a-z])([A-Z])/g, "$1 $2").match(/[A-Za-z\d]+/g) ?? [];
export const truncate = (value: string, length: number, omission = "…"): string =>
  value.length <= length ? value : value.slice(0, Math.max(0, length - omission.length)) + omission;
export const startsWith = (value: string, search: string, position = 0): boolean => value.startsWith(search, position);
export const endsWith = (value: string, search: string, length?: number): boolean => value.endsWith(search, length);
export const padStart = (value: string, length: number, chars = " "): string => value.padStart(length, chars);
export const padEnd = (value: string, length: number, chars = " "): string => value.padEnd(length, chars);
export const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const toStringSafe = (value: unknown): string => value == null ? "" : String(value);

export function getPath<T = unknown>(object: unknown, path: string | readonly (string | number)[], fallback?: T): unknown | T {
  const parts = Array.isArray(path) ? path : path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
  let current: any = object;
  for (const part of parts) {
    if (current == null || !Object.prototype.hasOwnProperty.call(Object(current), part)) return fallback;
    current = current[part as any];
  }
  return current === undefined ? fallback : current;
}
export function setPath<T extends object>(object: T, path: string | readonly (string | number)[], value: unknown): T {
  const parts = Array.isArray(path) ? [...path] : path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
  if (!parts.length) return object;
  let current: any = object;
  for (const part of parts.slice(0, -1)) {
    const next = current[part as any];
    if (!isObject(next) && !Array.isArray(next)) current[part as any] = {};
    current = current[part as any];
  }
  current[parts[parts.length - 1] as any] = value;
  return object;
}
export const pick = <T extends object, K extends keyof T>(object: T, keys: readonly K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  for (const key of keys) if (key in object) result[key] = object[key];
  return result;
};
export const omit = <T extends object, K extends keyof T>(object: T, keys: readonly K[]): Omit<T, K> => {
  const result = { ...object } as any; for (const key of keys) delete result[key]; return result;
};
export function deepClone<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  if (Array.isArray(value)) return value.map(deepClone) as T;
  if (value instanceof Date) return new Date(value.getTime()) as T;
  if (value instanceof Map) return new Map([...value].map(([k, v]) => [deepClone(k), deepClone(v)])) as T;
  if (value instanceof Set) return new Set([...value].map(deepClone)) as T;
  if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deepClone(v)])) as T;
  return value;
}
export function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
  if (isPlainObject(a) && isPlainObject(b)) {
    const ak = Object.keys(a), bk = Object.keys(b);
    return ak.length === bk.length && ak.every(k => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]));
  }
  return false;
}

export const debounce = <A extends unknown[]>(fn: (...args: A) => void, waitMs: number) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const wrapped = (...args: A) => { if (timer) clearTimeout(timer); timer = setTimeout(() => fn(...args), waitMs); };
  wrapped.cancel = () => { if (timer) clearTimeout(timer); timer = undefined; };
  wrapped.flush = () => { if (timer) { clearTimeout(timer); timer = undefined; fn(...([] as unknown as A)); } };
  return wrapped;
};
export const throttle = <A extends unknown[]>(fn: (...args: A) => void, waitMs: number) => {
  let last = 0;
  return (...args: A) => { const now = Date.now(); if (now - last >= waitMs) { last = now; fn(...args); } };
};
export const once = <A extends unknown[], R>(fn: (...args: A) => R): ((...args: A) => R) => {
  let called = false, result: R;
  return (...args) => { if (!called) { result = fn(...args); called = true; } return result!; };
};
export const memoize = <A extends unknown[], R>(fn: (...args: A) => R, keyOf: (...args: A) => unknown = (...args) => args[0]) => {
  const cache = new Map<unknown, R>();
  const wrapped = (...args: A): R => { const key = keyOf(...args); if (cache.has(key)) return cache.get(key)!; const result = fn(...args); cache.set(key, result); return result; };
  wrapped.clear = () => cache.clear();
  return wrapped;
};
export const sleep = (ms: number, signal?: AbortSignal): Promise<void> => new Promise((resolve, reject) => {
  if (signal?.aborted) return reject(signal.reason ?? new Error("Aborted"));
  const timer = setTimeout(resolve, ms);
  signal?.addEventListener("abort", () => { clearTimeout(timer); reject(signal.reason ?? new Error("Aborted")); }, { once: true });
});
export const retry = async <T>(fn: (attempt: number) => Promise<T>, attempts = 3, delayMs = 0): Promise<T> => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try { return await fn(attempt); } catch (error) { lastError = error; if (attempt < attempts && delayMs) await sleep(delayMs); }
  }
  throw lastError;
};
export const assert = (condition: unknown, message = "Assertion failed"): asserts condition => {
  if (!condition) throw new Error(message);
};
export const invariant = (condition: unknown, message = "Invariant violated"): asserts condition => {
  if (!condition) throw new Error(message);
};
export const tryCatch = <T>(fn: () => T): { data: T; error: null } | { data: null; error: unknown } => {
  try { return { data: fn(), error: null }; } catch (error) { return { data: null, error }; }
};
