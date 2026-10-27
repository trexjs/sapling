export interface Config {
  _id?: string;
  name: string;
  data: Record<string, any>;
  version: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateConfigRequest {
  name: string;
  data: Record<string, any>;
  bumpType?: 'major' | 'minor' | 'patch';
}

export interface UpdateConfigRequest {
  data: Record<string, any>;
  bumpType?: 'major' | 'minor' | 'patch';
}

export interface ConfigResponse {
  message: string;
  version: string;
  config: Config;
}

export interface ConfigContextType {
  configs: Config[];
  loading: boolean;
  error: string | null;
  fetchConfig: (name: string) => Promise<Config>;
  createConfig: (configData: CreateConfigRequest) => Promise<Config>;
  updateConfig: (name: string, configData: UpdateConfigRequest) => Promise<Config>;
  clearError: () => void;
}

export type VersionBumpType = 'major' | 'minor' | 'patch';

export interface ConfigFormData {
  name: string;
  data: string; // JSON string for editing
  bumpType: VersionBumpType;
}
