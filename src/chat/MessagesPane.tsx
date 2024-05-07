import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import AvatarWithStatus from '../common/AvatarWithStatus';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import MessagesPaneHeader from './MessagesPaneHeader';
import { MessageProps } from '../types';
import AiPannel from './AiPannel';
import { useChatStore, useSocket } from '../state/store';

export default function MessagesPane() {
  const chats = useChatStore((state) => state.chats);
  const selectedId = useChatStore((state) => state.selectedId);
  const selectedChat = useChatStore((state) => state.selectedChat) ?? chats[0];
  const socket = useSocket((state) => state.socket);
  const [chatMessages, setChatMessages] = useState(selectedChat.messages);
  const [textAreaValue, setTextAreaValue] = useState('');

  const handleChatSend = useCallback(async () => {
    if (socket == undefined) return;

    const newId = chatMessages.length + 1;

    const newMessage = {
      id: newId,
      sender: 'You' as const,
      content: textAreaValue,
      timestamp: 'Just now',
    };

    await socket.emit('send_message', { ...newMessage, room: selectedId });

    setChatMessages([...chatMessages, newMessage]);
  }, [socket, setChatMessages, selectedId, chatMessages, textAreaValue]);

  useEffect(() => {
    setChatMessages(selectedChat.messages);
  }, [selectedChat.messages]);

  return (
    <Sheet
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', lg: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
      }}
    >
      <MessagesPaneHeader sender={selectedChat.sender} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr minmax(min-content, min(30%, 360px))',
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
              {chatMessages.map((message: MessageProps, index: number) => {
                const isYou = message.sender === 'You';
                return (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    flexDirection={isYou ? 'row-reverse' : 'row'}
                  >
                    {message.sender !== 'You' && (
                      <AvatarWithStatus
                        online={message.sender.online}
                        src={message.sender.avatar}
                      />
                    )}
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
