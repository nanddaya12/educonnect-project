import { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';

/**
 * Waits for persisted auth to load, then validates the session against GET /api/auth/me.
 * Prevents a stale localStorage token from showing dashboards while logged out server-side.
 */
export default function AuthReady({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let unsubPersist = null;

    const waitForPersist = () =>
      new Promise((resolve) => {
        if (useAuthStore.persist.hasHydrated()) {
          resolve();
          return;
        }
        unsubPersist = useAuthStore.persist.onFinishHydration(() => {
          unsubPersist?.();
          resolve();
        });
      });

    const boot = async () => {
      await waitForPersist();
      if (cancelled) return;
      await useAuthStore.getState().hydrateSession();
      if (!cancelled) setReady(true);
    };

    void boot();
    return () => {
      cancelled = true;
      unsubPersist?.();
    };
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4 text-slate-400">
        <div
          className="w-11 h-11 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"
          aria-hidden
        />
        <p className="text-sm font-medium tracking-tight">Loading EduConnect…</p>
      </div>
    );
  }

  return children;
}
