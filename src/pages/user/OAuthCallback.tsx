import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const OAuthCallback = () => {
  const { kakaoLoginHandler } = useAuth();

  useEffect(() => {
    // 카카오로부터 받은 인가 코드
    const code =
      new URL(document.location.toString()).searchParams.get('code') || '';

    // 벡엔드 서버로 보내기
    kakaoLoginHandler(code);
  }, []);

  return <div>Redirecting...</div>;
};

export default OAuthCallback;
