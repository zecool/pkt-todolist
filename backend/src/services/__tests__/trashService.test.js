const trashService = require('../trashService');
const { pool } = require('../../config/database');

jest.mock('../../config/database');

describe('trashService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTrash', () => {
    const userId = 'user-123';
    const mockTrashItems = [
      { todo_id: 'todo-1', title: 'Deleted Todo 1', status: 'deleted' },
      { todo_id: 'todo-2', title: 'Deleted Todo 2', status: 'deleted' }
    ];

    test('삭제된 할일 목록을 조회해야 함', async () => {
      pool.query.mockResolvedValue({ rows: mockTrashItems });

      const result = await trashService.getTrash(userId);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('status = $2'),
        [userId, 'deleted']
      );
      expect(result).toEqual(mockTrashItems);
    });
  });

  describe('permanentlyDelete', () => {
    const userId = 'user-123';
    const todoId = 'todo-1';

    test('할일을 영구 삭제해야 함', async () => {
      pool.query.mockResolvedValue({ rows: [{ todo_id: todoId }] });

      const result = await trashService.permanentlyDelete(todoId, userId);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM todos'),
        [todoId, userId, 'deleted']
      );
      expect(result).toBe(true);
    });

    test('할일이 없거나 deleted 상태가 아니면 에러를 던져야 함', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      await expect(trashService.permanentlyDelete(todoId, userId))
        .rejects.toThrow('할일을 찾을 수 없거나 영구 삭제할 수 없는 상태입니다');
    });
  });
});
