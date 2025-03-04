import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

const EmailValidationCallback = () => {
  const { emailValidateionHandler } = useAuth();

  useEffect(() => {
    const code = new URL(document.location.toString()).searchParams.get(
      'token',
    );

    if (!code) {
      alert('유효하지 않은 토큰입니다.');
      return;
    }

    emailValidateionHandler(code);
  }, []);

  return <div>Redirecting...</div>;
};

export default EmailValidationCallback;
