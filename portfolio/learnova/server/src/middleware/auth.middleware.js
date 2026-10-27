import { verifyToken } from '../utils/token.js';
import { User } from '../models/user.model.js';

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  if (req.cookies?.token) {
    return req.cookies.token;
  }

  return null;
};

export const attachUser = async (req, _res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded?.id) {
      return next();
    }

    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    }
  } catch (error) {
    // token invalid; ignore and continue unauthenticated
  }

  next();
};

export const requireAuth = async (req, res, next) => {
  if (!req.user) {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      const decoded = verifyToken(token);
      if (!decoded?.id) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  next();
};

export const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    return requireAuth(req, res, (err) => {
      if (err) {
        return next(err);
      }

      if (!req.user) {
        return; // response already handled in requireAuth
      }

      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      next();
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};

