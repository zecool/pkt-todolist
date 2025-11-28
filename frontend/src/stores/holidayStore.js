import { create } from 'zustand';
import { holidayService } from '../services/holidayService';

// Holiday store using Zustand
const useHolidayStore = create((set, get) => ({
  // State
  holidays: [],
  isLoading: false,
  error: null,

  // Actions
  fetchHolidays: async (year, month) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await holidayService.getHolidays(year, month);
      
      set({
        holidays: response.data || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.error?.message || error.message || 'Failed to fetch holidays',
      });
    }
  },

  // Get holidays for a specific year
  getHolidaysByYear: (year) => {
    return get().holidays.filter(holiday => {
      const holidayYear = new Date(holiday.date).getFullYear();
      return holidayYear === year;
    });
  },

  // Get holidays for a specific month
  getHolidaysByMonth: (month) => {
    return get().holidays.filter(holiday => {
      const holidayMonth = new Date(holiday.date).getMonth() + 1; // getMonth() is 0-indexed
      return holidayMonth === month;
    });
  },

  // Get holidays between two dates
  getHolidaysBetween: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return get().holidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate >= start && holidayDate <= end;
    });
  },

  // Check if a date is a holiday
  isHoliday: (date) => {
    const checkDate = new Date(date);
    return get().holidays.some(holiday => {
      const holidayDate = new Date(holiday.date);
      return (
        holidayDate.getDate() === checkDate.getDate() &&
        holidayDate.getMonth() === checkDate.getMonth() &&
        holidayDate.getFullYear() === checkDate.getFullYear()
      );
    });
  },
}));

export default useHolidayStore;