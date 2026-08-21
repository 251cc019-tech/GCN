import { Router } from 'express';
import auditRoutes from './audit.routes.js';
import authRoutes from './auth.routes.js';
import { successResponse } from '../utils/response.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  return successResponse(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'clausenova-backend',
    version: '1.0.0'
  });
});

// Auth & Session routes
router.use('/auth', authRoutes);

// Audit routes
router.use('/audits', auditRoutes);

export default router;
