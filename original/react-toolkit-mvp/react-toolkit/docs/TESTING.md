# Build and test guide

## First run
```bash
npm install
npm run typecheck
npm run build
npm test
```

The archive contains the test runner configuration but the initial test suite is intentionally a TODO. Add tests before relying on this package in production.

## Required test matrix
### Hooks
- Fake timers for debounce, timeout, interval.
- Cleanup on unmount and dependency changes.
- Storage unavailable, invalid JSON, key changes.
- SSR import/render checks for window/document access.
- Clipboard permission rejection and unsupported APIs.

### State
- Partial merge and functional updates.
- Listener notification order and unsubscribe.
- `useStore` rerenders only when selected snapshot changes.
- Store teardown.

### Query
- Cache hit within stale time, stale refetch, request deduplication.
- Retry count and delay; aborted retry.
- Error with and without cached data.
- Prefix invalidation and removal.
- Garbage collection and re-subscription.
- Disabled queries and `initialData`.
- Focus refetch and polling cleanup.
- Mutation callbacks and thrown errors.
- Multiple observers using the same key and differing options.

## Manual smoke test
Use the `examples/basic-app` code in a React app and verify:
1. The initial query shows loading.
2. Data is rendered after the request resolves.
3. Re-mounting within `staleTime` uses cached data.
4. Invalidating a key causes a subscribed query to refetch when its stale state changes.
5. Mutation errors are surfaced via mutation state.
