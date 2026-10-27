import { HTTP_STATUS } from '../../config/constants.js';

export const validateFileUpload = (req, res, next) => {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024; // 100MB default
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/*',
    'application/pdf',
    'text/*',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!req.file) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  if (req.file.size > maxSize) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: `File size exceeds maximum limit of ${Math.round(maxSize / 1024 / 1024)}MB`
    });
  }

  // Check if file type is allowed
  const isAllowedType = allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const baseType = type.slice(0, -2);
      return req.file.mimetype.startsWith(baseType);
    }
    return req.file.mimetype === type;
  });

  if (!isAllowedType) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'File type not allowed'
    });
  }

  next();
};

export const validateFolderName = (req, res, next) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Folder name is required'
    });
  }

  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Folder name cannot be empty'
    });
  }

  if (trimmedName.length > 255) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Folder name is too long (max 255 characters)'
    });
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (invalidChars.test(trimmedName)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Folder name contains invalid characters'
    });
  }

  req.body.name = trimmedName;
  next();
};

export const validateSearchQuery = (req, res, next) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const trimmedQuery = q.trim();

  if (trimmedQuery.length === 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Search query cannot be empty'
    });
  }

  if (trimmedQuery.length > 100) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Search query is too long (max 100 characters)'
    });
  }

  req.query.q = trimmedQuery;
  next();
};
