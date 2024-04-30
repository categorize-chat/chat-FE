export type UserProps = {
  name: string;
  username: string;
  avatar: string;
  online: boolean;
};

export type MessageProps = {
  id: number;
  content: string;
  timestamp: string;
  unread?: boolean;
  sender: UserProps | 'You';
  attachment?: {
    fileName: string;
    type: string;
    size: string;
  };
};

export type ChatProps = {
  id: number;
  sender: UserProps;
  messages: MessageProps[];
};
