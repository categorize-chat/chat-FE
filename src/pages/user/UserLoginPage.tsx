import { KeyboardArrowRight } from '@mui/icons-material';
import { Box, Button, Divider, Input, Typography } from '@mui/joy';
import { ChangeEvent, KeyboardEvent, useRef } from 'react';
import { Paths } from '@/routes/paths';
import JoinForm from '@/components/user/JoinForm';
import KakaoAuthButton from '@/components/user/KakaoAuthButton';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const UserLoginPage = () => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const { loginHandler } = useAuth();

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
    (inputRef: React.RefObject<HTMLInputElement>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      if (inputRef.current === null) return;
      inputRef.current.value = e.target.value;
    };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100dvh',
        alignItems: 'center',
      }}
    >
      <JoinForm>
        <Typography level="h1">Welcome to AI-Chat</Typography>
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
            type="password"
            required
            onChange={handleInputChange(passwordInputRef)}
            onKeyDown={handleKeyDown}
            ref={passwordInputRef}
            defaultValue=""
          />
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
  );
};

export default UserLoginPage;
