import { TApiResponse } from '../type';
import { TUserProps } from '../user/type';

export type TMessageProps = {
  id: number;
  content: string;
  timestamp: string;
  unread?: boolean;
  sender: TUserProps | 'You';
  attachment?: {
    fileName: string;
    type: string;
    size: string;
  };
};

export type TChatProps = {
  id: string;
  sender: TUserProps;
  messages: TMessageProps[];
};

export type TChatRoomsResponse = TApiResponse<{
  channels: {
    channelId: string;
    channelName: string;
  }[];
}>;

export type TChatMessageResponse = TApiResponse<{
  messages: {
    nickname: string;
    createdAt: string;
    content: string;
  }[];
}>;

export type TChatRoomGenerateRequest = {
  channelName: string;
};

export type TChatRoomGenerateResponse = {
  channelId: string;
  channelName: string;
};
