import { dbStore } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export class RequirementModel {
  static async createMany(auditId, requirements) {
    const list = requirements.map((req, index) => ({
      id: req.id || `req-${uuidv4().slice(0, 8)}`,
      auditId,
      clauseId: req.clauseId || `§${index + 1}.0`,
      section: req.section || 'General Requirements',
      text: req.text,
      status: req.status || 'pending', // 'verified' | 'flagged' | 'pending'
      evidence: req.evidence || null, // { page, paragraph, excerpt, confidence }
      reviewerNote: req.reviewerNote || '',
      updatedAt: new Date().toISOString()
    }));
    dbStore.requirements.set(auditId, list);
    return list;
  }

  static async findByAuditId(auditId) {
    return dbStore.requirements.get(auditId) || [];
  }

  static async updateRequirement(auditId, reqId, updates) {
    const list = dbStore.requirements.get(auditId);
    if (!list) return null;
    const itemIndex = list.findIndex(r => r.id === reqId);
    if (itemIndex === -1) return null;

    list[itemIndex] = {
      ...list[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    dbStore.requirements.set(auditId, list);
    return list[itemIndex];
  }
}

export default RequirementModel;
