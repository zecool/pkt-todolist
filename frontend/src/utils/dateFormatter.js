import { format, isToday, isThisWeek, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale'; // Korean locale

/**
 * Format date to YYYY-MM-DD string
 * @param {Date | string} date 
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

/**
 * Format date to readable format
 * @param {Date | string} date 
 * @param {string} dateFormat 
 * @returns {string}
 */
export const formatReadableDate = (date, dateFormat = 'yyyy년 M월 d일') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, dateFormat, { locale: ko });
};

/**
 * Format date range for display
 * @param {string | Date} startDate 
 * @param {string | Date} endDate 
 * @returns {string}
 */
export const formatDueDateRange = (startDate, endDate) => {
  if (!startDate && !endDate) return '';
  
  let startFormatted = '';
  let endFormatted = '';
  
  if (startDate) {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    startFormatted = format(start, 'MM-dd');
  }
  
  if (endDate) {
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    endFormatted = format(end, 'MM-dd');
  }
  
  if (startDate && endDate) {
    return `${startFormatted} ~ ${endFormatted}`;
  } else if (startDate) {
    return `시작: ${startFormatted}`;
  } else if (endDate) {
    return `~ ${endFormatted}`;
  }
  
  return '';
};

/**
 * Check if a date is today
 * @param {Date | string} date 
 * @returns {boolean}
 */
export const isDateToday = (date) => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isToday(dateObj);
};

/**
 * Check if a date is this week
 * @param {Date | string} date 
 * @returns {boolean}
 */
export const isDateThisWeek = (date) => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isThisWeek(dateObj);
};

/**
 * Get relative time from now
 * @param {Date | string} date 
 * @returns {string}
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = dateObj - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return '오늘';
  } else if (diffDays === 1) {
    return '내일';
  } else if (diffDays === -1) {
    return '어제';
  } else if (diffDays > 0) {
    return `${diffDays}일 후`;
  } else {
    return `${Math.abs(diffDays)}일 전`;
  }
};