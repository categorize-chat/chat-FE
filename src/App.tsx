import { useEffect } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { Route, Routes, Navigate } from 'react-router-dom';
import { customTheme } from './style';
import { useSocket } from './state/chat';
import UserJoin from './pages/user/UserJoin';
import { ChatMain } from './pages/chat/ChatMain';

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
        <Route path="/chat" element={<ChatMain />} />
        <Route path="/chat/:id" element={<ChatMain />} />
      </Routes>
    </CssVarsProvider>
  );
}
