import { useEffect } from 'react';
import Sheet from '@mui/joy/Sheet';

import MessagesPane from './MessagesPane';
import ChatsPane from './ChatsPane';
import { useParams } from 'react-router-dom';
import { useChatStore, useSocket } from '../../state/chat';
import { useQuery } from 'react-query';
import { chatRoomsQuery } from '../../utils/chat/query';

export default function MyMessages() {
  // const chats = useChatStore((state) => state.chats);
  const { id: chatId } = useParams();
  const { data, isError } = useQuery(chatRoomsQuery());
  const { setChats, setSelectedId } = useChatStore();
  const { socket, connectSocket } = useSocket();

  useEffect(() => {
    if (!data) return;

    const { channels } = data;
    if (channels === undefined) return;

    setChats(channels);
  }, [data]);

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
    connectSocket(`${import.meta.env.VITE_SOCK_URL}/chat`, {
      path: '/socket.io',
      auth: { token: localStorage.getItem('accessToken') },
    });
  }, [chatId]);

  if (isError) {
    return <></>;
  }

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
