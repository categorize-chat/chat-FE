import { Route, Routes } from 'react-router-dom';
import { PublicRoutes } from './PublicRoutes';
import { PrivateRoutes } from './PrivateRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route>{PublicRoutes}</Route>
      <Route>{PrivateRoutes}</Route>
    </Routes>
  );
};

export default AppRoutes;
