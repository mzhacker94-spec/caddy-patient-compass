import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  INITIAL_STATE,
  loadState,
  saveState,
  type CaddyNotification,
  type CaddyProfile,
  type CaddyState,
  type Report,
} from "./caddy-store";

type Ctx = {
  state: CaddyState;
  hydrated: boolean;
  setProfile: (p: CaddyProfile | null) => void;
  updateProfile: (patch: Partial<CaddyProfile>) => void;
  addReport: (r: Report) => void;
  toggleShare: (id: string) => void;
  pushNotification: (n: Omit<CaddyNotification, "id" | "read" | "time">) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  logToday: () => void;
};

const CaddyContext = createContext<Ctx | null>(null);

export function CaddyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CaddyState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const pushNotification = useCallback<Ctx["pushNotification"]>((n) => {
    setState((s) => ({
      ...s,
      notifications: [
        { ...n, id: `n${Date.now()}`, read: false, time: "just now" },
        ...s.notifications,
      ],
    }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      hydrated,
      setProfile: (profile) => setState((s) => ({ ...s, profile })),
      updateProfile: (patch) =>
        setState((s) => (s.profile ? { ...s, profile: { ...s.profile, ...patch } } : s)),
      addReport: (r) => setState((s) => ({ ...s, reports: [r, ...s.reports] })),
      toggleShare: (id) =>
        setState((s) => ({
          ...s,
          reports: s.reports.map((r) =>
            r.id === id ? { ...r, sharedWithDoctor: !r.sharedWithDoctor } : r,
          ),
        })),
      pushNotification,
      markAllRead: () =>
        setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      markRead: (id) =>
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      logToday: () =>
        setState((s) => {
          const streak = [...s.streak];
          streak[streak.length - 1] = Math.min(4, (streak[streak.length - 1] ?? 0) + 1);
          return { ...s, streak };
        }),
    }),
    [state, hydrated, pushNotification],
  );

  return <CaddyContext.Provider value={value}>{children}</CaddyContext.Provider>;
}

export function useCaddy() {
  const ctx = useContext(CaddyContext);
  if (!ctx) throw new Error("useCaddy must be used inside CaddyProvider");
  return ctx;
}
