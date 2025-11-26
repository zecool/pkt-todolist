import { body, validationResult } from 'express-validator';
import * as authService from '../services/authService.js';

export const register = [
  // Validation
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('username').notEmpty().withMessage('Username is required'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
          success: false, 
          error: { 
              code: 'BAD_REQUEST', 
              message: errors.array().map(e => e.msg).join(', ') 
          } 
      });
    }

    try {
      const { email, password, username } = req.body;
      const user = await authService.register(email, password, username);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },
];

export const login = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            error: { 
                code: 'BAD_REQUEST', 
                message: errors.array().map(e => e.msg).join(', ') 
            } 
        });
    }

    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
];

export const refresh = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Refresh token required' } });
  }

  try {
    const accessToken = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({ success: true, data: { accessToken } });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  // Client-side action mostly, but we can return success
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
