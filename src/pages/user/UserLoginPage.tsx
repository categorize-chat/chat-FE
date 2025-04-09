import { KeyboardArrowRight } from '@mui/icons-material';
import { Alert, Box, Button, Divider, Input, Typography } from '@mui/joy';
import { ChangeEvent, KeyboardEvent, useRef, useState, useEffect } from 'react';
import { Paths } from '@/routes/paths';
import KakaoAuthButton from '@/components/user/KakaoAuthButton';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MailIcon from '@mui/icons-material/Mail';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import JoinForm from '@/components/user/JoinForm';
import ColorSchemeToggle from '@/components/common/ColorSchemeToggle';
import userApi from '@/api/user/api';
import Swal from 'sweetalert2';

const UserLoginPage = () => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const { loginHandler } = useAuth();
  const location = useLocation();
  const [emailAlertState, setEmailAlertState] = useState(
    location.state?.emailValidated,
  );
  const [alertVisible, setAlertVisible] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // 이메일 인증 알림을 5초 후에 사라지게 하는 효과
  useEffect(() => {
    setAlertVisible(true);
    const timer = setTimeout(() => {
      setAlertVisible(false);
      // 애니메이션이 끝난 후에 실제 요소를 DOM에서 제거
      setTimeout(() => {
        setEmailAlertState(undefined);
      }, 500); // 트랜지션 시간과 동일하게 설정
    }, 3000);

    return () => clearTimeout(timer);
  }, [emailAlertState]);

  useEffect(() => {
    console.log(emailAlertState);
  }, [emailAlertState]);

  const handleSubmit = async () => {
    if (emailInputRef.current === null) return;
    if (passwordInputRef.current === null) return;

    const inputEmail = emailInputRef.current.value;
    const inputPassword = passwordInputRef.current.value;

    if (!inputEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (!inputPassword) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    await loginHandler(inputEmail, inputPassword);
  };

  const handleInputChange =
    (inputRef: React.RefObject<HTMLInputElement | null>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      if (inputRef.current === null) return;
      inputRef.current.value = e.target.value;
    };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleRequestPasswordReset = async () => {
    const { value: email } = await Swal.fire({
      title: '이메일을 입력해주세요',
      input: 'email',
      inputPlaceholder: '이메일 인증을 위해 이메일을 입력해주세요',
    });

    if (!email) return;

    const { message } = await userApi.requestPasswordReset({ email });
    await Swal.fire({
      title: '비밀번호 초기화 요청',
      text: message,
      icon: 'success',
    });
  };
  return (
    <>
      <ColorSchemeToggle float />
      <Box
        p={2}
        sx={{
          display: 'flex',
          height: '100dvh',
          alignItems: 'center',
        }}
      >
        {emailAlertState === true ? (
          <Alert
            color="success"
            sx={{
              position: 'absolute',
              top: '16px',
              left: '50%',
              transform: `translateX(-50%) translateY(${alertVisible ? '0' : '-100px'})`,
              opacity: alertVisible ? 1 : 0,
              transition: 'transform 0.5s ease, opacity 0.5s ease',
            }}
            startDecorator={<MarkEmailReadIcon />}
          >
            이메일 인증이 완료되었습니다.
          </Alert>
        ) : emailAlertState === false ? (
          <Alert
            color="danger"
            sx={{
              position: 'absolute',
              top: '16px',
              left: '50%',
              transform: `translateX(-50%) translateY(${alertVisible ? '0' : '-100px'})`,
              opacity: alertVisible ? 1 : 0,
              transition: 'transform 0.5s ease, opacity 0.5s ease',
            }}
            startDecorator={<MailIcon />}
          >
            이메일 인증이 완료되지 않았습니다.
          </Alert>
        ) : (
          <></>
        )}
        <JoinForm>
          <Typography
            level="h1"
            sx={{
              fontSize: {
                xs: '24px',
                sm: '32px',
              },
            }}
          >
            Welcome to AI-Chat
          </Typography>
          <Typography>로그인을 해주세요</Typography>
          <Typography>
            <Link to={Paths.user.join()}>아직 회원이 아니신가요?</Link>
          </Typography>

          <Box
            sx={{
              marginTop: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              width: '100%',
            }}
          >
            <Input
              placeholder="이메일"
              type="email"
              required
              autoFocus
              onChange={handleInputChange(emailInputRef)}
              onKeyDown={handleKeyDown}
              ref={emailInputRef}
              defaultValue=""
            />
            <Input
              placeholder="비밀번호"
              type={showPassword ? 'text' : 'password'}
              required
              onChange={handleInputChange(passwordInputRef)}
              onKeyDown={handleKeyDown}
              ref={passwordInputRef}
              defaultValue=""
              endDecorator={
                <Box
                  onClick={() => setShowPassword(!showPassword)}
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.5,
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </Box>
              }
            />
            <Typography
              level="body-xs"
              sx={{
                textAlign: 'right',
                textDecoration: 'underline',
                cursor: 'pointer',
                color: 'primary',
              }}
              onClick={handleRequestPasswordReset}
            >
              비밀번호를 잊으셨나요?
            </Typography>
            <Button
              endDecorator={<KeyboardArrowRight />}
              type="submit"
              color="primary"
              onClick={handleSubmit}
            >
              로그인
            </Button>

            <Divider
              sx={{
                margin: '8px 0',
              }}
            >
              또는
            </Divider>

            <KakaoAuthButton />
          </Box>
        </JoinForm>
      </Box>
    </>
  );
};

export default UserLoginPage;
