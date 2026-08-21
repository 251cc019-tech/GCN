import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService.js';
import { AUDITOR_PERSONAS } from './personas.js';

export const AuthContext = createContext(null);

const STORAGE_KEY_USER = 'clausenova_auth_user';
const STORAGE_KEY_TOKEN = 'clausenova_auth_token';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [authToken, setAuthToken] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_TOKEN) || null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem(STORAGE_KEY_TOKEN, authToken);
    } else {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
  }, [authToken]);

  const login = async (email, password, options = {}) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      setCurrentUser(result.user);
      setAuthToken(result.token);
      return { success: true, user: result.user };
    } catch (error) {
      console.warn('Backend login request fallback:', error?.message);
      
      const matched = AUDITOR_PERSONAS.find((p) => p.email.toLowerCase() === email.toLowerCase());
      const fallbackUser = matched || {
        id: `auditor-${Date.now()}`,
        name: options.name || email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        role: options.role || 'Regulatory Compliance Auditor',
        org: options.org || 'Independent Compliance Office',
        certifications: ['ISO 9001:2015', 'FDA 21 CFR 820'],
        badge: 'AUDITOR',
        avatarInitials: email.substring(0, 2).toUpperCase(),
        clearanceLevel: 'Level 2 — Registered Auditor',
      };
      
      const fallbackToken = `mock-token-${Date.now()}`;
      setCurrentUser(fallbackUser);
      setAuthToken(fallbackToken);
      return { success: true, user: fallbackUser };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const result = await authService.register(userData);
      setCurrentUser(result.user);
      setAuthToken(result.token);
      return { success: true, user: result.user };
    } catch (error) {
      console.warn('Backend register request fallback:', error?.message);
      const newUser = {
        id: `auditor-${Date.now()}`,
        name: userData.name || 'New Auditor',
        email: userData.email,
        role: userData.role || 'Compliance Auditor',
        org: userData.org || 'Quality Assurance Directorate',
        certifications: userData.certifications || ['ISO 9001:2015'],
        badge: 'REGISTERED-AUDITOR',
        avatarInitials: (userData.name || userData.email).substring(0, 2).toUpperCase(),
        clearanceLevel: 'Level 1 — Associate Auditor',
      };
      const fallbackToken = `mock-token-${Date.now()}`;
      setCurrentUser(newUser);
      setAuthToken(fallbackToken);
      return { success: true, user: newUser };
    } finally {
      setIsLoading(false);
    }
  };

  const selectDemoPersona = (personaId) => {
    const persona = AUDITOR_PERSONAS.find((p) => p.id === personaId) || AUDITOR_PERSONAS[0];
    setCurrentUser(persona);
    setAuthToken(`demo-token-${persona.id}`);
    return persona;
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authToken,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        register,
        logout,
        selectDemoPersona,
        personas: AUDITOR_PERSONAS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
