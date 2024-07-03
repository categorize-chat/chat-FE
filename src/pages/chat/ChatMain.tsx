import { Box } from '@mui/joy';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import MyMessages from '../../components/chat/MyMessages';
import { useQuery } from 'react-query';
import { chatRoomsQuery } from '../../utils/chat/query';
import { useChatStore } from '../../state/chat';
import { useEffect } from 'react';

export const ChatMain = () => {
  const { data: chatRoomsData, isError: chatRoomsError } = useQuery(
    chatRoomsQuery(),
  );
  const { setChats } = useChatStore();

  useEffect(() => {
    if (!chatRoomsData) return;

    const { channels } = chatRoomsData;
    if (channels === undefined) return;

    setChats(channels);
  }, [chatRoomsData, setChats]);

  if (chatRoomsError) {
    return <></>;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <Sidebar />
      <Header />
      <Box component="main" className="MainContent" sx={{ flex: 1 }}>
        <MyMessages />
      </Box>
    </Box>
  );
};
