import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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

export const useUserStore = create<TUserStore>()(
  persist(
    (set) => ({
      ...initUserState,

      setNickname: (nickname) => set({ nickname }),
      setUserId: (userId) => set({ userId }),
      reset: () => set({ ...initUserState }),
    }),
    {
      name: 'userStorage',
      storage: createJSONStorage(() => sessionStorage),

      partialize: (state) => ({
        nickname: state.nickname,
        userId: state.userId,
      }),
    },
  ),
);
