import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { customTheme } from './style';
import AppRoutes from './routes/AppRoutes';
import { useEffect } from 'react';
import { connectSocket } from './utils/socket';

export default function App() {
  // 앱 시작 시 로그인 상태 확인 및 소켓 연결
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        connectSocket();
      } catch (error) {
        console.error('초기 소켓 연결 실패:', error);
      }
    }
  }, []);

  return (
    <CssVarsProvider disableTransitionOnChange theme={customTheme}>
      <CssBaseline />
      <AppRoutes />
    </CssVarsProvider>
  );
}
