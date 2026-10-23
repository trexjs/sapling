/** Functional-programming helpers: small, composable, mostly pure functions. */
export type Unary<A, B> = (value: A) => B;
export type Predicate<T> = (value: T) => boolean;
export type Curried2<A, B, R> = { (a: A): (b: B) => R; (a: A, b: B): R };

export const identity = <T>(value: T): T => value;
export const constant = <T>(value: T) => (): T => value;
export const prop = <T extends object, K extends keyof T>(key: K) => (value: T): T[K] => value[key];
export const propEq = <T extends object, K extends keyof T>(key: K, expected: T[K]) => (value: T): boolean => value[key] === expected;
export const complement = <A extends unknown[]>(fn: (...args: A) => boolean) => (...args: A): boolean => !fn(...args);
export const negate = <T>(predicate: Predicate<T>): Predicate<T> => value => !predicate(value);
export const allPass = <T>(...predicates: Predicate<T>[]) => (value: T): boolean => predicates.every(fn => fn(value));
export const anyPass = <T>(...predicates: Predicate<T>[]) => (value: T): boolean => predicates.some(fn => fn(value));
export const pipe = <A, B>(a: A, ab: (a: A) => B): B => ab(a);
export function flow<A, B>(ab: (a: A) => B): (a: A) => B;
export function flow<A, B, C>(ab: (a: A) => B, bc: (b: B) => C): (a: A) => C;
export function flow<A, B, C, D>(ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): (a: A) => D;
export function flow(...fns: Array<(value: any) => any>) {
  return (value: any) => fns.reduce((current, fn) => fn(current), value);
}
export function compose<A, B>(ab: (a: A) => B): (a: A) => B;
export function compose<A, B, C>(bc: (b: B) => C, ab: (a: A) => B): (a: A) => C;
export function compose(...fns: Array<(value: any) => any>) {
  return (value: any) => [...fns].reverse().reduce((current, fn) => fn(current), value);
}
export function curry2<A, B, R>(fn: (a: A, b: B) => R): Curried2<A, B, R> {
  function curried(a: A): (b: B) => R;
  function curried(a: A, b: B): R;
  function curried(a: A, b?: B): R | ((b: B) => R) {
    return arguments.length >= 2 ? fn(a, b as B) : (next: B) => fn(a, next);
  }
  return curried;
}
export const partial = <A extends unknown[], R>(fn: (...args: A) => R, ...preset: unknown[]) =>
  (...rest: unknown[]): R => fn(...([...preset, ...rest] as A));
export const partialRight = <A extends unknown[], R>(fn: (...args: A) => R, ...preset: unknown[]) =>
  (...rest: unknown[]): R => fn(...([...rest, ...preset] as A));
export const tap = <T>(effect: (value: T) => unknown) => (value: T): T => { effect(value); return value; };
export const thru = <T, R>(fn: (value: T) => R) => (value: T): R => fn(value);
export const when = <T>(predicate: Predicate<T>, transform: Unary<T, T>) => (value: T): T => predicate(value) ? transform(value) : value;
export const unless = <T>(predicate: Predicate<T>, transform: Unary<T, T>) => (value: T): T => predicate(value) ? value : transform(value);
export const map = <A, B>(fn: Unary<A, B>) => (items: readonly A[]): B[] => items.map(fn);
export const filter = <T>(predicate: Predicate<T>) => (items: readonly T[]): T[] => items.filter(predicate);
export const reject = <T>(predicate: Predicate<T>) => (items: readonly T[]): T[] => items.filter(complement(predicate));
export const reduce = <A, B>(fn: (accumulator: B, value: A, index: number) => B, initial: B) => (items: readonly A[]): B =>
  items.reduce(fn, initial);
export const find = <T>(predicate: Predicate<T>) => (items: readonly T[]): T | undefined => items.find(predicate);
export const sortBy = <T, K extends string | number>(keyOf: (item: T) => K, direction: "asc" | "desc" = "asc") =>
  (items: readonly T[]): T[] => [...items].sort((a, b) => {
    const result = keyOf(a) < keyOf(b) ? -1 : keyOf(a) > keyOf(b) ? 1 : 0;
    return direction === "asc" ? result : -result;
  });
export const fork = <T, A, B>(left: Unary<T, A>, right: Unary<T, B>) => (value: T): [A, B] => [left(value), right(value)];
export const converge = <T, A, B, R>(combine: (a: A, b: B) => R, left: Unary<T, A>, right: Unary<T, B>) =>
  (value: T): R => combine(left(value), right(value));
export const flip = <A, B, R>(fn: (a: A, b: B) => R) => (b: B, a: A): R => fn(a, b);
export const apply = <A extends unknown[], R>(fn: (...args: A) => R) => (args: A): R => fn(...args);
export const applyTo = <T, R>(value: T, fn: Unary<T, R>): R => fn(value);
export const juxt = <T, R extends readonly unknown[]>(...fns: { [K in keyof R]: Unary<T, R[K]> }) =>
  (value: T): R => fns.map(fn => fn(value)) as unknown as R;
export const memoizeUnary = <A, R>(fn: Unary<A, R>): Unary<A, R> => {
  const cache = new Map<A, R>();
  return value => { if (cache.has(value)) return cache.get(value)!; const result = fn(value); cache.set(value, result); return result; };
};
export const asyncMap = <A, B>(fn: (value: A, index: number) => Promise<B>) => async (items: readonly A[]): Promise<B[]> =>
  Promise.all(items.map(fn));
export const asyncPipe = <A, B>(first: (a: A) => A | Promise<A>, ...rest: Array<(value: any) => any>) =>
  async (input: A): Promise<B> => {
    let result: any = await first(input);
    for (const fn of rest) result = await fn(result);
    return result as B;
  };
export const tryCatch = <A, R>(fn: Unary<A, R>, onError: (error: unknown, input: A) => R) =>
  (input: A): R => { try { return fn(input); } catch (error) { return onError(error, input); } };
export const convergeArray = <T, R>(fn: (...values: any[]) => R, ...fns: Array<Unary<T, unknown>>) =>
  (value: T): R => fn(...fns.map(mapper => mapper(value)));
