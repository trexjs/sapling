import { Invalid, Schema, issue } from "./schema.js";
import type { ParseContext } from "./types.js";

export class StringSchema extends Schema<string> {
  private rules: Array<{ code: string; message: string; test: (value: string) => boolean }> = [];
  min(length: number, message = `Must contain at least ${length} characters`): this {
    this.rules.push({ code: "too_small", message, test: v => v.length >= length }); return this;
  }
  max(length: number, message = `Must contain at most ${length} characters`): this {
    this.rules.push({ code: "too_big", message, test: v => v.length <= length }); return this;
  }
  length(length: number, message = `Must contain exactly ${length} characters`): this {
    this.rules.push({ code: "invalid_length", message, test: v => v.length === length }); return this;
  }
  email(message = "Invalid email address"): this {
    this.rules.push({ code: "invalid_email", message, test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }); return this;
  }
  url(message = "Invalid URL"): this {
    this.rules.push({ code: "invalid_url", message, test: v => {
      try { const parsed = new URL(v); return Boolean(parsed.protocol && parsed.hostname); } catch { return false; }
    }}); return this;
  }
  uuid(message = "Invalid UUID"): this {
    this.rules.push({ code: "invalid_uuid", message, test: v => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v) }); return this;
  }
  regex(pattern: RegExp, message = "Invalid format"): this {
    this.rules.push({ code: "invalid_format", message, test: v => { pattern.lastIndex = 0; return pattern.test(v); } }); return this;
  }
  startsWith(prefix: string, message = `Must start with "${prefix}"`): this {
    this.rules.push({ code: "invalid_prefix", message, test: v => v.startsWith(prefix) }); return this;
  }
  endsWith(suffix: string, message = `Must end with "${suffix}"`): this {
    this.rules.push({ code: "invalid_suffix", message, test: v => v.endsWith(suffix) }); return this;
  }
  trim(): Schema<string> { return this.transform(v => v.trim()); }
  toLowerCase(): Schema<string> { return this.transform(v => v.toLowerCase()); }
  override _parse(input: unknown, context: ParseContext): string | Invalid {
    if (typeof input !== "string") return issue(context, "invalid_type", "Expected a string", input, "string");
    const start = context.issues.length;
    for (const rule of this.rules) if (!rule.test(input)) issue(context, rule.code, rule.message, input);
    return context.issues.length > start ? new Invalid() : input;
  }
}

export class NumberSchema extends Schema<number> {
  private rules: Array<{ code: string; message: string; test: (value: number) => boolean }> = [];
  min(value: number, message = `Must be at least ${value}`): this {
    this.rules.push({ code: "too_small", message, test: n => n >= value }); return this;
  }
  max(value: number, message = `Must be at most ${value}`): this {
    this.rules.push({ code: "too_big", message, test: n => n <= value }); return this;
  }
  int(message = "Must be an integer"): this {
    this.rules.push({ code: "invalid_integer", message, test: Number.isInteger }); return this;
  }
  positive(message = "Must be positive"): this { return this.min(Number.MIN_VALUE, message); }
  nonnegative(message = "Must be non-negative"): this { return this.min(0, message); }
  finite(message = "Must be finite"): this { this.rules.push({ code: "not_finite", message, test: Number.isFinite }); return this; }
  override _parse(input: unknown, context: ParseContext): number | Invalid {
    if (typeof input !== "number" || Number.isNaN(input)) return issue(context, "invalid_type", "Expected a number", input, "number");
    const start = context.issues.length;
    for (const rule of this.rules) if (!rule.test(input)) issue(context, rule.code, rule.message, input);
    return context.issues.length > start ? new Invalid() : input;
  }
  static coerce(): Schema<number> {
    return new CoerceNumberSchema();
  }
}

class CoerceNumberSchema extends Schema<number> {
  override _parse(input: unknown, context: ParseContext): number | Invalid {
    const value = typeof input === "number" ? input : typeof input === "string" && input.trim() !== "" ? Number(input) : NaN;
    if (!Number.isFinite(value)) return issue(context, "invalid_number", "Expected a coercible finite number", input, "number");
    return value;
  }
}

export class BooleanSchema extends Schema<boolean> {
  override _parse(input: unknown, context: ParseContext): boolean | Invalid {
    if (typeof input !== "boolean") return issue(context, "invalid_type", "Expected a boolean", input, "boolean");
    return input;
  }
}

export class DateSchema extends Schema<Date> {
  override _parse(input: unknown, context: ParseContext): Date | Invalid {
    if (!(input instanceof Date) || Number.isNaN(input.getTime())) return issue(context, "invalid_date", "Expected a valid Date", input, "Date");
    return input;
  }
}

export class LiteralSchema<const T extends string | number | boolean | null> extends Schema<T> {
  constructor(private readonly literal: T) { super(); }
  override _parse(input: unknown, context: ParseContext): T | Invalid {
    if (input !== this.literal) return issue(context, "invalid_literal", `Expected ${String(this.literal)}`, input, String(this.literal));
    return this.literal;
  }
}

export class EnumSchema<const T extends readonly [string, ...string[]]> extends Schema<T[number]> {
  constructor(private readonly values: T) { super(); }
  override _parse(input: unknown, context: ParseContext): T[number] | Invalid {
    if (typeof input !== "string" || !(this.values as readonly string[]).includes(input))
      return issue(context, "invalid_enum", `Expected one of: ${this.values.join(", ")}`, input);
    return input as T[number];
  }
}
