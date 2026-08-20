import { dbStore } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export class AuditModel {
  static async create(auditData) {
    const id = auditData.id || `audit-${uuidv4().slice(0, 8)}`;
    const audit = {
      id,
      name: auditData.name || `Compliance Audit #${id.slice(-4)}`,
      productName: auditData.productName || 'Product Specification',
      standardName: auditData.standardName || 'Regulatory Standard',
      standardType: auditData.standardType || 'ISO 9001:2015',
      status: auditData.status || 'processing', // 'processing' | 'complete' | 'failed'
      score: auditData.score || 0,
      counts: auditData.counts || { matched: 0, missing: 0, pending: 0, total: 0 },
      createdAt: auditData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: auditData.metadata || {}
    };
    dbStore.audits.set(id, audit);
    return audit;
  }

  static async findById(id) {
    return dbStore.audits.get(id) || null;
  }

  static async findAll() {
    return Array.from(dbStore.audits.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  static async update(id, updates) {
    const existing = dbStore.audits.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    dbStore.audits.set(id, updated);
    return updated;
  }

  static async delete(id) {
    dbStore.requirements.delete(id);
    return dbStore.audits.delete(id);
  }
}

export default AuditModel;
