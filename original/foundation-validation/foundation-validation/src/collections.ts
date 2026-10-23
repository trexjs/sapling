import { Invalid, Schema, issue } from "./schema.js";
import type { Infer, ParseContext } from "./types.js";

export type Shape = Record<string, Schema<unknown>>;
export type ObjectOutput<S extends Shape> = { [K in keyof S]: Infer<S[K]> };

export class ArraySchema<S extends Schema<unknown>> extends Schema<Infer<S>[]> {
  private minimum?: number;
  private maximum?: number;
  constructor(private readonly itemSchema: S) { super(); }
  min(length: number): this { this.minimum = length; return this; }
  max(length: number): this { this.maximum = length; return this; }
  override _parse(input: unknown, context: ParseContext): Infer<S>[] | Invalid {
    if (!Array.isArray(input)) return issue(context, "invalid_type", "Expected an array", input, "array");
    const start = context.issues.length;
    if (this.minimum !== undefined && input.length < this.minimum)
      issue(context, "too_small", `Must contain at least ${this.minimum} items`, input.length);
    if (this.maximum !== undefined && input.length > this.maximum)
      issue(context, "too_big", `Must contain at most ${this.maximum} items`, input.length);
    const output: Infer<S>[] = [];
    input.forEach((item, index) => {
      const childContext: ParseContext = { path: [...context.path, index], issues: context.issues };
      const parsed = this.itemSchema._parse(item, childContext);
      if (!(parsed instanceof Invalid)) output[index] = parsed as Infer<S>;
    });
    return context.issues.length > start ? new Invalid() : output;
  }
}

export class ObjectSchema<S extends Shape> extends Schema<ObjectOutput<S>> {
  constructor(private readonly shape: S, private readonly strictMode = false) { super(); }
  strict(): ObjectSchema<S> { return new ObjectSchema(this.shape, true); }
  extend<const A extends Shape>(additional: A): ObjectSchema<S & A> {
    return new ObjectSchema({ ...this.shape, ...additional } as S & A, this.strictMode);
  }
  pick<K extends keyof S>(keys: readonly K[]): ObjectSchema<Pick<S, K>> {
    const next = Object.fromEntries(keys.map(k => [k, this.shape[k]])) as Pick<S, K>;
    return new ObjectSchema(next, this.strictMode);
  }
  override _parse(input: unknown, context: ParseContext): ObjectOutput<S> | Invalid {
    if (typeof input !== "object" || input === null || Array.isArray(input))
      return issue(context, "invalid_type", "Expected an object", input, "object");
    const record = input as Record<string, unknown>;
    const start = context.issues.length;
    if (this.strictMode) {
      for (const key of Object.keys(record)) {
        if (!(key in this.shape)) {
          const child: ParseContext = { path: [...context.path, key], issues: context.issues };
          issue(child, "unrecognized_key", `Unrecognized key "${key}"`, record[key]);
        }
      }
    }
    const output: Record<string, unknown> = {};
    for (const [key, schema] of Object.entries(this.shape)) {
      const child: ParseContext = { path: [...context.path, key], issues: context.issues };
      const parsed = schema._parse(record[key], child);
      if (!(parsed instanceof Invalid) && parsed !== undefined) output[key] = parsed;
      else if (!(parsed instanceof Invalid) && parsed === undefined && key in record) output[key] = undefined;
    }
    return context.issues.length > start ? new Invalid() : output as ObjectOutput<S>;
  }
}

export class UnionSchema<const S extends readonly Schema<unknown>[]> extends Schema<Infer<S[number]>> {
  constructor(private readonly schemas: S) { super(); }
  override _parse(input: unknown, context: ParseContext): Infer<S[number]> | Invalid {
    for (const schema of this.schemas) {
      const trial: ParseContext = { path: context.path, issues: [] };
      const parsed = schema._parse(input, trial);
      if (!(parsed instanceof Invalid) && trial.issues.length === 0) return parsed as Infer<S[number]>;
    }
    return issue(context, "invalid_union", "Value did not match any allowed schema", input);
  }
}

export class RecordSchema<S extends Schema<unknown>> extends Schema<Record<string, Infer<S>>> {
  constructor(private readonly valueSchema: S) { super(); }
  override _parse(input: unknown, context: ParseContext): Record<string, Infer<S>> | Invalid {
    if (typeof input !== "object" || input === null || Array.isArray(input))
      return issue(context, "invalid_type", "Expected a record object", input, "object");
    const start = context.issues.length;
    const output: Record<string, Infer<S>> = {};
    for (const [key, value] of Object.entries(input)) {
      const child: ParseContext = { path: [...context.path, key], issues: context.issues };
      const parsed = this.valueSchema._parse(value, child);
      if (!(parsed instanceof Invalid)) output[key] = parsed as Infer<S>;
    }
    return context.issues.length > start ? new Invalid() : output;
  }
}
