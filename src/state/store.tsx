import { create } from 'zustand';
import { ChatProps } from '../types';
import { chats } from '../data';
import { ManagerOptions, Socket, SocketOptions, io } from 'socket.io-client';

type TChatStore = {
  chats: ChatProps[];
  selectedId: number;
  selectedChat: ChatProps | undefined;

  setChats: (chats: ChatProps[]) => void;
  setSelectedId: (id: number) => void;
  setSelectedChat: (chat: ChatProps | undefined) => void;
};

type TSocketStore = {
  socket: Socket | undefined;
  connectSocket: (
    url: string,
    opts?: Partial<ManagerOptions & SocketOptions>,
  ) => void;
};

export const useChatStore = create<TChatStore>((set) => ({
  chats: chats,
  selectedId: 0,
  selectedChat: undefined,

  setChats: (chats) => set(() => ({ chats })),
  setSelectedId: (id) => set(() => ({ selectedId: id })),
  setSelectedChat: (chat) => set(() => ({ selectedChat: chat })),
}));

export const useSocket = create<TSocketStore>((set) => ({
  socket: undefined,
  connectSocket: (url, opts?) => set(() => ({ socket: io(url, opts) })),
}));
