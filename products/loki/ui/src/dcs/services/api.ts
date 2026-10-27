import axios from 'axios';
import { 
  DCSFlag, 
  CreateOrUpdateFlagRequest, 
  MapFlagToAccountRequest, 
  FlagStatusResponse, 
  GetAllFlagsResponse,
  ApiResponse 
} from '../types';

const API_BASE_URL = '/api/dcs';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dcsApi = {
  // GET /api/dcs/flags - Get all DCS flags
  getAllFlags: async (): Promise<GetAllFlagsResponse> => {
    try {
      const response = await api.get('/flags');
      return response.data;
    } catch (error) {
      console.error('Error fetching all flags:', error);
      throw new Error('Failed to fetch flags. Please make sure the server is running.');
    }
  },

  // GET /api/dcs/status?flag=flagName&tenant=tenantId - Get flag status
  getFlagStatus: async (flagName: string, tenant: string): Promise<boolean> => {
    try {
      const response = await api.get('/status', {
        params: {
          flag: flagName,
          tenant: tenant
        }
      });
      return response.data.status;
    } catch (error) {
      console.error('Error fetching flag status:', error);
      throw new Error(`Failed to fetch status for flag ${flagName}. Please make sure the server is running.`);
    }
  },

  // POST /api/dcs - Create or update flag
  createOrUpdateFlag: async (flagData: CreateOrUpdateFlagRequest): Promise<DCSFlag> => {
    try {
      const response = await api.post('/', flagData);
      return response.data.flag;
    } catch (error) {
      console.error('Error creating/updating flag:', error);
      throw new Error(`Failed to ${flagData.name ? 'update' : 'create'} flag. Please make sure the server is running.`);
    }
  },

  // PUT /api/dcs/map - Map flag to account
  mapFlagToAccount: async (mappingData: MapFlagToAccountRequest): Promise<DCSFlag> => {
    try {
      const response = await api.put('/map', mappingData);
      return response.data.flag;
    } catch (error) {
      console.error('Error mapping flag to account:', error);
      throw new Error(`Failed to map flag ${mappingData.name} to account. Please make sure the server is running.`);
    }
  },
};
