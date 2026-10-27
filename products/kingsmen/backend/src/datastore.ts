import { randomUUID } from "crypto";
import { BadRequestError, ConflictError, NotFoundError } from "./errors";
import { Group, Realm, RealmSettings, User } from "./types";
import { slugify } from "./utils/slugify";

const generateId = () => randomUUID().replace(/-/g, "").slice(0, 12);

interface CreateRealmInput {
  name: string;
  slug?: string;
  description?: string;
  contactEmail?: string;
  status?: Realm["status"];
  settings?: Partial<RealmSettings>;
}

interface UpdateRealmInput {
  name?: string;
  description?: string;
  contactEmail?: string;
  status?: Realm["status"];
  settings?: Partial<RealmSettings>;
}

interface CreateUserInput {
  realmId: string;
  email: string;
  status?: User["status"];
  profile?: User["profile"];
  groups?: string[];
}

interface UpdateUserInput {
  email?: string;
  status?: User["status"];
  profile?: User["profile"];
  groups?: string[];
}

interface CreateGroupInput {
  realmId: string;
  name: string;
  description?: string;
  parentGroupId?: string;
}

interface UpdateGroupInput {
  name?: string;
  description?: string;
  parentGroupId?: string | null;
  members?: string[];
}

const realms = new Map<string, Realm>();
const users = new Map<string, User>();
const groups = new Map<string, Group>();

function applyDefaultRealmSettings(partial?: Partial<RealmSettings>): RealmSettings {
  return {
    passwordPolicy: {
      minLength: partial?.passwordPolicy?.minLength ?? 8,
      requireNumbers: partial?.passwordPolicy?.requireNumbers ?? true,
      requireSymbols: partial?.passwordPolicy?.requireSymbols ?? false,
    },
    session: {
      tokenTTLMinutes: partial?.session?.tokenTTLMinutes ?? 60,
    },
    branding: partial?.branding,
  };
}

function assertRealmSlugUnique(slug: string, realmId?: string) {
  const existing = listRealms().find((realm) => realm.slug === slug && realm.id !== realmId);
  if (existing) {
    throw new ConflictError(`Realm slug '${slug}' is already in use`);
  }
}

function createRealm(input: CreateRealmInput): Realm {
  const id = generateId();
  const slug = input.slug ? slugify(input.slug) : slugify(input.name);
  assertRealmSlugUnique(slug);

  const now = new Date().toISOString();
  const realm: Realm = {
    id,
    name: input.name,
    slug,
    status: input.status ?? "active",
    metadata: {
      description: input.description,
      contactEmail: input.contactEmail,
    },
    settings: applyDefaultRealmSettings(input.settings),
    createdAt: now,
    updatedAt: now,
  };

  realms.set(id, realm);
  return realm;
}

function updateRealm(realmId: string, input: UpdateRealmInput): Realm {
  const realm = realms.get(realmId);
  if (!realm) {
    throw new NotFoundError("Realm not found");
  }

  const now = new Date().toISOString();

  if (input.name) {
    const potentialSlug = slugify(input.name);
    assertRealmSlugUnique(potentialSlug, realmId);
    realm.slug = potentialSlug;
  }

  const updated: Realm = {
    ...realm,
    name: input.name ?? realm.name,
    status: input.status ?? realm.status,
    metadata: {
      description: input.description ?? realm.metadata?.description,
      contactEmail: input.contactEmail ?? realm.metadata?.contactEmail,
    },
    settings: applyDefaultRealmSettings({
      ...realm.settings,
      ...input.settings,
      passwordPolicy: {
        ...realm.settings.passwordPolicy,
        ...input.settings?.passwordPolicy,
      },
      session: {
        ...realm.settings.session,
        ...input.settings?.session,
      },
      branding: input.settings?.branding ?? realm.settings.branding,
    }),
    updatedAt: now,
  };

  realms.set(realmId, updated);
  return updated;
}

function listRealms(): Realm[] {
  return Array.from(realms.values());
}

function getRealm(realmId: string): Realm | undefined {
  return realms.get(realmId);
}

function getRealmBySlug(realmSlug: string): Realm | undefined {
  const normalized = slugify(realmSlug);
  return listRealms().find((realm) => realm.slug === normalized);
}

function ensureRealmExists(realmId: string): Realm {
  const realm = getRealm(realmId);
  if (!realm) {
    throw new NotFoundError("Realm not found");
  }
  return realm;
}

function createUser(input: CreateUserInput): User {
  ensureRealmExists(input.realmId);
  const now = new Date().toISOString();
  const id = generateId();

  const existing = listUsers(input.realmId).find(
    (user) => user.email.toLowerCase() === input.email.toLowerCase()
  );
  if (existing) {
    throw new ConflictError("User with email already exists in realm");
  }

  if (input.groups) {
    input.groups.forEach((groupId) => {
      const group = groups.get(groupId);
      if (!group || group.realmId !== input.realmId) {
        throw new BadRequestError("Group assignment invalid for realm");
      }
    });
  }

  const user: User = {
    id,
    realmId: input.realmId,
    email: input.email.toLowerCase(),
    status: input.status ?? "active",
    profile: input.profile ?? {},
    groups: input.groups ?? [],
    createdAt: now,
    updatedAt: now,
  };

  users.set(id, user);
  return user;
}

