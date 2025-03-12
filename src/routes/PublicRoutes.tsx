import { Navigate, Route } from 'react-router-dom';
import UserJoinPage from '../pages/user/UserJoinPage';
import UserLoginPage from '../pages/user/UserLoginPage';
import OAuthCallback from '../pages/user/OAuthCallback';
import { Paths } from './paths';
import { useAuth } from '../hooks/useAuth';
import EmailValidationCallback from '@/pages/user/EmailValidationCallback';
import UserEmailWaitPage from '@/pages/user/UserEmailWaitPage';

const RootRedirect = () => {
  const { isLoggedIn } = useAuth();

  // 로그인된 상태면 채팅 페이지로, 아니면 회원가입 페이지로
  if (isLoggedIn) {
    return <Navigate replace to={Paths.chat.base()} />;
  }
  return <Navigate replace to={Paths.user.join()} />;
};

export const PublicRoutes = (
  <>
    <Route path={Paths.base()} element={<RootRedirect />} />
    <Route path={Paths.user.join()} element={<UserJoinPage />} />
    <Route path={Paths.user.login()} element={<UserLoginPage />} />
    <Route path={Paths.user.emailWait()} element={<UserEmailWaitPage />} />
    <Route path={Paths.user.oauth.kakao()} element={<OAuthCallback />} />
    <Route
      path={Paths.auth.emailValidation()}
      element={<EmailValidationCallback />}
    />
  </>
);
