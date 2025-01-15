import { create } from 'zustand';
import { TAiSummaryResponse, THmlKey } from '../utils/ai/type';
import { TMessageProps } from '../utils/chat/type';

type TSelectedTopic = {
  index: number;
  color: string;
};

type TColorHSL = {
  h: number; // 0 ~ 360
  s: number; // 0 ~ 100
  l: number; // 0 ~ 100
};

export type TColorMaps = Record<
  THmlKey,
  {
    [topic: number]: TColorHSL;
  }
>;

type TFirstTopicIndices = Record<
  THmlKey,
  {
    [n: number]: number;
  }
>;

export type TAIStore = {
  selectedTopic: TSelectedTopic;
  colorMaps: TColorMaps;
  firstTopicIndices: TFirstTopicIndices;
  aiResult: TAiSummaryResponse['result'];
  hml: THmlKey;
  replacedPartMessages: Record<THmlKey, TMessageProps[]>;

  setSelectedTopic: (selectedTopic: TSelectedTopic) => void;
  setColorMaps: (colorMaps: TColorMaps) => void;
  setFirstTopicIndices: (firstTopicIndices: TFirstTopicIndices) => void;
  setAiResult: (aiResult: TAiSummaryResponse['result']) => void;
  setHml: (hml: THmlKey) => void;
  setReplacedPartMessages: (
    replacedPartMessages: Record<THmlKey, TMessageProps[]>,
  ) => void;

  init: () => void;
};

const initialAIState = {
  selectedTopic: {
    index: -1,
    color: '',
  },
  colorMaps: {} as TAIStore['colorMaps'],
  firstTopicIndices: {} as TAIStore['firstTopicIndices'],
  aiResult: {} as TAIStore['aiResult'],
  hml: 'mid' as const,
  replacedPartMessages: {} as TAIStore['replacedPartMessages'],
};

export const useAIStore = create<TAIStore>(set => ({
  ...initialAIState,

  setSelectedTopic: selectedTopic => set(() => ({ selectedTopic })),
  setColorMaps: colorMaps => set(() => ({ colorMaps })),
  setFirstTopicIndices: firstTopicIndices => set(() => ({ firstTopicIndices })),
  setAiResult: aiResult => set({ aiResult }),
  setHml: hml => set({ hml }),
  setReplacedPartMessages: replacedPartMessages =>
    set({ replacedPartMessages }),

  init: () => set({ ...initialAIState }),
}));
