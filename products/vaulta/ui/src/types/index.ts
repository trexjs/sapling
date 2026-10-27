// User types
export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  storageUsed: number;
  maxStorage: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// File types
export interface File {
  _id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url?: string;
  owner: string;
  parentFolder?: string;
  type: string;
  isStarred: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  downloadCount: number;
  sharedWith: string[];
  lastAccessed: string;
  createdAt: string;
  updatedAt: string;
  icon: string;
  itemType: 'file';
  id: string;
}

// Folder types
export interface Folder {
  _id: string;
  name: string;
  owner: string;
  parentFolder?: string;
  path: string;
  level: number;
  isStarred: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  sharedWith: string[];
  lastAccessed: string;
  createdAt: string;
  updatedAt: string;
  icon: string;
  itemType: 'folder';
  id: string;
}

// Share types
export interface Share {
  _id: string;
  itemId: string;
  itemType: 'File' | 'Folder';
  itemName: string;
  owner: string;
  sharedWith: {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  permissions: string[];
  shareToken: string;
  isActive: boolean;
  expiresAt: string | null;
  accessCount: number;
  lastAccessed: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Search types
export interface SearchResult {
  files: File[];
  folders: Folder[];
  total: number;
}

// Bin types
export interface BinItem {
  _id: string;
  itemId: string;
  itemType: 'file' | 'folder';
  originalName: string;
  deletedAt: string;
  userId: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Upload types
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Navigation types
export interface Breadcrumb {
  id: string;
  name: string;
  path: string;
}
