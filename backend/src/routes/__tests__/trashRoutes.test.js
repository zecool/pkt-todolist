const request = require('supertest');
const express = require('express');
const trashRoutes = require('../trashRoutes');
const trashService = require('../../services/trashService');
const { authenticate } = require('../../middlewares/authMiddleware');

jest.mock('../../services/trashService');
jest.mock('../../middlewares/authMiddleware');

describe('trashRoutes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/trash', trashRoutes);

    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 'user-123' };
      next();
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/trash', () => {
    test('휴지통 목록을 조회해야 함', async () => {
      const mockTrash = [{ id: 1, status: 'deleted' }];
      trashService.getTrash.mockResolvedValue(mockTrash);

      const response = await request(app)
        .get('/api/trash')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockTrash);
    });
  });
});
