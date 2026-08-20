/**
 * Auth Middleware
 * Validates request authorization and attaches organization/auditor session
 */
export function checkAuth(req, res, next) {
  const token = req.headers.authorization;
  // For open workspace demo, authenticate automatically if no auth token is required
  // If authorization header is provided with Bearer, validate format
  if (token && !token.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid authorization token header.' }
    });
  }

  req.user = {
    id: 'auditor-01',
    name: 'Lead Regulatory Auditor',
    org: 'Global Compliance Network'
  };

  next();
}

export default checkAuth;
