import jwt from 'jsonwebtoken';

// Extend the Request type with user property
/**
 * @typedef {object} RequestUser
 * @property {string} userId
 * @property {string} role
 */

/**
 * @typedef {import('express').Request & { user?: RequestUser }} AuthenticatedRequest
 */

import { verifyAccessToken } from '../utils/jwtHelper.js'; // Adjust path as necessary

/**
 * Middleware to authenticate requests using JWT.
 * Attaches decoded user information to `req.user`.
 * @param {AuthenticatedRequest} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication token required' } });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    // Attach user information to the request
    req.user = decoded; // Ensure decoded payload matches RequestUser type
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, error: { code: 'TOKEN_EXPIRED', message: 'Token expired' } });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } });
    } else {
      // Generic JWT error or other unexpected errors
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication failed' } });
    }
  }
};

/**
 * Middleware to restrict access to admin users only.
 * Requires `authenticate` middleware to be run before this.
 * @param {AuthenticatedRequest} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: { code: 'ADMIN_REQUIRED', message: 'Admin access required' } });
  }
  next();
};
