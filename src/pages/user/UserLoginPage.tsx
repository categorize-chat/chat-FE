import { KeyboardArrowRight } from '@mui/icons-material';
import { Box, Button, Divider, FormControl, Input, Typography } from '@mui/joy';
import { ChangeEvent, KeyboardEvent, useRef } from 'react';
import { useUserStore } from '../../state/user';
import { useMutation } from 'react-query';
import { userJoinQuery } from '../../utils/user/query';
import { useNavigate } from 'react-router-dom';
import { Paths } from '../../routes/paths';
import JoinForm from '../../components/user/JoinForm';
import KakaoAuthButton from '../../components/user/KakaoAuthButton';

const UserLoginPage = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
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
    if (inputRef.current === null) return;

    const inputNickname = inputRef.current.value;

    if (!inputNickname) {
      alert('Please write down your nickname.');
      return;
    }

    userJoinMutate.mutate({
      nickname: inputNickname,
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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

        <FormControl
          sx={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
          }}
        >
          <Input
            placeholder="Nickname"
            size="lg"
            required
            autoFocus
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            ref={inputRef}
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
        </FormControl>
      </JoinForm>
    </Box>
  );
};

export default UserLoginPage;
