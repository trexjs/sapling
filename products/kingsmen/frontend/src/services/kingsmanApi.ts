import type { Group, Realm, User } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

async function request<TResponse>(input: RequestInfo, init?: RequestInit): Promise<TResponse> {
  const response = await fetch(input, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const text = await response.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { error: text };
    }
    const errorMessage = typeof parsed === "object" && parsed && "error" in parsed
      ? String((parsed as Record<string, unknown>).error)
      : response.statusText;
    throw new Error(errorMessage || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

async function listRealms(): Promise<Realm[]> {
  const result = await request<{ items: Realm[] }>(`${API_BASE}/realms`);
  return result.items;
}

async function createRealm(payload: {
  name: string;
  slug?: string;
  description?: string;
  contactEmail?: string;
  status?: Realm["status"];
  settings?: Realm["settings"];
}): Promise<Realm> {
  return request<Realm>(`${API_BASE}/realms`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function updateRealm(
  realmId: string,
  payload: Partial<Omit<Parameters<typeof createRealm>[0], "name"> & { name?: string }>
): Promise<Realm> {
  return request<Realm>(`${API_BASE}/realms/${realmId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

async function listUsers(realmId: string): Promise<User[]> {
  const result = await request<{ items: User[] }>(`${API_BASE}/realms/${realmId}/users`);
  return result.items;
}

async function createUser(payload: {
  realmId: string;
  email: string;
  status?: User["status"];
  profile?: User["profile"];
  groups?: string[];
}): Promise<User> {
  return request<User>(`${API_BASE}/realms/${payload.realmId}/users`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function updateUser(
  realmId: string,
  userId: string,
  payload: Partial<Omit<Parameters<typeof createUser>[0], "realmId">>
): Promise<User> {
  return request<User>(`${API_BASE}/realms/${realmId}/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

async function listGroups(realmId: string): Promise<Group[]> {
  const result = await request<{ items: Group[] }>(`${API_BASE}/realms/${realmId}/groups`);
  return result.items;
}

async function createGroup(payload: {
  realmId: string;
  name: string;
  description?: string;
  parentGroupId?: string;
}): Promise<Group> {
  return request<Group>(`${API_BASE}/realms/${payload.realmId}/groups`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function updateGroup(
  realmId: string,
  groupId: string,
  payload: Partial<Omit<Parameters<typeof createGroup>[0], "realmId"> & { members?: string[] }>
): Promise<Group> {
  return request<Group>(`${API_BASE}/realms/${realmId}/groups/${groupId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

async function addUserToGroup(realmId: string, groupId: string, userId: string): Promise<Group> {
  return request<Group>(`${API_BASE}/realms/${realmId}/groups/${groupId}/members`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

async function removeUserFromGroup(
  realmId: string,
  groupId: string,
  userId: string
): Promise<Group> {
  return request<Group>(`${API_BASE}/realms/${realmId}/groups/${groupId}/members/${userId}`, {
    method: "DELETE",
  });
}

export const kingsmanApi = {
  listRealms,
  createRealm,
  updateRealm,
  listUsers,
  createUser,
  updateUser,
  listGroups,
  createGroup,
  updateGroup,
  addUserToGroup,
  removeUserFromGroup,
};
