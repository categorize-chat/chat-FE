import { useEffect } from 'react';
import {
  API,
  defaultResponseHandler,
  defaultAxiosErrorHandler,
} from '../../utils/api';
import { TUserOAuthResponse } from '../../utils/user/type';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../state/user';

const OAuthCallback = () => {
  const navigate = useNavigate();

  const { setNickname, setEmail, setProfileUrl } = useUserStore();

  const sendOAuthCode = async (code: string) => {
    const userInfo = await API.json
      .post('/oauth/kakao', { code })
      .then(defaultResponseHandler<TUserOAuthResponse>)
      .catch(defaultAxiosErrorHandler);

    // 로그인 성공 시
    localStorage.setItem('accessToken', userInfo.accessToken);

    setNickname(userInfo.nickname);
    setEmail(userInfo.email);
    setProfileUrl(userInfo.profileUrl);
    // 구독 관리는 chat 페이지에서 함

    navigate('/chat');
  };

  useEffect(() => {
    // 카카오로부터 받은 인가 코드
    const code =
      new URL(document.location.toString()).searchParams.get('code') || '';

    // 벡엔드 서버로 보내기
    sendOAuthCode(code);
  }, []);

  return <div>Redirecting...</div>;
};

export default OAuthCallback;
