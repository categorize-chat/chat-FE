import { useEffect } from 'react';
import Sheet from '@mui/joy/Sheet';

import MessagesPane from './MessagesPane';
import ChatsPane from './ChatsPane';
import { useParams } from 'react-router-dom';
import { useChatStore } from '../state/chat';

export default function MyMessages() {
  const chats = useChatStore((state) => state.chats);
  const setSelectedId = useChatStore((state) => state.setSelectedId);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);

  const chatParams = useParams();
  const chatId = chatParams.id;

  useEffect(() => {
    if (chatId === undefined) return;

    // 해당하는 채팅 찾기
    setSelectedChat(chats.find((chat) => chat.id === chatId));
    setSelectedId(chatId);
  }, [chatId, setSelectedId, chats, setSelectedChat]);

  return (
    <Sheet
      sx={{
        flex: 1,
        width: '100%',
        mx: 'auto',
        pt: { xs: 'var(--Header-height)', sm: 0 },
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'minmax(min-content, min(30%, 360px)) 1fr',
        },
      }}
    >
      <Sheet
        sx={{
          position: { xs: 'fixed', sm: 'sticky' },
          transform: {
            xs: 'translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))',
            sm: 'none',
          },
          transition: 'transform 0.4s, width 0.4s',
          zIndex: 100,
          width: '100%',
          top: 52,
        }}
      >
        <ChatsPane />
      </Sheet>
      {chatId ? <MessagesPane /> : <></>}
    </Sheet>
  );
}
