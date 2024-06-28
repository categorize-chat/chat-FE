import { KeyboardArrowRight, QuestionAnswerRounded } from '@mui/icons-material';
import { Box, Button, Card, FormControl, Input, Typography } from '@mui/joy';
import { ChangeEvent, useRef } from 'react';
import { useUserStore } from '../../state/user';
import { useMutation } from 'react-query';
import { userJoinQuery } from '../../utils/user/query';

const UserJoin = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setUserId, setNickname } = useUserStore();

  const userJoinMutate = useMutation({
    ...userJoinQuery,
    onSuccess: ({ userId, nickname }) => {
      setUserId(userId);
      setNickname(nickname);
    },
  });

  const handleSubmit = () => {
    if (inputRef.current === null) return;

    const inputNickname = inputRef.current.value;

    if (!inputNickname) {
      alert('Please write down your nickname.');
      return;
    }

    // TODO: user join api
    userJoinMutate.mutate({
      nickname: inputNickname,
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (inputRef.current === null) return;
    inputRef.current.value = e.target.value;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100dvh',
        alignItems: 'center',
      }}
    >
      <Card
        color="neutral"
        variant="soft"
        sx={{
          height: '360px',
          width: '450px',
          margin: '0 auto',
          alignItems: 'center',
        }}
      >
        <QuestionAnswerRounded
          sx={{
            margin: '0 auto',
            fontSize: '50px',
          }}
          color="primary"
        />
        <Typography level="h1">Welcome to AI-Chat</Typography>
        <Typography>Please write down your nickname and start chat!</Typography>

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
            ref={inputRef}
            defaultValue=""
          />
          <Button
            endDecorator={<KeyboardArrowRight />}
            type="submit"
            color="primary"
            onClick={handleSubmit}
          >
            Go to chatroom!
          </Button>
        </FormControl>
      </Card>
    </Box>
  );
};

export default UserJoin;
