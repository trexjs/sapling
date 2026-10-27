import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { configApi } from '../services/api';
import { Config, CreateConfigRequest, UpdateConfigRequest, ConfigContextType } from '../types';

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllConfigs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await configApi.getAllConfigs();
      setConfigs(response.configs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch configs');
    } finally {
      setLoading(false);
    }
  };

  const fetchConfig = async (name: string): Promise<Config> => {
    setLoading(true);
    setError(null);
    try {
      const config = await configApi.getLatestConfigByName(name);
      // Update the configs array with the fetched config
      setConfigs(prev => {
        const existingIndex = prev.findIndex(c => c.name === name);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = config;
          return updated;
        } else {
          return [...prev, config];
        }
      });
      return config;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch config');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createConfig = async (configData: CreateConfigRequest): Promise<Config> => {
    setLoading(true);
    setError(null);
    try {
      const newConfig = await configApi.createConfig(configData);
      // Refresh the configs list to get the latest data
      await fetchAllConfigs();
      return newConfig;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create config');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (name: string, configData: UpdateConfigRequest): Promise<Config> => {
    setLoading(true);
    setError(null);
    try {
      const updatedConfig = await configApi.updateConfigByName(name, configData);
      // Refresh the configs list to get the latest data
      await fetchAllConfigs();
      return updatedConfig;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update config');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Fetch all configs on component mount
  useEffect(() => {
    fetchAllConfigs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value: ConfigContextType = {
    configs,
    loading,
    error,
    fetchConfig,
    createConfig,
    updateConfig,
    clearError,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
