import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path'; // Import dirname explicitly
import request from 'supertest';
import express from 'express';
import { generateAccessToken } from '../src/utils/jwtHelper.js'; // Assuming it's in a sibling directory
import jwt from 'jsonwebtoken'; // For testing expired token

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Mocking req.user type for JSDoc or clarity, not strictly needed for test
/**
 * @typedef {object} RequestUser
 * @property {string} userId
 * @property {string} role
 */

// Create a dummy Express app for testing middleware
const app = express();
app.use(express.json());

// Dynamic import for the middleware to be tested
let authMiddlewareModule;
let authenticate;
let requireAdmin;

// Test setup (will be run before all tests)
beforeAll(async () => {
    const middlewarePath = path.join(__dirname, '../src/middlewares/authMiddleware.js');
    if (!fs.existsSync(middlewarePath)) {
        // Create a dummy file if it doesn't exist to prevent test crash
        fs.writeFileSync(middlewarePath, `
export const authenticate = (req, res, next) => { next(new Error('Auth middleware not implemented')); };
export const requireAdmin = (req, res, next) => { next(new Error('Admin middleware not implemented')); };
        `);
    }
    authMiddlewareModule = await import(`file://${middlewarePath}`);
    authenticate = authMiddlewareModule.authenticate;
    requireAdmin = authMiddlewareModule.requireAdmin;

    // Use the middlewares in our dummy app
    app.get('/protected', authenticate, (req, res) => res.status(200).json({ message: 'Access granted', user: req.user }));
    app.get('/admin', authenticate, requireAdmin, (req, res) => res.status(200).json({ message: 'Admin access granted', user: req.user }));
    app.get('/public', (req, res) => res.status(200).json({ message: 'Public content' }));

    // Global error handler for middleware errors
    // This part should be aligned with Task 2.7, but for testing just mimic the output
    app.use((err, req, res, next) => {
        if (err.message === 'Authentication token required') {
            return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: err.message } });
        }
        if (err.message === 'Token format is Bearer <token>') {
            return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: err.message } });
        }
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ success: false, error: { code: 'TOKEN_EXPIRED', message: 'Token expired' } });
        }
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } });
        }
        if (err.message === 'Admin access required') {
            return res.status(403).json({ success: false, error: { code: 'ADMIN_REQUIRED', message: err.message } });
        }
        res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } });
    });
});

describe('Task 2.6: Auth Middleware', () => {

    // Test authenticate middleware
    describe('authenticate middleware', () => {
        test('should allow access with a valid token', async () => {
            const userPayload = { userId: 'user123', role: 'user' };
            const token = generateAccessToken(userPayload);
            const res = await request(app)
                .get('/protected')
                .set('Authorization', `Bearer ${token}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Access granted');
            expect(res.body.user).toHaveProperty('userId', userPayload.userId);
            expect(res.body.user).toHaveProperty('role', userPayload.role);
        });

        test('should return 401 if no token is provided', async () => {
            const res = await request(app).get('/protected');
            expect(res.statusCode).toEqual(401);
            expect(res.body.error.message).toEqual('Authentication token required');
        });

        test('should return 401 if token is in invalid format', async () => {
            const res = await request(app)
                .get('/protected')
                .set('Authorization', 'InvalidToken');
            expect(res.statusCode).toEqual(401);
            expect(res.body.error.message).toEqual('Authentication token required'); // Middleware should return 'Authentication token required'
        });

        test('should return 401 if token is invalid', async () => {
            const res = await request(app)
                .get('/protected')
                .set('Authorization', 'Bearer invalid.jwt.token');
            expect(res.statusCode).toEqual(401);
            expect(res.body.error.code).toEqual('INVALID_TOKEN'); 
        });

        test('should return 401 if token is expired', async () => {
            // Temporarily use a very short expiry for testing expired token
            const expiredToken = jwt.sign({ userId: 'expired', role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1ms' });
            await new Promise(resolve => setTimeout(resolve, 10)); // Wait for token to expire

            const res = await request(app)
                .get('/protected')
                .set('Authorization', `Bearer ${expiredToken}`);
            expect(res.statusCode).toEqual(401);
            expect(res.body.error.code).toEqual('TOKEN_EXPIRED');
        });
    });

    // Test requireAdmin middleware
    describe('requireAdmin middleware', () => {
        test('should allow admin user to access admin route', async () => {
            const adminPayload = { userId: 'admin123', role: 'admin' };
            const token = generateAccessToken(adminPayload);
            const res = await request(app)
                .get('/admin')
                .set('Authorization', `Bearer ${token}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Admin access granted');
            expect(res.body.user).toHaveProperty('userId', adminPayload.userId);
            expect(res.body.user).toHaveProperty('role', adminPayload.role);
        });

        test('should return 403 if non-admin user tries to access admin route', async () => {
            const userPayload = { userId: 'user123', role: 'user' };
            const token = generateAccessToken(userPayload);
            const res = await request(app)
                .get('/admin')
                .set('Authorization', `Bearer ${token}`);
            
            expect(res.statusCode).toEqual(403);
            expect(res.body.error.code).toEqual('ADMIN_REQUIRED');
        });

        test('should return 401 if unauthenticated user tries to access admin route', async () => {
            const res = await request(app).get('/admin');
            expect(res.statusCode).toEqual(401);
            expect(res.body.error.message).toEqual('Authentication token required');
        });
    });

    describe('Public route', () => {
        test('should allow access to public route without token', async () => {
            const res = await request(app).get('/public');
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toEqual('Public content');
        });
    });

});
