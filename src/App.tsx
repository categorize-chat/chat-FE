import { useEffect } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Sidebar from './common/Sidebar';
import Header from './common/Header';
import MyMessages from './chat/MyMessages';
import { Route, Routes, Navigate } from 'react-router-dom';
import { customTheme } from './style';
import { useSocket } from './state/chat';
import UserJoin from './pages/user/UserJoin';

export default function App() {
  const connectSocket = useSocket((state) => state.connectSocket);

  useEffect(() => {
    connectSocket(import.meta.env.VITE_SOCK_URL);
  }, [connectSocket]);

  return (
    <CssVarsProvider disableTransitionOnChange theme={customTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Navigate replace to="/user" />} />
        <Route path="/user" element={<UserJoin />} />
        <Route path="/chat" element={<Dashboard />} />
        <Route path="/chat/:id" element={<Dashboard />} />
      </Routes>
    </CssVarsProvider>
  );
}

function Dashboard() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <Sidebar />
      <Header />
      <Box component="main" className="MainContent" sx={{ flex: 1 }}>
        <MyMessages />
      </Box>
    </Box>
  );
}
