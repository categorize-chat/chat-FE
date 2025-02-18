import { Navigate, Route } from 'react-router-dom';
import UserJoinPage from '../pages/user/UserJoinPage';
import UserLoginPage from '../pages/user/UserLoginPage';
import OAuthCallback from '../pages/user/OAuthCallback';
import { Paths } from './paths';

export const PublicRoutes = (
  <>
    <Route
      path={Paths.base()}
      element={<Navigate replace to={Paths.user.join()} />}
    />
    <Route path={Paths.user.join()} element={<UserJoinPage />} />
    <Route path={Paths.user.login()} element={<UserLoginPage />} />
    <Route path={Paths.user.oauth.kakao()} element={<OAuthCallback />} />
  </>
);
