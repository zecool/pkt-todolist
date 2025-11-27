const todoService = require('../todoService');
const { pool } = require('../../config/database');

// Mock 설정
jest.mock('../../config/database');

describe('todoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTodos', () => {
    const userId = 'user-123';
    const mockTodos = [
      { todo_id: 'todo-1', title: 'Test Todo 1', user_id: userId },
      { todo_id: 'todo-2', title: 'Test Todo 2', user_id: userId }
    ];

    test('사용자의 모든 할일 목록을 조회해야 함', async () => {
      pool.query.mockResolvedValue({ rows: mockTodos });

      const result = await todoService.getTodos(userId);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM todos WHERE user_id = $1'),
        expect.arrayContaining([userId])
      );
      expect(result).toEqual(mockTodos);
    });

    test('status 필터가 적용되어야 함', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      
      await todoService.getTodos(userId, { status: 'active' });

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('AND status = $2'),
        expect.arrayContaining([userId, 'active'])
      );
    });

    test('search 필터가 적용되어야 함', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      
      await todoService.getTodos(userId, { search: 'meeting' });

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('AND (title ILIKE $2 OR content ILIKE $2)'),
        expect.arrayContaining([userId, '%meeting%'])
      );
    });

    test('정렬 옵션이 적용되어야 함', async () => {
      pool.query.mockResolvedValue({ rows: [] });
      
      await todoService.getTodos(userId, { sortBy: 'dueDate', order: 'asc' });

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY due_date ASC'),
        expect.arrayContaining([userId])
      );
    });
  });

  describe('getTodoById', () => {
    const userId = 'user-123';
    const todoId = 'todo-1';
    const mockTodo = { todo_id: todoId, title: 'Test Todo', user_id: userId };

    test('특정 할일을 조회해야 함', async () => {
      pool.query.mockResolvedValue({ rows: [mockTodo] });

      const result = await todoService.getTodoById(todoId, userId);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE todo_id = $1 AND user_id = $2'),
        [todoId, userId]
      );
      expect(result).toEqual(mockTodo);
    });

    test('할일이 없으면 에러를 던져야 함', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      await expect(todoService.getTodoById(todoId, userId))
        .rejects.toThrow('할일을 찾을 수 없습니다');
    });
  });

  describe('createTodo', () => {
    const userId = 'user-123';
    const todoData = {
      title: 'New Todo',
      content: 'Content',
      startDate: '2025-11-27',
      dueDate: '2025-11-28'
    };

    test('새로운 할일을 생성해야 함', async () => {
      const createdTodo = { ...todoData, todo_id: 'new-id', user_id: userId };
      pool.query.mockResolvedValue({ rows: [createdTodo] });

      const result = await todoService.createTodo(userId, todoData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO todos'),
        [userId, todoData.title, todoData.content, todoData.startDate, todoData.dueDate]
      );
      expect(result).toEqual(createdTodo);
    });

    test('제목이 없으면 에러를 던져야 함', async () => {
      await expect(todoService.createTodo(userId, {}))
        .rejects.toThrow('제목은 필수입니다');
    });

    test('만료일이 시작일보다 빠르면 에러를 던져야 함', async () => {
      const invalidData = {
        title: 'Test',
        startDate: '2025-11-28',
        dueDate: '2025-11-27'
      };

      await expect(todoService.createTodo(userId, invalidData))
        .rejects.toThrow('만료일은 시작일 이후여야 합니다');
    });
  });

  describe('updateTodo', () => {
    const userId = 'user-123';
    const todoId = 'todo-1';
    const updateData = { title: 'Updated Title' };
    const mockTodo = { todo_id: todoId, user_id: userId, title: 'Old Title' };

    test('할일을 수정해야 함', async () => {
      // getTodoById mock
      pool.query
        .mockResolvedValueOnce({ rows: [mockTodo] }) // getTodoById
        .mockResolvedValueOnce({ rows: [{ ...mockTodo, ...updateData }] }); // update

      const result = await todoService.updateTodo(todoId, userId, updateData);

      expect(result.title).toBe(updateData.title);
    });

    test('날짜 유효성 검사를 수행해야 함', async () => {
       pool.query.mockResolvedValue({ rows: [mockTodo] });
       
       const invalidData = {
         startDate: '2025-11-28',
         dueDate: '2025-11-27'
       };

       await expect(todoService.updateTodo(todoId, userId, invalidData))
         .rejects.toThrow('만료일은 시작일 이후여야 합니다');
    });
  });

  describe('deleteTodo', () => {
    const userId = 'user-123';
    const todoId = 'todo-1';

    test('할일을 휴지통으로 이동해야 함', async () => {
      pool.query.mockResolvedValue({ rows: [{ todo_id: todoId, status: 'deleted' }] });

      const result = await todoService.deleteTodo(todoId, userId);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE todos SET status = 'deleted'"),
        expect.arrayContaining([todoId, userId])
      );
      expect(result.status).toBe('deleted');
    });

    test('이미 삭제된 할일이거나 없으면 에러를 던져야 함', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      await expect(todoService.deleteTodo(todoId, userId))
        .rejects.toThrow('할일을 찾을 수 없거나 이미 삭제된 할일입니다');
    });
  });
});
