import { getRateLimitConfig, getLoggingConfig } from "../utils/configLoader.js";

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map();

/**
 * Clean expired entries from rate limit store
 */
const cleanExpiredEntries = () => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (data.expiresAt < now) {
      rateLimitStore.delete(key);
    }
  }
};

/**
 * Get client identifier for rate limiting
 * @param {Object} req - Express request object
 * @returns {string} Client identifier
 */
const getClientId = (req) => {
  // Use IP address as primary identifier
  const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  
  // For authenticated users, also include user ID for more granular control
  if (req.user && req.user.userId) {
    return `${ip}:${req.user.userId}`;
  }
  
  return ip;
};

/**
 * Check if request should be rate limited
 * @param {string} clientId - Client identifier
 * @param {Object} config - Rate limit configuration
 * @returns {Object} Rate limit result
 */
const checkRateLimit = (clientId, config) => {
  const now = Date.now();
  const windowMs = config.windowMs;
  const maxAttempts = config.maxAttempts;
  
  // Clean expired entries periodically
  if (Math.random() < 0.1) { // 10% chance
    cleanExpiredEntries();
  }
  
  const key = clientId;
  const currentData = rateLimitStore.get(key);
  
  if (!currentData || currentData.expiresAt < now) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
      expiresAt: now + windowMs + 60000 // Keep in store 1 minute after window expires
    });
    
    return {
      allowed: true,
      remaining: maxAttempts - 1,
      resetTime: now + windowMs,
      total: maxAttempts
    };
  }
  
  if (currentData.count >= maxAttempts) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: currentData.resetTime,
      total: maxAttempts,
      retryAfter: Math.ceil((currentData.resetTime - now) / 1000)
    };
  }
  
  // Increment counter
  currentData.count++;
  rateLimitStore.set(key, currentData);
  
  return {
    allowed: true,
    remaining: maxAttempts - currentData.count,
    resetTime: currentData.resetTime,
    total: maxAttempts
  };
};

/**
 * Dynamic rate limiting middleware based on config
 * @param {string} type - Rate limit type (login, passwordReset, general)
 * @returns {Function} Express middleware function
 */
export const dynamicRateLimit = (type = 'general') => {
  return (req, res, next) => {
    try {
      const config = getRateLimitConfig(type);
      const loggingConfig = getLoggingConfig();
      
      if (!config) {
        // No rate limiting configured for this type
        return next();
      }
      
      const clientId = getClientId(req);
      const result = checkRateLimit(clientId, config);
      
      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': result.total,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': new Date(result.resetTime).toISOString()
      });
      
      if (!result.allowed) {
        if (loggingConfig.enabled && loggingConfig.logFailedAttempts) {
          console.log(`🚫 Rate limit exceeded for ${type}: ${clientId} on ${req.method} ${req.path}`);
        }
        
        res.set('Retry-After', result.retryAfter);
        return res.status(429).json({
          success: false,
          message: `Too many requests. Rate limit exceeded for ${type}`,
          retryAfter: result.retryAfter,
          limit: result.total,
          window: config.description || `${config.maxAttempts} requests per ${Math.round(config.windowMs / 60000)} minutes`
        });
      }
      
      if (loggingConfig.enabled && result.remaining < 3) {
        console.log(`⚠️ Rate limit warning: ${result.remaining} requests remaining for ${clientId}`);
      }
      
      next();
    } catch (error) {
      console.error("❌ Rate limiting error:", error);
      // Continue without rate limiting if there's an error
      next();
    }
  };
};

/**
 * Login-specific rate limiting middleware
 */
export const loginRateLimit = dynamicRateLimit('login');

/**
 * Password reset rate limiting middleware
 */
export const passwordResetRateLimit = dynamicRateLimit('passwordReset');

/**
 * General API rate limiting middleware
 */
export const generalRateLimit = dynamicRateLimit('general');

/**
 * Smart rate limiting that applies different limits based on endpoint
 */
export const smartRateLimit = (req, res, next) => {
  const { path, method } = req;
  
  // Apply specific rate limits based on endpoint
  if (path.includes('/auth/login')) {
    return loginRateLimit(req, res, next);
  } else if (path.includes('/auth/forgot-password') || path.includes('/auth/reset-password')) {
    return passwordResetRateLimit(req, res, next);
  } else {
    return generalRateLimit(req, res, next);
  }
};

/**
 * Rate limiting for authenticated users (stricter limits)
 */
export const authenticatedRateLimit = (req, res, next) => {
  if (req.user) {
    // Apply stricter limits for authenticated users
    const config = getRateLimitConfig('general');
    if (config) {
      // Reduce limit by 50% for authenticated users (more security)
      const strictConfig = {
        ...config,
        maxAttempts: Math.max(1, Math.floor(config.maxAttempts * 0.5))
      };
      
      const clientId = getClientId(req);
      const result = checkRateLimit(clientId, strictConfig);
      
      res.set({
        'X-RateLimit-Limit': result.total,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': new Date(result.resetTime).toISOString()
      });
      
      if (!result.allowed) {
        res.set('Retry-After', result.retryAfter);
        return res.status(429).json({
          success: false,
          message: "Too many requests for authenticated user",
          retryAfter: result.retryAfter,
          limit: result.total
        });
      }
    }
  }
  
  next();
};

/**
 * Reset rate limit for a specific client
 * @param {string} clientId - Client identifier
 */
export const resetRateLimit = (clientId) => {
  rateLimitStore.delete(clientId);
};

/**
 * Get rate limit status for a client
 * @param {string} clientId - Client identifier
 * @param {string} type - Rate limit type
 * @returns {Object} Rate limit status
 */
export const getRateLimitStatus = (clientId, type = 'general') => {
  const config = getRateLimitConfig(type);
  if (!config) return null;
  
  const key = clientId;
  const currentData = rateLimitStore.get(key);
  
  if (!currentData || currentData.expiresAt < Date.now()) {
    return {
      count: 0,
      limit: config.maxAttempts,
      remaining: config.maxAttempts,
      resetTime: null,
      windowMs: config.windowMs
    };
  }
  
  return {
    count: currentData.count,
    limit: config.maxAttempts,
    remaining: config.maxAttempts - currentData.count,
    resetTime: currentData.resetTime,
    windowMs: config.windowMs
  };
};

/**
 * Middleware to log rate limit violations
 */
export const rateLimitLogger = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    if (res.statusCode === 429) {
      const loggingConfig = getLoggingConfig();
      if (loggingConfig.enabled) {
        console.log(`🚫 Rate limit violation: ${req.method} ${req.path} from ${req.ip}`);
      }
    }
    originalSend.call(this, data);
  };
  
  next();
};
