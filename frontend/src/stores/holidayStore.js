import { create } from 'zustand';
import { holidayService } from '../services/holidayService';

export const useHolidayStore = create((set) => ({
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
        holidays: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || '국경일 목록을 불러오는데 실패했습니다';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  createHoliday: async (holidayData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await holidayService.createHoliday(holidayData);
      const newHoliday = response.data;
      
      // Add the new holiday to the list
      set((state) => ({
        holidays: [...state.holidays, newHoliday],
        isLoading: false,
        error: null,
      }));
      
      return { success: true, data: newHoliday };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || '국경일을 생성하는데 실패했습니다';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  updateHoliday: async (id, updateData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await holidayService.updateHoliday(id, updateData);
      const updatedHoliday = response.data;
      
      // Update the holiday in the list
      set((state) => ({
        holidays: state.holidays.map(holiday => 
          holiday.holidayId === id ? updatedHoliday : holiday
        ),
        isLoading: false,
        error: null,
      }));
      
      return { success: true, data: updatedHoliday };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || '국경일을 수정하는데 실패했습니다';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },
}));