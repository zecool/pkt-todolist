const request = require('supertest');
const express = require('express');
const holidayRoutes = require('../holidayRoutes');
const holidayService = require('../../services/holidayService');
const { authenticate, requireAdmin } = require('../../middlewares/authMiddleware');

jest.mock('../../services/holidayService');
jest.mock('../../middlewares/authMiddleware');

describe('holidayRoutes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/holidays', holidayRoutes);

    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 'user-123' };
      next();
    });

    requireAdmin.mockImplementation((req, res, next) => {
      next();
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/holidays', () => {
    test('국경일 목록을 조회해야 함', async () => {
      const mockHolidays = [{ id: 1, title: 'Holiday' }];
      holidayService.getHolidays.mockResolvedValue(mockHolidays);

      const response = await request(app)
        .get('/api/holidays')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockHolidays);
    });
  });

  describe('POST /api/holidays', () => {
    test('국경일을 생성해야 함', async () => {
      const newHoliday = { title: 'New Holiday', date: '2025-01-01' };
      holidayService.createHoliday.mockResolvedValue({ ...newHoliday, id: 1 });

      const response = await request(app)
        .post('/api/holidays')
        .send(newHoliday)
        .expect(201);

      expect(response.body.success).toBe(true);
    });
  });
});
