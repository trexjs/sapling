import axios from 'axios';
import { Product, Category, PaginatedResponse } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    gender?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    isFeatured?: boolean;
    isOnSale?: boolean;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getFeatured: async (): Promise<Product[]> => {
    const response = await api.get('/products/featured/list');
    return response.data;
  },

  getNew: async (): Promise<Product[]> => {
    const response = await api.get('/products/new/list');
    return response.data;
  },

  getOnSale: async (): Promise<Product[]> => {
    const response = await api.get('/products/sale/list');
    return response.data;
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (gender?: string): Promise<Category[]> => {
    const response = await api.get('/categories', { 
      params: gender ? { gender } : undefined 
    });
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },
};

export default api;
