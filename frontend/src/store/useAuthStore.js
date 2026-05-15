import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { syncBearerToken } from '../api/client';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      /** Refresh user from API; clears session on failure (without full-page redirect). */
      hydrateSession: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const { data } = await api.get('/api/auth/me', { skipAuthRedirect: true });
          const t = get().token;
          syncBearerToken(t);
          set({
            user: { ...data, token: t },
            token: t,
            isAuthenticated: true,
          });
        } catch {
          syncBearerToken(null);
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      login: async (identifier, password, role) => {
        const res = await api.post('/api/auth/login', { identifier, password, role });
        syncBearerToken(res.data.token);
        set({
          user: res.data,
          token: res.data.token,
          isAuthenticated: true,
        });
        return true;
      },

      signup: async (name, email, password, role) => {
        const res = await api.post('/api/auth/signup', { name, email, password, role });
        syncBearerToken(res.data.token);
        set({
          user: res.data,
          token: res.data.token,
          isAuthenticated: true,
        });
        return res.data;
      },

      logout: () => {
        syncBearerToken(null);
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          syncBearerToken(state.token);
        }
      },
    }
  )
);

export default useAuthStore;
