import { KeyboardArrowRight } from '@mui/icons-material';
import { Box, Button, Divider, Input, Typography } from '@mui/joy';
import React, { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { Paths } from '@/routes/paths';
import { Link } from 'react-router-dom';
import KakaoAuthButton from '@/components/user/KakaoAuthButton';
import { useAuth } from '@/hooks/useAuth';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import JoinForm from '@/components/user/JoinForm';

const UserJoinPage = () => {
  const nickNameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const pwdInputRef = useRef<HTMLInputElement>(null);
  const { joinHandler } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (nickNameInputRef.current === null) return;
    if (emailInputRef.current === null) return;
    if (pwdInputRef.current === null) return;

    const inputNickname = nickNameInputRef.current.value;
    const inputEmail = emailInputRef.current.value;
    const inputPassword = pwdInputRef.current.value;

    if (!inputNickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    if (!inputEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (!inputPassword) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    await joinHandler(inputNickname, inputEmail, inputPassword);
  };

  const handleInputChange =
    (ref: React.RefObject<HTMLInputElement>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      if (ref.current === null) return;
      ref.current.value = e.target.value;
    };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Box
      p={2}
      sx={{
        display: 'flex',
        minHeight: '100dvh',
        alignItems: 'center',
      }}
    >
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
        <Typography>가입하고 모든 기능을 누려보세요!</Typography>
        <Typography>
          <Link to={Paths.user.login()}>이미 계정이 있으신가요?</Link>
        </Typography>

        <form
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
          }}
        >
          <Input
            placeholder="닉네임"
            size="md"
            required
            autoFocus
            onChange={handleInputChange(nickNameInputRef)}
            onKeyDown={handleKeyDown}
            ref={nickNameInputRef}
            defaultValue=""
          />
          <Input
            placeholder="이메일"
            size="md"
            required
            type="email"
            onChange={handleInputChange(emailInputRef)}
            onKeyDown={handleKeyDown}
            ref={emailInputRef}
            defaultValue=""
          />
          <Input
            placeholder="비밀번호"
            size="md"
            required
            type={showPassword ? 'text' : 'password'}
            onChange={handleInputChange(pwdInputRef)}
            onKeyDown={handleKeyDown}
            ref={pwdInputRef}
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
          <Button
            endDecorator={<KeyboardArrowRight />}
            type="button"
            color="primary"
            onClick={handleSubmit}
          >
            회원가입
          </Button>

          <Divider
            sx={{
              margin: '8px 0',
            }}
          >
            또는
          </Divider>

          <KakaoAuthButton />
        </form>
      </JoinForm>
    </Box>
  );
};

export default UserJoinPage;
