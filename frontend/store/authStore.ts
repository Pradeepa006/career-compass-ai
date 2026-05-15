import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  plan: string;
  career_readiness_score: number;
  profile_completion: number;
  skills: string[];
  target_role?: string;
  is_admin: boolean;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user, accessToken, refreshToken) => {
        Cookies.set("access_token", accessToken, { expires: 1, secure: true, sameSite: "strict" });
        Cookies.set("refresh_token", refreshToken, { expires: 7, secure: true, sameSite: "strict" });
        set({ user, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        set({ user: null, isAuthenticated: false });
        window.location.href = "/login";
      },

      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "careercompass-auth",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
