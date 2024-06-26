import { create } from 'zustand';

type TUserStore = {
  nickname: string;
  userId: string;

  setNickname: (nickname: string) => void;
  setUserId: (userId: string) => void;

  reset: () => void;
};

const initUserState = {
  nickname: '',
  userId: '',
};

export const useUserStore = create<TUserStore>((set) => ({
  ...initUserState,

  setNickname: (nickname) => set({ nickname }),
  setUserId: (userId) => set({ userId }),
  reset: () => set({ ...initUserState }),
}));
