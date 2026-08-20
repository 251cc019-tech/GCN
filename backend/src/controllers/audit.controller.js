import { AuditService } from '../services/audit.service.js';
import { ReportService } from '../services/report.service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { seedSampleAudits } from '../db/seeds/sample_audits.js';

export class AuditController {
  static async create(req, res, next) {
    try {
      const productFile = req.files?.product?.[0] || null;
      const standardFile = req.files?.standard?.[0] || null;

      const {
        productName,
        standardName,
        standardType,
        productText,
        standardText,
        isSample
      } = req.body;

      const audit = await AuditService.createAuditSession({
        productName: productName || (isSample ? 'NovaTech BioSensor QMS Dossier' : undefined),
        standardName: standardName || (isSample ? 'ISO 9001:2015 & MDR Standard' : undefined),
        standardType: standardType || 'ISO 9001:2015',
        productFile,
        standardFile,
        productText,
        standardText
      });

      return successResponse(res, {
        auditId: audit.id,
        status: audit.status,
        name: audit.name,
        createdAt: audit.createdAt
      }, 202, 'Audit job queued successfully.');
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const audit = await AuditService.getAuditStatus(id);

      if (!audit) {
        return errorResponse(res, 'AUDIT_NOT_FOUND', `Audit with ID '${id}' was not found.`, 404);
      }

      return successResponse(res, {
        id: audit.id,
        name: audit.name,
        productName: audit.productName,
        standardName: audit.standardName,
        standardType: audit.standardType,
        status: audit.status,
        score: audit.score,
        counts: audit.counts,
        createdAt: audit.createdAt,
        updatedAt: audit.updatedAt
      });
    } catch (err) {
      next(err);
    }
  }

  static async list(req, res, next) {
    try {
      const audits = await AuditService.getAllAudits();
      return successResponse(res, audits);
    } catch (err) {
      next(err);
    }
  }

  static async getRequirements(req, res, next) {
    try {
      const { id } = req.params;
      const audit = await AuditService.getAuditStatus(id);

      if (!audit) {
        return errorResponse(res, 'AUDIT_NOT_FOUND', `Audit with ID '${id}' was not found.`, 404);
      }

      const requirements = await AuditService.getAuditRequirements(id);
      return successResponse(res, {
        auditId: id,
        status: audit.status,
        score: audit.score,
        counts: audit.counts,
        requirements
      });
    } catch (err) {
      next(err);
    }
  }

  static async generateReport(req, res, next) {
    try {
      const { id } = req.params;
      const options = req.body || {};
      const report = await ReportService.generateAuditReport(id, options);
      return successResponse(res, report);
    } catch (err) {
      next(err);
    }
  }

  static async updateRequirement(req, res, next) {
    try {
      const { id, reqId } = req.params;
      const updates = req.body;

      const updated = await AuditService.updateRequirement(id, reqId, updates);
      if (!updated) {
        return errorResponse(res, 'REQUIREMENT_NOT_FOUND', 'Requirement could not be updated.', 404);
      }

      return successResponse(res, updated, 200, 'Requirement updated successfully.');
    } catch (err) {
      next(err);
    }
  }

  static async seed(req, res, next) {
    try {
      const sampleData = await seedSampleAudits();
      return successResponse(res, sampleData, 200, 'Sample audit data loaded successfully.');
    } catch (err) {
      next(err);
    }
  }
}

export default AuditController;
