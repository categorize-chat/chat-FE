import { useState, useEffect, Fragment, useRef, useMemo } from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import AiPannel from '../ai/AiPannel';
import { useChatStore, useSocket } from '../../state/chat';
import { TMessageProps } from '../../utils/chat/type';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery } from 'react-query';
import { chatMessageQuery } from '../../utils/chat/query';
import { useUserStore } from '../../state/user';
import UserAvatar from '../user/UserAvatar';
import { parseRawDateAndTime } from '../../utils/common/function';
import { Divider, Typography } from '@mui/joy';
import { useAIStore } from '../../state/ai';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export default function MessagesPane() {
  const { id: chatId } = useParams();

  const { chatMessages, setChatMessages, addNewMessage } = useChatStore();
  const { firstTopicIndices, selectedTopic, hml } = useAIStore();

  const socket = useSocket(state => state.socket);

  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { data, fetchNextPage, hasNextPage, isError, isFetchingNextPage } =
    useInfiniteQuery({
      ...chatMessageQuery(chatId || ''),
      getNextPageParam: lastPage => lastPage.nextCursor,
    });

  const { ref, isIntersecting } = useIntersectionObserver(
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

  const { nickname, email, profileUrl } = useUserStore();

  const [textAreaValue, setTextAreaValue] = useState('');

  // 현재 메세지 보내는 유저
  const user = useMemo(() => {
    return {
      nickname,
      email,
      profileUrl,
    };
  }, [nickname, email, profileUrl]);

  const handleChatSend = async () => {
    if (!socket) return;

    const newMessage: TMessageProps = {
      user,
      content: textAreaValue,
      createdAt: new Date().toISOString(),
      topic: -1,
    };

    socket.emit('message', {
      ...newMessage,
      roomId: chatId,
    });
  };

  useEffect(() => {
    if (!data) return;

    const allMessages = data.pages.flatMap(page => page.messages);
    setChatMessages(allMessages);
  }, [data]);

  useEffect(() => {
    if (!selectedTopic || !firstTopicIndices[hml] || selectedTopic.index === -1)
      return;

    messageRefs.current[
      firstTopicIndices[hml][selectedTopic.index]
    ]?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [selectedTopic, firstTopicIndices]);

  useEffect(() => {
    if (socket === undefined) return;

    socket.on('chat', (newMessage: TMessageProps) => {
      addNewMessage(newMessage);
    });
  }, [socket]);

  if (isError) {
    return <></>;
  }

  return (
    <Sheet
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', lg: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
      }}
    >
      {/* <MessagesPaneHeader sender={selectedChat!.channelName} /> */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr minmax(min-content, min(50%, 400px))',
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
          <Box
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
                    <Stack
                      direction="row"
                      spacing={2}
                      flexDirection={isYou ? 'row-reverse' : 'row'}
                      id={`${i}`}
                      ref={el => (messageRefs.current[i] = el)}
                    >
                      <UserAvatar user={message.user} />
                      <MessageBubble
                        variant={isYou ? 'sent' : 'received'}
                        {...message}
                        date={date}
                        time={time}
                      />
                    </Stack>
                  </Fragment>
                );
              })}
            </Stack>

            <div ref={ref} style={{ height: '10px' }} />
          </Box>
          <MessageInput
            textAreaValue={textAreaValue}
            setTextAreaValue={setTextAreaValue}
            onSubmit={handleChatSend}
          />
        </Box>
        <AiPannel />
      </Box>
    </Sheet>
  );
}
