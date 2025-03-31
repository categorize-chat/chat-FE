import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isMessagesPaneOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  openMessagesPane: () => void;
  closeMessagesPane: () => void;
  toggleMessagesPane: () => void;
}

export const useUIStore = create<UIState>(set => ({
  isSidebarOpen: false,
  isMessagesPaneOpen: false,

  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),

  openMessagesPane: () => set({ isMessagesPaneOpen: true }),
  closeMessagesPane: () => set({ isMessagesPaneOpen: false }),
  toggleMessagesPane: () =>
    set(state => ({ isMessagesPaneOpen: !state.isMessagesPaneOpen })),
}));
