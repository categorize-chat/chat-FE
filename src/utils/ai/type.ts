import { TMessageProps } from '../chat/type';
import { TApiResponse } from '../type';

export type TAiSummaryRequest = {
  channelId: string;
};

export type TAiSummaryResponse = TApiResponse<{
  messages: TMessageProps[];
  summary: {
    [key: number]: {
      keywords: string[];
      content: string;
    };
  };
}>;
