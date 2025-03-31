import { KeyboardArrowRight } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/joy';
import { Paths } from '@/routes/paths';
import JoinForm from '@/components/user/JoinForm';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '@/hooks/useAuth';

const UserEmailWaitPage = () => {
  const { emailResendHandler, emailWaiting } = useAuth();
  const navigate = useNavigate();

  const emailResendTime = 30;
  const [resendTime, setResendTime] = useState(emailResendTime);

  const handleResendEmail = async () => {
    await emailResendHandler();

    Swal.fire({
      title: '이메일 재전송 완료',
      text: '이메일을 확인해보세요',
      icon: 'success',
    });

    setResendTime(emailResendTime);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTime(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 임의 접근 제한
  useEffect(() => {
    if (!emailWaiting) {
      navigate(Paths.user.login());
    }
  }, [emailWaiting, navigate]);

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
          이메일 인증이 필요합니다
        </Typography>
        <Typography>받은 이메일을 확인해보세요</Typography>

        <Box
          sx={{
            marginTop: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography level="body-sm">이메일이 도착하지 않았나요?</Typography>
          <Button
            endDecorator={<KeyboardArrowRight />}
            type="submit"
            color="primary"
            onClick={handleResendEmail}
            disabled={resendTime > 0}
            sx={{
              width: '100%',
            }}
          >
            {resendTime > 0 ? `${resendTime}초 후 재전송` : '이메일 재전송'}
          </Button>
          <Typography>
            <Link to={Paths.user.login()}>로그인 화면으로 돌아가기</Link>
          </Typography>
        </Box>
      </JoinForm>
    </Box>
  );
};

export default UserEmailWaitPage;
