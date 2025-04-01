import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/state/user';
import PasswordResetModal from '@/components/user/PasswordResetModal';

const PasswordResetCallback = () => {
  const { passwordResetCallbackHandler } = useAuth();
  const { email } = useUserStore();
  const [token, setToken] = useState('');

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // 카카오로부터 받은 인가 코드
    const code =
      new URL(document.location.toString()).searchParams.get('token') || '';

    // 벡엔드 서버로 보내기
    passwordResetCallbackHandler(code).then(({ email: responseEmail }) => {
      if (email === responseEmail) {
        setToken(code);
        setIsSuccess(true);

        // URL에서 token 쿼리 파라미터 제거
        const url = new URL(window.location.href);
        url.searchParams.delete('token');
        window.history.replaceState({}, document.title, url.toString());
      }
    });
  }, []);

  const handleResetPassword = () => {
    if (!token) return;
  };

  return (
    <>
      {isSuccess ? (
        <div>Validating...</div>
      ) : (
        <>
          <PasswordResetModal open={true} onSubmit={handleResetPassword} />
        </>
      )}
    </>
  );
};

export default PasswordResetCallback;
