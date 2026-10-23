/** Type-level utilities for TypeScript consumers. These exports erase at runtime. */
export type Primitive = string | number | bigint | boolean | symbol | null | undefined;
export type Nil = null | undefined;
export type Awaitable<T> = T | PromiseLike<T>;
export type ValueOf<T> = T[keyof T];
export type KeysOfType<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];
export type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];
export type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>;
export type Mutable<T> = { -readonly [K in keyof T]: T[K] };
export type DeepMutable<T> = T extends (...args: any[]) => any ? T
  : T extends readonly (infer U)[] ? DeepMutable<U>[]
  : T extends object ? { -readonly [K in keyof T]: DeepMutable<T[K]> } : T;
export type DeepReadonly<T> = T extends (...args: any[]) => any ? T
  : T extends readonly (infer U)[] ? readonly DeepReadonly<U>[]
  : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type PickByType<T, V> = Pick<T, KeysOfType<T, V>>;
export type OmitByType<T, V> = Omit<T, KeysOfType<T, V>>;
export type Merge<A, B> = Omit<A, keyof B> & B;
export type Simplify<T> = { [K in keyof T]: T[K] } & {};
export type UnionToIntersection<U> = (U extends unknown ? (arg: U) => void : never) extends (arg: infer I) => void ? I : never;
export type IsNever<T> = [T] extends [never] ? true : false;
export type IsAny<T> = 0 extends (1 & T) ? true : false;
export type IsUnknown<T> = IsAny<T> extends true ? false : unknown extends T ? true : false;
export type NonEmptyArray<T> = readonly [T, ...T[]];
export type MutableNonEmptyArray<T> = [T, ...T[]];
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };
export type Option<T> = { some: true; value: T } | { some: false };
export type Brand<T, Name extends string> = T & { readonly __brand: Name };
export type UUID = Brand<string, "UUID">;
export type EmailAddress = Brand<string, "EmailAddress">;
export type DeepPartial<T> = T extends (...args: any[]) => any ? T
  : T extends readonly (infer U)[] ? DeepPartial<U>[]
  : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;
export type Paths<T, Prefix extends string = ""> = T extends object ? {
  [K in Extract<keyof T, string>]: T[K] extends object
    ? `${Prefix}${K}` | Paths<T[K], `${Prefix}${K}.`>
    : `${Prefix}${K}`
}[Extract<keyof T, string>] : never;
export type PathValue<T, P extends string> = P extends `${infer Head}.${infer Tail}`
  ? Head extends keyof T ? PathValue<T[Head], Tail> : never
  : P extends keyof T ? T[P] : never;
export type FunctionArgs<T> = T extends (...args: infer A) => any ? A : never;
export type FunctionReturn<T> = T extends (...args: any[]) => infer R ? R : never;
export type AsyncReturn<T> = T extends (...args: any[]) => infer R ? Awaited<R> : never;
export type Constructor<T = object, A extends unknown[] = unknown[]> = new (...args: A) => T;
export type Exact<Expected, Actual extends Expected> = Actual & Record<Exclude<keyof Actual, keyof Expected>, never>;
export type XOR<A, B> = (A | B) extends object
  ? (Omit<A, keyof B> & B) | (Omit<B, keyof A> & A) : A | B;
export type NonNullableDeep<T> = T extends null | undefined ? never
  : T extends readonly (infer U)[] ? NonNullableDeep<U>[]
  : T extends object ? { [K in keyof T]: NonNullableDeep<T[K]> } : T;
export type StringKeyOf<T> = Extract<keyof T, string>;
export type NumberKeyOf<T> = Extract<keyof T, number>;
export type OneOf<T extends readonly unknown[]> = T[number];

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });
export const some = <T>(value: T): Option<T> => ({ some: true, value });
export const none = (): Option<never> => ({ some: false });
export const isOk = <T, E>(result: Result<T, E>): result is { ok: true; value: T } => result.ok;
export const isErr = <T, E>(result: Result<T, E>): result is { ok: false; error: E } => !result.ok;
export const isSome = <T>(option: Option<T>): option is { some: true; value: T } => option.some;
