import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'farmer' | 'trader' | 'exporter' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  token: string | null;
  role: Role;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, role: Role, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, role, user) =>
        set({ token, role, user, isAuthenticated: true }),
      logout: () =>
        set({ token: null, role: null, user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);
