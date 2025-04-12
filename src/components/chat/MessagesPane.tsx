import { useEffect, Fragment, useRef, useMemo, memo, useCallback } from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import AiPannel from '../ai/AiPannel';
import { useChatStore } from '@/state/chat';
import { TMessageProps } from '@/types';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery } from 'react-query';
import { chatMessageQuery } from '@/api/chat/query';
import { useUserStore } from '@/state/user';
import UserAvatar from '../user/UserAvatar';
import { parseRawDateAndTime } from '@/utils/common/function';
import { Divider, Typography } from '@mui/joy';
import { useAIStore } from '@/state/ai';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import MessagesPaneHeader from './MessagesPaneHeader';
import { getSocket } from '@/utils/socket';

export default function MessagesPane() {
  const { id: chatId } = useParams();

  const { chatMessages, selectedChat, setChatMessages } = useChatStore();
  const {
    firstTopicRelativeIndices,
    selectedTopic,
    hml,
    startIndexAnchor,
    setStartIndexAnchor,
    isSelectingMessages,
    selectedMessages,
    setHowmany,
  } = useAIStore();
  const { nickname, email, profileUrl } = useUserStore();

  // 현재 메세지 보내는 유저
  const user = useMemo(() => {
    return {
      nickname,
      email,
      profileUrl,
    };
  }, [nickname, email, profileUrl]);

  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const messageLimit = 20;

  const selectedMessageIndex = useMemo(() => {
    if (selectedMessages.start) {
      return chatMessages.findIndex(
        message => message._id === selectedMessages.start!._id,
      );
    }
    return -1;
  }, [chatMessages, selectedMessages]);
  const howmanyLimit = 100;

  const { data, fetchNextPage, hasNextPage, isError, isFetchingNextPage } =
    useInfiniteQuery({
      ...chatMessageQuery(chatId || '', messageLimit),
      getNextPageParam: lastPage => lastPage.nextCursor,
    });

  const { ref } = useIntersectionObserver(
    {
      threshold: 0.1,
      rootMargin: '100px',
    },
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  );

  const handleChatSend = useCallback(
    async (inputMessage: string) => {
      const socket = getSocket();
      if (!socket) return;

      const newMessage: TMessageProps = {
        user,
        content: inputMessage,
        createdAt: new Date().toISOString(),
        topic: -1,
        room: chatId || '',
      };

      socket.emit('message', {
        ...newMessage,
      });
    },
    [chatId, email, nickname, profileUrl],
  );

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const prevScrollHeight = useRef<number>(0);

  // 메시지 데이터 업데이트
  useEffect(() => {
    if (!data) return;

    // 받아온 페이지가 하나라면 그것만 업데이트
    if (data.pages.length === 1) {
      setChatMessages(data.pages[0].messages);
      return;
    }

    // 새로운 페이지가 들어오면 append
    const recentMessages = data.pages[data.pages.length - 1].messages;
    setChatMessages(state => [...recentMessages, ...state]);

    // startIndexAnchor 업데이트
    if (startIndexAnchor !== -1) {
      setStartIndexAnchor(startIndexAnchor + recentMessages.length);
    }
  }, [data]);

  // 채팅방 변경 시 스크롤 초기화
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // 채팅방 변경 시 messageRefs 초기화
    messageRefs.current = [];

    // column-reverse에서는 scrollTop을 0으로 설정하면 맨 아래로 이동
    scrollContainer.scrollTop = 0;
    prevScrollHeight.current = scrollContainer.scrollHeight;
  }, [chatId]); // chatId가 변경될 때만 실행

  // 기존의 스크롤 위치 관리 useEffect는 그대로 유지
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const isAtBottom = scrollContainer.scrollTop === 0;

    if (!isAtBottom) {
      const scrollDiff =
        scrollContainer.scrollHeight - prevScrollHeight.current;
      if (scrollDiff > 0) {
        scrollContainer.scrollTop += scrollDiff;
      }
    }

    prevScrollHeight.current = scrollContainer.scrollHeight;
  }, [chatMessages]);

  useEffect(() => {
    if (
      !selectedTopic ||
      !firstTopicRelativeIndices[hml] ||
      selectedTopic.index === -1
    )
      return;

    messageRefs.current[
      firstTopicRelativeIndices[hml][selectedTopic.index] + startIndexAnchor
    ]?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [selectedTopic, firstTopicRelativeIndices]);

  // AI 요약에 사용될 메시지 개수 업데이트
  useEffect(() => {
    if (selectedMessages.start && selectedMessages.end) {
      const startIndex = chatMessages.findIndex(
        message => message._id === selectedMessages.start!._id,
      );
      const endIndex = chatMessages.findIndex(
        message => message._id === selectedMessages.end!._id,
      );
      setHowmany(endIndex - startIndex + 1);
    }
  }, [selectedMessages]);

  if (isError) {
    return <></>;
  }

  return (
    <Sheet
      sx={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr minmax(min-content, min(50%, 400px))',
          },
          overflowY: 'auto',
          height: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {selectedChat && <MessagesPaneHeader channel={selectedChat} />}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              flex: 1,
            }}
          >
            <Box
              ref={scrollContainerRef}
              sx={{
                display: 'flex',
                flex: 1,
                minHeight: 0,
                px: 2,
                py: 3,
                overflowY: 'scroll',
                flexDirection: 'column-reverse',
              }}
            >
              {isFetchingNextPage && (
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  메시지를 불러오는 중...
                </Box>
              )}

              <Stack spacing={2} justifyContent="flex-end">
                {chatMessages.map((message: TMessageProps, i) => {
                  const { date, time } = parseRawDateAndTime(message.createdAt);
                  const isYou = message.user.email === email;

                  const prevDate =
                    i > 0
                      ? parseRawDateAndTime(chatMessages[i - 1].createdAt).date
                      : null;
                  return (
                    <Fragment key={i}>
                      {prevDate !== date && (
                        <Stack>
                          <Divider>
                            <Typography
                              textAlign={'center'}
                              my={2}
                              fontWeight={'lg'}
                            >
                              {date}
                            </Typography>
                          </Divider>
                        </Stack>
                      )}
                      {isSelectingMessages &&
                        selectedMessageIndex >= 0 &&
                        i == selectedMessageIndex + howmanyLimit && (
                          <Divider>
                            <Typography
                              textAlign={'center'}
                              my={2}
                              fontWeight={'lg'}
                            >
                              여기까지 선택 가능
                            </Typography>
                          </Divider>
                        )}
                      <div
                        ref={el => {
                          messageRefs.current[i] = el;
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={2}
                          flexDirection={isYou ? 'row-reverse' : 'row'}
                          id={`${i}`}
                        >
                          <MemoizedUserAvatar user={message.user} />
                          <MemoizedMessageBubble
                            variant={isYou ? 'sent' : 'received'}
                            message={message}
                            date={date}
                            time={time}
                            disabled={
                              isSelectingMessages &&
                              selectedMessageIndex >= 0 &&
                              i >= selectedMessageIndex + howmanyLimit
                            }
                          />
                        </Stack>
                      </div>
                    </Fragment>
                  );
                })}
              </Stack>

              <div ref={ref} style={{ height: '10px' }} />
            </Box>
            <MemoizedMessageInput onSubmit={handleChatSend} />
          </Box>
        </Box>
        <AiPannel />
      </Box>
    </Sheet>
  );
}

const MemoizedMessageBubble = memo(MessageBubble, (prevProps, nextProps) => {
  return (
    prevProps.message._id === nextProps.message._id &&
    prevProps.message === nextProps.message
  );
});
const MemoizedUserAvatar = memo(UserAvatar, (prevProps, nextProps) => {
  return prevProps.user?.profileUrl === nextProps.user?.profileUrl;
});
const MemoizedMessageInput = memo(MessageInput);
