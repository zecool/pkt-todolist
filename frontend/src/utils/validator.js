/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password 
 * @returns {boolean}
 */
export const validatePassword = (password) => {
  if (!password) return false;
  // At least 8 characters, contain at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate password match
 * @param {string} password 
 * @param {string} confirmPassword 
 * @returns {boolean}
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validate required field
 * @param {string} value 
 * @returns {boolean}
 */
export const validateRequired = (value) => {
  if (!value) return false;
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return true;
};

/**
 * Validate date range (start date should not be after end date)
 * @param {string | Date} startDate 
 * @param {string | Date} endDate 
 * @returns {boolean}
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true; // If either is empty, validation passes
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  return start <= end;
};