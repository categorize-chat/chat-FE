import { TApiResponse } from '../type';
import { TUserProps } from '../user/type';
// import { TUserProps } from '../user/type';

export type TMessageProps = {
  // id: number;
  // content: string;
  // timestamp: string;
  // unread?: boolean;
  // sender: TUserProps | 'You';
  // attachment?: {
  //   fileName: string;
  //   type: string;
  //   size: string;
  // };

  nickname: string;
  createdAt: string;
  content: string;
  topic: number;
};

export type TChannelProps = {
  channelId: string;
  channelName: string;
};

export type TChatProps = TMessageProps[];

export type TChatRoomsResponse = TApiResponse<{
  channels: {
    channelId: string;
    channelName: string;
  }[];
}>;

export type TChatMessageResponse = TApiResponse<{
  messages: TMessageProps[];
}>;

export type TChatRoomGenerateRequest = {
  channelName: string;
};

export type TChatRoomGenerateResponse = TApiResponse<{
  channelId: string;
  channelName: string;
  owner: string;
  participants: string[];
}>;
