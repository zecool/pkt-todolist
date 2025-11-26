/**
 * Global error handling middleware
 * @param {Error} err - The error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  // Log error for debugging (you might want to use a logger like winston in production)
  console.error(err);

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_ERROR';
  const errorMessage = err.message || 'Internal Server Error';

  const response = {
    success: false,
    error: {
      code: errorCode,
      message: errorMessage,
    },
  };

  // Include stack trace in development environment
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
