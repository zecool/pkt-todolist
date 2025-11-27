const request = require('supertest');
const express = require('express');
const todoRoutes = require('../todoRoutes');
const todoService = require('../../services/todoService');
const { authenticate } = require('../../middlewares/authMiddleware');

// Mock settings
jest.mock('../../services/todoService');
jest.mock('../../middlewares/authMiddleware');

describe('todoRoutes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/todos', todoRoutes);

    // Mock auth middleware
    authenticate.mockImplementation((req, res, next) => {
      req.user = { userId: 'user-123' };
      next();
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/todos', () => {
    test('할일 목록을 조회해야 함', async () => {
      const mockTodos = [{ id: 1, title: 'Todo' }];
      todoService.getTodos.mockResolvedValue(mockTodos);

      const response = await request(app)
        .get('/api/todos')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockTodos);
    });
  });

  describe('POST /api/todos', () => {
    test('할일을 생성해야 함', async () => {
      const newTodo = { title: 'New Todo' };
      todoService.createTodo.mockResolvedValue({ ...newTodo, id: 1 });

      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    test('제목이 없으면 400을 반환해야 함', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({})
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
