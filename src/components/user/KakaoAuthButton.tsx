import OAuthButton from './OAuthButton';

import { ReactComponent as KakaoIcon } from '/assets/image/kakao-logo.svg';

const KakaoAuthButton = () => {
  const handleClickKakaoJoin = () => {
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    const clientId = import.meta.env.VITE_KAKAO_RESTAPI_KEY;
    const scope = ['account_email', 'profile_image', 'profile_nickname'];
    const scopeWithDelimiter = scope.join(',');

    const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopeWithDelimiter}`;

    // 카카오 로그인 페이지로 이동
    window.location.href = authUrl;
  };

  return (
    <OAuthButton
      buttonStyle={{
        backgroundColor: '#FFEB00',
        color: '#000000',

        ':hover': {
          backgroundColor: '#c1b101',
          color: '#000000',
        },
      }}
      provider="kakao"
      icon={<KakaoIcon width={16} height={16} />}
      description="카카오로 시작하기"
      onClick={handleClickKakaoJoin}
    />
  );
};

export default KakaoAuthButton;
