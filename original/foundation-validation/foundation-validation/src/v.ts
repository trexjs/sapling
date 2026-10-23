import { ArraySchema, ObjectSchema, RecordSchema, UnionSchema, type Shape } from "./collections.js";
import { BooleanSchema, DateSchema, EnumSchema, LiteralSchema, NumberSchema, StringSchema } from "./primitives.js";
import type { Schema } from "./schema.js";

export const v = {
  string: (): StringSchema => new StringSchema(),
  number: (): NumberSchema => new NumberSchema(),
  boolean: (): BooleanSchema => new BooleanSchema(),
  date: (): DateSchema => new DateSchema(),
  literal: <const T extends string | number | boolean | null>(value: T): LiteralSchema<T> => new LiteralSchema(value),
  enum: <const T extends readonly [string, ...string[]]>(values: T): EnumSchema<T> => new EnumSchema(values),
  array: <S extends Schema<unknown>>(schema: S): ArraySchema<S> => new ArraySchema(schema),
  object: <const S extends Shape>(shape: S): ObjectSchema<S> => new ObjectSchema(shape),
  union: <const S extends readonly [Schema<unknown>, Schema<unknown>, ...Schema<unknown>[]]>(schemas: S): UnionSchema<S> => new UnionSchema(schemas),
  record: <S extends Schema<unknown>>(schema: S): RecordSchema<S> => new RecordSchema(schema),
  coerce: {
    number: () => NumberSchema.coerce()
  }
};
