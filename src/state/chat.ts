import { create } from 'zustand';
import { TChannelProps, TMessageProps } from '@/types';
import { createJSONStorage, persist } from 'zustand/middleware';
import React from 'react';

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
  setChatMessages: (prev: React.SetStateAction<TMessageProps[]>) => void;
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
      setChatMessages: (prev: React.SetStateAction<TMessageProps[]>) =>
        prev instanceof Function
          ? set(state => ({
              chatMessages: prev(state.chatMessages),
            }))
          : set({ chatMessages: prev }),
      addNewMessage: newMessage => {
        // temp 업데이트 후, chat 업데이트
        set(state => ({
          chatMessages: [...state.chatMessages, newMessage],
        }));
      },
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
