import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/jwtHelper.js';

const prisma = new PrismaClient();

/**
 * Registers a new user.
 * @param {string} email
 * @param {string} password
 * @param {string} username
 * @returns {Promise<object>} Created user data
 */
export const register = async (email, password, username) => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const error = new Error('Email already exists');
    error.statusCode = 409;
    error.code = 'EMAIL_EXISTS';
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
      role: 'user',
    },
    select: {
      userId: true,
      email: true,
      username: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

/**
 * Logs in a user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} Tokens and user data
 */
export const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  const tokenPayload = { userId: user.userId, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    accessToken,
    refreshToken,
    user: {
      userId: user.userId,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  };
};

/**
 * Refreshes access token.
 * @param {string} refreshToken
 * @returns {Promise<string>} New access token
 */
export const refreshAccessToken = async (refreshToken) => {
  // Verify refresh token (this throws if invalid/expired)
  const { verifyRefreshToken } = await import('../utils/jwtHelper.js'); // Use dynamic import to avoid circular dependency if any, or just standard import if fine.
  // Actually jwtHelper is pure utility, so standard import is fine.
  
  // We need to decode/verify to get userId to generate new token
  // In jwtHelper verifyRefreshToken returns decoded payload or throws
  let decoded;
  try {
      // Re-import to ensure we use the function
      const { verifyRefreshToken: verify } = await import('../utils/jwtHelper.js');
      decoded = verify(refreshToken);
  } catch (err) {
      const error = new Error('Invalid refresh token');
      error.statusCode = 401;
      error.code = 'INVALID_TOKEN';
      throw error;
  }

  // Optional: Check if user still exists or is not banned
  const user = await prisma.user.findUnique({ where: { userId: decoded.userId } });
  if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      error.code = 'USER_NOT_FOUND';
      throw error;
  }

  const accessToken = generateAccessToken({ userId: user.userId, role: user.role });
  return accessToken;
};
