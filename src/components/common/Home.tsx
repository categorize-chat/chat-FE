import { Box } from '@mui/joy';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <Sidebar />
      <Outlet />
    </Box>
  );
};

export default Home;
