import { TChannelProps } from '../chat/type';
import { TApiResponse } from '../type';

export type TSearchRoomsRequest = {
  keyword: string;
};

export type TSearchRoomsResponse = TApiResponse<{
  channels: TChannelProps[];
}>;
