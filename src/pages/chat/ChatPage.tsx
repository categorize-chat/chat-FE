import { Box, Sheet } from '@mui/joy';
import { useQuery } from 'react-query';
import { chatRoomsQuery } from '@/api/chat/query';
import { useChatStore } from '@/state/chat';
import { useEffect, useCallback, useState } from 'react';
import NewChatModal from '@/components/chat/NewChatModal';
import { useUserStore } from '@/state/user';
import { useParams } from 'react-router-dom';
import ChatSidebar from '@/components/chat/ChatSidebar';
import MessagesPane from '@/components/chat/MessagesPane';
import { socket } from '@/utils/socket';
import { TMessageProps } from '@/types';

export const ChatPage = () => {
  const { data: chatRoomsData, isError: chatRoomsError } =
    useQuery(chatRoomsQuery());
  const { chats, setChats } = useChatStore();
  const { subscriptions, setSubscriptions } = useUserStore();

  const { id: chatId } = useParams();
  const { setSelectedId, setSelectedChat, addNewMessage } = useChatStore();

  const [modalOpen, setModalOpen] = useState(false);

  // setSelectedChat을 메모이제이션
  const updateSelectedChat = useCallback((chatId: string, chats: any[]) => {
    const channel = chats.find(channel => channel.channelId === chatId);
    if (channel) {
      setSelectedChat(channel);
    }
  }, []);

  const handleRoomView = (id: string) => {
    const newChats = chats.map(chat => {
      if (chat.channelId === id) {
        return {
          ...chat,
          unreadCount: 0,
        };
      }

      return chat;
    });

    setChats(newChats);
  };

  // 메시지 수신 이벤트 핸들러
  const handleIncomingMessage = (newMessage: TMessageProps) => {
    // 현재 채팅방이 아닌 다른 채팅방에서 온 메시지인 경우 읽지 않은 메시지 수 업데이트
    if (newMessage.room && newMessage.room !== chatId) {
      const updatedChats = chats.map(chat => {
        if (chat.channelId === newMessage.room) {
          return {
            ...chat,
            unreadCount: chat.unreadCount + 1,
            totalMessageCount: chat.totalMessageCount + 1,
            lastMessage: newMessage,
          };
        }
        return chat;
      });

      setChats(updatedChats);
    } else {
      const updatedChats = chats.map(chat => {
        if (chat.channelId === newMessage.room) {
          return {
            ...chat,
            lastMessage: newMessage,
          };
        }
        return chat;
      });

      setChats(updatedChats);

      // 메시지 추가
      addNewMessage(newMessage);
    }
  };

  // 받아온 채널 설정
  useEffect(() => {
    if (!chatRoomsData) return;

    const { channels } = chatRoomsData;
    if (channels === undefined) return;

    setChats(channels);

    setSubscriptions(channels.map(channel => channel.channelId));
  }, [chatRoomsData, setChats]);

  useEffect(() => {
    if (!chatId) return;

    setSelectedId(chatId);

    if (!chats) return;

    updateSelectedChat(chatId, chats);
  }, [chatId, chats, updateSelectedChat]);

  useEffect(() => {
    if (!socket) return;

    // 구독하고 있는 모든 채팅방에 입장
    socket.emit('join', subscriptions);
  }, [subscriptions]);

  // 채팅방 입장 관련 처리
  useEffect(() => {
    if (!socket) return;

    // 채팅방에 입장
    if (chatId) {
      socket.emit('view', chatId);
      handleRoomView(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    // 이벤트 리스너 등록
    socket.on('chat', handleIncomingMessage);

    // cleanup 함수: 컴포넌트 언마운트 또는 의존성 변경 시 이벤트 리스너 제거
    return () => {
      socket.off('chat', handleIncomingMessage);
    };
  }, [handleIncomingMessage]);

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
