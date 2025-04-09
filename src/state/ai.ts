import { create } from 'zustand';
import { TAiSummaryResponse } from '@/api/ai/type';
import { THmlKey, TMessageProps } from '@/types';

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

export type TReplacedPartMessages = Record<THmlKey, TMessageProps[]>;

type TFirstTopicIndices = Record<
  THmlKey,
  {
    [n: number]: number;
  }
>;

export type TAIStore = {
  selectedTopic: TSelectedTopic;
  colorMaps: TColorMaps;
  startIndexAnchor: number;
  firstTopicRelativeIndices: TFirstTopicIndices;
  aiResult: TAiSummaryResponse['result'];
  hml: THmlKey;

  setSelectedTopic: (selectedTopic: TSelectedTopic) => void;
  setColorMaps: (colorMaps: TColorMaps) => void;
  setStartIndexAnchor: (startIndexAnchor: number) => void;
  setFirstTopicRelativeIndices: (
    firstTopicRelativeIndices: TFirstTopicIndices,
  ) => void;
  setAiResult: (aiResult: TAiSummaryResponse['result']) => void;
  setHml: (hml: THmlKey) => void;

  init: () => void;
};

const initialAIState = {
  selectedTopic: {
    index: -1,
    color: '',
  },
  colorMaps: {} as TAIStore['colorMaps'],
  startIndexAnchor: -1,
  firstTopicRelativeIndices: {} as TAIStore['firstTopicRelativeIndices'],
  aiResult: {} as TAIStore['aiResult'],
  hml: 'mid' as const,
};

export const useAIStore = create<TAIStore>(set => ({
  ...initialAIState,

  setSelectedTopic: selectedTopic => set(() => ({ selectedTopic })),
  setColorMaps: colorMaps => set(() => ({ colorMaps })),
  setStartIndexAnchor: startIndexAnchor => set(() => ({ startIndexAnchor })),
  setFirstTopicRelativeIndices: firstTopicRelativeIndices =>
    set(() => ({ firstTopicRelativeIndices })),
  setAiResult: aiResult => set({ aiResult }),
  setHml: hml => set({ hml }),

  init: () => set({ ...initialAIState }),
}));
