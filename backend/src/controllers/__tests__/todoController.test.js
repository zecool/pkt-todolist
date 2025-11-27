const todoController = require('../todoController');
const todoService = require('../../services/todoService');
const { validationResult } = require('express-validator');

jest.mock('../../services/todoService');
jest.mock('express-validator');

describe('todoController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 'user-123' },
      query: {},
      params: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getTodos', () => {
    test('성공적으로 할일 목록을 조회해야 함', async () => {
      const mockTodos = [{ id: 1, title: 'Todo' }];
      todoService.getTodos.mockResolvedValue(mockTodos);

      await todoController.getTodos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTodos
      });
    });

    test('에러 발생 시 500을 반환해야 함', async () => {
      todoService.getTodos.mockRejectedValue(new Error('Service Error'));

      await todoController.getTodos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'INTERNAL_ERROR' })
      }));
    });
  });

  describe('createTodo', () => {
    beforeEach(() => {
      validationResult.mockReturnValue({ isEmpty: () => true });
    });

    test('성공적으로 할일을 생성해야 함', async () => {
      req.body = { title: 'New Todo' };
      const createdTodo = { id: 1, ...req.body };
      todoService.createTodo.mockResolvedValue(createdTodo);

      await todoController.createTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: createdTodo
      });
    });

    test('유효성 검사 실패 시 400을 반환해야 함', async () => {
      validationResult.mockReturnValue({ 
        isEmpty: () => false, 
        array: () => [{ msg: 'Error' }] 
      });

      await todoController.createTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'VALIDATION_ERROR' })
      }));
    });

    test('제목이 없을 때 서비스 에러 처리', async () => {
      todoService.createTodo.mockRejectedValue(new Error('제목은 필수입니다'));

      await todoController.createTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'TITLE_REQUIRED' })
      }));
    });
  });

  describe('updateTodo', () => {
     beforeEach(() => {
      validationResult.mockReturnValue({ isEmpty: () => true });
    });

    test('성공적으로 할일을 수정해야 함', async () => {
      req.params.id = 'todo-1';
      req.body = { title: 'Updated' };
      todoService.updateTodo.mockResolvedValue(req.body);

      await todoController.updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('할일이 없으면 404를 반환해야 함', async () => {
      todoService.updateTodo.mockRejectedValue(new Error('할일을 찾을 수 없거나 권한이 없습니다'));

      await todoController.updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'TODO_NOT_FOUND' })
      }));
    });
  });

  describe('deleteTodo', () => {
    test('성공적으로 할일을 삭제해야 함', async () => {
      req.params.id = 'todo-1';
      todoService.deleteTodo.mockResolvedValue({ status: 'deleted' });

      await todoController.deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
