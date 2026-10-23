/** Lazy iterable utilities; generators avoid allocating intermediate arrays. */
export type IterableMapper<T, U> = (value: T, index: number) => U;
export function* mapIter<T, U>(iterable: Iterable<T>, mapper: IterableMapper<T, U>): Generator<U> {
  let index = 0; for (const value of iterable) yield mapper(value, index++);
}
export function* filterIter<T>(iterable: Iterable<T>, predicate: (value: T, index: number) => boolean): Generator<T> {
  let index = 0; for (const value of iterable) if (predicate(value, index++)) yield value;
}
export function* flatMapIter<T, U>(iterable: Iterable<T>, mapper: (value: T, index: number) => Iterable<U>): Generator<U> {
  let index = 0; for (const value of iterable) yield* mapper(value, index++);
}
export function* takeIter<T>(iterable: Iterable<T>, count: number): Generator<T> {
  if (count <= 0) return;
  let taken = 0; for (const value of iterable) { yield value; if (++taken >= count) return; }
}
export function* dropIter<T>(iterable: Iterable<T>, count: number): Generator<T> {
  let index = 0; for (const value of iterable) if (index++ >= count) yield value;
}
export function* enumerate<T>(iterable: Iterable<T>, start = 0): Generator<[number, T]> {
  let index = start; for (const value of iterable) yield [index++, value];
}
export function* zipIter<A, B>(left: Iterable<A>, right: Iterable<B>): Generator<[A, B]> {
  const a = left[Symbol.iterator](), b = right[Symbol.iterator]();
  while (true) { const av = a.next(), bv = b.next(); if (av.done || bv.done) return; yield [av.value, bv.value]; }
}
export function* zipLongest<A, B>(left: Iterable<A>, right: Iterable<B>, fillA?: A, fillB?: B): Generator<[A | undefined, B | undefined]> {
  const a = left[Symbol.iterator](), b = right[Symbol.iterator]();
  let ad = false, bd = false;
  while (!ad || !bd) {
    const av = ad ? { done: true as const, value: undefined } : a.next();
    const bv = bd ? { done: true as const, value: undefined } : b.next();
    ad = Boolean(av.done); bd = Boolean(bv.done);
    if (ad && bd) return;
    yield [av.done ? fillA : av.value, bv.done ? fillB : bv.value];
  }
}
export function* chunkIter<T>(iterable: Iterable<T>, size: number): Generator<T[]> {
  if (!Number.isInteger(size) || size < 1) throw new RangeError("size must be a positive integer");
  let batch: T[] = [];
  for (const value of iterable) { batch.push(value); if (batch.length === size) { yield batch; batch = []; } }
  if (batch.length) yield batch;
}
export function* uniqueIter<T>(iterable: Iterable<T>): Generator<T> {
  const seen = new Set<T>(); for (const value of iterable) if (!seen.has(value)) { seen.add(value); yield value; }
}
export function* takeWhile<T>(iterable: Iterable<T>, predicate: (value: T, index: number) => boolean): Generator<T> {
  let index = 0; for (const value of iterable) { if (!predicate(value, index++)) return; yield value; }
}
export function* skipWhile<T>(iterable: Iterable<T>, predicate: (value: T, index: number) => boolean): Generator<T> {
  let skipping = true, index = 0;
  for (const value of iterable) { if (skipping && predicate(value, index++)) continue; skipping = false; yield value; }
}
export function* concatIter<T>(...iterables: Iterable<T>[]): Generator<T> {
  for (const iterable of iterables) yield* iterable;
}
export function* repeat<T>(value: T, count: number): Generator<T> {
  for (let i = 0; i < count; i++) yield value;
}
export function* cycle<T>(iterable: Iterable<T>): Generator<T> {
  const cache = [...iterable];
  if (!cache.length) return;
  while (true) yield* cache;
}
export function* rangeIter(start: number, end?: number, step = 1): Generator<number> {
  const from = end === undefined ? 0 : start, to = end === undefined ? start : end;
  if (!step || !Number.isFinite(step)) throw new RangeError("step must be finite and non-zero");
  if (step > 0) for (let n = from; n < to; n += step) yield n;
  else for (let n = from; n > to; n += step) yield n;
}
export const toArray = <T>(iterable: Iterable<T>): T[] => Array.from(iterable);
export const first = <T>(iterable: Iterable<T>): T | undefined => iterable[Symbol.iterator]().next().value;
export function last<T>(iterable: Iterable<T>): T | undefined { let result: T | undefined; for (const value of iterable) result = value; return result; }
export function count<T>(iterable: Iterable<T>, predicate: (value: T, index: number) => boolean = () => true): number {
  let total = 0, index = 0; for (const value of iterable) if (predicate(value, index++)) total++; return total;
}
export function reduceIter<T, A>(iterable: Iterable<T>, reducer: (acc: A, value: T, index: number) => A, initial: A): A {
  let acc = initial, index = 0; for (const value of iterable) acc = reducer(acc, value, index++); return acc;
}
export function everyIter<T>(iterable: Iterable<T>, predicate: (value: T, index: number) => boolean): boolean {
  let index = 0; for (const value of iterable) if (!predicate(value, index++)) return false; return true;
}
export function someIter<T>(iterable: Iterable<T>, predicate: (value: T, index: number) => boolean): boolean {
  let index = 0; for (const value of iterable) if (predicate(value, index++)) return true; return false;
}
export function findIter<T>(iterable: Iterable<T>, predicate: (value: T, index: number) => boolean): T | undefined {
  let index = 0; for (const value of iterable) if (predicate(value, index++)) return value; return undefined;
}
export function* entries<T>(iterable: Iterable<T>): Generator<[number, T]> { yield* enumerate(iterable); }
export async function* mapAsyncIter<T, U>(iterable: AsyncIterable<T>, mapper: (value: T, index: number) => U | Promise<U>): AsyncGenerator<U> {
  let index = 0; for await (const value of iterable) yield await mapper(value, index++);
}
export async function* filterAsyncIter<T>(iterable: AsyncIterable<T>, predicate: (value: T, index: number) => boolean | Promise<boolean>): AsyncGenerator<T> {
  let index = 0; for await (const value of iterable) if (await predicate(value, index++)) yield value;
}
export async function* takeAsyncIter<T>(iterable: AsyncIterable<T>, count: number): AsyncGenerator<T> {
  if (count <= 0) return;
  let taken = 0; for await (const value of iterable) { yield value; if (++taken >= count) return; }
}
export async function asyncToArray<T>(iterable: AsyncIterable<T>): Promise<T[]> {
  const result: T[] = []; for await (const value of iterable) result.push(value); return result;
}
