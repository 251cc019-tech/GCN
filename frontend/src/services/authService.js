import { request } from './api.js';

export const authService = {
  /**
   * Login user with email and password
   */
  async login(email, password) {
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response.data;
  },

  /**
   * Register a new auditor
   */
  async register(userData) {
    const response = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data;
  },

  /**
   * Fetch current authenticated auditor profile
   */
  async getCurrentUser() {
    const response = await request('/auth/me');
    return response.data;
  },
};

export default authService;
