import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dcsApi } from '../services/api';
import { DCSFlag, CreateOrUpdateFlagRequest, MapFlagToAccountRequest, DCSContextType } from '../types';

const DCSContext = createContext<DCSContextType | undefined>(undefined);

interface DCSProviderProps {
  children: ReactNode;
}

export const DCSProvider: React.FC<DCSProviderProps> = ({ children }) => {
  const [flags, setFlags] = useState<DCSFlag[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllFlags = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dcsApi.getAllFlags();
      setFlags(response.flags);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch flags');
    } finally {
      setLoading(false);
    }
  };

  const getFlagStatus = async (flagName: string, tenant: string): Promise<boolean> => {
    try {
      return await dcsApi.getFlagStatus(flagName, tenant);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get flag status');
      throw err;
    }
  };

  const createOrUpdateFlag = async (flagData: CreateOrUpdateFlagRequest): Promise<DCSFlag> => {
    try {
      const updatedFlag = await dcsApi.createOrUpdateFlag(flagData);
      // Refresh the flags list
      await fetchAllFlags();
      return updatedFlag;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create/update flag');
      throw err;
    }
  };

  const mapFlagToAccount = async (mappingData: MapFlagToAccountRequest): Promise<DCSFlag> => {
    try {
      const updatedFlag = await dcsApi.mapFlagToAccount(mappingData);
      // Refresh the flags list
      await fetchAllFlags();
      return updatedFlag;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to map flag to account');
      throw err;
    }
  };

  useEffect(() => {
    fetchAllFlags();
  }, []);

  const value: DCSContextType = {
    flags,
    loading,
    error,
    fetchAllFlags,
    getFlagStatus,
    createOrUpdateFlag,
    mapFlagToAccount,
  };

  return <DCSContext.Provider value={value}>{children}</DCSContext.Provider>;
};

export const useDCS = (): DCSContextType => {
  const context = useContext(DCSContext);
  if (context === undefined) {
    throw new Error('useDCS must be used within a DCSProvider');
  }
  return context;
};
