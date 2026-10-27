export type RealmStatus = "active" | "suspended";

export interface RealmSettings {
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSymbols: boolean;
  };
  session: {
    tokenTTLMinutes: number;
  };
  branding?: {
    displayName?: string;
    primaryColor?: string;
    logoUrl?: string;
  };
}

export interface RealmMetadata {
  description?: string;
  contactEmail?: string;
}

export interface Realm {
  id: string;
  name: string;
  slug: string;
  status: RealmStatus;
  metadata?: RealmMetadata;
  settings: RealmSettings;
  createdAt: string;
  updatedAt: string;
}

export type UserStatus = "active" | "disabled";

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  attributes?: Record<string, string>;
}

export interface User {
  id: string;
  realmId: string;
  email: string;
  status: UserStatus;
  profile: UserProfile;
  groups: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  realmId: string;
  name: string;
  description?: string;
  members: string[];
  parentGroupId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiListResponse<T> {
  items: T[];
  total: number;
}
