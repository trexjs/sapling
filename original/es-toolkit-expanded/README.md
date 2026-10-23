# TypeScript Utility Toolkit

This folder contains framework-agnostic TypeScript utility modules:

- `es-toolkit.ts` — shared/browser-safe utilities
- `server.ts` — Node.js utilities
- `fp.ts` — functional programming
- `types.ts` — type-level utilities and Result/Option
- `iterators.ts` — lazy and async iterables
- `date.ts` — date/time helpers using native `Date` and `Intl`
- `storage.ts` — local/session storage, cookies, and in-memory store with optional namespace
- `hooks.ts` — framework-agnostic observable primitives suitable for framework adapters
- `i18n.ts` — translation, pluralization, locale negotiation, Intl formatting
- `permissions.ts` — RBAC/ABAC policy evaluation

## Notes

This is an original utility implementation, not a complete API-compatible copy of `es-toolkit`, `date-fns`, `datejs`, or `nanoid`.

- `date.ts` intentionally uses native Date and Intl, without timezone database support. For DST-safe timezone calculations, use a timezone-aware library or explicit timezone logic.
- `storage.ts` requires browser APIs for local/session storage and cookies. An optional namespace scopes keys; omit it to use unscoped keys.
- `hooks.ts` does not import React or another UI framework. Wrap these primitives in framework-specific hooks using the relevant peer dependency.
- `permissions.ts` is a shared policy evaluator. Client-side permission checks are for rendering UX only; backend endpoints must enforce authorization independently, using trusted server-side identity and resource data.
- Never store credentials or sensitive secrets in localStorage/sessionStorage. JavaScript-accessible cookies are not equivalent to `HttpOnly` cookies.

No tests are included, per request.
