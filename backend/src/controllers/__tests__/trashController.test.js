const trashController = require('../trashController');
const trashService = require('../../services/trashService');

jest.mock('../../services/trashService');

describe('trashController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { userId: 'user-123' },
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getTrash', () => {
    test('성공적으로 휴지통 목록을 조회해야 함', async () => {
      const mockTrash = [{ id: 1, status: 'deleted' }];
      trashService.getTrash.mockResolvedValue(mockTrash);

      await trashController.getTrash(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTrash
      });
    });
  });

  describe('permanentlyDelete', () => {
    test('성공적으로 영구 삭제해야 함', async () => {
      req.params.id = 'todo-1';
      trashService.permanentlyDelete.mockResolvedValue(true);

      await trashController.permanentlyDelete(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('할일이 없으면 404를 반환해야 함', async () => {
      req.params.id = 'todo-1';
      trashService.permanentlyDelete.mockRejectedValue(new Error('할일을 찾을 수 없거나 영구 삭제할 수 없는 상태입니다'));

      await trashController.permanentlyDelete(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'TODO_NOT_FOUND' })
      }));
    });
  });
});
