// Constants for Document Master API
export const MAX_HIERARCHY_LEVELS = 4;

export const FILE_TYPES = {
  DOCUMENT: 'document',
  IMAGE: 'image',
  OTHER: 'other'
};

export const ITEM_TYPES = {
  FILE: 'file',
  FOLDER: 'folder'
};

export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  SHARE: 'share'
};

export const BIN_AUTO_DELETE_DAYS = 30;

export const STORAGE_TYPES = {
  LOCAL: 'local',
  AWS_S3: 'aws_s3'
};

export const ICON_MAPPING = {
  // Document types
  'application/pdf': '📄',
  'application/msword': '📝',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
  'application/vnd.ms-excel': '📊',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
  'application/vnd.ms-powerpoint': '📊',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📊',
  'text/plain': '📄',
  'text/csv': '📊',
  
  // Image types
  'image/jpeg': '🖼️',
  'image/jpg': '🖼️',
  'image/png': '🖼️',
  'image/gif': '🖼️',
  'image/webp': '🖼️',
  'image/svg+xml': '🖼️',
  
  // Archive types
  'application/zip': '📦',
  'application/x-rar-compressed': '📦',
  'application/x-7z-compressed': '📦',
  
  // Default
  'default': '📄',
  'folder': '📁'
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};
