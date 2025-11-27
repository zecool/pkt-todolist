const holidayController = require('../holidayController');
const holidayService = require('../../services/holidayService');
const { validationResult } = require('express-validator');

jest.mock('../../services/holidayService');
jest.mock('express-validator');

describe('holidayController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getHolidays', () => {
    test('성공적으로 국경일 목록을 조회해야 함', async () => {
      const mockHolidays = [{ id: 1, title: 'Holiday' }];
      holidayService.getHolidays.mockResolvedValue(mockHolidays);

      await holidayController.getHolidays(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockHolidays
      });
    });

    test('잘못된 월 입력 시 400을 반환해야 함', async () => {
      req.query.month = '13';

      await holidayController.getHolidays(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: 'BAD_REQUEST' })
      }));
    });
  });

  describe('createHoliday', () => {
    beforeEach(() => {
      validationResult.mockReturnValue({ isEmpty: () => true });
    });

    test('성공적으로 국경일을 생성해야 함', async () => {
      req.body = { title: 'Holiday', date: '2025-01-01' };
      const createdHoliday = { ...req.body, id: 1 };
      holidayService.createHoliday.mockResolvedValue(createdHoliday);

      await holidayController.createHoliday(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: createdHoliday
      });
    });
  });

  describe('updateHoliday', () => {
    beforeEach(() => {
      validationResult.mockReturnValue({ isEmpty: () => true });
    });

    test('성공적으로 국경일을 수정해야 함', async () => {
      req.params.id = 'h-1';
      req.body = { title: 'Updated' };
      holidayService.updateHoliday.mockResolvedValue(req.body);

      await holidayController.updateHoliday(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('국경일이 없으면 404를 반환해야 함', async () => {
      holidayService.updateHoliday.mockRejectedValue(new Error('국경일을 찾을 수 없습니다'));

      await holidayController.updateHoliday(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
