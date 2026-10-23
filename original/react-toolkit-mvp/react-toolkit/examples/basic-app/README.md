# Basic app integration

Create a React + TypeScript app, install this package locally or via npm, then paste the examples from the root README into `src/App.tsx`.

```tsx
import { QueryClient, QueryClientProvider, useQuery } from "@your-org/react-toolkit/query";
const client = new QueryClient({ staleTime: 15_000, retry: 1 });

function Ping() {
  const result = useQuery({
    queryKey: ["ping"],
    queryFn: async ({ signal }) => {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos/1", { signal });
      if (!response.ok) throw new Error("Network response was not OK");
      return response.json() as Promise<{id:number; title:string; completed:boolean}>;
    }
  });
  if (result.isPending) return <p>Loading…</p>;
  if (result.isError) return <p>Request failed.</p>;
  return <pre>{JSON.stringify(result.data, null, 2)}</pre>;
}
export default function App() {
  return <QueryClientProvider client={client}><Ping /></QueryClientProvider>;
}
```

For real applications, use your own API and validate response payloads at the network boundary.
