import { describe, expect, it, vi } from "vitest";
import { createStore } from "../src/state/createStore";
import { QueryClient } from "../src/query/QueryClient";

describe("createStore", () => {
  it("merges partial updates and notifies subscribers", () => {
    const store = createStore({ count: 0, label: "counter" });
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.setState(s => ({ count: s.count + 1 }));
    expect(store.getState()).toEqual({ count: 1, label: "counter" });
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    store.setState({ count: 2 });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe("QueryClient", () => {
  it("caches data and supports prefix invalidation", async () => {
    const client = new QueryClient();
    const queryFn = vi.fn(async () => ({ ok: true }));
    const options = { queryKey: ["users", { page: 1 }] as const, queryFn };
    await client.fetchQuery(options);
    expect(client.getQueryData(options.queryKey)).toEqual({ ok: true });
    expect(queryFn).toHaveBeenCalledTimes(1);
    client.invalidateQueries(["users"]);
    expect(client.getEntry(options.queryKey)?.invalidated).toBe(true);
  });

  it("deduplicates concurrent requests", async () => {
    const client = new QueryClient();
    let resolve!: (value: string) => void;
    const queryFn = vi.fn(() => new Promise<string>(r => { resolve = r; }));
    const options = { queryKey: ["slow"] as const, queryFn };
    const first = client.fetchQuery(options);
    const second = client.fetchQuery(options);
    expect(queryFn).toHaveBeenCalledTimes(1);
    resolve("done");
    await expect(first).resolves.toBe("done");
    await expect(second).resolves.toBe("done");
  });
});
