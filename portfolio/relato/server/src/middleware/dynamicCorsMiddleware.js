import { getCorsConfig, getLoggingConfig } from "../utils/configLoader.js";

/**
 * Dynamic CORS middleware that uses api-access-config.json settings
 * @returns {Function} Express middleware function
 */
export const dynamicCors = (req, res, next) => {
  try {
    const corsConfig = getCorsConfig();
    const loggingConfig = getLoggingConfig();
    
    // If CORS is disabled in config, skip CORS handling
    if (!corsConfig.enabled) {
      return next();
    }
    
    const origin = req.headers.origin;
    const method = req.method;
    
    // Handle preflight requests
    if (method === 'OPTIONS') {
      // Check if origin is allowed
      const isAllowedOrigin = isOriginAllowed(origin, corsConfig.allowedOrigins);
      
      if (!isAllowedOrigin) {
        if (loggingConfig.enabled) {
          console.log(`❌ CORS: Origin not allowed: ${origin}`);
        }
        return res.status(403).json({
          success: false,
          message: "CORS: Origin not allowed",
          origin: origin
        });
      }
      
      // Check if method is allowed
      const isAllowedMethod = corsConfig.allowedMethods.includes(method);
      
      if (!isAllowedMethod) {
        if (loggingConfig.enabled) {
          console.log(`❌ CORS: Method not allowed: ${method}`);
        }
        return res.status(405).json({
          success: false,
          message: "CORS: Method not allowed",
          method: method
        });
      }
      
      // Set CORS headers for preflight
      setCorsHeaders(res, corsConfig, origin);
      
      // Respond to preflight request
      return res.status(200).end();
    }
    
    // Handle actual requests
    const isAllowedOrigin = isOriginAllowed(origin, corsConfig.allowedOrigins);
    const isAllowedMethod = corsConfig.allowedMethods.includes(method);
    
    if (!isAllowedOrigin) {
      if (loggingConfig.enabled) {
        console.log(`❌ CORS: Origin not allowed: ${origin} for ${method} ${req.path}`);
      }
      return res.status(403).json({
        success: false,
        message: "CORS: Origin not allowed",
        origin: origin,
        endpoint: `${method} ${req.path}`
      });
    }
    
    if (!isAllowedMethod) {
      if (loggingConfig.enabled) {
        console.log(`❌ CORS: Method not allowed: ${method} for ${origin}`);
      }
      return res.status(405).json({
        success: false,
        message: "CORS: Method not allowed",
        method: method
      });
    }
    
    // Set CORS headers for actual request
    setCorsHeaders(res, corsConfig, origin);
    
    if (loggingConfig.enabled) {
      console.log(`✅ CORS: Request allowed from ${origin} for ${method} ${req.path}`);
    }
    
    next();
  } catch (error) {
    console.error("❌ CORS middleware error:", error);
    // Continue without CORS if there's an error
    next();
  }
};

/**
 * Check if origin is allowed
 * @param {string} origin - Request origin
 * @param {Array} allowedOrigins - Array of allowed origins
 * @returns {boolean} True if origin is allowed
 */
const isOriginAllowed = (origin, allowedOrigins) => {
  if (!origin) {
    // Allow requests without origin (e.g., from Postman, curl)
    return true;
  }
  
  return allowedOrigins.includes(origin) || 
         allowedOrigins.includes('*') ||
         allowedOrigins.some(allowed => {
           // Support for wildcard subdomains
           if (allowed.includes('*')) {
             const pattern = allowed.replace(/\*/g, '.*');
             const regex = new RegExp(`^${pattern}$`);
             return regex.test(origin);
           }
           return false;
         });
};

/**
 * Set CORS headers
 * @param {Object} res - Express response object
 * @param {Object} corsConfig - CORS configuration
 * @param {string} origin - Request origin
 */
