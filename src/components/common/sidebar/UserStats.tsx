import { Box, IconButton, Typography } from '@mui/joy';
import UserAvatar from '../../user/UserAvatar';
import { useUserStore } from '../../../state/user';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate } from 'react-router-dom';
import { Paths } from '../../../utils/constant';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const UserStats = () => {
  const { nickname, email, profileUrl, reset } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    // 유저 정보 지우기
    reset();

    // 엑세스 토큰 지우기
    localStorage.removeItem('accessToken');
    cookies.remove('refreshToken'); // http only 면 안될듯?

    navigate(Paths.user.login());
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <UserAvatar user={{ nickname, email, profileUrl }} />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography level="title-sm">{nickname}</Typography>
      </Box>
      <IconButton
        size="sm"
        variant="plain"
        color="neutral"
        onClick={handleLogout}
      >
        <LogoutRoundedIcon />
      </IconButton>
    </Box>
  );
};

export default UserStats;
