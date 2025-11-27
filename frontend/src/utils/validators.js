// Form validation utilities

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return '이메일은 필수 입력 항목입니다';
  }
  if (!emailRegex.test(email)) {
    return '올바른 이메일 형식이 아닙니다';
  }
  return null;
};

/**
 * Validates a password
 * @param {string} password - The password to validate
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validatePassword = (password) => {
  if (!password) {
    return '비밀번호는 필수 입력 항목입니다';
  }
  if (password.length < 8) {
    return '비밀번호는 최소 8자 이상이어야 합니다';
  }
  return null;
};

/**
 * Validates a username
 * @param {string} username - The username to validate
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validateUsername = (username) => {
  if (!username) {
    return '사용자 이름은 필수 입력 항목입니다';
  }
  if (username.length < 2) {
    return '사용자 이름은 최소 2자 이상이어야 합니다';
  }
  if (username.length > 50) {
    return '사용자 이름은 50자를 초과할 수 없습니다';
  }
  return null;
};

/**
 * Validates a todo title
 * @param {string} title - The title to validate
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validateTodoTitle = (title) => {
  if (!title || title.trim().length === 0) {
    return '제목은 필수 입력 항목입니다';
  }
  if (title.length > 200) {
    return '제목은 200자를 초과할 수 없습니다';
  }
  return null;
};

/**
 * Validates due date to ensure it's not before start date
 * @param {string} startDate - The start date in YYYY-MM-DD format
 * @param {string} dueDate - The due date in YYYY-MM-DD format
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const validateDateRange = (startDate, dueDate) => {
  if (startDate && dueDate) {
    const start = new Date(startDate);
    const end = new Date(dueDate);
    
    if (end < start) {
      return '만료일은 시작일과 같거나 이후여야 합니다';
    }
  }
  return null;
};