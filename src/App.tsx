import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { Route, Routes, Navigate } from 'react-router-dom';
import { customTheme } from './style';
import UserJoinPage from './pages/user/UserJoinPage';
import { ChatPage } from './pages/chat/ChatPage';
import UserLoginPage from './pages/user/UserLoginPage';
import OAuthCallback from './pages/user/OAuthCallback';
import SearchPage from './pages/search/SearchPage';
import Home from './components/common/Home';
import Settings from './pages/settings/SettingsPage';

export default function App() {
  return (
    <CssVarsProvider disableTransitionOnChange theme={customTheme}>
      <CssBaseline />
      <Routes>
        {/* TODO: Landing page */}
        <Route path="/" element={<Navigate replace to="/join" />} />
        <Route path="/join" element={<UserJoinPage />} />
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/user/oauth/kakao" element={<OAuthCallback />} />
        <Route path="/" element={<Home />}>
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:id" element={<ChatPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </CssVarsProvider>
  );
}
