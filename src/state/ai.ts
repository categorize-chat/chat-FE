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
  isSelectingMessages: boolean;
  selectedMessages: Record<'start' | 'end', TMessageProps | null>;
  howmany: number;

  setSelectedTopic: (selectedTopic: TSelectedTopic) => void;
  setColorMaps: (colorMaps: TColorMaps) => void;
  setStartIndexAnchor: (startIndexAnchor: number) => void;
  setFirstTopicRelativeIndices: (
    firstTopicRelativeIndices: TFirstTopicIndices,
  ) => void;
  setAiResult: (aiResult: TAiSummaryResponse['result']) => void;
  setHml: (hml: THmlKey) => void;
  setIsSelectingMessages: (isSelectingMessages: boolean) => void;
  setSelectedMessages: (
    selectedMessages: Record<'start' | 'end', TMessageProps | null>,
  ) => void;
  setHowmany: (howmany: number) => void;
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
  isSelectingMessages: false,
  selectedMessages: { start: null, end: null } as TAIStore['selectedMessages'],
  howmany: 0,
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
  setIsSelectingMessages: isSelectingMessages => set({ isSelectingMessages }),
  setSelectedMessages: selectedMessages => set({ selectedMessages }),
  setHowmany: howmany => set({ howmany }),
  init: () => set({ ...initialAIState }),
}));