const setCorsHeaders = (res, corsConfig, origin) => {
  // Set Access-Control-Allow-Origin
  if (corsConfig.allowedOrigins.includes('*')) {
    res.set('Access-Control-Allow-Origin', '*');
  } else {
    res.set('Access-Control-Allow-Origin', origin || corsConfig.allowedOrigins[0]);
  }
  
  // Set Access-Control-Allow-Methods
  res.set('Access-Control-Allow-Methods', corsConfig.allowedMethods.join(', '));
  
  // Set Access-Control-Allow-Headers
  if (corsConfig.allowedHeaders) {
    res.set('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(', '));
  }
  
  // Set Access-Control-Allow-Credentials if needed
  if (corsConfig.allowCredentials) {
    res.set('Access-Control-Allow-Credentials', 'true');
  }
  
  // Set Access-Control-Max-Age for preflight caching
  if (corsConfig.maxAge) {
    res.set('Access-Control-Max-Age', corsConfig.maxAge.toString());
  }
  
  // Set Access-Control-Expose-Headers if specified
  if (corsConfig.exposedHeaders) {
    res.set('Access-Control-Expose-Headers', corsConfig.exposedHeaders.join(', '));
  }
};

/**
 * CORS middleware for specific routes
 * @param {Array} allowedOrigins - Array of allowed origins for this route
 * @returns {Function} Express middleware function
 */
export const routeSpecificCors = (allowedOrigins) => {
  return (req, res, next) => {
    try {
      const origin = req.headers.origin;
      const method = req.method;
      const corsConfig = getCorsConfig();
      const loggingConfig = getLoggingConfig();
      
      // Use route-specific origins or fall back to global config
      const originsToCheck = allowedOrigins || corsConfig.allowedOrigins;
      
      // Handle preflight requests
      if (method === 'OPTIONS') {
        const isAllowedOrigin = isOriginAllowed(origin, originsToCheck);
        
        if (!isAllowedOrigin) {
          if (loggingConfig.enabled) {
            console.log(`❌ Route CORS: Origin not allowed: ${origin}`);
          }
          return res.status(403).json({
            success: false,
            message: "CORS: Origin not allowed for this route",
            origin: origin
          });
        }
        
        setCorsHeaders(res, { ...corsConfig, allowedOrigins: originsToCheck }, origin);
        return res.status(200).end();
      }
      
      // Handle actual requests
      const isAllowedOrigin = isOriginAllowed(origin, originsToCheck);
      
      if (!isAllowedOrigin) {
        if (loggingConfig.enabled) {
          console.log(`❌ Route CORS: Origin not allowed: ${origin} for ${method} ${req.path}`);
        }
        return res.status(403).json({
          success: false,
          message: "CORS: Origin not allowed for this route",
          origin: origin,
          endpoint: `${method} ${req.path}`
        });
      }
      
      setCorsHeaders(res, { ...corsConfig, allowedOrigins: originsToCheck }, origin);
      
      if (loggingConfig.enabled) {
        console.log(`✅ Route CORS: Request allowed from ${origin} for ${method} ${req.path}`);
      }
      
      next();
    } catch (error) {
      console.error("❌ Route CORS middleware error:", error);
      next();
    }
  };
};

/**
 * CORS middleware for API endpoints only
 * Applies CORS only to API routes
 */
export const apiCors = (req, res, next) => {
  // Only apply CORS to API routes
  if (req.path.startsWith('/api/')) {
    return dynamicCors(req, res, next);
  }
  
  // Skip CORS for non-API routes
  next();
};

/**
 * CORS middleware with custom error handling
 * @param {Function} errorHandler - Custom error handler function
 * @returns {Function} Express middleware function
 */
export const corsWithErrorHandler = (errorHandler) => {
  return (req, res, next) => {
    try {
      return dynamicCors(req, res, next);
    } catch (error) {
      if (errorHandler) {
        return errorHandler(error, req, res, next);
      }
      
      console.error("❌ CORS error:", error);
      return res.status(500).json({
        success: false,
        message: "CORS configuration error"
      });
    }
  };
};

/**
 * Development CORS middleware (more permissive)
 * Use this only in development environment
 */
export const devCors = (req, res, next) => {
  // Allow all origins in development
  const origin = req.headers.origin;
  
  if (req.method === 'OPTIONS') {
    res.set({
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    });
    return res.status(200).end();
  }
  
  res.set('Access-Control-Allow-Origin', origin || '*');
  res.set('Access-Control-Allow-Credentials', 'true');
  
  next();
};
