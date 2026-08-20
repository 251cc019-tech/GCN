import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller.js';
import { checkAuth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { validateAuditUpload } from '../middleware/validation.middleware.js';

const router = Router();

// Create / Upload Audit
router.post(
  '/',
  checkAuth,
  upload.fields([
    { name: 'product', maxCount: 1 },
    { name: 'standard', maxCount: 1 }
  ]),
  validateAuditUpload,
  AuditController.create
);

// List All Audits (History)
router.get('/', checkAuth, AuditController.list);

// Seed Sample Data
router.post('/seed', checkAuth, AuditController.seed);

// Poll Single Audit Status
router.get('/:id', checkAuth, AuditController.getById);

// Get Audit Requirements & Evidence
router.get('/:id/requirements', checkAuth, AuditController.getRequirements);

// Generate Exportable Audit Report
router.post('/:id/report', checkAuth, AuditController.generateReport);

// Update Reviewer Note / Status Override
router.patch('/:id/requirements/:reqId', checkAuth, AuditController.updateRequirement);

export default router;
