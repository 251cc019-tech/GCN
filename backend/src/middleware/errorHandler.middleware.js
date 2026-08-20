import { logger } from '../utils/logger.js';
import { errorResponse } from '../utils/response.js';

export function errorHandler(err, req, res, next) {
  logger.error(`Error handling ${req.method} ${req.originalUrl}:`, {
    message: err.message,
    stack: err.stack
  });

  if (err.name === 'MulterError') {
    return errorResponse(res, 'UPLOAD_ERROR', `File upload error: ${err.message}`, 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  return errorResponse(res, code, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : undefined);
}

export default errorHandler;
