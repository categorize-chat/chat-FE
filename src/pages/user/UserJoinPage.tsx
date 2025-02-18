import { KeyboardArrowRight } from '@mui/icons-material';
import { Box, Button, Divider, Input, Typography } from '@mui/joy';
import React, { ChangeEvent, KeyboardEvent, useRef } from 'react';
import { useUserStore } from '../../state/user';
import { useMutation } from 'react-query';
import { userJoinQuery } from '../../utils/user/query';
import { useNavigate } from 'react-router-dom';
import { Paths } from '../../utils/constant';
import { Link } from 'react-router-dom';
import JoinForm from '../../components/user/JoinForm';

import KakaoAuthButton from '../../components/user/KakaoAuthButton';

const UserJoinPage = () => {
  const navigate = useNavigate();
  const nickNameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const pwdInputRef = useRef<HTMLInputElement>(null);
  const { setUserId, setNickname } = useUserStore();

  const userJoinMutate = useMutation({
    ...userJoinQuery(),
    onSuccess: ({ userId, nickname }) => {
      // TODO: 스토리지에 박기
      setUserId(userId);
      setNickname(nickname);

      navigate(Paths.chat.base());
    },
    onError: () => {},
  });

  const handleSubmit = () => {
    if (nickNameInputRef.current === null) return;

    const inputNickname = nickNameInputRef.current.value;

    if (!inputNickname) {
      alert('Please write down your nickname.');
      return;
    }

    userJoinMutate.mutate({
      nickname: inputNickname,
    });
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
      sx={{
        display: 'flex',
        minHeight: '100dvh',
        alignItems: 'center',
      }}
    >
      <JoinForm>
        <Typography level="h1">Welcome to AI-Chat</Typography>
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
            type="password"
            onChange={handleInputChange(pwdInputRef)}
            onKeyDown={handleKeyDown}
            ref={pwdInputRef}
            defaultValue=""
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