function updateUser(userId: string, input: UpdateUserInput): User {
  const existing = users.get(userId);
  if (!existing) {
    throw new NotFoundError("User not found");
  }

  const now = new Date().toISOString();

  if (input.email) {
    const duplicate = listUsers(existing.realmId).find(
      (user) => user.id !== userId && user.email.toLowerCase() === input.email!.toLowerCase()
    );
    if (duplicate) {
      throw new ConflictError("User with email already exists in realm");
    }
  }

  if (input.groups) {
    input.groups.forEach((groupId) => {
      const group = groups.get(groupId);
      if (!group || group.realmId !== existing.realmId) {
        throw new BadRequestError("Group assignment invalid for realm");
      }
    });
  }

  const updated: User = {
    ...existing,
    email: input.email ? input.email.toLowerCase() : existing.email,
    status: input.status ?? existing.status,
    profile: {
      ...existing.profile,
      ...input.profile,
      attributes: {
        ...existing.profile.attributes,
        ...input.profile?.attributes,
      },
    },
    groups: input.groups ?? existing.groups,
    updatedAt: now,
  };

  users.set(userId, updated);
  return updated;
}

function listUsers(realmId: string): User[] {
  ensureRealmExists(realmId);
  return Array.from(users.values()).filter((user) => user.realmId === realmId);
}

function getUser(realmId: string, userId: string): User | undefined {
  const user = users.get(userId);
  if (!user || user.realmId !== realmId) {
    return undefined;
  }
  return user;
}

function createGroup(input: CreateGroupInput): Group {
  ensureRealmExists(input.realmId);
  if (input.parentGroupId) {
    const parent = groups.get(input.parentGroupId);
    if (!parent || parent.realmId !== input.realmId) {
      throw new BadRequestError("Parent group not found within realm");
    }
  }

  const duplicateName = listGroups(input.realmId).find(
    (group) => group.name.toLowerCase() === input.name.toLowerCase()
  );
  if (duplicateName) {
    throw new ConflictError("Group name already exists in realm");
  }

  const id = generateId();
  const now = new Date().toISOString();
  const group: Group = {
    id,
    realmId: input.realmId,
    name: input.name,
    description: input.description,
    members: [],
    parentGroupId: input.parentGroupId,
    createdAt: now,
    updatedAt: now,
  };

  groups.set(id, group);
  return group;
}

function updateGroup(groupId: string, input: UpdateGroupInput): Group {
  const existing = groups.get(groupId);
  if (!existing) {
    throw new NotFoundError("Group not found");
  }

  if (input.parentGroupId) {
    const parent = groups.get(input.parentGroupId);
    if (!parent || parent.realmId !== existing.realmId) {
      throw new BadRequestError("Parent group not found within realm");
    }
    if (parent.id === groupId) {
      throw new BadRequestError("Group cannot be its own parent");
    }
  }

  if (input.name) {
    const duplicateName = listGroups(existing.realmId).find(
      (group) => group.id !== groupId && group.name.toLowerCase() === input.name!.toLowerCase()
    );
    if (duplicateName) {
      throw new ConflictError("Group name already exists in realm");
    }
  }

  const now = new Date().toISOString();
  const updated: Group = {
    ...existing,
    name: input.name ?? existing.name,
    description: input.description ?? existing.description,
    members: input.members ?? existing.members,
    parentGroupId: input.parentGroupId ?? existing.parentGroupId,
    updatedAt: now,
  };

  groups.set(groupId, updated);
  return updated;
}

function listGroups(realmId: string): Group[] {
  ensureRealmExists(realmId);
  return Array.from(groups.values()).filter((group) => group.realmId === realmId);
}

function getGroup(realmId: string, groupId: string): Group | undefined {
  const group = groups.get(groupId);
  if (!group || group.realmId !== realmId) {
    return undefined;
  }
  return group;
}

function addUserToGroup(realmId: string, groupId: string, userId: string): Group {
  const group = getGroup(realmId, groupId);
  if (!group) {
    throw new NotFoundError("Group not found");
  }
  const user = getUser(realmId, userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (!group.members.includes(userId)) {
    group.members.push(userId);
    group.updatedAt = new Date().toISOString();
    groups.set(groupId, group);
  }

  if (!user.groups.includes(groupId)) {
    user.groups.push(groupId);
    user.updatedAt = new Date().toISOString();
    users.set(userId, user);
  }

  return group;
}

function removeUserFromGroup(realmId: string, groupId: string, userId: string): Group {
  const group = getGroup(realmId, groupId);
  if (!group) {
    throw new NotFoundError("Group not found");
  }
  const user = getUser(realmId, userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  group.members = group.members.filter((id) => id !== userId);
  group.updatedAt = new Date().toISOString();
  groups.set(groupId, group);

  user.groups = user.groups.filter((id) => id !== groupId);
  user.updatedAt = new Date().toISOString();
  users.set(userId, user);

  return group;
}

function seedData() {
  if (realms.size > 0) {
    return;
  }

  const systemRealm = createRealm({
    name: "System Realm",
    slug: "system",
    description: "Kingsman platform administration realm",
    contactEmail: "admin@kingsman.local",
  });

  const engineering = createGroup({
    realmId: systemRealm.id,
    name: "Engineering",
  });

  const adminUser = createUser({
    realmId: systemRealm.id,
    email: "founder@kingsman.local",
    profile: { firstName: "Founding", lastName: "Admin" },
    groups: [engineering.id],
  });

  addUserToGroup(systemRealm.id, engineering.id, adminUser.id);
}

seedData();

export const store = {
  createRealm,
  updateRealm,
  listRealms,
  getRealm,
  getRealmBySlug,
  createUser,
  updateUser,
  listUsers,
  getUser,
  createGroup,
  updateGroup,
  listGroups,
  getGroup,
  addUserToGroup,
  removeUserFromGroup,
};

export type {
  CreateRealmInput,
  UpdateRealmInput,
  CreateUserInput,
  UpdateUserInput,
  CreateGroupInput,
  UpdateGroupInput,
};
