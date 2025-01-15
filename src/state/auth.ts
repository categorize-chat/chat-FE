import { create } from 'zustand';

type TAuthStore = {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
};

export const useAuth = create<TAuthStore>(set => ({
  isLogin: false,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
}));
