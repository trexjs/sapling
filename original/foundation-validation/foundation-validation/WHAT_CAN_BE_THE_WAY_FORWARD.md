# What can be the way forward?

## Purpose

This document captures the missing capabilities and recommended implementation sequence for `@foundation/validation`. The current code is a working foundation, not a claim of production completeness.

## P0 — Required before treating the core as dependable

1. **Parser correctness and edge cases**
   - Define missing vs `undefined` vs `null` consistently.
   - Ensure nested objects, arrays, unions, transforms, and defaults never return partially valid output.
   - Decide whether unknown object keys are stripped, preserved, or rejected; document each mode.
   - Add protections against prototype-sensitive keys and unusual object inputs where relevant.
2. **Complete type inference**
   - Improve optional-property inference so optional fields become optional TypeScript properties rather than required properties typed with `undefined`.
   - Add compile-time tests for every public schema combinator.
3. **Test coverage**
   - Add tests for empty strings, NaN, infinities, invalid dates, nested failures, union branch errors, optional/default interactions, regex state, and transforms that throw.
   - Add property-based/fuzz testing for parser invariants.
4. **Stable error contract**
   - Standardize issue codes, paths, expected/received metadata, and error formatting.
   - Avoid leaking secrets or entire request payloads through `received` in logs/API responses.
5. **Release hygiene**
   - Verify build output and ESM exports in a clean install.
   - Add CI for build, typecheck, tests, supported Node versions, and package contents.
   - Add semantic versioning and a changelog.

## P1 — Core usability and API readiness

1. **More primitives**
   - `bigint`, `unknown`, `any`, `never`, `void`, `date` coercion, tuples, records with key validation.
2. **Object operations**
   - `omit`, `partial`, `required`, `merge`, `passthrough`, `strip`, nested path helpers.
3. **Composition**
   - Discriminated unions, intersections, tuples, lazy schemas for recursive data, reusable schema composition.
4. **Validation controls**
   - First-error vs collect-all modes.
   - Custom error maps and per-parse messages.
   - `superRefine` for multiple issues and cross-field validation.
5. **Data handling**
   - Explicit coercion APIs for string/number/boolean/date.
   - Separate parsing/transformation from validation; document input and output types.
6. **API integration**
   - Framework-neutral request parsing helpers.
   - Examples for Express and Fastify with typed request payloads.
   - Standard response mapping (for example, HTTP 400 with safe issue details).
7. **Documentation**
   - API reference, migration/versioning policy, cookbook, security guidance, and runnable examples.

## P2 — Advanced and ecosystem capabilities

1. **Async validation**
   - Async refinements, cancellation via `AbortSignal`, timeouts, and optional debouncing at UI adapter level.
   - Never make network calls implicitly from a schema.
2. **React adapter**
   - `useField`, `useForm`, touched/dirty/submitting state, submit validation, dependency-based revalidation, accessible error summaries.
3. **Interoperability**
   - JSON Schema export/import where semantics map safely.
   - OpenAPI integration and API contract generation.
   - Adapters for other schema libraries only if there is clear demand.
4. **Localization**
   - Message catalogs, locale-aware formatting, stable issue codes separate from display messages.
5. **Performance and observability**
   - Benchmarks, large payload tests, optional instrumentation hooks without sensitive values.
6. **Governance**
   - Extension/plugin contracts, deprecation policy, compatibility matrix, security reporting process.

## Recommended sequence

1. Close P0 parser and typing gaps.
2. Expand tests and establish CI.
3. Complete P1 object operations, composition, and error customization.
4. Ship documented Node.js API examples and integration adapters.
5. Add P2 async validation and React adapter as separate packages.
6. Add JSON Schema/OpenAPI support after input/output semantics are stable.

## Non-goals / safeguards

- Validation does not replace authentication, authorization, rate limiting, business invariants, or database constraints.
- Do not log or return sensitive input values by default.
- Remote checks should be explicit and bounded; avoid turning every keystroke into a network request.
- Keep the core dependency-light and framework-agnostic.
