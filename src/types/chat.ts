import { TUserProps } from '@/types';

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

  user: TUserProps;
  createdAt: string;
  content: string;
  topic: number;
};

export type TChannelProps = {
  _id?: string; // FIXME: channelId 로 통합
  channelId: string;
  channelName: string;
  description: string;
  owner: TUserProps;
  participants: TUserProps[];
};

export type TChatProps = TMessageProps[];
