# React Toolkit — original lightweight implementations

A TypeScript-first React package containing commonly used hooks, a small external-store state manager, and an original query-cache/data-fetching layer. It is inspired by common developer needs, **not a fork or a drop-in compatible clone** of Zustand or TanStack Query. No Zustand or TanStack Query dependency is used.

> **Status:** starter implementation / MVP. Review the limitations in `docs/ROADMAP.md` before production adoption. This package is not yet security-reviewed or fully parity-tested.

## Requirements
- Node.js 18+
- React 18+
- TypeScript 5.6+ recommended

## Install locally
```bash
npm install
npm run build
npm test
```
Publishable package files are emitted to `dist/`. Install in another project using a registry package once you set your npm scope and publish it.

## Hooks

```tsx
import { useDebounce, useToggle, useLocalStorage } from "@your-org/react-toolkit/hooks";

function SearchBox() {
  const [value, setValue] = useState("");
  const debounced = useDebounce(value, 250);
  const [open, , toggleOpen] = useToggle();
  const [theme, setTheme] = useLocalStorage("theme", "light");
  return <section>
    <input value={value} onChange={e => setValue(e.target.value)} />
    <p>Search term: {debounced}</p>
    <button onClick={toggleOpen}>{open ? "Close" : "Open"}</button>
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme}</button>
  </section>;
}
```

Included: `useDebounce`, `useDebouncedCallback`, `usePrevious`, `useToggle`, `useLatest`, `useEventListener`, `useMediaQuery`, `useLocalStorage`, `useSessionStorage`, `useOnClickOutside`, `useCopyToClipboard`, `useOnlineStatus`, `useWindowSize`, `useInterval`, `useTimeout`, `useMounted`, `useIsomorphicLayoutEffect`.

## State management

Create a store outside React and select the data needed by a component:

```tsx
import { createStore, useStore } from "@your-org/react-toolkit/state";

type CounterState = { count: number; increment: () => void };
export const counterStore = createStore<CounterState>({
  count: 0,
  increment: () => counterStore.setState(s => ({ count: s.count + 1 }))
});

function Counter() {
  const count = useStore(counterStore, s => s.count);
  const increment = useStore(counterStore, s => s.increment);
  return <button onClick={increment}>Count: {count}</button>;
}
```

`setState` shallow-merges partial state. `subscribe` returns an unsubscribe function. `getState` reads the current state. Use selectors that return stable values; selectors creating a new object/array on every call may cause unnecessary renders and can conflict with `useSyncExternalStore` snapshot expectations.

## Query client and data fetching

```tsx
import { QueryClient, QueryClientProvider, useQuery } from "@your-org/react-toolkit/query";

const queryClient = new QueryClient({ staleTime: 30_000, retry: 1 });
function Users() {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: async ({ signal }) => {
      const response = await fetch("/api/users", { signal });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      return response.json() as Promise<Array<{id:number;name:string}>>;
    }
  });
  if (query.isPending) return <p>Loading…</p>;
  if (query.isError) return <p>Could not load users.</p>;
  return <ul>{query.data?.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
}
export function App() {
  return <QueryClientProvider client={queryClient}><Users /></QueryClientProvider>;
}
```

### Mutations and invalidation
```tsx
import { useMutation, useQueryClient } from "@your-org/react-toolkit/query";

function CreateTodo() {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await fetch("/api/todos", {
        method: "POST", headers: {"content-type":"application/json"},
        body: JSON.stringify({title})
      });
      if (!response.ok) throw new Error("Could not create todo");
      return response.json() as Promise<{id:number;title:string}>;
    },
    onSuccess: () => client.invalidateQueries(["todos"])
  });
  return <button disabled={mutation.isPending} onClick={() => mutation.mutate("Read docs")}>
    {mutation.isPending ? "Saving…" : "Create todo"}
  </button>;
}
```

## Query API

- `QueryClient`: `getQueryData`, `setQueryData`, `fetchQuery`, `invalidateQueries`, `removeQueries`, `clear`, `getDefaultOptions`
- `QueryClientProvider`: shares a client with hooks.
- `useQuery`: `queryKey`, `queryFn`, `enabled`, `staleTime`, `gcTime`, `retry`, `retryDelay`, `initialData`, `refetchOnWindowFocus`, `refetchInterval`; result includes `data`, `error`, `status`, `isPending`, `isLoading`, `isFetching`, `isSuccess`, `isError`, `isStale`, `refetch`.
- `useMutation`: `mutationFn`, `onMutate`, `onSuccess`, `onError`, `onSettled`; result includes `data`, `error`, `status`, `isPending`, `mutate`, `mutateAsync`, `reset`.
- Query keys are arrays. Object key fields are sorted for stable hashing. Prefix invalidation/removal uses shallow key-prefix matching.

## Examples and guides
- `examples/basic-app/`: small integration sketch
- `docs/API.md`: API reference and behavior
- `docs/ARCHITECTURE.md`: design and internals
- `docs/TESTING.md`: local verification steps
- `docs/ROADMAP.md`: known gaps and next steps

## Important caveats
This is an educational MVP and not a complete TanStack Query replacement. Before production, address the roadmap items, run tests in your target environments, review SSR behavior and browser storage behavior, and add integration/e2e tests. Do not assume compatibility with TanStack Query APIs.
