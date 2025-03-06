import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/state/user';
import userApi from '@/api/user/api';
import { Paths } from '@/routes/paths';
import { TUserAuthResponse } from '@/api/user/type';
import { useCallback, useMemo } from 'react';
import authApi from '@/api/auth/api';

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, setNickname, setEmail, setProfileUrl, reset } = useUserStore();

  const isLoggedIn = useMemo(() => {
    const accessToken = localStorage.getItem('accessToken');

    return email && accessToken;
  }, [email]);

  // 이메일 대기 화면에서 필요한 이메일 정보
  const emailWaiting = useMemo(() => {
    const emailFromStorage = localStorage.getItem('tempEmail');
    const emailFromLocation = location.state?.email;

    if (!emailFromStorage && !emailFromLocation) {
      return undefined;
    }

    if (emailFromLocation) {
      localStorage.setItem('tempEmail', emailFromLocation);
    }

    return emailFromLocation || emailFromStorage;
  }, [location.state]);

  const removeTempEmail = useCallback(() => {
    localStorage.removeItem('tempEmail');
  }, []);

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
    // 회원가입 시에는 accessToken 을 받지 않음
    await userApi.join({ nickname, email, password });

    // 회원가입 후 대기 화면으로 이동
    navigate(Paths.user.emailWait(), { state: { email } });
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

  const emailValidateionHandler = async (code: string) => {
    try {
      await authApi.validateEmail(code);
    } catch (error) {
      console.error(error);
      throw error;
    }

    // 성공했을 때에는 임시 이메일 정보 삭제
    removeTempEmail();
    navigate(Paths.user.login(), { state: { emailValidated: true } });
  };

  const emailResendHandler = async () => {
    try {
      const tempEmail = emailWaiting;

      if (!tempEmail) {
        throw new Error('이메일이 존재하지 않습니다.');
      }

      await authApi.resendEmail(tempEmail);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    loginHandler,
    joinHandler,
    logoutHandler,
    kakaoLoginHandler,
    emailValidateionHandler,
    isLoggedIn,
    emailResendHandler,
    emailWaiting,
  };
};
