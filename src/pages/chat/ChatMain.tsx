import { Box } from '@mui/joy';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import MyMessages from '../../components/chat/MyMessages';

export const ChatMain = () => {
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
