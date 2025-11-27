import React, { useState, useEffect } from 'react';
import { useHolidayStore } from '../stores/holidayStore';
import HolidayItem from '../components/holiday/HolidayItem';
import Loading from '../components/common/Loading';

const HolidayPage = () => {
  const { holidays, isLoading, fetchHolidays } = useHolidayStore();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-12

  useEffect(() => {
    fetchHolidays(year, month);
  }, [year, month, fetchHolidays]);

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
  };

  // Generate year options (current year ± 2)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#212121]">국경일</h1>
        <p className="text-[#757575] mt-1">연도 및 월별 공공국경일을 확인하세요</p>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-[#212121] mb-1">연도</label>
          <select
            value={year}
            onChange={handleYearChange}
            className="px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C73C] focus:ring-offset-2"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}년</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#212121] mb-1">월</label>
          <select
            value={month}
            onChange={handleMonthChange}
            className="px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C73C] focus:ring-offset-2"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{m}월</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loading message="국경일 정보를 불러오는 중..." />
        </div>
      ) : holidays.length > 0 ? (
        <div className="space-y-4">
          {holidays.map(holiday => (
            <HolidayItem key={holiday.holidayId} holiday={holiday} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-[#757575]">
          {year}년 {month}월에 해당하는 국경일이 없습니다.
        </div>
      )}
    </div>
  );
};

export default HolidayPage;