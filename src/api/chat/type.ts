import { TApiResponse } from '../type';
import { TChannelProps, TMessageProps } from '@/types';

export type TChatRoomsResponse = TApiResponse<{
  channels: TChannelProps[];
}>;

export type TChatMessageResponse = TApiResponse<{
  messages: (TMessageProps & {
    _id: string;
  })[];
  nextCursor: string | null;
}>;

export type TChatRoomGenerateRequest = {
  channelName: string;
  description: string;
};

export type TChatRoomGenerateResponse = TApiResponse<TChannelProps>;
