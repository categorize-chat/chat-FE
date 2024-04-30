import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Sidebar from './common/Sidebar';
import Header from './common/Header';
import MyMessages from './chat/MyMessages';
import { Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <CssVarsProvider disableTransitionOnChange theme={customTheme}>
      <CssBaseline />
      <Routes>
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
