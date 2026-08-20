import { AuditModel } from '../../models/audit.model.js';
import { RequirementModel } from '../../models/requirement.model.js';

export async function seedSampleAudits() {
  const sampleAudit1 = await AuditModel.create({
    id: 'audit-iso-9001-sample',
    name: 'PulseFlow BioMonitor QMS Audit',
    productName: 'PulseFlow BioMonitor v2.4 Technical Manual',
    standardName: 'ISO 9001:2015 Quality Management Standard',
    standardType: 'ISO 9001:2015',
    status: 'complete',
    score: 78,
    counts: { matched: 7, missing: 1, pending: 1, total: 9 },
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  });

  const sampleReqs1 = [
    {
      id: 'req-01',
      clauseId: 'ISO 9001 §4.3',
      section: 'Context of the Organization',
      text: 'The organization shall determine the boundaries and applicability of the quality management system to establish its scope.',
      status: 'verified',
      evidence: {
        page: 2,
        paragraph: 1,
        excerpt: 'PulseFlow Medical systems maintain boundary documentation covering all Class II wearable diagnostic instruments across North America and EU operations.',
        confidence: 0.96
      },
      reviewerNote: 'Scope definitions confirmed with regulatory team.'
    },
    {
      id: 'req-02',
      clauseId: 'ISO 9001 §5.2.1',
      section: 'Leadership & Quality Policy',
      text: 'Top management shall establish, implement and maintain a quality policy that is appropriate to the purpose and context of the organization.',
      status: 'verified',
      evidence: {
        page: 3,
        paragraph: 2,
        excerpt: 'Executive leadership signs quarterly quality commitments ensuring patient safety compliance and continuous risk abatement.',
        confidence: 0.94
      }
    },
    {
      id: 'req-03',
      clauseId: 'ISO 9001 §6.1.1',
      section: 'Planning & Risk Management',
      text: 'When planning for the quality management system, the organization shall consider risks and opportunities that need to be addressed.',
      status: 'verified',
      evidence: {
        page: 5,
        paragraph: 4,
        excerpt: 'FMEA and hazard analysis tables are maintained per ISO 14971 cross-referencing all firmware and battery thermal failure modes.',
        confidence: 0.91
      }
    },
    {
      id: 'req-04',
      clauseId: 'ISO 9001 §7.1.5',
      section: 'Support & Monitoring Resources',
      text: 'The organization shall determine and provide the resources needed to ensure valid and reliable results when monitoring or measuring is used.',
      status: 'verified',
      evidence: {
        page: 8,
        paragraph: 2,
        excerpt: 'All optical pulse oximetry sensors undergo NIST-traceable optical calibration every 180 days with certified calibration logs.',
        confidence: 0.98
      }
    },
    {
      id: 'req-05',
      clauseId: 'ISO 9001 §7.5.3',
      section: 'Documented Information',
      text: 'Documented information required by the quality management system shall be controlled to ensure it is adequately protected and available.',
      status: 'verified',
      evidence: {
        page: 11,
        paragraph: 1,
        excerpt: 'Electronic document management system (EDMS) enforces 21 CFR Part 11 electronic signatures and encrypted cloud backups.',
        confidence: 0.95
      }
    },
    {
      id: 'req-06',
      clauseId: 'ISO 9001 §8.2.3',
      section: 'Operation & Requirements Review',
      text: 'The organization shall ensure that it has the ability to meet the requirements for products and services to be offered to customers.',
      status: 'verified',
      evidence: {
        page: 14,
        paragraph: 3,
        excerpt: 'Pre-production feasibility verification gate reviews ensure thermal, RF, and ergonomic specifications before commercial deployment.',
        confidence: 0.89
      }
    },
    {
      id: 'req-07',
      clauseId: 'ISO 9001 §8.5.2',
      section: 'Identification & Traceability',
      text: 'The organization shall use suitable means to identify outputs when it is necessary to ensure the conformity of products and services.',
      status: 'pending',
      evidence: {
        page: 16,
        paragraph: 2,
        excerpt: 'Laser etched QR serial codes are stamped on outer casing; internal component batch lot tracking is in review for supplier sub-assemblies.',
        confidence: 0.64
      },
      reviewerNote: 'Need supplier lot tracking verification.'
    },
    {
      id: 'req-08',
      clauseId: 'ISO 9001 §9.1.2',
      section: 'Performance Evaluation',
      text: 'The organization shall monitor customers perceptions of the degree to which their needs and expectations have been fulfilled.',
      status: 'verified',
      evidence: {
        page: 19,
        paragraph: 1,
        excerpt: 'Post-market surveillance logs clinical feedback scores and hospital procurement satisfaction ratings on a monthly cadence.',
        confidence: 0.92
      }
    },
    {
      id: 'req-09',
      clauseId: 'ISO 9001 §10.2.1',
      section: 'Improvement & Corrective Action',
      text: 'When a nonconformity occurs, including any arising from complaints, the organization shall react to the nonconformity and evaluate the need for action.',
      status: 'flagged',
      evidence: {
        page: null,
        paragraph: null,
        excerpt: 'No formal CAPA response escalation timeline found for critical field failure nonconformities in Section 10.',
        confidence: 0.95
      },
      reviewerNote: 'Critical finding: Escalation SLA table missing from Section 10.'
    }
  ];

  await RequirementModel.createMany(sampleAudit1.id, sampleReqs1);

  // Seed sample 2 (CE MDR)
  const sampleAudit2 = await AuditModel.create({
    id: 'audit-ce-mdr-sample',
    name: 'CardioCore Implantable Lead EU MDR Audit',
    productName: 'CardioCore Model X-50 Design Dossier',
    standardName: 'EU Medical Device Regulation (MDR 2017/745)',
    standardType: 'CE MDR 2017/745',
    status: 'complete',
    score: 100,
    counts: { matched: 4, missing: 0, pending: 0, total: 4 },
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString()
  });

  const sampleReqs2 = [
    {
      id: 'req-mdr-01',
      clauseId: 'MDR Annex I §4',
      section: 'General Safety & Performance',
      text: 'Risk management shall be understood as a continuous iterative process throughout the entire lifecycle of a device.',
      status: 'verified',
      evidence: {
        page: 4,
        paragraph: 2,
        excerpt: 'Lifecycle risk matrices are updated at post-market clinical follow-up intervals per EN ISO 14971:2019 standards.',
        confidence: 0.98
      }
    },
    {
      id: 'req-mdr-02',
      clauseId: 'MDR Annex I §14.2',
      section: 'Design & Manufacture',
      text: 'Devices shall be designed and manufactured in such a way as to remove or reduce as far as possible the risk of infection.',
      status: 'verified',
      evidence: {
        page: 7,
        paragraph: 3,
        excerpt: 'Ethylene oxide sterilization validation conforms to ISO 11135 achieving a Sterility Assurance Level (SAL) of 10^-6.',
        confidence: 0.97
      }
    },
    {
      id: 'req-mdr-03',
      clauseId: 'MDR Annex I §23.1',
      section: 'Labeling & Instructions',
      text: 'Each device shall be accompanied by the information needed to identify the device and its manufacturer.',
      status: 'verified',
      evidence: {
        page: 12,
        paragraph: 1,
        excerpt: 'Direct UDI carrier marking with GS1 Datamatrix barcode applied to all sterile blister packages.',
        confidence: 0.95
      }
    },
    {
      id: 'req-mdr-04',
      clauseId: 'MDR Article 10 §9',
      section: 'Quality Management System',
      text: 'Manufacturers of devices shall establish, document, implement, maintain and continually improve a quality management system.',
      status: 'verified',
      evidence: {
        page: 15,
        paragraph: 4,
        excerpt: 'ISO 13485 certified quality management system maintained with annual notified body surveillance audits.',
        confidence: 0.99
      }
    }
  ];

  await RequirementModel.createMany(sampleAudit2.id, sampleReqs2);

  return [sampleAudit1, sampleAudit2];
}
