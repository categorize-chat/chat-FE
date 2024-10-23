import { useState, useEffect } from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
// import MessagesPaneHeader from './MessagesPaneHeader';
import AiPannel from './AiPannel';
import { useChatStore, useSocket } from '../../state/chat';
import { TMessageProps } from '../../utils/chat/type';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { chatMessageQuery } from '../../utils/chat/query';
import { useUserStore } from '../../state/user';
import CustomAvatar from '../user/CustomAvatar';

export default function MessagesPane() {
  const { id: chatId } = useParams();

  const { chatMessages, setChatMessages, addNewMessage } = useChatStore();
  const socket = useSocket(state => state.socket);

  const { data, isError } = useQuery(chatMessageQuery(chatId || ''));
  const { nickname } = useUserStore();

  const [textAreaValue, setTextAreaValue] = useState('');

  const handleChatSend = async () => {
    if (!socket) return;

    const newMessage: TMessageProps = {
      nickname,
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

    setChatMessages(data.messages);
  }, [data]);

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
            <Stack spacing={2} justifyContent="flex-end">
              {chatMessages.map((message: TMessageProps, index: number) => {
                const isYou = message.nickname === nickname;
                return (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    flexDirection={isYou ? 'row-reverse' : 'row'}
                  >
                    <CustomAvatar nickname={message.nickname} />
                    <ChatBubble
                      variant={isYou ? 'sent' : 'received'}
                      {...message}
                    />
                  </Stack>
                );
              })}
            </Stack>
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
