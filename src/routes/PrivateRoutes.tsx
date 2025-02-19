import { Route } from 'react-router-dom';
import PrivateRoute from '../components/routes/PrivateRoute';
import Home from '../components/common/Home';
import { ChatPage } from '../pages/chat/ChatPage';
import SearchPage from '../pages/search/SearchPage';
import Settings from '../pages/settings/SettingsPage';
import { Paths } from './paths';

export const PrivateRoutes = (
  <Route
    path={Paths.base()}
    element={
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    }
  >
    <Route path={Paths.chat.base()} element={<ChatPage />} />
    <Route path={`${Paths.chat.base()}/:id`} element={<ChatPage />} />
    <Route path={Paths.search.base()} element={<SearchPage />} />
    <Route path={Paths.user.settings()} element={<Settings />} />
  </Route>
);
