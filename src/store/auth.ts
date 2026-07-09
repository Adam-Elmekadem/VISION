import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface AuthStore {
  user:  AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  isLoggedIn: () => boolean;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user:  null,
      token: null,
      setAuth:   (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
      isLoggedIn: () => !!get().token,
    }),
    {
      name: "vision-auth",
      partialize: (s) => ({ user: s.user, token: s.token }),
    }
  )
);

// Convenience — attach token to fetch headers
export function authHeaders(): HeadersInit {
  const token = useAuth.getState().token;
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" }
    : { "Content-Type": "application/json", Accept: "application/json" };
}
