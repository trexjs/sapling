import type { ParseContext, SafeParseResult, ValidationIssue, ValidationPath } from "./types.js";

export abstract class Schema<T> {
  /** Internal synchronous parser. Subclasses append issues to the shared context. */
  abstract _parse(input: unknown, context: ParseContext): T | Invalid;

  safeParse(input: unknown): SafeParseResult<T> {
    const context: ParseContext = { path: [], issues: [] };
    const data = this._parse(input, context);
    if (data instanceof Invalid || context.issues.length > 0) {
      return { success: false, issues: context.issues };
    }
    return { success: true, data };
  }

  parse(input: unknown): T {
    const result = this.safeParse(input);
    if (!result.success) throw new ValidationError(result.issues);
    return result.data;
  }

  optional(): Schema<T | undefined> { return new OptionalSchema(this); }
  nullable(): Schema<T | null> { return new NullableSchema(this); }
  nullish(): Schema<T | null | undefined> { return this.nullable().optional(); }

  refine(
    predicate: (value: T) => boolean,
    message = "Invalid value",
    code = "custom"
  ): Schema<T> {
    return new RefinedSchema(this, predicate, message, code);
  }

  transform<U>(mapper: (value: T) => U): Schema<U> {
    return new TransformSchema(this, mapper);
  }

  default(value: T): Schema<T> { return new DefaultSchema(this, value); }

  safeParseAsync(input: unknown): Promise<SafeParseResult<T>> {
    // Sync schemas are async-compatible. Async refinements are a planned extension.
    return Promise.resolve(this.safeParse(input));
  }
}

export class Invalid {
  private readonly __invalid = true;
}

export function issue(
  context: ParseContext,
  code: string,
  message: string,
  received?: unknown,
  expected?: string
): Invalid {
  const item: ValidationIssue = {
    code,
    message,
    path: [...context.path],
    ...(received !== undefined ? { received } : {}),
    ...(expected !== undefined ? { expected } : {})
  };
  context.issues.push(item);
  return new Invalid();
}

export class ValidationError extends Error {
  readonly issues: ValidationIssue[];
  constructor(issues: ValidationIssue[]) {
    super(issues.map((i) => `${formatPath(i.path)}: ${i.message}`).join("; "));
    this.name = "ValidationError";
    this.issues = issues;
  }
}

export function formatPath(path: ValidationPath): string {
  if (path.length === 0) return "$";
  return path.reduce<string>((acc, part) =>
    typeof part === "number" ? `${acc}[${part}]` : `${acc}.${part}`, "$");
}

class OptionalSchema<T> extends Schema<T | undefined> {
  constructor(private readonly inner: Schema<T>) { super(); }
  override _parse(input: unknown, context: ParseContext): T | undefined | Invalid {
    if (input === undefined) return undefined;
    return this.inner._parse(input, context);
  }
}

class NullableSchema<T> extends Schema<T | null> {
  constructor(private readonly inner: Schema<T>) { super(); }
  override _parse(input: unknown, context: ParseContext): T | null | Invalid {
    if (input === null) return null;
    return this.inner._parse(input, context);
  }
}

class DefaultSchema<T> extends Schema<T> {
  constructor(private readonly inner: Schema<T>, private readonly fallback: T) { super(); }
  override _parse(input: unknown, context: ParseContext): T | Invalid {
    return this.inner._parse(input === undefined ? this.fallback : input, context);
  }
}

class RefinedSchema<T> extends Schema<T> {
  constructor(
    private readonly inner: Schema<T>,
    private readonly predicate: (value: T) => boolean,
    private readonly message: string,
    private readonly code: string
  ) { super(); }
  override _parse(input: unknown, context: ParseContext): T | Invalid {
    const before = context.issues.length;
    const value = this.inner._parse(input, context);
    if (value instanceof Invalid || context.issues.length > before) return new Invalid();
    try {
      if (!this.predicate(value)) return issue(context, this.code, this.message, input);
    } catch {
      return issue(context, this.code, this.message, input);
    }
    return value;
  }
}

class TransformSchema<T, U> extends Schema<U> {
  constructor(private readonly inner: Schema<T>, private readonly mapper: (value: T) => U) { super(); }
  override _parse(input: unknown, context: ParseContext): U | Invalid {
    const before = context.issues.length;
    const value = this.inner._parse(input, context);
    if (value instanceof Invalid || context.issues.length > before) return new Invalid();
    try { return this.mapper(value); }
    catch { return issue(context, "transform_failed", "Value transformation failed", input); }
  }
}
