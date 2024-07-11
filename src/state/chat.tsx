import { create } from 'zustand';
import { ManagerOptions, Socket, SocketOptions, io } from 'socket.io-client';
import { TChannelProps } from '../utils/chat/type';

type TChatStore = {
  chats: TChannelProps[];
  selectedId: string;
  selectedChat: TChannelProps | undefined;
  modalOpen: boolean;

  setChats: (chats: TChannelProps[]) => void;
  addChat: (newChat: TChannelProps) => void;
  setSelectedId: (id: string) => void;
  setSelectedChat: (chat: TChannelProps | undefined) => void;
  setModalOpen: (modalOpen: boolean) => void;
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
  modalOpen: false,

  setChats: (chats) => set(() => ({ chats })),
  addChat: (newChat: TChannelProps) =>
    set((state) => ({ chats: [...state.chats, newChat] })),
  setSelectedId: (id) => set(() => ({ selectedId: id })),
  setSelectedChat: (chat) => set(() => ({ selectedChat: chat })),
  setModalOpen: (modalOpen: boolean) => set({ modalOpen }),
}));

export const useSocket = create<TSocketStore>((set) => ({
  socket: undefined,
  connectSocket: (url, opts?) => set(() => ({ socket: io(url, opts) })),
}));
