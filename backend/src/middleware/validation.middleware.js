import { errorResponse } from '../utils/response.js';

export function validateAuditUpload(req, res, next) {
  // If request contains sampleFlag or JSON body with text, allow it through
  if (req.body && req.body.isSample) {
    return next();
  }

  // If multer files are used
  const product = req.files?.product?.[0];
  const standard = req.files?.standard?.[0];

  // Also check if text content was passed directly in body
  if (!product && !req.body?.productContent && !req.body?.productText) {
    return errorResponse(res, 'VALIDATION_ERROR', 'Product document is required.', 400);
  }

  if (!standard && !req.body?.standardContent && !req.body?.standardText && !req.body?.standardType) {
    return errorResponse(res, 'VALIDATION_ERROR', 'Regulatory standard document is required.', 400);
  }

  next();
}
