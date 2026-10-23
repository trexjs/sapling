# Roadmap and production gaps

## P0 — before production use
- [ ] Add comprehensive unit tests for every hook, store operation, query lifecycle, and mutation lifecycle.
- [ ] Fix query observer semantics: invalidate should trigger active observers to refetch; stale-time timers should update stale flags correctly.
- [ ] Harden stable key serialization for Dates, Maps/Sets, cyclic objects, BigInt, functions, symbols, and non-JSON values; or document/reject unsupported keys.
- [ ] Correct mutation callback error semantics and ensure `onSettled` is called exactly once in all paths.
- [ ] Add SSR/hydration tests and prevent browser globals from being evaluated in server contexts.
- [ ] Fix selector snapshot stability and provide an equality function or selector memoization guidance.
- [ ] Add a robust cross-tab storage event strategy and functional-update synchronization for local/session storage.
- [ ] Validate `useDebouncedCallback.flush()` argument behavior and make its type/API explicit.
- [ ] Add error handling for rejected background fetches without hiding query failures from callers.
- [ ] Add CI (typecheck, build, tests), linting, formatting, and code coverage gates.

## P1 — useful medium-core features
- [ ] Query defaults by key/prefix and per-query option merging.
- [ ] `refetchOnReconnect`, network mode, and configurable focus behavior.
- [ ] `placeholderData`, `select`, `keepPreviousData`, `initialDataUpdatedAt`.
- [ ] `setQueriesData`, query cache inspection, `getQueryState`.
- [ ] Mutation keys, mutation cache, optimistic update helpers and rollback patterns.
- [ ] `useQueries` for parallel queries and `useInfiniteQuery` for pagination.
- [ ] `useIsFetching` / `useIsMutating`.
- [ ] Persist query cache to session/local storage with versioning and max-age.
- [ ] Query cancellation semantics, invalidation-driven active refetch, and safer GC.
- [ ] Better tests for React Strict Mode and rapid key changes.

## P2 — advanced features
- [ ] Devtools panel.
- [ ] Suspense integration.
- [ ] Broadcast channel / multi-tab cache sync.
- [ ] Offline queue and mutation persistence.
- [ ] Framework adapters and integration examples.
- [ ] Benchmarks and API stability policy.

## Release checklist
- [ ] Pick the real package scope and repository URL.
- [ ] Set versioning and changelog policy.
- [ ] Add README badges only when backed by actual CI.
- [ ] Audit dependency and license policy.
- [ ] Run the full test suite against supported React versions.
- [ ] Publish as `0.x` until API stability and tests are satisfactory.
