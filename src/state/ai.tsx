import { create } from 'zustand';

type TSelectedTopic = {
  index: number;
  color: string;
};

type TColorHSL = {
  h: number; // 0 ~ 360
  s: number; // 0 ~ 100
  l: number; // 0 ~ 100
};

export type TColorMaps = {
  [topic: number]: TColorHSL;
};

type TFirstTopicIndex = {
  [n: number]: number;
};

type TAIStore = {
  selectedTopic: TSelectedTopic;
  colorMaps: TColorMaps;
  firstTopicIndex: TFirstTopicIndex;

  setSelectedTopic: (selectedTopic: TSelectedTopic) => void;
  setColorMaps: (colorMaps: TColorMaps) => void;
  setFirstTopicIndex: (firstTopicIndex: TFirstTopicIndex) => void;
};

export const useAIStore = create<TAIStore>(set => ({
  selectedTopic: {
    index: -1,
    color: '',
  },
  colorMaps: {},
  firstTopicIndex: {},

  setSelectedTopic: selectedTopic => set(() => ({ selectedTopic })),
  setColorMaps: colorMaps => set(() => ({ colorMaps })),
  setFirstTopicIndex: firstTopicIndex => set(() => ({ firstTopicIndex })),
}));
