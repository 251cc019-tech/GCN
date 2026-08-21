const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const defaultHeaders = {};
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('clausenova_auth_token') : null;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...authHeader,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.error?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export default { request, API_BASE_URL };
