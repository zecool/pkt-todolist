import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../src/app.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock Prisma calls to avoid DB dependency in this specific test suite
// OR use a test database. For simplicity and speed, we will use the actual DB but mock data where possible,
// OR rely on the fact that we are running in a local dev environment where DB is available.
// However, mocking is safer for unit tests.
// Let's try integration testing with the local DB as per the environment setup instructions.
// We need to clean up the user after tests.

describe('Task 2.8: Auth API', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    username: 'Test User',
  };

  let accessToken;
  let refreshToken;

  afterAll(async () => {
    // Cleanup
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  test('POST /api/auth/register should create a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('userId');
    expect(res.body.data.email).toBe(testUser.email);
    expect(res.body.data).not.toHaveProperty('password'); // Should not return password
  });

  test('POST /api/auth/register should fail with duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(409);
    expect(res.body.error.code).toBe('EMAIL_EXISTS');
  });

  test('POST /api/auth/login should return tokens', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    expect(res.body.data.user.email).toBe(testUser.email);

    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  test('POST /api/auth/login should fail with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  test('POST /api/auth/refresh should return new access token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data.accessToken).not.toBe(accessToken);
  });

  test('POST /api/auth/refresh should fail with invalid token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'invalid-token' });

    expect(res.statusCode).toEqual(401);
    expect(res.body.error.code).toBe('INVALID_TOKEN');
  });

  test('POST /api/auth/logout should return success', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});
