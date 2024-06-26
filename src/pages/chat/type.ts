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
