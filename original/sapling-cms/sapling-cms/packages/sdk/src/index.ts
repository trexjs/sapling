export type Entry = { id: string; model: string; locale: string; status: 'draft'|'published'; data: Record<string, unknown>; version: number; createdAt: string; updatedAt: string };
export type Model = { slug: string; name: string; kind: 'collection'|'single'; fields: Record<string,{ type: 'text'|'number'|'boolean'|'date'|'json'|'richtext'|'relation'|'media'; required?: boolean }> };
export class SaplingCMS {
  constructor(private config: { baseUrl: string; token?: string }) {}
  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.config.baseUrl.replace(/\/$/,'')}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(this.config.token ? { Authorization: `Bearer ${this.config.token}` } : {}), ...init.headers } });
    if (!res.ok) throw new Error(`CMS ${res.status}: ${await res.text()}`);
    return res.json() as Promise<T>;
  }
  models() { return this.request<Model[]>('/api/models'); }
  createModel(model: Model) { return this.request<Model>('/api/models', {method:'POST',body:JSON.stringify(model)}); }
  entries(model: string, params: Record<string,string>={}) { return this.request<Entry[]>(`/api/content/${encodeURIComponent(model)}?${new URLSearchParams(params)}`); }
  create(model: string, data: Record<string,unknown>, locale='en') { return this.request<Entry>(`/api/content/${encodeURIComponent(model)}`, {method:'POST',body:JSON.stringify({data,locale})}); }
  update(model: string, id: string, data: Record<string,unknown>) { return this.request<Entry>(`/api/content/${encodeURIComponent(model)}/${id}`, {method:'PATCH',body:JSON.stringify({data})}); }
  publish(model: string, id: string) { return this.request<Entry>(`/api/content/${encodeURIComponent(model)}/${id}/publish`,{method:'POST'}); }
  revisions(id: string) { return this.request<unknown[]>(`/api/revisions/${id}`); }
  restore(id: string, version: number) { return this.request<Entry>(`/api/revisions/${id}/restore/${version}`,{method:'POST'}); }
  locales() { return this.request<unknown[]>('/api/locales'); }
  assets() { return this.request<unknown[]>('/api/assets'); }
  audit() { return this.request<unknown[]>('/api/audit'); }
}
