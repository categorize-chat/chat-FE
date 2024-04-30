import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MyMessages from './components/messages/MyMessages';
import { Route, Routes } from 'react-router-dom';
import MessagesPane from './components/messages/MessagesPane';
import { chats } from './data';

export default function App() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Routes>
        <Route path="/chat" element={<Dashboard />}>
          <Route path="message" element={<MessagesPane chat={chats[0]} />} />
        </Route>
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
