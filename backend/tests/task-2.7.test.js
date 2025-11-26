import request from 'supertest';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dynamic import for the middleware to be tested
let errorHandler;

// Test setup
beforeAll(async () => {
    const middlewarePath = path.join(__dirname, '../src/middlewares/errorMiddleware.js');
    if (!fs.existsSync(middlewarePath)) {
        // Create a dummy file if it doesn't exist to prevent test crash, 
        // although the goal is to implement it.
        // This allows the test file to exist before implementation.
        fs.writeFileSync(middlewarePath, `
export const errorHandler = (err, req, res, next) => { 
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Not implemented' } }); 
};
        `);
    }
    const module = await import(`file://${middlewarePath}`);
    errorHandler = module.errorHandler;
});

describe('Task 2.7: Error Middleware', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        
        // Routes that trigger errors
        app.get('/error', (req, res, next) => {
            const error = new Error('Something went wrong');
            error.statusCode = 400;
            error.code = 'BAD_REQUEST';
            next(error);
        });

        app.get('/unknown-error', (req, res, next) => {
            next(new Error('Unknown error'));
        });

        // Use the error handler
        app.use((err, req, res, next) => errorHandler(err, req, res, next));
    });

    test('should format known error correctly', async () => {
        const res = await request(app).get('/error');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            success: false,
            error: {
                code: 'BAD_REQUEST',
                message: 'Something went wrong'
            }
        });
    });

    test('should handle unknown errors with 500 status', async () => {
        const res = await request(app).get('/unknown-error');
        expect(res.statusCode).toEqual(500);
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe('INTERNAL_ERROR');
    });

    // We can't easily test console.error or stack trace visibility in this simple integration test 
    // without mocking process.env or console.error, but this covers the core requirement.
});
