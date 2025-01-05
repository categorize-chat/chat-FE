import { useEffect } from 'react';
import Sheet from '@mui/joy/Sheet';

import MessagesPane from './MessagesPane';
import ChatsPane from './ChatsPane';
import { useParams } from 'react-router-dom';
import { useChatStore, useSocket } from '../../state/chat';

export default function MyMessages() {
  const { id: chatId } = useParams();
  const { setSelectedId } = useChatStore();
  const { socket, connectSocket } = useSocket();

  useEffect(() => {
    if (!chatId) return;

    setSelectedId(chatId);
  }, [chatId]);

  useEffect(() => {
    if (!socket || !chatId) return;

    // 채팅방에 입장
    socket.emit('join', chatId);
  }, [socket, chatId]);

  // 소켓 연결
  useEffect(() => {
    const socketUrl = `${import.meta.env.VITE_SOCK_URL}/chat`;

    connectSocket(socketUrl, {
      path: '/socket.io',
      withCredentials: true,
      auth: { token: localStorage.getItem('accessToken') },
    });
  }, [chatId]);

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
