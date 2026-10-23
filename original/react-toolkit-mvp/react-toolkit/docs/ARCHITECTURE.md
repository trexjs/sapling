# Architecture

## Goals
- Small and understandable public API.
- React 18 external-store subscription via `useSyncExternalStore`.
- Query cache independent of React components, so it can be inspected or populated directly.
- No dependency on Zustand, TanStack Query, or another state/query library.
- Separate package exports so consumers import only the module they need.

## Query lifecycle
1. `useQuery` subscribes to a cache entry identified by a stable serialized key.
2. If enabled and stale, it calls `QueryClient.fetchQuery`.
3. The client deduplicates an in-flight request, creates an `AbortController`, optionally retries, then updates the cache.
4. Subscribers are notified and React re-renders.
5. When the final subscriber leaves, a GC timer eventually removes the cache entry.

## State lifecycle
`createStore` owns a state object and a listener set. `setState` shallow-merges partial updates and synchronously notifies subscribers. `useStore` uses `useSyncExternalStore`.

## Design decisions
- Query keys are arrays; object properties are sorted for stable hashing.
- Invalidation is prefix-based.
- Retry delay supports a fixed value or exponential backoff base.
- Query and mutation APIs are deliberately a subset, not a compatibility layer.

## Non-goals for MVP
Persistence of query cache, infinite queries, suspense, devtools, cross-tab synchronization, automatic garbage collection tuning, and complete TanStack Query semantics.
