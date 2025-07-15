import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { customTheme } from './style';
import AppRoutes from './routes/AppRoutes';
import SocketTestPanel from './components/dev/SocketTestPanel';

export default function App() {
  return (
    <CssVarsProvider disableTransitionOnChange theme={customTheme}>
      <CssBaseline />
      <AppRoutes />
      <SocketTestPanel />
    </CssVarsProvider>
  );
}
