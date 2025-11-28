import React, { useEffect, useState } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import useHolidayStore from '../stores/holidayStore';
import HolidayCard from '../components/holiday/HolidayCard';

const HolidayPage = () => {
  const { 
    holidays, 
    isLoading, 
    error, 
    fetchHolidays 
  } = useHolidayStore();

  // Initialize filters
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(''); // Empty string means all months

  // Fetch holidays when component mounts or filters change
  useEffect(() => {
    fetchHolidays(year, month || undefined);
  }, [year, month, fetchHolidays]);

  // Handle year change
  const handleYearChange = (e) => {
    setYear(Number(e.target.value));
  };

  // Handle month change
  const handleMonthChange = (e) => {
    setMonth(e.target.value === 'all' ? '' : Number(e.target.value));
  };

  // Generate year options (current year and a few years around it)
  const yearOptions = [];
  for (let i = currentYear - 2; i <= currentYear + 2; i++) {
    yearOptions.push(i);
  }

  return (
    <div className="w-full max-w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">국경일</h1>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              연도
            </label>
            <select
              id="year"
              value={year}
              onChange={handleYearChange}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {yearOptions.map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}년
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              월
            </label>
            <select
              id="month"
              value={month || 'all'}
              onChange={handleMonthChange}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">전체 월</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}월
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">에러 발생</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Holiday List */}
      {!isLoading && (
        <div className="space-y-4">
          {holidays.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Calendar className="text-gray-400" size={24} />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                선택한 기간에 국경일이 없습니다
              </h3>
            </div>
          ) : (
            // Group holidays by month
            (() => {
              // Create a map to group holidays by month
              const holidaysByMonth = {};
              holidays.forEach(holiday => {
                const month = new Date(holiday.date).getMonth() + 1; // getMonth() is 0-indexed
                if (!holidaysByMonth[month]) {
                  holidaysByMonth[month] = [];
                }
                holidaysByMonth[month].push(holiday);
              });

              return Object.entries(holidaysByMonth).map(([month, monthHolidays]) => (
                <div key={month} className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    {month}월
                  </h2>
                  <div className="space-y-3">
                    {monthHolidays.map(holiday => (
                      <HolidayCard key={holiday.holidayId} holiday={holiday} />
                    ))}
                  </div>
                </div>
              ));
            })()
          )}
        </div>
      )}
    </div>
  );
};

export default HolidayPage;