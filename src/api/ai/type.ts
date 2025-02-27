import { THmlKey, TMessageProps } from '@/types';
import { TApiResponse } from '../type';

export type TAiSummaryRequest = {
  channelId: string;
  howmany: number;
};

export type TAiSummaryResponse = TApiResponse<{
  refChat: TMessageProps;
  howmany: number;
  topics: Record<THmlKey, number[]>;
  summaries: Record<
    THmlKey,
    {
      [summaryKey: number]: {
        keywords: string[];
        content: string;
      };
    }
  >;
}>;
