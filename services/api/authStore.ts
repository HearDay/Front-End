import { create } from "zustand";

interface AuthState {
  isAuthReady: boolean;
  setAuthReady: (ready: boolean) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthReady: false,
  setAuthReady: (ready) => set({ isAuthReady: ready }),
  resetAuth: () => set({ isAuthReady: false }),
}));
