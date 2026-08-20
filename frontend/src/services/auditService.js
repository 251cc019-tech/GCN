import { request } from './api.js';

export const auditService = {
  /**
   * Upload product & standard documents to create a new audit
   */
  async createAudit(formData) {
    return request('/audits', {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * List all historical audits
   */
  async getAudits() {
    const res = await request('/audits');
    return res.data || [];
  },

  /**
   * Poll single audit status & summary
   */
  async getAuditById(auditId) {
    const res = await request(`/audits/${auditId}`);
    return res.data;
  },

  /**
   * Get all requirement classifications & evidence citations for an audit
   */
  async getRequirements(auditId) {
    const res = await request(`/audits/${auditId}/requirements`);
    return res.data;
  },

  /**
   * Generate exportable compliance audit report
   */
  async generateReport(auditId, options = {}) {
    const res = await request(`/audits/${auditId}/report`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
    return res.data;
  },

  /**
   * Update auditor notes or override requirement status
   */
  async updateRequirement(auditId, reqId, updates) {
    const res = await request(`/audits/${auditId}/requirements/${reqId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return res.data;
  },

  /**
   * Seed sample data
   */
  async seedSampleData() {
    const res = await request('/audits/seed', {
      method: 'POST',
    });
    return res.data;
  }
};

export default auditService;
