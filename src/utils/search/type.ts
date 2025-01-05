import { TChannelProps } from '../chat/type';
import { TApiResponse } from '../type';
import { TUserProps } from '../user/type';

export type TSearchRoomsRequest = {
  keyword: string;
};

export type TSearchRoomsResponse = TApiResponse<{
  channels: TChannelProps[];
}>;

export type TSubscribeResponse = TApiResponse<{
  user: TUserProps;
}>;
