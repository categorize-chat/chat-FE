import { create } from 'zustand';

type TSelectedTopic = {
  index: number;
  color: string;
};

type TAIStore = {
  selectedTopic: TSelectedTopic;
  setSelectedTopic: (selectedTopic: TSelectedTopic) => void;
};

export const useAIStore = create<TAIStore>(set => ({
  selectedTopic: {
    index: -1,
    color: '',
  },

  setSelectedTopic: selectedTopic => set(() => ({ selectedTopic })),
}));
