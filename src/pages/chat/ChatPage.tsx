import { Box, Sheet } from '@mui/joy';
import { useQuery } from 'react-query';
import { chatRoomsQuery } from '@/api/chat/query';
import { useChatStore } from '@/state/chat';
import { useEffect, useCallback, useState, useRef } from 'react';
import NewChatModal from '@/components/chat/NewChatModal';
import { useUserStore } from '@/state/user';
import { useParams, useLocation } from 'react-router-dom';
import ChatSidebar from '@/components/chat/ChatSidebar';
import MessagesPane from '@/components/chat/MessagesPane';
import {
  getSocket,
  connectSocket,
  addReconnectCallback,
  removeReconnectCallback,
} from '@/utils/socket';
import { TMessageProps, TChannelProps } from '@/types';
import { useUIStore } from '@/state/ui';

export const ChatPage = () => {
  const { data: chatRoomsData, isError: chatRoomsError } =
    useQuery(chatRoomsQuery());
  const { chats, setChats } = useChatStore();
  const { subscriptions, setSubscriptions } = useUserStore();
  const { openMessagesPane, closeMessagesPane } = useUIStore();
  const location = useLocation();

  const { id: chatId } = useParams();
  const { setSelectedId, setSelectedChat, addNewMessage, clearTempMessages } =
    useChatStore();

  const [modalOpen, setModalOpen] = useState(false);

  // chats 상태의 최신 값을 유지하기 위한 ref
  const chatsRef = useRef<TChannelProps[]>(chats);

  // chats 상태가 변경될 때마다 ref 업데이트
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

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
  const updateSelectedChat = useCallback(
    (chatId: string, chats: TChannelProps[]) => {
      setSelectedId(chatId);

      const channel = chats.find(channel => channel.channelId === chatId);
      if (channel) {
        setSelectedChat(channel);
      }
    },
    [],
  );

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
        const updatedChats = chatsRef.current.map((chat: TChannelProps) => {
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
        const updatedChats = chatsRef.current.map((chat: TChannelProps) => {
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
    [chatId, setChats, addNewMessage], // chats 의존성 제거, ref 사용
  );

  // 이벤트 리스너를 등록하는 함수
  const registerEventListeners = useCallback(() => {
    const socket = getSocket();
    if (!socket) return;

    // 기존 리스너 제거 (중복 등록 방지)
    socket.off('chat', handleIncomingMessage);

    // 새로운 리스너 등록
    socket.on('chat', handleIncomingMessage);

    console.debug('소켓 이벤트 리스너 등록 완료');
  }, [handleIncomingMessage]);

  const unregisterEventListeners = useCallback(() => {
    const socket = getSocket();
    if (!socket) return;
    socket.off('chat', handleIncomingMessage);
    console.debug('소켓 이벤트 리스너 제거 완료');
  }, [handleIncomingMessage]);

  // 방 입장 및 구독 로직을 실행하는 함수
  const rejoinRooms = useCallback(() => {
    const socket = getSocket();
    if (!socket) return;

    // 구독하고 있는 모든 채팅방에 입장
    if (subscriptions.length > 0) {
      socket.emit('join', subscriptions);
      console.debug('소켓 재연결 시 방 재입장:', subscriptions);
    }

    // 현재 채팅방에 입장
    if (chatId) {
      socket.emit('view', chatId);
      console.debug('소켓 재연결 시 현재 방 재입장:', chatId);
    }
  }, [subscriptions, chatId]);

  // 소켓 재연결 시 실행할 전체 콜백 함수
  // 처음 연결 시에도 실행 됨
  const onSocketReconnect = useCallback(() => {
    registerEventListeners();
    rejoinRooms();
  }, [registerEventListeners, rejoinRooms]);

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
    if (!chatId || !chatsRef.current) return;

    // 채팅방 선택
    updateSelectedChat(chatId, chatsRef.current);

    handleRoomView(chatId);

    // 임시 메시지 삭제
    clearTempMessages();
  }, [chatId]);

  // 소켓 재연결 시 이벤트 리스너 재등록
  useEffect(() => {
    // 재연결 시 실행할 콜백 등록
    addReconnectCallback(onSocketReconnect);

    // 초기 이벤트 리스너 등록
    registerEventListeners();

    // cleanup 함수: 컴포넌트 언마운트 시 콜백 해제 및 이벤트 리스너 제거
    return () => {
      removeReconnectCallback(onSocketReconnect);
      unregisterEventListeners();
    };
  }, [onSocketReconnect, handleIncomingMessage]);

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
