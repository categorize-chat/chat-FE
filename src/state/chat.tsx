import { create } from 'zustand';
import { TChatProps } from '../types';
import { chats } from '../data';
import { ManagerOptions, Socket, SocketOptions, io } from 'socket.io-client';

type TChatStore = {
  chats: TChatProps[];
  selectedId: string;
  selectedChat: TChatProps | undefined;

  setChats: (chats: TChatProps[]) => void;
  setSelectedId: (id: string) => void;
  setSelectedChat: (chat: TChatProps | undefined) => void;
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
  selectedId: '0',
  selectedChat: undefined,

  setChats: (chats) => set(() => ({ chats })),
  setSelectedId: (id) => set(() => ({ selectedId: id })),
  setSelectedChat: (chat) => set(() => ({ selectedChat: chat })),
}));

export const useSocket = create<TSocketStore>((set) => ({
  socket: undefined,
  connectSocket: (url, opts?) => set(() => ({ socket: io(url, opts) })),
}));
