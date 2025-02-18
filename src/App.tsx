import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { customTheme } from './style';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <CssVarsProvider disableTransitionOnChange theme={customTheme}>
      <CssBaseline />
      <AppRoutes />
    </CssVarsProvider>
  );
}
