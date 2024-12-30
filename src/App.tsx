import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { Route, Routes, Navigate } from 'react-router-dom';
import { customTheme } from './style';
import UserJoin from './pages/user/UserJoin';
import { ChatMain } from './pages/chat/ChatMain';
import UserLogin from './pages/user/UserLogin';
import OAuthCallback from './pages/user/OAuthCallback';
import SearchPage from './pages/search/SearchPage';

export default function App() {
  return (
    <CssVarsProvider disableTransitionOnChange theme={customTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Navigate replace to="/user/join" />} />
        <Route path="/user/join" element={<UserJoin />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/oauth/kakao" element={<OAuthCallback />} />
        <Route path="/chat" element={<ChatMain />} />
        <Route path="/chat/:id" element={<ChatMain />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </CssVarsProvider>
  );
}
