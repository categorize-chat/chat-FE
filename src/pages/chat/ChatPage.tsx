import { Box, Sheet } from '@mui/joy';
import { useQuery } from 'react-query';
import { chatRoomsQuery } from '../../utils/chat/query';
import { useChatStore, useSocket } from '../../state/chat';
import { useEffect } from 'react';
import NewChatModal from '../../components/chat/NewChatModal';
import { useUserStore } from '../../state/user';
import { useParams } from 'react-router-dom';
import ChatSidebar from '../../components/chat/ChatSidebar';
import MessagesPane from '../../components/chat/MessagesPane';

export const ChatPage = () => {
  const { data: chatRoomsData, isError: chatRoomsError } =
    useQuery(chatRoomsQuery());
  const { setChats } = useChatStore();
  const { setSubscriptions } = useUserStore();

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
      secure: true,
      auth: { token: localStorage.getItem('accessToken') },
    });
  }, [chatId]);

  // 받아온 채널 설정
  useEffect(() => {
    if (!chatRoomsData) return;

    const { channels } = chatRoomsData;
    if (channels === undefined) return;

    setChats(channels);

    setSubscriptions(channels.map(channel => channel.channelId));
  }, [chatRoomsData, setChats]);

  if (chatRoomsError) {
    return <></>;
  }

  return (
    <>
      <Box component="main" className="MainContent" sx={{ flex: 1 }}>
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
            <ChatSidebar />
          </Sheet>
          {chatId ? <MessagesPane /> : <></>}
        </Sheet>
      </Box>
      <NewChatModal />
    </>
  );
};
