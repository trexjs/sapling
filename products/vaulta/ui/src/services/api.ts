import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { 
  AuthResponse, 
  User, 
  File, 
  Folder, 
  Share, 
  SearchResult, 
  BinItem,
  ApiResponse,
  UploadProgress 
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/dm/';
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(userData: { username: string; email: string; password: string; firstName: string; lastName: string }): Promise<AuthResponse> {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = await this.api.post('/auth/register', userData);
    const { data } = response.data;
    return {
      success: response.data.success,
      message: response.data.message,
      user: data?.user,
      token: data?.token
    };
  }

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = await this.api.post('/auth/login', credentials);
    const { data } = response.data;
    return {
      success: response.data.success,
      message: response.data.message,
      user: data?.user,
      token: data?.token
    };
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await this.api.get('/auth/profile');
    return response.data.data!.user;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await this.api.put('/auth/profile', userData);
    return response.data.data!.user;
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.put('/auth/change-password', passwordData);
    return response.data;
  }

  // File endpoints
  async uploadFile(file: globalThis.File, folderId?: string, onProgress?: (progress: UploadProgress) => void): Promise<ApiResponse<File>> {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) {
      formData.append('folderId', folderId);
    }

    const response: AxiosResponse<ApiResponse<File>> = await this.api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          };
          onProgress(progress);
        }
      },
    });
    return response.data;
  }

  async downloadFile(fileId: string): Promise<Blob> {
    const response: AxiosResponse<Blob> = await this.api.get(`/files/${fileId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async getFileInfo(fileId: string): Promise<File> {
    const response: AxiosResponse<ApiResponse<File>> = await this.api.get(`/files/${fileId}/info`);
    return response.data.data!;
  }

  async renameFile(fileId: string, newName: string): Promise<File> {
    const response: AxiosResponse<ApiResponse<File>> = await this.api.put(`/files/${fileId}/rename`, { newName });
    return response.data.data!;
  }

  async copyFile(fileId: string, destinationFolderId?: string): Promise<File> {
    const response: AxiosResponse<ApiResponse<File>> = await this.api.post(`/files/${fileId}/copy`, { destinationFolderId });
    return response.data.data!;
  }

  async moveFile(fileId: string, destinationFolderId?: string): Promise<File> {
    const response: AxiosResponse<ApiResponse<File>> = await this.api.post(`/files/${fileId}/move`, { destinationFolderId });
    return response.data.data!;
  }

  async deleteFile(fileId: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.delete(`/files/${fileId}`);
    return response.data;
  }

  // Folder endpoints
  async createFolder(name: string, parentId?: string): Promise<Folder> {
    const response: AxiosResponse<ApiResponse<Folder>> = await this.api.post('/folders', { name, parentId });
    return response.data.data!;
  }

  async getFolderContents(folderId?: string): Promise<{ files: File[]; folders: Folder[] }> {
    const url = folderId ? `/folders/${folderId}/contents` : '/folders';
    const response: AxiosResponse<ApiResponse<{ items: (File | Folder)[]; counts: { files: number; folders: number } }>> = await this.api.get(url);
    
    console.log('API Response:', response.data);
    
    // Separate files and folders from the items array
    const items = response.data.data!.items;
    const files: File[] = items.filter((item: any) => item.itemType === 'file') as File[];
    const folders: Folder[] = items.filter((item: any) => item.itemType === 'folder') as Folder[];
    
    console.log('Separated files:', files);
    console.log('Separated folders:', folders);
    
    return { files, folders };
  }

  async getFolderInfo(folderId: string): Promise<Folder> {
    const response: AxiosResponse<ApiResponse<Folder>> = await this.api.get(`/folders/${folderId}`);
    return response.data.data!;
  }

  async renameFolder(folderId: string, newName: string): Promise<Folder> {
    const response: AxiosResponse<ApiResponse<Folder>> = await this.api.put(`/folders/${folderId}/rename`, { newName });
    return response.data.data!;
  }

  async moveFolder(folderId: string, destinationFolderId?: string): Promise<Folder> {
    const response: AxiosResponse<ApiResponse<Folder>> = await this.api.post(`/folders/${folderId}/move`, { destinationFolderId });
    return response.data.data!;
  }

  async deleteFolder(folderId: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.delete(`/folders/${folderId}`);
    return response.data;
  }

  // Search endpoints
  async searchItems(query: string, type?: 'file' | 'folder'): Promise<SearchResult> {
    const params = new URLSearchParams({ q: query });
    if (type) params.append('type', type);
    
    const response: AxiosResponse<ApiResponse<SearchResult>> = await this.api.get(`/search?${params}`);
    return response.data.data!;
  }

  async getRecentItems(): Promise<SearchResult> {
    const response: AxiosResponse<ApiResponse<SearchResult>> = await this.api.get('/search/recent');
    return response.data.data!;
  }

  async getStarredItems(): Promise<SearchResult> {
    const response: AxiosResponse<ApiResponse<{ items: (File | Folder)[]; pagination: any }>> = await this.api.get('/search/starred');
    console.log('getStarredItems API Response:', response.data);
    
    // Separate files and folders from the items array
    const items = response.data.data!.items || [];
    const files: File[] = items.filter((item: any) => item.itemType === 'file') as File[];
    const folders: Folder[] = items.filter((item: any) => item.itemType === 'folder') as Folder[];
    
    console.log('Separated starred files:', files);
    console.log('Separated starred folders:', folders);
    
    return { files, folders, total: items.length };
  }

  // Star endpoints
  async toggleStar(itemType: 'file' | 'folder', itemId: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post(`/star/${itemType}/${itemId}`);
    return response.data;
  }

  // Share endpoints
  async shareItem(itemId: string, itemType: 'file' | 'folder', sharedWith: string[], permissions: 'read' | 'write'): Promise<Share> {
    const response: AxiosResponse<ApiResponse<Share>> = await this.api.post('/share/share', {
      itemId,
      itemType,
      sharedWith,
      permissions,
    });
    return response.data.data!;
  }

  async getSharedWithMe(): Promise<{ files: File[]; folders: Folder[] }> {
    const response: AxiosResponse<ApiResponse<{ items: Share[]; pagination: any }>> = await this.api.get('/share/shared-with-me');
    console.log('getSharedWithMe API Response:', response.data);
    
    // The "Shared with Me" API returns share objects, not file/folder objects
    // We need to return them as a mixed array that can be handled by the UI
    const data = response.data.data!;
    const shares = data.items || [];
    
    // Convert share objects to a format that can be displayed
    // Since these are share objects, we'll return them as "files" for now
    // The UI will handle displaying them correctly based on itemType
    console.log('Converting shares to display format:', shares);
    const files: any[] = shares.map((share: Share) => ({
      _id: share.itemId, // Use itemId as the main ID
      name: share.itemName,
      itemType: share.itemType.toLowerCase(), // Convert to lowercase for consistency
      originalName: share.itemName,
      mimeType: share.itemType === 'File' ? 'application/octet-stream' : 'folder',
      size: 0, // Share objects don't have size
      path: '',
      url: null,
      owner: share.owner,
      parentFolder: null,
      type: share.itemType.toLowerCase(),
      isStarred: false,
      isDeleted: false,
      deletedAt: null,
      downloadCount: share.accessCount,
      sharedWith: [],
      lastAccessed: share.lastAccessed || share.createdAt,
      createdAt: share.createdAt,
      updatedAt: share.updatedAt,
      icon: share.itemType === 'File' ? '📄' : '📁',
      id: share.itemId,
      // Keep share-specific properties
      shareId: share._id,
      shareToken: share.shareToken,
      sharePermissions: share.permissions,
      shareOwner: share.owner
    }));
    
    console.log('Converted files for display:', files);
    return { files, folders: [] };
  }

  async getMySharedItems(): Promise<Share[]> {
    const response: AxiosResponse<ApiResponse<{ items: Share[]; pagination: any }>> = await this.api.get('/share/my-shared');
    console.log('getMySharedItems API Response:', response.data);
    
    // Extract items from the response structure
    const data = response.data.data!;
    return data.items || [];
  }

  async updateSharePermissions(shareId: string, permissions: 'read' | 'write'): Promise<Share> {
    const response: AxiosResponse<ApiResponse<Share>> = await this.api.put(`/share/share/${shareId}/permissions`, { permissions });
    return response.data.data!;
  }

  async revokeShare(shareId: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.delete(`/share/share/${shareId}`);
    return response.data;
  }

  async getSharedItemAccess(shareToken: string): Promise<{ file?: File; folder?: Folder }> {
    const response: AxiosResponse<ApiResponse<{ file?: File; folder?: Folder }>> = await this.api.get(`/share/access/${shareToken}`);
    return response.data.data!;
  }

  // Bin endpoints
  async getBinItems(): Promise<BinItem[]> {
    const response: AxiosResponse<ApiResponse<BinItem[]>> = await this.api.get('/bin');
    return response.data.data!;
  }

  async restoreBinItem(binItemId: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post(`/bin/${binItemId}/restore`);
    return response.data;
  }

  async permanentlyDeleteBinItem(binItemId: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.delete(`/bin/${binItemId}`);
    return response.data;
  }

  async emptyBin(): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.delete('/bin');
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.get('/health');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
