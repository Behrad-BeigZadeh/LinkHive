import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
}

interface UserStore {
  user: User | null;
  accessToken: string | null;
  hasHydrated: boolean;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      hasHydrated: false,
      setAccessToken: (accessToken) => set({ accessToken }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, accessToken: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "linkHive-auth",
      onRehydrateStorage: () => () => {
        useAuthStore.getState().setHasHydrated(true);
      },
    }
  )
);
