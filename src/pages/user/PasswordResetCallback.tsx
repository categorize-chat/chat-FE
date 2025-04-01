import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/state/user';
import PasswordResetModal from '@/components/user/PasswordResetModal';
import Swal from 'sweetalert2';

const PasswordResetCallback = () => {
  const {
    passwordResetCallbackHandler,
    passwordResetSubmitHandler,
    logoutHandler,
  } = useAuth();
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

  const handleResetPassword = useCallback(
    async (password: string) => {
      if (!token) return;

      const { message } = await passwordResetSubmitHandler(token, password);
      Swal.fire({
        title: '비밀번호 초기화 성공',
        text: message,
        icon: 'success',
      }).finally(() => {
        logoutHandler();
      });
    },
    [token],
  );

  return (
    <>
      {!isSuccess ? (
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
