import { KeyboardArrowRight } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/joy';
import { Paths } from '@/routes/paths';
import JoinForm from '@/components/user/JoinForm';
import { useNavigate } from 'react-router-dom';

const UserEmailWaitPage = () => {
  const navigate = useNavigate();

  const handleGotoLogin = () => {
    navigate(Paths.user.login());
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
        <Typography level="h1">이메일 인증이 필요합니다</Typography>
        <Typography>받으신 이메일을 확인해보세요</Typography>

        <Box
          sx={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
          }}
        >
          <Button
            endDecorator={<KeyboardArrowRight />}
            type="submit"
            color="primary"
            onClick={handleGotoLogin}
          >
            로그인 화면으로 가기
          </Button>
        </Box>
      </JoinForm>
    </Box>
  );
};

export default UserEmailWaitPage;
