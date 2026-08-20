import { AuditModel } from '../models/audit.model.js';
import { RequirementModel } from '../models/requirement.model.js';

/**
 * Report Service
 * Generates audit summaries and exportable compliance reports
 */
export class ReportService {
  static async generateAuditReport(auditId, options = {}) {
    const audit = await AuditModel.findById(auditId);
    if (!audit) throw new Error('Audit not found');

    const requirements = await RequirementModel.findByAuditId(auditId);
    const verified = requirements.filter(r => r.status === 'verified');
    const flagged = requirements.filter(r => r.status === 'flagged');
    const pending = requirements.filter(r => r.status === 'pending');

    const report = {
      auditId: audit.id,
      auditName: audit.name,
      standardType: audit.standardType,
      productName: audit.productName,
      generatedAt: new Date().toISOString(),
      complianceScore: audit.score,
      verdict: audit.score >= 80 ? 'CONFORMANT' : audit.score >= 60 ? 'ACTION_REQUIRED' : 'NON_CONFORMANT',
      statistics: {
        totalClauses: requirements.length,
        verifiedCount: verified.length,
        flaggedCount: flagged.length,
        pendingCount: pending.length,
        compliancePercentage: audit.score
      },
      executiveSummary: `Audit of ${audit.productName} against ${audit.standardType} completed with a compliance score of ${audit.score}%. ${verified.length} requirements verified with supporting documentation evidence, ${flagged.length} non-conformances flagged, and ${pending.length} clauses requiring auditor review.`,
      clauses: requirements.map(r => ({
        id: r.id,
        clauseId: r.clauseId,
        section: r.section,
        text: r.text,
        status: r.status,
        evidencePage: r.evidence?.page || 'N/A',
        evidenceParagraph: r.evidence?.paragraph || 'N/A',
        excerpt: r.evidence?.excerpt || 'None provided',
        confidence: r.evidence?.confidence ? `${Math.round(r.evidence.confidence * 100)}%` : 'N/A',
        reviewerNote: r.reviewerNote || ''
      })),
      signoff: {
        leadAuditor: options.auditorName || 'Lead Compliance Officer',
        organization: 'ClauseNova Automated Audit Engine',
        timestamp: new Date().toISOString()
      }
    };

    return report;
  }
}

export default ReportService;
