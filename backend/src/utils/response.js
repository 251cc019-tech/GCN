/**
 * Standard API Response envelope format
 */
export function successResponse(res, data = null, statusCode = 200, message = null) {
  const response = {
    success: true,
    data,
  };
  if (message) response.message = message;
  return res.status(statusCode).json(response);
}

export function errorResponse(res, code = 'INTERNAL_ERROR', message = 'An unexpected error occurred.', statusCode = 500, details = null) {
  const response = {
    success: false,
    error: {
      code,
      message,
    },
  };
  if (details) response.error.details = details;
  return res.status(statusCode).json(response);
}
