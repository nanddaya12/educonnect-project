import axios from 'axios';
import { readPersistedToken, clearPersistedAuth } from '../lib/persistedAuth';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/** In-memory token for the current tab so requests right after login see the new token before persist flushes. */
let bearerOverride = null;

export function syncBearerToken(token) {
  bearerOverride = token || null;
}

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  const token = bearerOverride ?? readPersistedToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthAttempt = url.includes('/auth/login') || url.includes('/auth/signup');
    const skipRedirect = error.config?.skipAuthRedirect === true;
    if (status === 401 && !isAuthAttempt && !skipRedirect) {
      bearerOverride = null;
      clearPersistedAuth();
      if (typeof window !== 'undefined') {
        window.location.assign('/');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
