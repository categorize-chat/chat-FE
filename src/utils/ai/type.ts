import { TMessageProps } from '../chat/type';
import { TApiResponse } from '../type';

export type TAiSummaryRequest = {
  channelId: string;
  howmany: number;
};

export type THmlKey = 'high' | 'mid' | 'low';

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
