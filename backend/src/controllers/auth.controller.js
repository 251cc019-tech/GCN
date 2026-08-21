import { successResponse, errorResponse } from '../utils/response.js';

const SAMPLE_AUDITOR_ACCOUNTS = [
  {
    id: 'auditor-01',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@clausenova.gov',
    password: 'Auditor2026!Secure',
    role: 'Lead Regulatory Auditor',
    org: 'Global Compliance Network (GCN)',
    certifications: ['ISO 9001:2015 Lead', 'CE MDR 2017/745 Notified Body'],
    badge: 'LEAD-AUDITOR',
    avatarInitials: 'ER',
    clearanceLevel: 'Level 3 — Certified Officer',
  },
  {
    id: 'auditor-02',
    name: 'Marcus Vance, RAC',
    email: 'm.vance@novatech-devices.com',
    password: 'Auditor2026!Secure',
    role: 'Senior QA Compliance Director',
    org: 'NovaTech BioElectronics Corp',
    certifications: ['FDA 21 CFR Part 820 QSR', 'ISO 13485:2016'],
    badge: 'QA-DIRECTOR',
    avatarInitials: 'MV',
    clearanceLevel: 'Level 2 — Quality Representative',
  },
  {
    id: 'auditor-03',
    name: 'Sarah Chen, M.Sc.',
    email: 'schen@tuv-regulatory-inspect.eu',
    password: 'Auditor2026!Secure',
    role: 'EU Notified Body Inspector',
    org: 'TÜV Rheinland Inspection Body',
    certifications: ['EU MDR Annex IX', 'ISO 14971 Risk Management'],
    badge: 'NOTIFIED-BODY',
    avatarInitials: 'SC',
    clearanceLevel: 'Level 3 — External Assessor',
  },
];

/**
 * Handle Auditor Login
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and security password are required.', 400, 'VALIDATION_ERROR');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = SAMPLE_AUDITOR_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === normalizedEmail
    );

    const user = existing || {
      id: `auditor-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: normalizedEmail,
      role: 'Regulatory Compliance Auditor',
      org: 'Independent Audit Directorate',
      certifications: ['ISO 9001:2015', 'FDA 21 CFR 820'],
      badge: 'CERTIFIED-AUDITOR',
      avatarInitials: normalizedEmail.substring(0, 2).toUpperCase(),
      clearanceLevel: 'Level 2 — Certified Officer',
    };

    const token = `jwt-sec-token-${user.id}-${Date.now()}`;

    return successResponse(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        org: user.org,
        certifications: user.certifications,
        badge: user.badge,
        avatarInitials: user.avatarInitials,
        clearanceLevel: user.clearanceLevel,
      },
      token,
      expiresIn: '24h',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle Auditor Registration
 * POST /api/auth/register
 */
export async function register(req, res, next) {
  try {
    const { name, email, password, org, auditorId } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required.', 400, 'VALIDATION_ERROR');
    }

    const newUser = {
      id: auditorId || `auditor-${Date.now()}`,
      name: name || 'Registered Auditor',
      email: email.trim().toLowerCase(),
      role: 'Registered Compliance Auditor',
      org: org || 'Quality Assurance Directorate',
      certifications: ['ISO 9001:2015 Standardized'],
      badge: 'REGISTERED-AUDITOR',
      avatarInitials: (name || email).substring(0, 2).toUpperCase(),
      clearanceLevel: 'Level 1 — Associate Auditor',
    };

    const token = `jwt-sec-token-${newUser.id}-${Date.now()}`;

    return successResponse(res, {
      user: newUser,
      token,
      expiresIn: '24h',
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Fetch currently authenticated user
 * GET /api/auth/me
 */
export async function getCurrentUser(req, res, next) {
  try {
    const user = req.user || SAMPLE_AUDITOR_ACCOUNTS[0];
    return successResponse(res, { user });
  } catch (error) {
    next(error);
  }
}

export default {
  login,
  register,
  getCurrentUser,
};
