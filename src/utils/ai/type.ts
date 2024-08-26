import { TChatProps } from '../chat/type';
import { TApiResponse } from '../type';

export type TAiSummaryRequest = {
  channelId: string;
};

export type TAiSummaryResponse = TApiResponse<{
  message: {
    [key: string]: {
      chats: TChatProps;
      summary: string;
    };
  };
}>;
