import { Box, Sheet } from '@mui/joy';
import { useQuery } from 'react-query';
import { chatRoomsQuery } from '@/api/chat/query';
import { useChatStore, useSocket } from '@/state/chat';
import { useEffect, useCallback, useState } from 'react';
import NewChatModal from '@/components/chat/NewChatModal';
import { useUserStore } from '@/state/user';
import { useParams } from 'react-router-dom';
import ChatSidebar from '@/components/chat/ChatSidebar';
import MessagesPane from '@/components/chat/MessagesPane';

export const ChatPage = () => {
  const { data: chatRoomsData, isError: chatRoomsError } =
    useQuery(chatRoomsQuery());
  const { chats, setChats } = useChatStore();
  const { setSubscriptions } = useUserStore();

  const { id: chatId } = useParams();
  const { setSelectedId, setSelectedChat } = useChatStore();
  const { socket, connectSocket } = useSocket();

  const [modalOpen, setModalOpen] = useState(false);

  // setSelectedChat을 메모이제이션
  const updateSelectedChat = useCallback((chatId: string, chats: any[]) => {
    const channel = chats.find(channel => channel.channelId === chatId);
    if (channel) {
      setSelectedChat(channel);
    }
  }, []);

  useEffect(() => {
    if (!chatId) return;

    setSelectedId(chatId);

    if (!chats) return;

    updateSelectedChat(chatId, chats);
  }, [chatId, chats, updateSelectedChat]);

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
            <ChatSidebar setOpen={setModalOpen} />
          </Sheet>
          {chatId ? <MessagesPane /> : <></>}
        </Sheet>
      </Box>
      <NewChatModal open={modalOpen} setOpen={setModalOpen} />
    </>
  );
};
