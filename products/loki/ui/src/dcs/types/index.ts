export interface POC {
  name: string;
  escalation_mail: string;
  oncall_id: string;
}

export interface DCSFlag {
  _id?: string;
  exp: string; // Expiry like '1hr', '30days', etc.
  type: 'EXP' | 'NO_EXP';
  created_by: string;
  updated_by: string;
  poc: POC;
  name: string;
  associated_accounts: string[];
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrUpdateFlagRequest {
  name: string;
  exp?: string;
  type?: 'EXP' | 'NO_EXP';
  created_by?: string;
  updated_by?: string;
  poc?: POC;
  associated_accounts?: string[];
  status?: boolean;
}

export interface MapFlagToAccountRequest {
  name: string;
  associated_accounts: string[];
  status: boolean;
}

export interface FlagStatusResponse {
  status: boolean;
}

export interface GetAllFlagsResponse {
  count: number;
  flags: DCSFlag[];
}

export interface ApiResponse<T> {
  message: string;
  flag?: T;
  document?: T;
}

export interface DCSContextType {
  flags: DCSFlag[];
  loading: boolean;
  error: string | null;
  fetchAllFlags: () => Promise<void>;
  getFlagStatus: (flagName: string, tenant: string) => Promise<boolean>;
  createOrUpdateFlag: (flagData: CreateOrUpdateFlagRequest) => Promise<DCSFlag>;
  mapFlagToAccount: (mappingData: MapFlagToAccountRequest) => Promise<DCSFlag>;
}
