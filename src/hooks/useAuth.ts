import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/state/user';
import userApi from '@/api/user/api';
import { Paths } from '@/routes/paths';
import { TUserAuthResponse } from '@/api/user/type';
import { useMemo } from 'react';

export const useAuth = () => {
  const navigate = useNavigate();
  const { email, setNickname, setEmail, setProfileUrl, reset } = useUserStore();

  const isLoggedIn = useMemo(() => {
    const accessToken = localStorage.getItem('accessToken');

    return email && accessToken;
  }, [email]);

  // 로그인/회원가입 을 통해 받아온 데이터로 유저 정보 업데이트
  const updateUserInfo = (userInfo: TUserAuthResponse['result']) => {
    // 로그인 성공 시
    localStorage.setItem('accessToken', userInfo.accessToken);

    setNickname(userInfo.nickname);
    setEmail(userInfo.email);
    setProfileUrl(userInfo.profileUrl);

    return userInfo;
  };

  const loginHandler = async (email: string, password: string) => {
    await userApi.login({ email, password }).then(updateUserInfo);

    navigate(Paths.chat.base());
  };

  const joinHandler = async (
    nickname: string,
    email: string,
    password: string,
  ) => {
    await userApi.join({ nickname, email, password }).then(updateUserInfo);

    navigate(Paths.chat.base());
  };

  const logoutHandler = async () => {
    // 쿠키가 삭제됨
    await userApi.logout();

    // 유저 정보 지우기
    reset();

    // 엑세스 토큰 지우기
    localStorage.removeItem('accessToken');

    navigate(Paths.user.login());
  };

  const kakaoLoginHandler = async (code: string) => {
    await userApi.kakaoLogin({ code }).then(updateUserInfo);

    navigate(Paths.chat.base());
  };

  return {
    loginHandler,
    joinHandler,
    logoutHandler,
    kakaoLoginHandler,
    isLoggedIn,
  };
};
