import { create } from 'zustand';
import { TChannelProps, TMessageProps } from '@/types';
import { createJSONStorage, persist } from 'zustand/middleware';

type TChatStore = {
  chats: TChannelProps[];
  selectedId: string;
  selectedChat: TChannelProps | undefined;
  modalOpen: boolean;
  chatMessages: TMessageProps[];

  setChats: (chats: TChannelProps[]) => void;
  addChat: (newChat: TChannelProps) => void;
  setSelectedId: (id: string) => void;
  setSelectedChat: (chat: TChannelProps | undefined) => void;
  setModalOpen: (modalOpen: boolean) => void;
  setChatMessages: (chatMessages: TMessageProps[]) => void;
  addNewMessage: (newMessage: TMessageProps) => void;
};

const initChatState = {
  chats: [],
  selectedId: '0',
  selectedChat: undefined,
  modalOpen: false,
  chatMessages: [],
};

export const useChatStore = create<TChatStore>()(
  persist(
    set => ({
      ...initChatState,

      setChats: chats => set(() => ({ chats })),
      addChat: (newChat: TChannelProps) =>
        set(state => ({ chats: [...state.chats, newChat] })),
      setSelectedId: id => set(() => ({ selectedId: id })),
      setSelectedChat: chat => set(() => ({ selectedChat: chat })),
      setModalOpen: (modalOpen: boolean) => set({ modalOpen }),
      setChatMessages: (chatMessages: TMessageProps[]) =>
        set(() => ({ chatMessages })),
      addNewMessage: newMessage =>
        set(state => ({ chatMessages: [...state.chatMessages, newMessage] })),
      reset: () => set({ ...initChatState }),
    }),
    {
      name: 'chatStorage',
      storage: createJSONStorage(() => localStorage),

      partialize: state => ({
        chats: state.chats,
      }),
    },
  ),
);
