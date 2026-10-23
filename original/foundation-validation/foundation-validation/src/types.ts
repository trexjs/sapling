export type PathSegment = string | number;
export type ValidationPath = readonly PathSegment[];

export interface ValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly path: ValidationPath;
  readonly received?: unknown;
  readonly expected?: string;
}

export type SafeParseResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly issues: ValidationIssue[] };

export interface ParseContext {
  readonly path: ValidationPath;
  readonly issues: ValidationIssue[];
}

export type Infer<S> = S extends import("./schema.js").Schema<infer T> ? T : never;
