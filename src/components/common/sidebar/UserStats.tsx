import { Box, IconButton, Typography } from '@mui/joy';
import UserAvatar from '../../user/UserAvatar';
import { useUserStore } from '@/state/user';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useAuth } from '@/hooks/useAuth';

const UserStats = () => {
  const { nickname, email, profileUrl } = useUserStore();
  const { logoutHandler } = useAuth();

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
        onClick={logoutHandler}
      >
        <LogoutRoundedIcon />
      </IconButton>
    </Box>
  );
};

export default UserStats;
