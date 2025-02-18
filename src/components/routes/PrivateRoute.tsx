import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../state/user';

interface IPrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: IPrivateRouteProps) => {
  const { email } = useUserStore();
  const location = useLocation();

  const accessToken = localStorage.getItem('accessToken');

  if (!email || !accessToken) {
    // 이메일이나 액세스 토큰이 없는 경우 로그인 페이지로 리다이렉트
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
