import { create } from 'zustand';
import { ChatProps } from '../types';
import { chats } from '../data';

type TChatStore = {
  chats: ChatProps[];
  selectedId: number;
  selectedChat: ChatProps | undefined;

  setChats: (chats: ChatProps[]) => void;
  setSelectedId: (id: number) => void;
  setSelectedChat: (chat: ChatProps | undefined) => void;
};

export const useChatStore = create<TChatStore>((set) => ({
  chats: chats,
  selectedId: 0,
  selectedChat: undefined,

  setChats: (chats) => set(() => ({ chats })),
  setSelectedId: (id) => set(() => ({ selectedId: id })),
  setSelectedChat: (chat) => set(() => ({ selectedChat: chat })),
}));
