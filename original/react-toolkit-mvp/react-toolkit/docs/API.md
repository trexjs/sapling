# API reference

## Hooks
| Hook | Purpose | Key behavior |
|---|---|---|
| `useDebounce(value, delay=300)` | Debounce a changing value | Cancels prior timer on change/unmount |
| `useDebouncedCallback(fn, delay=300)` | Debounced callback | Returned function has `cancel()` and `flush()` |
| `usePrevious(value)` | Previous render's value | Initially `undefined` |
| `useToggle(initial=false)` | Boolean state | Returns `[value, set(next?), toggle()]` |
| `useLatest(value)` | Latest value ref | Ref updated during render |
| `useEventListener(event, handler, target=window)` | Window event listener | Cleans up on dependency change/unmount |
| `useMediaQuery(query, serverValue=false)` | Media query match | Watches query changes |
| `useLocalStorage(key, initial, options?)` | Persistent state | JSON serialization by default; storage failures are swallowed |
| `useSessionStorage(key, initial)` | Tab-session state | JSON serialization by default |
| `useOnClickOutside(ref, handler)` | Outside pointer detection | Uses `pointerdown` |
| `useCopyToClipboard()` | Copy text | Returns `[copiedText, asyncCopy]`; clipboard API may be unavailable |
| `useOnlineStatus()` | Network online flag | Browser online/offline events |
| `useWindowSize()` | Viewport dimensions | Window resize listener |
| `useInterval(callback, delay|null)` | Managed interval | `null` pauses interval |
| `useTimeout(callback, delay|null)` | Managed timeout | `null` disables timeout |
| `useMounted()` | Client mounted flag | False during SSR/first render |
| `useIsomorphicLayoutEffect` | SSR-safe effect selection | Layout effect in browser, effect on server |

## State
`createStore<T extends object>(initialState): StoreApi<T>`
- `getState(): T`
- `setState(update: Partial<T> | T | ((state:T) => Partial<T> | T)): void` — shallow merge
- `subscribe(listener): () => void`
- `destroy(): void` — removes listeners

`useStore(store, selector)` subscribes to the store and returns the selected value. Selectors should return primitives or stable references.

## Query client
`new QueryClient(defaults?)`: defaults include `staleTime`, `gcTime`, `retry`, `retryDelay`.

- `getQueryData(key)`: cached data or undefined
- `setQueryData(key, valueOrUpdater)`: sets cache and notifies observers
- `fetchQuery(options)`: fetches, deduplicates in-flight requests, caches result and retries
- `invalidateQueries(prefix=[])`: marks matching entries stale
- `removeQueries(prefix=[])`: aborts and removes matching entries
- `clear()`: aborts and clears all entries

`useQuery` returns status flags and `refetch`. A background refetch retains existing data. Errors are retained in the cache; `refetch()` resolves cached data after errors rather than throwing, so inspect `isError` for state. This behavior is intentionally simpler than mature query libraries.

`useMutation` returns `mutate` (fire-and-forget; errors are handled in result state) and `mutateAsync` (rejects on failure). Callback errors are currently handled through the same mutation error path.
