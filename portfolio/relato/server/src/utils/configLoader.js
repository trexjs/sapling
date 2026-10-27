import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the API access config file
const configFilePath = path.join(__dirname, "../config/api-access-config.json");

let configCache = null;
let lastModified = null;

/**
 * Load and cache the API access configuration
 * @returns {Object} Configuration object
 */
export const loadApiAccessConfig = () => {
  try {
    // Check if config file exists
    if (!fs.existsSync(configFilePath)) {
      throw new Error("api-access-config.json file not found");
    }

    // Check if file was modified since last load
    const stats = fs.statSync(configFilePath);
    const currentModified = stats.mtime.getTime();

    // Return cached config if file hasn't changed
    if (configCache && lastModified === currentModified) {
      return configCache;
    }

    // Read and parse the config file
    const configData = fs.readFileSync(configFilePath, 'utf8');
    configCache = JSON.parse(configData);
    lastModified = currentModified;

    console.log("✅ API Access Configuration loaded successfully");
    return configCache;
  } catch (error) {
    console.error("❌ Error loading API access configuration:", error);
    throw error;
  }
};

/**
 * Get specific configuration section
 * @param {string} section - Section name (apiAccess, security, rateLimiting, cors, logging)
 * @returns {Object} Configuration section
 */
export const getConfigSection = (section) => {
  const config = loadApiAccessConfig();
  return config[section] || null;
};

/**
 * Check if an endpoint is public (no authentication required)
 * @param {string} path - API path
 * @param {string} method - HTTP method
 * @returns {boolean} True if endpoint is public
 */
export const isPublicEndpoint = (path, method) => {
  const apiAccess = getConfigSection('apiAccess');
  if (!apiAccess || !apiAccess.public) return false;

  return apiAccess.public.endpoints.some(endpoint => {
    const pathMatches = endpoint.path === path || 
                       (endpoint.path.includes('*') && path.startsWith(endpoint.path.replace('*', '')));
    const methodMatches = endpoint.methods.includes(method.toUpperCase());
    return pathMatches && methodMatches;
  });
};

/**
 * Check if an endpoint requires authentication
 * @param {string} path - API path
 * @param {string} method - HTTP method
 * @returns {boolean} True if endpoint requires authentication
 */
export const requiresAuth = (path, method) => {
  const apiAccess = getConfigSection('apiAccess');
  if (!apiAccess) return true; // Default to requiring auth

  // Check protected endpoints
  if (apiAccess.protected) {
    const isProtected = apiAccess.protected.endpoints.some(endpoint => {
      const pathMatches = endpoint.path === path || 
                         (endpoint.path.includes('*') && path.startsWith(endpoint.path.replace('*', '')));
      const methodMatches = endpoint.methods.includes(method.toUpperCase());
      return pathMatches && methodMatches && endpoint.requiredAuth;
    });
    if (isProtected) return true;
  }

  // Check role-based endpoints
  if (apiAccess.roleBased) {
    const isRoleBased = apiAccess.roleBased.endpoints.some(endpoint => {
      const pathMatches = endpoint.path === path || 
                         (endpoint.path.includes('*') && path.startsWith(endpoint.path.replace('*', '')));
      const methodMatches = endpoint.methods.includes(method.toUpperCase());
      return pathMatches && methodMatches && endpoint.requiredAuth;
    });
    if (isRoleBased) return true;
  }

  return false;
};

/**
 * Get allowed roles for an endpoint
 * @param {string} path - API path
 * @param {string} method - HTTP method
 * @returns {Array} Array of allowed roles
 */
export const getAllowedRoles = (path, method) => {
  const apiAccess = getConfigSection('apiAccess');
  if (!apiAccess || !apiAccess.roleBased) return [];

  const endpoint = apiAccess.roleBased.endpoints.find(endpoint => {
    const pathMatches = endpoint.path === path || 
                       (endpoint.path.includes('*') && path.startsWith(endpoint.path.replace('*', '')));
    const methodMatches = endpoint.methods.includes(method.toUpperCase());
    return pathMatches && methodMatches;
  });

  return endpoint ? endpoint.allowedRoles || [] : [];
};

/**
 * Get middleware requirements for an endpoint
 * @param {string} path - API path
 * @param {string} method - HTTP method
 * @returns {Array} Array of required middleware names
 */
export const getRequiredMiddleware = (path, method) => {
  const apiAccess = getConfigSection('apiAccess');
  if (!apiAccess) return [];

  // Check all endpoint types
  const endpointTypes = ['public', 'protected', 'roleBased'];
  
  for (const type of endpointTypes) {
    if (apiAccess[type] && apiAccess[type].endpoints) {
      const endpoint = apiAccess[type].endpoints.find(endpoint => {
        const pathMatches = endpoint.path === path || 
                           (endpoint.path.includes('*') && path.startsWith(endpoint.path.replace('*', '')));
        const methodMatches = endpoint.methods.includes(method.toUpperCase());
        return pathMatches && methodMatches;
      });

      if (endpoint && endpoint.middleware) {
        return endpoint.middleware;
      }
    }
  }

  return [];
};

/**
 * Get security configuration
 * @returns {Object} Security configuration
 */
export const getSecurityConfig = () => {
  return getConfigSection('security') || {};
};

/**
 * Get rate limiting configuration
 * @param {string} type - Rate limit type (login, passwordReset, general)
 * @returns {Object} Rate limiting configuration
 */
export const getRateLimitConfig = (type = 'general') => {
  const rateLimiting = getConfigSection('rateLimiting');
  return rateLimiting ? rateLimiting[type] || rateLimiting.general : null;
};

/**
 * Get CORS configuration
 * @returns {Object} CORS configuration
 */
export const getCorsConfig = () => {
  return getConfigSection('cors') || {};
};

/**
 * Get logging configuration
 * @returns {Object} Logging configuration
 */
export const getLoggingConfig = () => {
  return getConfigSection('logging') || {};
};
