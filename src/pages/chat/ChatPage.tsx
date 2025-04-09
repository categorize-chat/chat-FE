import { Box, Sheet } from '@mui/joy';
import { useQuery } from 'react-query';
import { chatRoomsQuery } from '@/api/chat/query';
import { useChatStore } from '@/state/chat';
import { useEffect, useCallback, useState } from 'react';
import NewChatModal from '@/components/chat/NewChatModal';
import { useUserStore } from '@/state/user';
import { useParams, useLocation } from 'react-router-dom';
import ChatSidebar from '@/components/chat/ChatSidebar';
import MessagesPane from '@/components/chat/MessagesPane';
import { getSocket, connectSocket } from '@/utils/socket';
import { TMessageProps } from '@/types';
import { useUIStore } from '@/state/ui';

export const ChatPage = () => {
  const { data: chatRoomsData, isError: chatRoomsError } =
    useQuery(chatRoomsQuery());
  const { chats, setChats } = useChatStore();
  const { subscriptions, setSubscriptions } = useUserStore();
  const { openMessagesPane, closeMessagesPane } = useUIStore();
  const location = useLocation();

  const { id: chatId } = useParams();
  const { setSelectedId, setSelectedChat, addNewMessage } = useChatStore();

  const [modalOpen, setModalOpen] = useState(false);

  // URL 경로에 따라 모바일에서 사이드바 표시 여부 결정
  useEffect(() => {
    if (!chatId) {
      // /chat 경로에서는 사이드바 표시
      openMessagesPane();
    } else {
      // /chat/:id 경로에서는 사이드바 숨김 (모바일 환경에서만)
      const isMobile = window.matchMedia('(max-width: 600px)').matches;
      if (isMobile) {
        closeMessagesPane();
      }
    }
  }, [chatId, location.pathname, openMessagesPane, closeMessagesPane]);

  // setSelectedChat을 메모이제이션
  const updateSelectedChat = useCallback((chatId: string, chats: any[]) => {
    setSelectedId(chatId);

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
  const handleIncomingMessage = useCallback(
    (newMessage: TMessageProps) => {
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
    },
    [chatId, chats, setChats, addNewMessage],
  );

  // 컴포넌트 마운트 시 소켓 연결 확인
  useEffect(() => {
    // 소켓이 연결되어 있지 않으면 연결 시도
    if (!getSocket()) {
      try {
        connectSocket();
      } catch (error) {
        console.error('소켓 연결 실패:', error);
      }
    }
  }, []);

  // 받아온 채널 설정
  useEffect(() => {
    if (!chatRoomsData) return;

    const { channels } = chatRoomsData;
    if (channels === undefined) return;

    setChats(channels);

    setSubscriptions(channels.map(channel => channel.channelId));
  }, [chatRoomsData, setChats]);

  // 채팅방 진입 시 채팅방 선택
  useEffect(() => {
    if (!chatId || !chats) return;

    // 채팅방 선택
    updateSelectedChat(chatId, chats);
  }, [chatId, chats, updateSelectedChat]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !subscriptions.length) return;

    // 구독하고 있는 모든 채팅방에 입장
    socket.emit('join', subscriptions);
  }, [subscriptions]);

  // 채팅방 입장 관련 처리
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !chatId) return;

    // 채팅방에 입장
    socket.emit('view', chatId);
    handleRoomView(chatId);
  }, [chatId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

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
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'minmax(min-content, min(30%, 360px)) 1fr',
            },
            height: '100dvh',
          }}
        >
          <ChatSidebar setOpen={setModalOpen} />
          {chatId ? <MessagesPane /> : <></>}
        </Sheet>
      </Box>
      <NewChatModal open={modalOpen} setOpen={setModalOpen} />
    </>
  );
};
