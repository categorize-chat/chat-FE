import { TChannelProps, TUserProps } from '@/types';
import { TApiResponse } from '../type';

export type TSearchRoomsRequest = {
  keyword: string;
};

export type TSearchRoomsResponse = TApiResponse<{
  channels: TChannelProps[];
}>;

export type TSubscribeResponse = TApiResponse<{
  user: TUserProps & { subscriptions: string[] };
}>;

export type TSearchResponse = TApiResponse<{
  channels: TChannelProps[];
}>;
