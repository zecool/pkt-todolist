// Validation utility functions

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

// Username validation
export const validateUsername = (username) => {
  // At least 2 characters, alphanumeric and spaces/dashes/underscores allowed
  const usernameRegex = /^[a-zA-Z0-9 _-]{2,50}$/;
  return usernameRegex.test(username);
};

// Date validation
export const validateDate = (dateString) => {
  if (!dateString) return true; // Allow empty dates
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Date range validation (start date should be before or equal to end date)
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true; // Allow if either date is empty
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Check if dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false;
  }
  
  // Check if start date is before or equal to end date
  return start <= end;
};

// Validate todo title (required, max 200 chars)
export const validateTodoTitle = (title) => {
  if (!title || title.trim().length === 0) {
    return false;
  }
  return title.length <= 200;
};

// Validate todo content (max 1000 chars)
export const validateTodoContent = (content) => {
  if (!content) return true; // Content is optional
  return content.length <= 1000;
};