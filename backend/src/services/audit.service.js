import { AuditModel } from '../models/audit.model.js';
import { RequirementModel } from '../models/requirement.model.js';
import { DocumentParserService } from './documentParser.service.js';
import { RequirementExtractorService } from './requirementExtractor.service.js';
import { ComparisonEngineService } from './comparisonEngine.service.js';
import { logger } from '../utils/logger.js';

export class AuditService {
  static async createAuditSession({ productName, standardName, standardType, productFile, standardFile, productText, standardText }) {
    // 1. Create audit record in 'processing' status
    const audit = await AuditModel.create({
      productName: productName || productFile?.originalname || 'Product Quality Specification',
      standardName: standardName || standardFile?.originalname || 'Regulatory Standard Requirements',
      standardType: standardType || 'ISO 9001:2015',
      status: 'processing',
      score: 0,
      metadata: {
        productFileSize: productFile?.size || 0,
        standardFileSize: standardFile?.size || 0,
        hasCustomStandardText: Boolean(standardText),
      }
    });

    // 2. Run processing asynchronously (simulating BullMQ job worker flow)
    this.runAuditJob(audit.id, { productFile, standardFile, productText, standardText, standardType });

    return audit;
  }

  static async runAuditJob(auditId, { productFile, standardFile, productText, standardText, standardType }) {
    try {
      logger.info(`Starting comparison job for audit ${auditId}`);

      // 1. Parse product document into paginated paragraphs
      let productPages = [];
      if (productFile?.path) {
        productPages = await DocumentParserService.extractText(productFile.path, productFile.originalname);
      } else if (productText) {
        productPages = DocumentParserService.parseRawText(productText);
      } else {
        // Sample default product text
        productPages = DocumentParserService.parseRawText(
          `NovaTech Medical Device Quality Manual & Technical Dossier.\n\n` +
          `Section 1: Scope and Applicability.\nNovaTech establishes and maintains a comprehensive quality management system across all manufacturing facilities.\n\n` +
          `Section 2: Quality Policy & Leadership.\nManagement has instituted continuous compliance monitoring, executive risk reviews, and resource calibration procedures.\n\n` +
          `Section 3: Risk Assessment and Opportunities.\nRisk management protocols analyze patient safety hazards iteratively during every lifecycle phase.\n\n` +
          `Section 4: Monitoring and Measuring Resources.\nCalibration logs are stored with tamper-proof timestamps to verify instrument validity.\n\n` +
          `Section 5: Document Control & Traceability.\nAll standard operating procedures and technical drawings carry revision tags and unique serial identifiers.\n\n` +
          `Section 6: Non-conformance & CAPA.\nCorrective actions are triggered automatically upon customer defect reports.`
        );
      }

      // 2. Extract standard requirements
      let rawStandardText = standardText || '';
      if (standardFile?.path) {
        const parsedStandard = await DocumentParserService.extractText(standardFile.path, standardFile.originalname);
        rawStandardText = parsedStandard.map(p => p.paragraphs.join('\n')).join('\n\n');
      }

      const standardRequirements = await RequirementExtractorService.extractRequirements(
        rawStandardText,
        standardType || 'iso-9001'
      );

      // 3. Compare each requirement against product pages
      const classifiedRequirements = [];
      for (const req of standardRequirements) {
        const classification = await ComparisonEngineService.classifyRequirement(req, productPages);
        classifiedRequirements.push({
          clauseId: req.clauseId,
          section: req.section,
          text: req.text,
          status: classification.status,
          evidence: {
            page: classification.page,
            paragraph: classification.paragraph,
            excerpt: classification.excerpt,
            confidence: classification.confidence
          }
        });
      }

      // 4. Save requirement results
      await RequirementModel.createMany(auditId, classifiedRequirements);

      // 5. Compute compliance score and counts
      const matched = classifiedRequirements.filter(r => r.status === 'verified').length;
      const missing = classifiedRequirements.filter(r => r.status === 'flagged').length;
      const pending = classifiedRequirements.filter(r => r.status === 'pending').length;
      const total = classifiedRequirements.length;
      const score = total ? Math.round((matched / total) * 100) : 0;

      // 6. Update audit status to complete
      await AuditModel.update(auditId, {
        status: 'complete',
        score,
        counts: { matched, missing, pending, total }
      });

      logger.info(`Audit ${auditId} completed with compliance score ${score}%`);
    } catch (err) {
      logger.error(`Audit ${auditId} failed:`, err);
      await AuditModel.update(auditId, {
        status: 'failed',
        metadata: { error: err.message }
      });
    }
  }

  static async getAuditStatus(auditId) {
    return AuditModel.findById(auditId);
  }

  static async getAllAudits() {
    return AuditModel.findAll();
  }

  static async getAuditRequirements(auditId) {
    return RequirementModel.findByAuditId(auditId);
  }

  static async updateRequirement(auditId, reqId, updates) {
    const updated = await RequirementModel.updateRequirement(auditId, reqId, updates);
    if (!updated) return null;

    // Recalculate audit score
    const all = await RequirementModel.findByAuditId(auditId);
    const matched = all.filter(r => r.status === 'verified').length;
    const missing = all.filter(r => r.status === 'flagged').length;
    const pending = all.filter(r => r.status === 'pending').length;
    const score = all.length ? Math.round((matched / all.length) * 100) : 0;

    await AuditModel.update(auditId, {
      score,
      counts: { matched, missing, pending, total: all.length }
    });

    return updated;
  }
}

export default AuditService;
