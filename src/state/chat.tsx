import { create } from 'zustand';
import { ManagerOptions, Socket, SocketOptions, io } from 'socket.io-client';
import { TChannelProps } from '../utils/chat/type';

type TChatStore = {
  chats: TChannelProps[];
  selectedId: string;
  selectedChat: TChannelProps | undefined;

  setChats: (chats: TChannelProps[]) => void;
  setSelectedId: (id: string) => void;
  setSelectedChat: (chat: TChannelProps | undefined) => void;
};

type TSocketStore = {
  socket: Socket | undefined;
  connectSocket: (
    url: string,
    opts?: Partial<ManagerOptions & SocketOptions>,
  ) => void;
};

export const useChatStore = create<TChatStore>((set) => ({
  chats: [],
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
