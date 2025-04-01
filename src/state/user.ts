import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type TUserStore = {
  nickname: string;
  userId: string;
  email: string;
  profileUrl: string;
  subscriptions: string[];

  setNickname: (nickname: string) => void;
  setUserId: (userId: string) => void;
  setEmail: (email: string) => void;
  setProfileUrl: (profileUrl: string) => void;
  setSubscriptions: (subscriptions: string[]) => void;
  reset: () => void;
};

const initUserState = {
  nickname: '',
  email: '',
  profileUrl: '',
  userId: '',
  subscriptions: [],
};

export const useUserStore = create<TUserStore>()(
  persist(
    set => ({
      ...initUserState,

      setNickname: nickname => set({ nickname }),
      setUserId: userId => set({ userId }),
      setEmail: email => set({ email }),
      setProfileUrl: profileUrl => set({ profileUrl }),
      setSubscriptions: subscriptions => set({ subscriptions }),
      reset: () => set({ ...initUserState }),
    }),
    {
      name: 'userStorage',
      storage: createJSONStorage(() => localStorage),

      partialize: state => ({
        nickname: state.nickname,
        userId: state.userId,
        email: state.email,
        profileUrl: state.profileUrl,
        subscriptions: state.subscriptions,
      }),
    },
  ),
);
