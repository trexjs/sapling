import axios from 'axios';
import { 
  Config, 
  CreateConfigRequest, 
  UpdateConfigRequest 
} from '../types';

const API_BASE_URL = '/api/config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const configApi = {
  // GET /api/config - Get all configs
  getAllConfigs: async (): Promise<{ count: number; configs: Config[] }> => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error fetching all configs:', error);
      throw new Error('Failed to fetch configs. Please make sure the server is running.');
    }
  },

  // POST /api/config - Create new config
  createConfig: async (configData: CreateConfigRequest): Promise<Config> => {
    try {
      const response = await api.post('/', configData);
      return response.data.config;
    } catch (error) {
      console.error('Error creating config:', error);
      throw new Error('Failed to create config. Please make sure the server is running.');
    }
  },

  // GET /api/config/:name/latest - Get latest config by name
  getLatestConfigByName: async (name: string): Promise<Config> => {
    try {
      const response = await api.get(`/${name}/latest`);
      return response.data;
    } catch (error) {
      console.error('Error fetching config:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`No config found for '${name}'`);
      }
      throw new Error(`Failed to fetch config '${name}'. Please make sure the server is running.`);
    }
  },

  // PUT /api/config/:name - Update config
  updateConfigByName: async (name: string, configData: UpdateConfigRequest): Promise<Config> => {
    try {
      const response = await api.put(`/${name}`, configData);
      return response.data.config;
    } catch (error) {
      console.error('Error updating config:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`No config found for '${name}'`);
      }
      throw new Error(`Failed to update config '${name}'. Please make sure the server is running.`);
    }
  },
};
