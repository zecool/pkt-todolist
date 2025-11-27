const holidayService = require('../holidayService');
const { pool } = require('../../config/database');

jest.mock('../../config/database');

describe('holidayService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHolidays', () => {
    const mockHolidays = [
      { holiday_id: 'h-1', title: 'New Year', date: '2025-01-01' }
    ];

    test('특정 연도의 국경일을 조회해야 함', async () => {
      pool.query.mockResolvedValue({ rows: mockHolidays });

      const result = await holidayService.getHolidays(2025);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('EXTRACT(YEAR FROM date) = $1'),
        expect.arrayContaining([2025])
      );
      expect(result).toEqual(mockHolidays);
    });

    test('특정 연도와 월의 국경일을 조회해야 함', async () => {
      pool.query.mockResolvedValue({ rows: mockHolidays });

      const result = await holidayService.getHolidays(2025, 1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('AND EXTRACT(MONTH FROM date) = $2'),
        expect.arrayContaining([2025, 1])
      );
    });
  });

  describe('createHoliday', () => {
    const holidayData = {
      title: 'New Holiday',
      date: '2025-05-05',
      isRecurring: true
    };

    test('새로운 국경일을 생성해야 함', async () => {
      const createdHoliday = { ...holidayData, holiday_id: 'new-id' };
      pool.query.mockResolvedValue({ rows: [createdHoliday] });

      const result = await holidayService.createHoliday(holidayData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO holidays'),
        [holidayData.title, holidayData.date, null, holidayData.isRecurring]
      );
      expect(result).toEqual(createdHoliday);
    });
  });

  describe('updateHoliday', () => {
    const holidayId = 'h-1';
    const updateData = { title: 'Updated Holiday' };
    const mockHoliday = { holiday_id: holidayId, title: 'Old Title' };

    test('국경일을 수정해야 함', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [mockHoliday] }) // check existence
        .mockResolvedValueOnce({ rows: [{ ...mockHoliday, ...updateData }] }); // update

      const result = await holidayService.updateHoliday(holidayId, updateData);

      expect(result.title).toBe(updateData.title);
    });

    test('국경일이 없으면 에러를 던져야 함', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      await expect(holidayService.updateHoliday(holidayId, updateData))
        .rejects.toThrow('국경일을 찾을 수 없습니다');
    });
  });
});
