/**
 * Requirement Extractor Service
 * Extracts clauses and requirements from regulatory standards
 */
export class RequirementExtractorService {
  static standardPresets = {
    'iso-9001': [
      {
        clauseId: 'ISO 9001 §4.3',
        section: 'Context of the Organization',
        text: 'The organization shall determine the boundaries and applicability of the quality management system to establish its scope.'
      },
      {
        clauseId: 'ISO 9001 §5.2.1',
        section: 'Leadership & Policy',
        text: 'Top management shall establish, implement and maintain a quality policy that is appropriate to the purpose and context of the organization.'
      },
      {
        clauseId: 'ISO 9001 §6.1.1',
        section: 'Planning & Risk Management',
        text: 'When planning for the quality management system, the organization shall consider risks and opportunities that need to be addressed.'
      },
      {
        clauseId: 'ISO 9001 §7.1.5',
        section: 'Support & Monitoring Resources',
        text: 'The organization shall determine and provide the resources needed to ensure valid and reliable results when monitoring or measuring is used.'
      },
      {
        clauseId: 'ISO 9001 §7.5.3',
        section: 'Documented Information',
        text: 'Documented information required by the quality management system shall be controlled to ensure it is adequately protected and available.'
      },
      {
        clauseId: 'ISO 9001 §8.2.3',
        section: 'Operation & Requirements Review',
        text: 'The organization shall ensure that it has the ability to meet the requirements for products and services to be offered to customers.'
      },
      {
        clauseId: 'ISO 9001 §8.5.2',
        section: 'Identification & Traceability',
        text: 'The organization shall use suitable means to identify outputs when it is necessary to ensure the conformity of products and services.'
      },
      {
        clauseId: 'ISO 9001 §9.1.2',
        section: 'Performance Evaluation',
        text: 'The organization shall monitor customers perceptions of the degree to which their needs and expectations have been fulfilled.'
      },
      {
        clauseId: 'ISO 9001 §10.2.1',
        section: 'Improvement & Corrective Action',
        text: 'When a nonconformity occurs, including any arising from complaints, the organization shall react to the nonconformity and evaluate the need for action.'
      }
    ],
    'ce-mdr': [
      {
        clauseId: 'MDR Annex I §4',
        section: 'General Safety & Performance',
        text: 'Risk management shall be understood as a continuous iterative process throughout the entire lifecycle of a device, requiring regular systematic updating.'
      },
      {
        clauseId: 'MDR Annex I §14.2',
        section: 'Design & Manufacture',
        text: 'Devices shall be designed and manufactured in such a way as to remove or reduce as far as possible the risk of infection to patients, users and third parties.'
      },
      {
        clauseId: 'MDR Annex I §23.1',
        section: 'Labeling & Instructions',
        text: 'Each device shall be accompanied by the information needed to identify the device and its manufacturer, and by any safety and performance information relevant to the user.'
      },
      {
        clauseId: 'MDR Article 10 §9',
        section: 'Quality Management System',
        text: 'Manufacturers of devices shall establish, document, implement, maintain, keep up to date and continually improve a quality management system.'
      }
    ],
    'fda-cfr-820': [
      {
        clauseId: '21 CFR §820.30(a)',
        section: 'Design Controls',
        text: 'Each manufacturer of any class III or class II device, and select class I devices, shall establish and maintain procedures to control the design of the device.'
      },
      {
        clauseId: '21 CFR §820.30(e)',
        section: 'Design Review',
        text: 'Each manufacturer shall establish and maintain procedures to ensure that formal documented reviews of the design results are planned and conducted at appropriate stages.'
      },
      {
        clauseId: '21 CFR §820.70(a)',
        section: 'Production & Process Controls',
        text: 'Each manufacturer shall develop, conduct, control, and monitor production processes to ensure that a device conforms to its specifications.'
      },
      {
        clauseId: '21 CFR §820.100(a)',
        section: 'Corrective & Preventive Action (CAPA)',
        text: 'Each manufacturer shall establish and maintain procedures for implementing corrective and preventive action including analyzing processes, work operations, and complaints.'
      }
    ]
  };

  static async extractRequirements(standardFileOrText, standardType = 'iso-9001') {
    // If standardType matches a preset
    const normalizedKey = standardType.toLowerCase().replace(/[^a-z0-9]/g, '-');
    for (const [key, preset] of Object.entries(this.standardPresets)) {
      if (normalizedKey.includes(key) || key.includes(normalizedKey)) {
        return preset;
      }
    }

    // If text was provided directly, parse clauses by looking for section headings/clauses
    if (typeof standardFileOrText === 'string' && standardFileOrText.length > 20) {
      const lines = standardFileOrText.split('\n').map(l => l.trim()).filter(Boolean);
      const parsed = [];
      let currentSection = 'General Requirements';

      lines.forEach((line, index) => {
        if (line.match(/^(Section|Chapter|Part|Article|§|\d+\.)/i)) {
          currentSection = line;
        } else if (line.length > 25) {
          parsed.push({
            clauseId: `Clause §${parsed.length + 1}.0`,
            section: currentSection,
            text: line
          });
        }
      });

      if (parsed.length > 0) return parsed;
    }

    // Default fallback to ISO 9001 preset
    return this.standardPresets['iso-9001'];
  }
}

export default RequirementExtractorService;
