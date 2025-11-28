import { format, parseISO, isToday, isThisWeek, isAfter, isBefore, isEqual } from 'date-fns';
import { ko } from 'date-fns/locale';

// Format date to YYYY-MM-DD
export const formatDate = (date) => {
  if (!date) return '';
  return format(parseISO(date), 'yyyy-MM-dd');
};

// Format date to readable format
export const formatReadableDate = (date) => {
  if (!date) return '';
  return format(parseISO(date), 'yyyy년 MM월 dd일', { locale: ko });
};

// Format date to weekday format
export const formatWeekdayDate = (date) => {
  if (!date) return '';
  return format(parseISO(date), 'MM/dd (eee)', { locale: ko });
};

// Check if date is today
export const isDateToday = (date) => {
  if (!date) return false;
  return isToday(parseISO(date));
};

// Check if date is this week
export const isDateThisWeek = (date) => {
  if (!date) return false;
  return isThisWeek(parseISO(date));
};

// Compare dates (date1 < date2)
export const isDateBefore = (date1, date2) => {
  if (!date1 || !date2) return false;
  return isBefore(parseISO(date1), parseISO(date2));
};

// Compare dates (date1 > date2)
export const isDateAfter = (date1, date2) => {
  if (!date1 || !date2) return false;
  return isAfter(parseISO(date1), parseISO(date2));
};

// Compare dates (date1 === date2)
export const isDateEqual = (date1, date2) => {
  if (!date1 || !date2) return false;
  return isEqual(parseISO(date1), parseISO(date2));
};

// Format date range (start to end date)
export const formatDateRange = (startDate, endDate) => {
  if (!startDate && !endDate) return '';
  if (!startDate) return `~ ${formatWeekdayDate(endDate)}`;
  if (!endDate) return `${formatWeekdayDate(startDate)} ~`;
  return `${formatWeekdayDate(startDate)} ~ ${formatWeekdayDate(endDate)}`;
};

// Check if date is overdue (past due and not completed)
export const isDateOverdue = (dueDate, isCompleted) => {
  if (!dueDate || isCompleted) return false;
  const due = parseISO(dueDate);
  const now = new Date();
  return isBefore(due, now);
};